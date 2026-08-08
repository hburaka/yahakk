import type { PrayerTimeSource } from '@/core/db/schema';

export type PrayerKey =
  | 'fajr'
  | 'sunrise'
  | 'dhuhr'
  | 'asr'
  | 'maghrib'
  | 'isha';

/** Tarife sırası — ekranda bu sırayla listelenir */
export const PRAYER_ORDER: readonly PrayerKey[] = [
  'fajr',
  'sunrise',
  'dhuhr',
  'asr',
  'maghrib',
  'isha',
] as const;

export const PRAYER_LABELS: Record<PrayerKey, string> = {
  fajr: 'İmsak',
  sunrise: 'Güneş',
  dhuhr: 'Öğle',
  asr: 'İkindi',
  maghrib: 'Akşam',
  isha: 'Yatsı',
};

/**
 * Ekran okuyucu için açık okunuş. "Güneş" vakti bir namaz vakti değil,
 * güneşin doğuşudur; ekran okuyucuda bunun ayrımı yapılmazsa kullanıcı
 * altı namaz vakti olduğunu sanıyor.
 */
export const PRAYER_A11Y_LABELS: Record<PrayerKey, string> = {
  fajr: 'İmsak vakti',
  sunrise: 'Güneşin doğuşu',
  dhuhr: 'Öğle namazı vakti',
  asr: 'İkindi namazı vakti',
  maghrib: 'Akşam namazı vakti',
  isha: 'Yatsı namazı vakti',
};

/**
 * Bir günün vakitleri. Değerler gün başından itibaren **dakika**
 * cinsindendir (05:42 → 342) — veritabanı şemasıyla aynı gösterim.
 */
export type DaySchedule = {
  /** ISO tarih, "2026-08-07" */
  date: string;
  times: Record<PrayerKey, number>;
  source: PrayerTimeSource;
};
