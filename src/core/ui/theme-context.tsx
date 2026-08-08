import { createContext, use, useCallback, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';

import { storage, StorageKeys } from '@/core/store/storage';
import {
  ARABIC_FONTS,
  arabicScales,
  neutrals,
  radii,
  READING_FONTS,
  readingScales,
  spacing,
  typography,
  type ArabicFont,
  type ArabicScale,
  type FontChoice,
  type NeutralPalette,
  type ReadingFont,
  type ReadingScale,
  type ThemeMode,
} from '@/core/ui/theme';

/**
 * `system` cihaz ayarını takip eder. `night` bilinçli bir seçimdir ve
 * cihaz ayarından bağımsızdır — kullanıcı karanlıkta okumak için elle açar.
 */
export type ThemePreference = 'system' | ThemeMode;

type ThemeContextValue = {
  /** Çözümlenmiş mod — `system` burada asla görünmez */
  mode: ThemeMode;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  /**
   * Yalnızca nötr eksen. Kromatik vurgu için `usePeriodPalette()`
   * kullanılır — ekrandaki tek renk içinde bulunulan vakittir.
   */
  colors: NeutralPalette;

  /** Latin okuma metni */
  readingScale: ReadingScale;
  setReadingScale: (scale: ReadingScale) => void;
  readingScaleFactor: number;
  readingFont: ReadingFont;
  setReadingFont: (font: ReadingFont) => void;
  readingFontChoice: FontChoice;

  /** Arapça metin — Latin'den bağımsız ölçek ve yazı tipi */
  arabicScale: ArabicScale;
  setArabicScale: (scale: ArabicScale) => void;
  arabicScaleFactor: number;
  arabicFont: ArabicFont;
  setArabicFont: (font: ArabicFont) => void;
  arabicFontChoice: FontChoice;

  spacing: typeof spacing;
  radii: typeof radii;
  typography: typeof typography;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function pick<T extends string>(
  value: string | undefined,
  allowed: Record<T, unknown>,
  fallback: T
): T {
  return value !== undefined && value in allowed ? (value as T) : fallback;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();

  const [storedPreference, setStoredPreference] = useMMKVString(
    StorageKeys.themePreference,
    storage
  );
  const [storedScale, setStoredScale] = useMMKVString(
    StorageKeys.readingScale,
    storage
  );
  const [storedFont, setStoredFont] = useMMKVString(
    StorageKeys.readingFont,
    storage
  );
  const [storedArabicScale, setStoredArabicScale] = useMMKVString(
    StorageKeys.arabicScale,
    storage
  );
  const [storedArabicFont, setStoredArabicFont] = useMMKVString(
    StorageKeys.arabicFont,
    storage
  );

  const preference: ThemePreference =
    storedPreference === 'system' ||
    storedPreference === 'light' ||
    storedPreference === 'dark' ||
    storedPreference === 'night'
      ? storedPreference
      : 'system';

  const readingScale = pick<ReadingScale>(storedScale, readingScales, 'normal');
  const readingFont = pick<ReadingFont>(storedFont, READING_FONTS, 'sistem');
  const arabicScale = pick<ArabicScale>(
    storedArabicScale,
    arabicScales,
    'normal'
  );
  const arabicFont = pick<ArabicFont>(storedArabicFont, ARABIC_FONTS, 'amiri');

  const mode: ThemeMode =
    preference === 'system'
      ? systemScheme === 'dark'
        ? 'dark'
        : 'light'
      : preference;

  const setPreference = useCallback(
    (next: ThemePreference) => setStoredPreference(next),
    [setStoredPreference]
  );
  const setReadingScale = useCallback(
    (next: ReadingScale) => setStoredScale(next),
    [setStoredScale]
  );
  const setReadingFont = useCallback(
    (next: ReadingFont) => setStoredFont(next),
    [setStoredFont]
  );
  const setArabicScale = useCallback(
    (next: ArabicScale) => setStoredArabicScale(next),
    [setStoredArabicScale]
  );
  const setArabicFont = useCallback(
    (next: ArabicFont) => setStoredArabicFont(next),
    [setStoredArabicFont]
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      preference,
      setPreference,
      colors: neutrals[mode],

      readingScale,
      setReadingScale,
      readingScaleFactor: readingScales[readingScale],
      readingFont,
      setReadingFont,
      readingFontChoice: READING_FONTS[readingFont],

      arabicScale,
      setArabicScale,
      arabicScaleFactor: arabicScales[arabicScale],
      arabicFont,
      setArabicFont,
      arabicFontChoice: ARABIC_FONTS[arabicFont],

      spacing,
      radii,
      typography,
    }),
    [
      mode,
      preference,
      setPreference,
      readingScale,
      setReadingScale,
      readingFont,
      setReadingFont,
      arabicScale,
      setArabicScale,
      arabicFont,
      setArabicFont,
    ]
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme(): ThemeContextValue {
  const context = use(ThemeContext);
  if (!context) {
    throw new Error('useTheme, ThemeProvider içinde kullanılmalıdır.');
  }
  return context;
}
