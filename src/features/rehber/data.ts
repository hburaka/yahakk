/**
 * Rehber sekmesinin iskeleti: dua kategorileri ve ilmihal konuları.
 *
 * ⚠️ İÇERİK DOĞRULAMA NOTU
 * Buradaki başlıklar yalnızca yapıyı kuruyor. Metinlerin kendisi
 * (Arapça, okunuş, meal ve ilmihal anlatımları) ehil biri tarafından
 * onaylanmadan uygulamaya girmeyecek. İlmihal içeriği ayrıca dinî
 * doğruluk riski taşır: yanlış tarif edilmiş bir abdest doğrudan
 * kullanıcının ibadetini etkiler. Bkz. PRODUCT.md ve plan risk #5.
 */

export type Madhab = 'hanefi' | 'safii';

export const MADHAB_LABELS: Record<Madhab, string> = {
  hanefi: 'Hanefî',
  safii: 'Şâfiî',
};

export type DuaCategory = {
  id: string;
  title: string;
  /** Kategorideki dua sayısı — içerik girildikçe gerçekleşecek */
  count: number;
};

export const DUA_CATEGORIES: readonly DuaCategory[] = [
  { id: 'gunluk', title: 'Sabah ve Akşam Duaları', count: 12 },
  { id: 'namaz', title: 'Namaz Duaları', count: 9 },
  { id: 'yemek', title: 'Yemek Duaları', count: 4 },
  { id: 'yolculuk', title: 'Yolculuk Duaları', count: 5 },
  { id: 'sifa', title: 'Şifa ve Sıkıntı Duaları', count: 8 },
  { id: 'kuran', title: "Kur'an'dan Dualar", count: 15 },
  { id: 'esma', title: "Esmâü'l-Hüsnâ", count: 99 },
] as const;

export type IlmihalTopic = {
  id: string;
  title: string;
  /**
   * Konunun anlatımı mezhebe göre değişiyor mu. Değişiyorsa ekranda
   * görünür mezhep etiketi zorunlu — etiketsiz gösterim, okuyucunun bir
   * kısmına yanlış bilgi vermek demek.
   */
  madhabSpecific: boolean;
};

export type IlmihalSection = {
  id: string;
  title: string;
  topics: readonly IlmihalTopic[];
};

export const ILMIHAL_SECTIONS: readonly IlmihalSection[] = [
  {
    id: 'temizlik',
    title: 'Temizlik',
    topics: [
      { id: 'abdest', title: 'Abdestin Alınışı', madhabSpecific: true },
      { id: 'abdest-bozan', title: 'Abdesti Bozan Durumlar', madhabSpecific: true },
      { id: 'gusul', title: 'Guslün Alınışı', madhabSpecific: true },
      { id: 'teyemmum', title: 'Teyemmüm', madhabSpecific: true },
    ],
  },
  {
    id: 'namaz',
    title: 'Namaz',
    topics: [
      { id: 'namazin-kilinisi', title: 'Namazın Kılınışı', madhabSpecific: true },
      { id: 'namazin-farzlari', title: 'Namazın Farzları', madhabSpecific: true },
      { id: 'namazi-bozanlar', title: 'Namazı Bozan Durumlar', madhabSpecific: true },
      { id: 'sehiv-secdesi', title: 'Sehiv Secdesi', madhabSpecific: true },
      // Mezhebe göre değişir: Şâfiî'de imama uyan kişi Fâtiha'yı kendisi
      // okumakla yükümlü, Hanefî'de susup imamı dinler. Pratikte en sık
      // karşılaşılan farklardan biri.
      { id: 'cemaat', title: 'Cemaatle Namaz', madhabSpecific: true },
      { id: 'cuma', title: 'Cuma Namazı', madhabSpecific: true },
      { id: 'bayram', title: 'Bayram Namazı', madhabSpecific: true },
      { id: 'cenaze', title: 'Cenaze Namazı', madhabSpecific: true },
      { id: 'seferilik', title: 'Seferîlik ve Namazın Kısaltılması', madhabSpecific: true },
      { id: 'kaza', title: 'Kaza Namazı', madhabSpecific: true },
    ],
  },
  {
    id: 'oruc',
    title: 'Oruç',
    topics: [
      // Mezhebe göre değişir: Şâfiî'de farz oruca geceden niyet etmek
      // şart, Hanefî'de kuşluk vaktine kadar niyet edilebiliyor. Sahura
      // kalkamayan biri için sonuç tamamen farklı.
      { id: 'orucun-esaslari', title: 'Orucun Esasları', madhabSpecific: true },
      { id: 'orucu-bozanlar', title: 'Orucu Bozan Durumlar', madhabSpecific: true },
      { id: 'fidye-kefaret', title: 'Fidye ve Kefaret', madhabSpecific: true },
    ],
  },
  {
    id: 'zekat',
    title: 'Zekât',
    topics: [
      // Mezhebe göre değişir: Şâfiî'de çocuğun malından da zekât gerekir
      // (velisi öder), Hanefî'de gerekmez. Ayrıca dağıtım kuralı farklı.
      { id: 'zekatin-esaslari', title: 'Zekâtın Esasları', madhabSpecific: true },
      { id: 'nisab', title: 'Nisab ve Hesaplama', madhabSpecific: true },
      { id: 'fitre', title: 'Fitre', madhabSpecific: true },
    ],
  },
] as const;
