import { create } from 'zustand';

import type { DayPeriod } from '@/core/ui/theme';

import { minutesSinceMidnight, roughPeriodFromClock } from './period';

type PeriodState = {
  /** İçinde bulunulan gün dilimi — arayüzün tek kromatik rolünü belirler */
  period: DayPeriod;
  setPeriod: (period: DayPeriod) => void;
};

/**
 * Gün dilimi ayrı bir store'da tutuluyor çünkü iki bağımsız yer okuyor:
 * namaz vakitleri ekranı (tarife rayı) ve sekme çubuğu (aktif renk).
 * Vakitler yüklenmeden önceki ilk çizim için saatten kaba tahmin
 * kullanılır; gerçek tarife gelince ekran bunu günceller.
 */
export const usePeriodStore = create<PeriodState>((set) => ({
  period: roughPeriodFromClock(minutesSinceMidnight(new Date())),
  setPeriod: (period) =>
    set((state) => (state.period === period ? state : { period })),
}));
