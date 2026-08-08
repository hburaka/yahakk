/**
 * Hazır zikir şablonları.
 *
 * ⚠️ İÇERİK DOĞRULAMA NOTU
 * Buradaki Arapça metinler, okunuşlar, anlamlar ve tekrar sayıları yayına
 * çıkmadan önce ehil biri tarafından gözden geçirilmelidir. `source` alanı
 * boş olan kayıtlar hadis kaynağına dayanmayan, yaygın kullanımdan gelen
 * şablonlardır ve uygulamada "sünnette sayısı belirtilmiş" gibi
 * gösterilmemelidir (bkz. ZikirTemplate.source kullanımı).
 */

export type ZikirCategory =
  | 'tesbihat'
  | 'gunluk'
  | 'salavat'
  | 'istigfar'
  | 'tevhid'
  | 'sigma';

export type ZikirTemplate = {
  id: string;
  /** Türkçe ad — liste ve sayaç başlığında görünür */
  name: string;
  /**
   * Dar yerlerde kullanılan kısa ad (hızlı geçiş şeridi).
   * Tam ad şeride sığmıyor: "Sübhânallâhi ve bihamdihî" tek başına
   * ekranın yarısını kaplayıp şeridi kullanılamaz hale getiriyordu.
   */
  shortName: string;
  /** Arapça metin (RTL, Arapça font ile render edilir) */
  arabic: string;
  /** Latin harfli okunuş */
  transliteration: string;
  /** Türkçe anlamı */
  meaning: string;
  /** Varsayılan hedef; kullanıcı istediği sayıyla değiştirebilir */
  defaultCount: number;
  /** Sık kullanılan alternatif hedefler — sayaç ekranında hızlı seçim */
  suggestedCounts: readonly number[];
  category: ZikirCategory;
  /**
   * Tekrar sayısının dayandığı kaynak. undefined ise sayı yaygın
   * kullanımdan gelir, nassa dayanmaz — arayüzde kaynak rozeti gösterilmez.
   */
  source?: string;
  /** Kısa fazilet notu; yalnızca source varsa gösterilir */
  virtue?: string;
};

export const ZIKIR_TEMPLATES: readonly ZikirTemplate[] = [
  // ─────────────────────────── Tevhid ───────────────────────────
  {
    id: 'tehlil',
    name: 'Kelime-i Tevhid',
    shortName: 'Tevhid',
    arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ',
    transliteration: 'Lâ ilâhe illallâh',
    meaning: 'Allah’tan başka ilah yoktur.',
    defaultCount: 100,
    suggestedCounts: [33, 100, 500, 1000],
    category: 'tevhid',
  },
  {
    id: 'tehlil-tam',
    name: 'Kelime-i Tevhid (tam metin)',
    shortName: 'Tevhid (tam)',
    arabic:
      'لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلٰى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration:
      'Lâ ilâhe illallâhu vahdehû lâ şerîke leh, lehü’l-mülkü ve lehü’l-hamdü ve hüve alâ külli şey’in kadîr',
    meaning:
      'Allah’tan başka ilah yoktur, O tektir, ortağı yoktur. Mülk O’nundur, hamd O’na aittir. O her şeye kadirdir.',
    defaultCount: 100,
    suggestedCounts: [10, 100, 1000],
    category: 'tevhid',
    source: 'Buhârî, Deavât 64; Müslim, Zikir 28',
    virtue:
      'Günde yüz defa okuyana on köle azat etmiş sevabı yazılır, yüz iyilik yazılır, yüz günahı silinir.',
  },
  {
    id: 'temcid',
    name: 'Kelime-i Temcîd',
    shortName: 'Temcîd',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ الْعَلِيِّ الْعَظِيمِ',
    transliteration: 'Lâ havle velâ kuvvete illâ billâhi’l-aliyyi’l-azîm',
    meaning:
      'Güç ve kuvvet ancak yüce ve büyük olan Allah’a aittir.',
    defaultCount: 100,
    suggestedCounts: [33, 100, 500],
    category: 'tevhid',
  },

  // ─────────────────────── Namaz tesbihatı ───────────────────────
  {
    id: 'subhanallah',
    name: 'Sübhânallâh',
    shortName: 'Sübhânallâh',
    arabic: 'سُبْحَانَ اللّٰهِ',
    transliteration: 'Sübhânallâh',
    meaning: 'Allah’ı her türlü noksanlıktan tenzih ederim.',
    defaultCount: 33,
    suggestedCounts: [33, 100, 500],
    category: 'tesbihat',
  },
  {
    id: 'elhamdulillah',
    name: 'Elhamdülillâh',
    shortName: 'Elhamdülillâh',
    arabic: 'اَلْحَمْدُ لِلّٰهِ',
    transliteration: 'Elhamdülillâh',
    meaning: 'Hamd Allah’a mahsustur.',
    defaultCount: 33,
    suggestedCounts: [33, 100, 500],
    category: 'tesbihat',
  },
  {
    id: 'allahuekber',
    name: 'Allâhu ekber',
    shortName: 'Allâhu ekber',
    arabic: 'اَللّٰهُ أَكْبَرُ',
    transliteration: 'Allâhu ekber',
    meaning: 'Allah en büyüktür.',
    defaultCount: 34,
    suggestedCounts: [33, 34, 100],
    category: 'tesbihat',
  },

  // ──────────────────────── Günlük zikirler ────────────────────────
  {
    id: 'subhanallahi-ve-bihamdihi',
    name: 'Sübhânallâhi ve bihamdihî',
    shortName: 'Tesbîh + Hamd',
    arabic: 'سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ',
    transliteration: 'Sübhânallâhi ve bihamdihî',
    meaning: 'Allah’ı hamd ile tesbih ederim.',
    defaultCount: 100,
    suggestedCounts: [100, 500, 1000],
    category: 'gunluk',
    source: 'Buhârî, Deavât 65; Müslim, Zikir 28',
    virtue:
      'Günde yüz defa söyleyenin günahları, deniz köpüğü kadar da olsa bağışlanır.',
  },
  {
    id: 'subhanallahil-azim',
    name: 'Sübhânallâhi’l-azîm ve bihamdihî',
    shortName: 'Tesbîh-i azîm',
    arabic: 'سُبْحَانَ اللّٰهِ الْعَظِيمِ وَبِحَمْدِهِ',
    transliteration: 'Sübhânallâhi’l-azîm ve bihamdihî',
    meaning: 'Yüce Allah’ı hamd ile tesbih ederim.',
    defaultCount: 100,
    suggestedCounts: [33, 100, 500],
    category: 'gunluk',
  },
  {
    id: 'hasbunallah',
    name: 'Hasbünallâhu ve ni’me’l-vekîl',
    shortName: 'Hasbünallâh',
    arabic: 'حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَكِيلُ',
    transliteration: 'Hasbünallâhu ve ni’me’l-vekîl',
    meaning: 'Allah bize yeter, O ne güzel vekildir.',
    defaultCount: 100,
    suggestedCounts: [7, 100, 500],
    category: 'gunluk',
  },

  // ───────────────────────────  Salavât  ───────────────────────────
  {
    id: 'salavat-kisa',
    name: 'Salavât-ı Şerîfe',
    shortName: 'Salavât',
    arabic: 'اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ وَعَلٰى آلِهِ وَصَحْبِهِ وَسَلِّمْ',
    transliteration:
      'Allâhümme salli alâ seyyidinâ Muhammedin ve alâ âlihî ve sahbihî ve sellim',
    meaning:
      'Allah’ım! Efendimiz Muhammed’e, âline ve ashabına salât ve selam eyle.',
    defaultCount: 100,
    suggestedCounts: [10, 100, 1000],
    category: 'salavat',
  },

  // ───────────────────────────  İstiğfar  ───────────────────────────
  {
    id: 'estagfirullah',
    name: 'Estağfirullâh',
    shortName: 'İstiğfâr',
    arabic: 'أَسْتَغْفِرُ اللّٰهَ',
    transliteration: 'Estağfirullâh',
    meaning: 'Allah’tan bağışlanma dilerim.',
    defaultCount: 100,
    suggestedCounts: [33, 100, 500, 1000],
    category: 'istigfar',
    source: 'Müslim, Zikir 41',
    virtue:
      'Peygamber Efendimiz’in günde yetmiş defadan fazla istiğfar ettiği rivayet edilmiştir.',
  },
  {
    id: 'estagfirullah-azim',
    name: 'Estağfirullâhe’l-azîm',
    shortName: 'İstiğfâr-ı azîm',
    arabic: 'أَسْتَغْفِرُ اللّٰهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Estağfirullâhe’l-azîme ve etûbü ileyh',
    meaning: 'Yüce Allah’tan bağışlanma diler ve O’na tevbe ederim.',
    defaultCount: 100,
    suggestedCounts: [33, 100, 500],
    category: 'istigfar',
  },
] as const;

