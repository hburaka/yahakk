/**
 * Günün ayeti ve hadisi.
 *
 * ⚠️ İÇERİK DOĞRULAMA NOTU — bu dosya yayına çıkmadan önce ehil biri
 * tarafından onaylanmalıdır. İki ayrı risk var:
 *
 * **Telif:** Türkçe mealler telif altında (Diyanet meali dahil). Arapça
 * Kur'an metni için Tanzil.net şartlarına uyulmalı: metin değiştirilmeden
 * kullanılmalı ve kaynak belirtilmeli. Buradaki meal metinleri
 * taslaktır, lisansı netleşmeden yayınlanmayacak.
 *
 * **Sıhhat:** Hadiste telif meselesinden ayrı ve daha ağır bir risk var.
 * Zayıf ya da uydurma bir rivayeti sahihmiş gibi göstermek, yanlış meal
 * göstermekten farklı bir sorumluluk. Bu yüzden `grade` alanı zorunlu
 * tutuldu ve arayüzde her zaman kaynakla birlikte gösteriliyor;
 * derecesi bilinmeyen bir rivayet uygulamaya giremez.
 */

export type VerseOfDay = {
  id: string;
  /** Arapça metin */
  arabic: string;
  /** Türkçe meal — taslak, onay bekliyor */
  meaning: string;
  /** Sûre adı */
  surah: string;
  /** Sûre ve âyet numarası, "2:286" */
  reference: string;
};

/** Hadis derecesi — kaynağıyla birlikte her zaman gösterilir */
export type HadithGrade = 'sahih' | 'hasen';

export const GRADE_LABELS: Record<HadithGrade, string> = {
  sahih: 'Sahih',
  hasen: 'Hasen',
};

export type HadithOfDay = {
  id: string;
  arabic?: string;
  /** Türkçe metin — taslak, onay bekliyor */
  text: string;
  /** Kaynak eseri ve yeri: "Buhârî, Îmân 7" */
  source: string;
  /**
   * Sıhhat derecesi. Zayıf rivayetler bilinçli olarak tip düzeyinde
   * dışarıda: uygulama zayıf hadis göstermiyor.
   */
  grade: HadithGrade;
};

/**
 * ⚠️ TASLAK İÇERİK — onay bekliyor.
 * Yalnızca arayüzün çalıştığını görmek için, sınırlı ve yaygın kabul
 * gören metinlerden seçildi. Yayın öncesi tamamı gözden geçirilecek ve
 * meal kaynağı netleşecek.
 */
export const VERSES: readonly VerseOfDay[] = [
  {
    id: 'bakara-286',
    arabic: 'لَا يُكَلِّفُ اللّٰهُ نَفْسًا إِلَّا وُسْعَهَا',
    meaning: 'Allah hiçbir kimseye gücünün yeteceğinden başkasını yüklemez.',
    surah: 'Bakara',
    reference: '2:286',
  },
  {
    id: 'insirah-6',
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    meaning: 'Şüphesiz güçlükle beraber bir kolaylık vardır.',
    surah: 'İnşirâh',
    reference: '94:6',
  },
  {
    id: 'rad-28',
    arabic: 'أَلَا بِذِكْرِ اللّٰهِ تَطْمَئِنُّ الْقُلُوبُ',
    meaning: 'Bilesiniz ki kalpler ancak Allah’ı anmakla huzur bulur.',
    surah: 'Ra’d',
    reference: '13:28',
  },
  {
    id: 'bakara-152',
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ',
    meaning: 'Öyleyse siz beni anın ki ben de sizi anayım.',
    surah: 'Bakara',
    reference: '2:152',
  },
  {
    id: 'talak-3',
    arabic: 'وَمَنْ يَتَوَكَّلْ عَلَى اللّٰهِ فَهُوَ حَسْبُهُ',
    meaning: 'Kim Allah’a tevekkül ederse O ona yeter.',
    surah: 'Talâk',
    reference: '65:3',
  },
] as const;

/** ⚠️ TASLAK İÇERİK — onay bekliyor. */
export const HADITHS: readonly HadithOfDay[] = [
  {
    id: 'niyet',
    text: 'Ameller ancak niyetlere göredir.',
    source: 'Buhârî, Bed’ü’l-vahy 1; Müslim, İmâre 155',
    grade: 'sahih',
  },
  {
    id: 'kolaylastirin',
    text: 'Kolaylaştırınız, zorlaştırmayınız; müjdeleyiniz, nefret ettirmeyiniz.',
    source: 'Buhârî, İlim 11; Müslim, Cihâd 6',
    grade: 'sahih',
  },
  {
    id: 'komsu',
    text: 'Allah’a ve âhiret gününe iman eden kimse komşusuna eziyet etmesin.',
    source: 'Buhârî, Edeb 31; Müslim, Îmân 74',
    grade: 'sahih',
  },
  {
    id: 'tebessum',
    text: 'Kardeşine tebessüm etmen sadakadır.',
    source: 'Tirmizî, Birr 36',
    grade: 'hasen',
  },
  {
    id: 'guzel-soz',
    text: 'Güzel söz sadakadır.',
    source: 'Buhârî, Cihâd 128; Müslim, Zekât 56',
    grade: 'sahih',
  },
] as const;

/**
 * Tarihten kararlı bir sıra üretir.
 *
 * Rastgele seçim kullanılmıyor: aynı gün uygulamayı açan herkes aynı
 * âyeti görmeli. "Günün âyeti" ancak paylaşılan bir şeyse anlamlı;
 * her açılışta değişen bir metin "günün" olmaz.
 */
const VERSE_SEED = 0x9e3779b1;
const HADITH_SEED = 0x85ebca6b;

/**
 * Tohumlu karıştırma.
 *
 * İlk sürümde basit `hash * 31 + karakter` polinomu kullanılıp hadis
 * için metnin başına `'h'` ekleniyordu. Bu bağımsız görünüyordu ama
 * değildi: önek eklemek polinomu sabit bir çarpanla ötelediği için
 * modül sonrası **sabit bir kaydırmaya** dönüşüyordu. Sonuç, âyet ve
 * hadisin kilitli ilerlemesi — aynı âyeti gördüğünde hep aynı hadis
 * geliyordu, 25 kombinasyon yerine 5.
 *
 * Şimdi her biri kendi tohumuyla karıştırılıyor ve sonda bir dağıtma
 * (avalanche) adımı var; ikisi gerçekten bağımsız ilerliyor.
 */
function hash(text: string, seed: number): number {
  let value = seed >>> 0;
  for (let i = 0; i < text.length; i += 1) {
    value = Math.imul(value ^ text.charCodeAt(i), 2654435761) >>> 0;
  }
  value ^= value >>> 15;
  value = Math.imul(value, 2246822507) >>> 0;
  value ^= value >>> 13;
  return value >>> 0;
}

export function verseForDay(isoDate: string): VerseOfDay {
  return VERSES[hash(isoDate, VERSE_SEED) % VERSES.length];
}

export function hadithForDay(isoDate: string): HadithOfDay {
  return HADITHS[hash(isoDate, HADITH_SEED) % HADITHS.length];
}
