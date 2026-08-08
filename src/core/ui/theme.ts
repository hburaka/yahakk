/**
 * Tasarım tokenları. Kararların gerekçesi DESIGN.md'de.
 *
 * Temel kural: arayüz akromatiktir (mürekkep ekseni), ekrandaki tek
 * kromatik öge içinde bulunulan namaz vaktinin gök rengidir. Vakit rengi
 * yalnızca ray, işaretçi ve vurgu olarak görünür — hiçbir zaman metnin
 * kendi rengi olmaz. Böylece kontrast oranı vakitten bağımsız kalır.
 *
 * Üç mod:
 *  - light : sıcak kağıt, gündüz
 *  - dark  : nötr mürekkep, akşam
 *  - night : sıcak ve kısık; imsak öncesi karanlıkta okumak için, cihaz
 *            ayarından bağımsız olarak kullanıcı elle seçer.
 */

export type ThemeMode = 'light' | 'dark' | 'night';

/** Günün namaz vakitlerine göre bölünmüş dilimleri */
export type DayPeriod =
  /** yatsı → imsak */
  | 'gece'
  /** imsak → güneş */
  | 'fecr'
  /** güneş → öğle */
  | 'kusluk'
  /** öğle → ikindi */
  | 'ogle'
  /** ikindi → akşam */
  | 'ikindi'
  /** akşam → yatsı */
  | 'aksam';

export type NeutralPalette = {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  borderStrong: string;

  /** AAA — gövde metni, başlıklar, saatler */
  text: string;
  /** AAA — ikincil metin */
  textSecondary: string;
  /**
   * Yalnızca AA. Büyük metin, dekoratif etiket ve devre dışı öge
   * dışında kullanılmamalı; küçük gövde metni için AAA hedefini tutmaz.
   */
  textMuted: string;

  danger: string;
  success: string;
  warning: string;
};

export const neutrals: Record<ThemeMode, NeutralPalette> = {
  light: {
    background: '#FAF8F4',
    surface: '#FFFDFA',
    surfaceAlt: '#F0EDE6',
    border: '#E2DED4',
    borderStrong: '#C9C4B7',

    text: '#14120E',
    textSecondary: '#4A463D',
    textMuted: '#6B665B',

    danger: '#96271F',
    success: '#1B5E3F',
    warning: '#8A5A12',
  },

  dark: {
    background: '#0E0F11',
    surface: '#16181B',
    surfaceAlt: '#1E2126',
    border: '#2A2E34',
    borderStrong: '#3D4249',

    text: '#F2F1EE',
    textSecondary: '#B4B1AA',
    textMuted: '#83807A',

    danger: '#F0A9A2',
    success: '#7FCFA4',
    warning: '#E3B36A',
  },

  night: {
    background: '#0A0705',
    surface: '#100C08',
    surfaceAlt: '#171109',
    border: '#241B12',
    borderStrong: '#332618',

    text: '#DFC9A6',
    textSecondary: '#A8977B',
    textMuted: '#8C7F68',

    danger: '#C9846A',
    success: '#A39566',
    warning: '#C9A05E',
  },
};

export type PeriodPalette = {
  /** Ray, işaretçi, aktif satır vurgusu, birincil buton zemini */
  accent: string;
  /** Aktif satırın çok hafif yüzey kırılması */
  accentSoft: string;
  /** Accent üzerine gelen metin — okunabilirlik için sabitlenmiş */
  onAccent: string;
};

/**
 * Vakit renkleri gökyüzünden türetildi, dinî ikonografiden değil.
 * Açık modda kağıt üzerinde yeterli derinliğe, koyu modlarda mürekkep
 * üzerinde yeterli parlaklığa sahip olacak şekilde ayrı ayrı seçildi.
 */