/**
 * Zincirli zikir setleri — adımlar sırayla ilerler, her adım bitince
 * sayaç otomatik olarak sonraki zikre geçer.
 */
export type ZikirSetStep = {
  templateId: ZikirTemplate['id'];
  count: number;
};

export type ZikirSet = {
  id: string;
  name: string;
  /** Hızlı geçiş şeridinde kullanılan kısa ad */
  shortName: string;
  description: string;
  steps: readonly ZikirSetStep[];
  source?: string;
};

export const ZIKIR_SETS: readonly ZikirSet[] = [
  {
    id: 'namaz-tesbihati',
    name: 'Namaz Tesbihatı',
    shortName: 'Namaz',
    description: 'Farz namazlardan sonra okunan tesbihat.',
    steps: [
      { templateId: 'subhanallah', count: 33 },
      { templateId: 'elhamdulillah', count: 33 },
      { templateId: 'allahuekber', count: 33 },
      { templateId: 'tehlil-tam', count: 1 },
    ],
    source: 'Müslim, Mesâcid 146',
  },
  {
    id: 'uyku-oncesi',
    name: 'Uyku Öncesi Tesbihat',
    shortName: 'Uyku öncesi',
    description: 'Yatmadan önce okunan tesbihat.',
    steps: [
      { templateId: 'subhanallah', count: 33 },
      { templateId: 'elhamdulillah', count: 33 },
      { templateId: 'allahuekber', count: 34 },
    ],
    source: 'Buhârî, Fedâilü’s-sahâbe 9',
  },
] as const;

const TEMPLATES_BY_ID = new Map(ZIKIR_TEMPLATES.map((t) => [t.id, t]));

export function getZikirTemplate(id: string): ZikirTemplate | undefined {
  return TEMPLATES_BY_ID.get(id);
}

export function getTemplatesByCategory(
  category: ZikirCategory
): ZikirTemplate[] {
  return ZIKIR_TEMPLATES.filter((t) => t.category === category);
}

export const CATEGORY_LABELS: Record<ZikirCategory, string> = {
  tevhid: 'Tevhid',
  tesbihat: 'Tesbihat',
  gunluk: 'Günlük Zikirler',
  salavat: 'Salavât',
  istigfar: 'İstiğfar',
  sigma: 'Kendi Zikirlerim',
};
