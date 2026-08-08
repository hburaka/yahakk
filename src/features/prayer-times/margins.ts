import type { DaySchedule, PrayerKey } from './types';

/**
 * İhtiyat payı.
 *
 * Cihazdaki hesap, Diyanet'in resmî yayınladığı vakitlerle en fazla
 * 2 dakika sapıyor (bkz. scripts/compare-diyanet.mjs). Normal günlerde
 * bunun pratik etkisi yok, ancak **oruç** için iki uçta da önemli:
 *
 * - **İftar**: akşam vaktinin erken olması istenmez → paya eklenir.
 *   Ölçüm: pay olmadan 122 günün 62'sinde Diyanet'ten erken. +2 dk
 *   bunu sıfırlıyor.
 * - **Sahur**: imsakın geç olması istenmez → paya çıkarılır.
 *   Ölçüm: pay olmadan 122 günün 5'inde Diyanet'ten geç. -1 dk
 *   bunu sıfırlıyor.
 *
 * Kullanıcı her iki payı da dakika cinsinden **pozitif** olarak girer;
 * yönü kod belirler. Varsayılan **0**: uygulama kimse adına ihtiyat
 * kararı vermez. Pay uygulandığında arayüzde açıkça belirtilir —
 * kullanıcı resmî vakti sandığı bir şeye bakmamalı.
 */
export type PrayerMargins = {
  /** İmsaktan çıkarılacak dakika (sahur ihtiyatı) */
  fajr: number;
  /** Akşama eklenecek dakika (iftar ihtiyatı) */
  maghrib: number;
};

export const DEFAULT_MARGINS: PrayerMargins = { fajr: 0, maghrib: 0 };

export const MARGIN_OPTIONS = [0, 1, 2, 3, 5] as const;

/** Ölçüme dayalı öneriler — ayar ekranında işaretlenir */
export const RECOMMENDED_MARGINS: PrayerMargins = { fajr: 1, maghrib: 2 };

export function marginLabel(minutes: number): string {
  return minutes === 0 ? 'Yok' : `${minutes} dakika`;
}

/**
 * Vakte uygulanacak **işaretli** kayma.
 * İmsak geriye (negatif), akşam ileriye (pozitif) kayar.
 */
export function marginFor(prayer: PrayerKey, margins: PrayerMargins): number {
  if (prayer === 'fajr') return -margins.fajr;
  if (prayer === 'maghrib') return margins.maghrib;
  return 0;
}

export function hasAnyMargin(margins: PrayerMargins): boolean {
  return margins.fajr > 0 || margins.maghrib > 0;
}

/**
 * Payı tarifeye uygular.
 *
 * Hesaplamanın kendisi saf kalıyor; pay sonradan ekleniyor. Böylece
 * doğrulama script'i (compare-diyanet.mjs) kullanıcının ayarından
 * etkilenmeden ham hesabı ölçmeye devam edebiliyor.
 */
export function applyMargins(
  schedule: DaySchedule,
  margins: PrayerMargins
): DaySchedule {
  if (!hasAnyMargin(margins)) return schedule;

  return {
    ...schedule,
    times: {
      ...schedule.times,
      fajr: schedule.times.fajr + marginFor('fajr', margins),
      maghrib: schedule.times.maghrib + marginFor('maghrib', margins),
    },
  };
}

/** Sınırlandırılmış okuma — depodan gelen değer bozuk olabilir */
export function clampMargin(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(Math.round(parsed), 15) : 0;
}