export const periodColors: Record<ThemeMode, Record<DayPeriod, PeriodPalette>> =
  {
    light: {
      gece: { accent: '#2E3A6B', accentSoft: '#EAECF5', onAccent: '#FFFDFA' },
      fecr: { accent: '#5B4B8A', accentSoft: '#EFEBF6', onAccent: '#FFFDFA' },
      kusluk: { accent: '#9C6B1E', accentSoft: '#F7EFDF', onAccent: '#FFFDFA' },
      ogle: { accent: '#6F6555', accentSoft: '#F2EFE8', onAccent: '#FFFDFA' },
      ikindi: { accent: '#A55716', accentSoft: '#F8EDE1', onAccent: '#FFFDFA' },
      aksam: { accent: '#96324A', accentSoft: '#F7E9EC', onAccent: '#FFFDFA' },
    },

    dark: {
      gece: { accent: '#7C8FD6', accentSoft: '#171B2B', onAccent: '#0E0F11' },
      fecr: { accent: '#A491DE', accentSoft: '#1D1930', onAccent: '#0E0F11' },
      kusluk: { accent: '#E8C173', accentSoft: '#2A2213', onAccent: '#0E0F11' },
      ogle: { accent: '#CFC2A6', accentSoft: '#23211B', onAccent: '#0E0F11' },
      ikindi: { accent: '#EF9A4F', accentSoft: '#2C1E11', onAccent: '#0E0F11' },
      aksam: { accent: '#E8808F', accentSoft: '#2B171C', onAccent: '#0E0F11' },
    },

    night: {
      gece: { accent: '#8E8467', accentSoft: '#171208', onAccent: '#0A0705' },
      fecr: { accent: '#9C8A6B', accentSoft: '#1A1309', onAccent: '#0A0705' },
      kusluk: { accent: '#D2A961', accentSoft: '#211705', onAccent: '#0A0705' },
      ogle: { accent: '#BE9F72', accentSoft: '#1D1508', onAccent: '#0A0705' },
      ikindi: { accent: '#D89A4C', accentSoft: '#231705', onAccent: '#0A0705' },
      aksam: { accent: '#CC8062', accentSoft: '#221306', onAccent: '#0A0705' },
    },
  };

/** Vakit dilimlerinin görünen adları */
export const PERIOD_LABELS: Record<DayPeriod, string> = {
  gece: 'Gece',
  fecr: 'İmsak sonrası',
  kusluk: 'Kuşluk',
  ogle: 'Öğle',
  ikindi: 'İkindi',
  aksam: 'Akşam',
};

/** 4pt tabanlı ölçek */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  /** Sıradaki vakit bloğu ile tarife listesi arasındaki nefes */
  section: 56,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

/**
 * Tipografi.
 *
 * Taban gövde 17pt — kategori standardından büyük. Kullanıcı yaş
 * dağılımının üst tarafı ağır bastığı için taban bilinçli büyütüldü;
 * bu bir taviz değil, düzenin kendisi (bkz. PRODUCT.md ilke 4).
 *
 * `tabular` alanı true olan tokenlar sabit genişlikli rakam ister:
 * geri sayım her saniye değişiyor, orantılı rakamla sayı zıplıyor.
 */
export const typography = {
  /** Geri sayım ve tesbih sayacı */
  countdown: { fontSize: 64, lineHeight: 66, fontWeight: '700', tabular: true },
  display: { fontSize: 44, lineHeight: 48, fontWeight: '700', tabular: false },
  title: { fontSize: 30, lineHeight: 36, fontWeight: '700', tabular: false },
  heading: { fontSize: 22, lineHeight: 28, fontWeight: '600', tabular: false },
  /** Tarife satırındaki saat */
  time: { fontSize: 20, lineHeight: 26, fontWeight: '600', tabular: true },
  body: { fontSize: 17, lineHeight: 26, fontWeight: '400', tabular: false },
  bodyStrong: { fontSize: 17, lineHeight: 26, fontWeight: '600', tabular: false },
  /**
   * Buton etiketi.
   *
   * Boyutu gövde metniyle aynı ama satır aralığı dar (26 değil 22).
   * Butonlar önce `bodyStrong` kullanıyordu; o token okuma metni için
   * ayarlanmış geniş satır aralığı taşıdığı için butonlar gereksiz
   * uzuyor ve ekrandan ekrana farklı yükseklikte çıkıyordu. Ayrı token
   * olması ayrıca buton yazısını tek yerden değiştirilebilir kılıyor.
   */
  button: { fontSize: 17, lineHeight: 22, fontWeight: '600', tabular: false },
  caption: { fontSize: 14, lineHeight: 20, fontWeight: '400', tabular: false },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '600', tabular: false },

  arabic: { fontSize: 28, lineHeight: 52, fontWeight: '400', tabular: false },
  transliteration: {
    fontSize: 17,
    lineHeight: 30,
    fontWeight: '500',
    tabular: false,
  },
} as const;

