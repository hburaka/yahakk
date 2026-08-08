import { and, eq, gte, ne, sql } from 'drizzle-orm';
import { useEffect, useState } from 'react';

import { db } from '@/core/db/client';
import { zikirSessions } from '@/core/db/schema';

import { getZikirTemplate, ZIKIR_SETS } from './data/zikir-templates';

/**
 * Tesbihat raporu.
 *
 * Sayım kuralı: **terk edilen oturumlar da toplama dahil.** Hedefe
 * ulaşmamak, o zikrin çekilmediği anlamına gelmiyor — 100 hedefleyip
 * 60'ta bırakan kişi 60 zikir çekmiştir. "Tamamlanan" ayrı bir metrik
 * olarak duruyor.
 */

export type DailyPoint = { date: string; total: number };

export type ZikirBreakdownRow = {
  templateId: string;
  name: string;
  total: number;
};

export type TesbihStats = {
  today: number;
  week: number;
  month: number;
  allTime: number;
  /** Son 30 günün günlük toplamları, eksik günler 0 ile dolu */
  daily: DailyPoint[];
  breakdown: ZikirBreakdownRow[];
  /** Bugün dahil aralıksız zikir çekilen gün sayısı */
  currentStreak: number;
  longestStreak: number;
  /** Son adımı tamamlanmış zincirli set sayısı */
  completedSets: number;
  isLoading: boolean;
};

const EMPTY: TesbihStats = {
  today: 0,
  week: 0,
  month: 0,
  allTime: 0,
  daily: [],
  breakdown: [],
  currentStreak: 0,
  longestStreak: 0,
  completedSets: 0,
  isLoading: true,
};

function isoOf(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function daysAgo(count: number): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - count);
  return date;
}

/** Haftanın başı pazartesi — Türkiye'de hafta böyle sayılıyor */
function startOfWeek(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  const day = date.getDay(); // 0 pazar
  const offset = day === 0 ? 6 : day - 1;
  date.setDate(date.getDate() - offset);
  return date;
}

function startOfMonth(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(1);
  return date;
}

/**
 * Ardışık gün serilerini hesaplar.
 * Bugün henüz zikir çekilmediyse dünden devam eden seri korunur —
 * gün bitmeden seriyi sıfırlamak haksız olur.
 */
function computeStreaks(dates: string[]): {
  current: number;
  longest: number;
} {
  if (dates.length === 0) return { current: 0, longest: 0 };

  const unique = [...new Set(dates)].sort();
  const dayMs = 86_400_000;
  const toTime = (iso: string) => new Date(`${iso}T00:00:00`).getTime();

  let longest = 1;
  let run = 1;
  for (let i = 1; i < unique.length; i += 1) {
    const gap = toTime(unique[i]) - toTime(unique[i - 1]);
    run = gap === dayMs ? run + 1 : 1;
    longest = Math.max(longest, run);
  }

  const today = isoOf(new Date());
  const yesterday = isoOf(daysAgo(1));
  const last = unique[unique.length - 1];
  const current = last === today || last === yesterday ? run : 0;

  return { current, longest };
}

async function loadStats(): Promise<Omit<TesbihStats, 'isLoading'>> {
  const todayIso = isoOf(new Date());
  const weekIso = isoOf(startOfWeek());
  const monthIso = isoOf(startOfMonth());
  const windowIso = isoOf(daysAgo(29));

  const sumOf = async (from?: string) => {
    const rows = await db
      .select({ total: sql<number>`coalesce(sum(${zikirSessions.currentCount}), 0)` })
      .from(zikirSessions)
      .where(from ? gte(zikirSessions.date, from) : undefined);
    return Number(rows[0]?.total ?? 0);
  };

  const [today, week, month, allTime] = await Promise.all([
    sumOf(todayIso),
    sumOf(weekIso),
    sumOf(monthIso),
    sumOf(),
  ]);

  const dailyRows = await db
    .select({
      date: zikirSessions.date,
      total: sql<number>`coalesce(sum(${zikirSessions.currentCount}), 0)`,
    })
    .from(zikirSessions)
    .where(gte(zikirSessions.date, windowIso))
    .groupBy(zikirSessions.date);

  const byDate = new Map(dailyRows.map((row) => [row.date, Number(row.total)]));
  const daily: DailyPoint[] = Array.from({ length: 30 }, (_, index) => {
    const iso = isoOf(daysAgo(29 - index));
    return { date: iso, total: byDate.get(iso) ?? 0 };
  });

  const breakdownRows = await db
    .select({
      templateId: zikirSessions.templateId,
      total: sql<number>`coalesce(sum(${zikirSessions.currentCount}), 0)`,
    })
    .from(zikirSessions)
    .groupBy(zikirSessions.templateId);

  const breakdown: ZikirBreakdownRow[] = breakdownRows
    .map((row) => ({
      templateId: row.templateId ?? '',
      name: getZikirTemplate(row.templateId ?? '')?.name ?? 'Bilinmeyen zikir',
      total: Number(row.total),
    }))
    .filter((row) => row.total > 0)
    .sort((a, b) => b.total - a.total);

  // Bir set, son adımı tamamlandığında bitmiş sayılır.
  let completedSets = 0;
  for (const set of ZIKIR_SETS) {
    const rows = await db
      .select({ count: sql<number>`count(*)` })
      .from(zikirSessions)
      .where(
        and(
          eq(zikirSessions.setId, set.id),
          eq(zikirSessions.setStepIndex, set.steps.length - 1),
          eq(zikirSessions.status, 'completed')
        )
      );
    completedSets += Number(rows[0]?.count ?? 0);
  }

  const activeDates = await db
    .selectDistinct({ date: zikirSessions.date })
    .from(zikirSessions)
    .where(ne(zikirSessions.currentCount, 0));

  const streaks = computeStreaks(activeDates.map((row) => row.date));

  return {
    today,
    week,
    month,
    allTime,
    daily,
    breakdown,
    currentStreak: streaks.current,
    longestStreak: streaks.longest,
    completedSets,
  };
}

export function useTesbihStats(): TesbihStats {
  const [stats, setStats] = useState<TesbihStats>(EMPTY);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const next = await loadStats();
        if (!cancelled) setStats({ ...next, isLoading: false });
      } catch {
        // Sorgu patlarsa boş rapor gösterilir; ekran çökmesin.
        if (!cancelled) setStats({ ...EMPTY, isLoading: false });
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return stats;
}
