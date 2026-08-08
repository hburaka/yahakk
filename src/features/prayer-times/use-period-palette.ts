import { periodColors, type PeriodPalette } from '@/core/ui/theme';
import { useTheme } from '@/core/ui/theme-context';

import { usePeriodStore } from './period-store';

/**
 * Ekrandaki tek kromatik rol: içinde bulunulan vaktin gök rengi.
 * Tema modu ile gün dilimini birleştirir.
 *
 * Bu renk asla metin rengi olarak kullanılmaz — yalnızca ray, işaretçi,
 * aktif satır vurgusu ve buton zemini. Metin renkleri paletin nötr
 * ekseninden gelir, böylece kontrast oranı vakitten bağımsız kalır.
 */
export function usePeriodPalette(): PeriodPalette {
  const { mode } = useTheme();
  const period = usePeriodStore((state) => state.period);
  return periodColors[mode][period];
}
