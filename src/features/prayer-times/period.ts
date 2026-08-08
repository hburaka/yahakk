import type { DayPeriod } from '@/core/ui/theme';

import { PRAYER_ORDER, type DaySchedule, type PrayerKey } from './types';

export const MINUTES_IN_DAY = 24 * 60;

/** Yerel saati gün başından itibaren dakikaya çevirir */
export function minutesSinceMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

/** 342 → "05:42" */
export function formatMinutes(minutes: number): string {
  const normalized = ((minutes % MINUTES_IN_DAY) + MINUTES_IN_DAY) % MINUTES_IN_DAY;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Ekran okuyucu için saat okunuşu. Ham "05:42" ekran okuyucuda
 * "sıfır beş iki nokta dört iki" gibi okunuyor.
 */
export function spellMinutes(minutes: number): string {
  const normalized = ((minutes % MINUTES_IN_DAY) + MINUTES_IN_DAY) % MINUTES_IN_DAY;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return m === 0 ? `saat ${h}` : `saat ${h} ${m}`;
}

/**
 * Vakitlere göre günün hangi diliminde olduğumuzu bulur.
 * Yatsıdan sonrası ve imsaktan öncesi aynı dilimdir: gece.
 */
export function periodFromSchedule(
  schedule: DaySchedule,
  nowMinutes: number
): DayPeriod {
  const { times } = schedule;
  if (nowMinutes < times.fajr) return 'gece';
  if (nowMinutes < times.sunrise) return 'fecr';
  if (nowMinutes < times.dhuhr) return 'kusluk';
  if (nowMinutes < times.asr) return 'ogle';
  if (nowMinutes < times.maghrib) return 'ikindi';
  if (nowMinutes < times.isha) return 'aksam';
  return 'gece';
}

/**
 * Vakitler henüz yüklenmemişken ilk çizim için kaba tahmin.
 * Yalnızca yüzey rengini seçmek için kullanılır; kullanıcıya sayı
 * olarak hiçbir zaman gösterilmez.
 */
export function roughPeriodFromClock(nowMinutes: number): DayPeriod {
  if (nowMinutes < 5 * 60) return 'gece';
  if (nowMinutes < 6 * 60 + 30) return 'fecr';
  if (nowMinutes < 13 * 60) return 'kusluk';
  if (nowMinutes < 16 * 60 + 30) return 'ogle';
  if (nowMinutes < 19 * 60 + 30) return 'ikindi';
  if (nowMinutes < 21 * 60) return 'aksam';
  return 'gece';
}

export type NextPrayer = {
  key: PrayerKey;
  /** Vaktin kendi saati, dakika cinsinden */
  at: number;
  /** Şu andan itibaren kalan dakika (gece devri hesaba katılmış) */
  remainingMinutes: number;
  /** Sıradaki vakit yarına mı sarkıyor */
  isTomorrow: boolean;
};

/**
 * Sıradaki vakti bulur. Gün içinde kalan vakit yoksa yarının imsakına
 * sarar — yatsıdan sonra açıldığında ekranın boş kalmaması için.
 */
export function findNextPrayer(
  schedule: DaySchedule,
  nowMinutes: number
): NextPrayer {
  for (const key of PRAYER_ORDER) {
    const at = schedule.times[key];
    if (at > nowMinutes) {
      return { key, at, remainingMinutes: at - nowMinutes, isTomorrow: false };
    }
  }

  const at = schedule.times.fajr;
  return {
    key: 'fajr',
    at,
    remainingMinutes: MINUTES_IN_DAY - nowMinutes + at,
    isTomorrow: true,
  };
}

/**
 * Geri sayım — saat:dakika:saniye.
 *
 * Saniye her zaman gösteriliyor. Bilgi değeri düşük olsa da sayacın
 * canlı olduğunu görmek önemli: saniyesiz bir geri sayım dakikalarca
 * hiç değişmediği için ekran donmuş gibi duruyor.
 *
 * Tabular rakamla dizilir (typography.countdown), yoksa her saniye
 * rakam genişliği değişip metin zıplıyor.
 */
export function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;

  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** Ekran okuyucu için geri sayım okunuşu */
export function spellCountdown(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);

  if (hours > 0) return `${hours} saat ${minutes} dakika kaldı`;
  if (minutes > 0) return `${minutes} dakika kaldı`;
  return 'bir dakikadan az kaldı';
}