export type TypographyToken = keyof typeof typography;

/**
 * Okuma yazı boyutu çarpanı — Latin (Türkçe) metin için.
 * Yalnızca dua ve ilmihal metinlerine uygulanır; arayüz etiketlerine
 * uygulanırsa sekme adları ve butonlar taşıyor.
 */
export const readingScales = {
  small: 0.9,
  normal: 1,
  large: 1.2,
  xlarge: 1.45,
  xxlarge: 1.75,
} as const;

export type ReadingScale = keyof typeof readingScales;

/**
 * Arapça metin ölçeği Latin ölçeğinden **bağımsızdır**.
 *
 * Arapça harekeleriyle birlikte geldiği için aynı puntoda Latin metinden
 * belirgin biçimde küçük okunur. Tek bir ölçekle ikisini birden
 * ayarlamak daima birini bozuyor: Türkçe meali rahat okunacak boyuta
 * getirdiğinizde Arapça hâlâ küçük kalıyor, Arapça'yı düzelttiğinizde
 * Türkçe ekrana sığmıyor.
 */
export const arabicScales = {
  small: 0.85,
  normal: 1,
  large: 1.25,
  xlarge: 1.55,
  xxlarge: 1.9,
} as const;

export type ArabicScale = keyof typeof arabicScales;

export const SCALE_LABELS: Record<ReadingScale, string> = {
  small: 'Küçük',
  normal: 'Normal',
  large: 'Büyük',
  xlarge: 'Çok büyük',
  xxlarge: 'En büyük',
};

/**
 * Okuma yazı tipi. Boyut ve yazı tipi yaşlı kullanıcıda **iki ayrı
 * problemdir**: harflerin birbirine karışması (ı/i, rn/m, 3/8) punto
 * büyütmekle çözülmez, harf biçimiyle çözülür.
 *
 * `undefined` = cihazın sistem yazı tipi.
 */
export type ReadingFont = 'sistem' | 'serif' | 'okunakli';

export type FontChoice = {
  label: string;
  hint: string;
  regular: string | undefined;
  bold: string | undefined;
};

export const READING_FONTS: Record<ReadingFont, FontChoice> = {
  sistem: {
    label: 'Sistem',
    hint: 'Telefonunuzun kendi yazı tipi',
    regular: undefined,
    bold: undefined,
  },
  serif: {
    label: 'Kitap',
    hint: 'Tırnaklı harfler, basılı kitap hissi',
    regular: 'Lora_400Regular',
    bold: 'Lora_600SemiBold',
  },
  okunakli: {
    label: 'Yüksek okunabilirlik',
    hint: 'Az gören okuyucular için tasarlandı; benzer harfleri belirgin biçimde ayırır',
    regular: 'AtkinsonHyperlegible_400Regular',
    bold: 'AtkinsonHyperlegible_700Bold',
  },
};

/** Arapça yazı tipi — mushaf geleneğine göre iki farklı nesih */
export type ArabicFont = 'amiri' | 'scheherazade';

export const ARABIC_FONTS: Record<ArabicFont, FontChoice> = {
  amiri: {
    label: 'Amiri',
    hint: 'Klasik nesih, mushaf hattına yakın',
    regular: 'Amiri_400Regular',
    bold: 'Amiri_700Bold',
  },
  scheherazade: {
    label: 'Scheherazade',
    hint: 'Daha büyük gövde ve açık harekeler, netlik önceliği',
    regular: 'ScheherazadeNew_400Regular',
    bold: 'ScheherazadeNew_600SemiBold',
  },
};

/** Erişilebilirlik tabanı — dokunma hedefi alt sınırı */
export const MIN_TOUCH_TARGET = 48;
