import { neutrals, periodColors, type ThemeMode } from './theme';

/**
 * Kontrast testleri.
 *
 * PRODUCT.md WCAG 2.2 **AAA** hedefliyor (normal metin 7:1) ve şunu
 * ekliyor: "AAA tutturulamayan yerde gerekçesi yazılır."
 *
 * Bu söz insan hafızasına bırakılırsa tutulmuyor. `textMuted` bir
 * dönem üç modda da yalnızca AA idi ve tam olarak en küçük yazılarda
 * kullanılıyordu (caption 14pt, label 13pt); kimse fark etmedi çünkü
 * kontrastı gözle ölçmek mümkün değil. Test o yüzden var.
 *
 * Bilinçli bir istisna gerekirse buraya gerekçesiyle yazılır — sessizce
 * eşiğin altına inmek yerine.
 */

const AAA_NORMAL = 7;
/** 18pt+ veya 14pt kalın metin için AAA eşiği */
const AAA_LARGE = 4.5;

const MODES: readonly ThemeMode[] = ['light', 'dark', 'night'];

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  return (
    0.2126 * channel((n >> 16) & 255) +
    0.7152 * channel((n >> 8) & 255) +
    0.0722 * channel(n & 255)
  );
}

export function contrastRatio(a: string, b: string): number {
  const first = luminance(a);
  const second = luminance(b);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('metin kontrastı', () => {
  it('bilinen değerlerle doğru hesaplıyor', () => {
    // Referans: siyah üzerine beyaz 21:1, aynı renk 1:1
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
    expect(contrastRatio('#777777', '#777777')).toBeCloseTo(1, 5);
  });

  it.each(MODES)('%s modunda tüm metin renkleri AAA', (mode) => {
    const palette = neutrals[mode];

    for (const role of ['text', 'textSecondary', 'textMuted'] as const) {
      const ratio = contrastRatio(palette[role], palette.background);
      expect({ mode, role, ratio: Number(ratio.toFixed(2)) }).toMatchObject({
        ratio: expect.any(Number),
      });
      expect(ratio).toBeGreaterThanOrEqual(AAA_NORMAL);
    }
  });

  it.each(MODES)('%s modunda durum renkleri en az büyük metin AAA', (mode) => {
    // danger / success / warning uyarı metninde kullanılıyor; bunlar
    // renk seçimi kısıtlı olduğu için büyük metin eşiğinde tutuluyor.
    const palette = neutrals[mode];
    for (const role of ['danger', 'success', 'warning'] as const) {
      const ratio = contrastRatio(palette[role], palette.background);
      expect(ratio).toBeGreaterThanOrEqual(AAA_LARGE);
    }
  });

  it.each(MODES)('%s modunda yüzey üzerindeki metin de AAA', (mode) => {
    // Kartlar ve butonlar `surface` üzerine çiziliyor; arka planla
    // ölçmek yeterli değil.
    const palette = neutrals[mode];
    for (const role of ['text', 'textSecondary', 'textMuted'] as const) {
      const ratio = contrastRatio(palette[role], palette.surface);
      expect(ratio).toBeGreaterThanOrEqual(AAA_NORMAL);
    }
  });
});

describe('vakit renkleri', () => {
  /**
   * Vakit rengi metnin rengi olmaz (bkz. DESIGN.md), o yüzden metin
   * kontrastı aranmıyor. Ama birincil buton bir dönem vakit rengiyle
   * doluydu; `onAccent` o denemeden kalan rol ve hâlâ kullanılabilir
   * durumda tutuluyor. Kullanılacaksa okunur olmalı.
   */
  it.each(MODES)('%s modunda onAccent, accent üzerinde okunur', (mode) => {
    for (const period of Object.values(periodColors[mode])) {
      expect(contrastRatio(period.onAccent, period.accent)).toBeGreaterThanOrEqual(
        AAA_LARGE
      );
    }
  });
});
