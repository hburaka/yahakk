import { useEffect, useMemo, useState } from 'react';

import type { Location as LocationRow } from '@/core/db/schema';

import { calculateDaySchedule, todayIso } from './calculate';
import { applyMargins, type PrayerMargins } from './margins';
import {
  findNextPrayer,
  minutesSinceMidnight,
  periodFromSchedule,
  type NextPrayer,
} from './period';
import { usePeriodStore } from './period-store';
import type { DaySchedule } from './types';
import { useLocation } from './use-location';
import { usePrayerSettings } from './use-prayer-settings';

export type ScheduleState =
  | { status: 'loading' }
  | { status: 'needsLocation'; reason: 'denied' | 'unavailable' }
  | {
      status: 'ready';
      location: LocationRow;
      schedule: DaySchedule;
      next: NextPrayer;
      /** Sıradaki vakte kalan saniye — her saniye güncellenir */
      remainingSeconds: number;
      /** Uygulanan ihtiyat payı — arayüzde rozet göstermek için */
      margins: PrayerMargins;
    };

/**
 * Günün tarifesini, sıradaki vakti ve canlı geri sayımı verir.
 * Ayrıca gün dilimini store'a yazar — arayüzün kromatik rolü buradan
 * besleniyor.
 *
 * Şu an vakitler her zaman cihazda hesaplanıyor. Türkiye için Diyanet
 * anlık görüntüsü Faz 1'in ikinci yarısında devreye girecek ve bu
 * hesaplama yurt dışı + çevrimdışı yedeği hâline gelecek.
 */
export function useDaySchedule(): ScheduleState {
  const locationState = useLocation();
  const settings = usePrayerSettings();
  const setPeriod = usePeriodStore((state) => state.setPeriod);

  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const location =
    locationState.status === 'ready' ? locationState.location : null;

  const maghribMargin = settings.margins.maghrib;
  const fajrMargin = settings.margins.fajr;

  const schedule = useMemo(() => {
    if (!location) return null;
    const raw = calculateDaySchedule(location, todayIso(location.timezone), {
      method: settings.calculationMethod,
      asrMethod: settings.asrMethod,
      timezone: location.timezone,
      highLatitudeRule: settings.highLatitudeRule,
    });
    // İhtiyat payı hesaptan sonra uygulanıyor; hesabın kendisi saf
    // kalsın ki doğrulama script'i kullanıcı ayarından etkilenmesin.
    return applyMargins(raw, { fajr: fajrMargin, maghrib: maghribMargin });
  }, [
    location,
    settings.calculationMethod,
    settings.asrMethod,
    settings.highLatitudeRule,
    fajrMargin,
    maghribMargin,
  ]);

  const nowMinutes = minutesSinceMidnight(now);

  const period = useMemo(
    () => (schedule ? periodFromSchedule(schedule, nowMinutes) : null),
    [schedule, nowMinutes]
  );

  useEffect(() => {
    if (period) setPeriod(period);
  }, [period, setPeriod]);

  if (locationState.status === 'loading') return { status: 'loading' };
  if (locationState.status === 'needsSelection') {
    return { status: 'needsLocation', reason: locationState.reason };
  }
  if (!location || !schedule) return { status: 'loading' };

  const next = findNextPrayer(schedule, nowMinutes);

  return {
    status: 'ready',
    location,
    schedule,
    next,
    remainingSeconds: next.remainingMinutes * 60 - now.getSeconds(),
    margins: { fajr: fajrMargin, maghrib: maghribMargin },
  };
}
