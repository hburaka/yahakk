/**
 * İçerik kaynak sicili.
 *
 * Uygulamadaki her dinî metnin nereden geldiği, hangi lisansla
 * kullanıldığı ve yayına hazır olup olmadığı burada tutuluyor.
 *
 * Neden koda gömüldü: "şu metnin izni geldi mi?" sorusu insan
 * hafızasına bırakılırsa altı ay sonra kimse hatırlamıyor. Burada
 * `clearance` alanı zorunlu ve `assertReleaseReady` yayına hazır
 * olmayan bir kaynak varsa testte düşüyor. Yani izinsiz içerik
 * kazayla yayına çıkamıyor.
 */

export type Clearance =
  /** Kamu malı — telif yok (Kur'an'ın Arapça metni, hadislerin Arapçası) */
  | 'public-domain'
  /** Açık lisans; `license` alanı doldurulmalı (CC0, CC BY vb.) */
  | 'open-license'
  /** Yazılı izin alındı; `permissionRef` alanı doldurulmalı */
  | 'permitted'
  /** Kendi ürettiğimiz metin; hakları bizde */
  | 'own-work'
  /** İzin talebi gönderildi, cevap bekleniyor — YAYINA GİREMEZ */
  | 'pending'
  /** Taslak, kaynağı/izni belirsiz — YAYINA GİREMEZ */
  | 'draft';

/** Yayına çıkabilecek durumlar */
const RELEASE_READY: readonly Clearance[] = [
  'public-domain',
  'open-license',
  'permitted',
  'own-work',
];

export type ContentSource = {
  id: string;
  /** Neyi kapsıyor: "Kur'an Arapça metni", "Türkçe meal" gibi */
  scope: string;
  /** Kullanıcıya gösterilecek kaynak künyesi */
  attribution: string;
  clearance: Clearance;
  /** `open-license` ise lisans adı */
  license?: string;
  /** `permitted` ise izin belgesinin referansı */
  permissionRef?: string;
  /** Durumu açıklayan not — neden bu aşamada olduğunu anlatır */
  note?: string;
};

export const CONTENT_SOURCES: readonly ContentSource[] = [
  {
    id: 'quran-arabic',
    scope: "Kur'an-ı Kerîm Arapça metni",
    attribution: "Kur'an-ı Kerîm",
    clearance: 'public-domain',
    note: "Arapça metnin telifi yoktur. Tanzil.net gibi bir kaynaktan alınırsa metin değiştirilmeden kullanılır ve kaynak belirtilir.",
  },
  {
    id: 'hadith-arabic',
    scope: 'Hadis Arapça metinleri',
    attribution: 'Kütüb-i Sitte',
    clearance: 'public-domain',
    note: 'Klasik hadis külliyatının Arapça metinleri kamu malıdır.',
  },
  {
    id: 'hadith-tr',
    scope: 'Hadis metinlerinin Türkçe anlamları',
    attribution: 'Kendi çalışmamız',
    clearance: 'own-work',
    note: 'Telifli bir çeviriden alınmadı; sade biçimde kendimiz yazdık. Her rivayetin kaynağı metnin altında ayrıca belirtiliyor.',
  },
  {
    id: 'dua-arabic',
    scope: 'Dua metinlerinin Arapça asılları',
    attribution: 'Kur’an-ı Kerîm ve Kütüb-i Sitte',
    clearance: 'public-domain',
    note: 'Âyet ve hadis metinlerinin Arapçası kamu malıdır. Her duanın hangi kaynaktan geldiği metnin altında ayrıca yazıyor.',
  },
  {
    id: 'dua-tr',
    scope: 'Dua metinlerinin okunuşu ve Türkçe anlamı',
    attribution: 'Kendi çalışmamız',
    clearance: 'own-work',
    note: 'Türkçe anlamlar telifli bir mealden ALINMADI; sade biçimde kendimiz yazdık. Telif riski böylece tamamen ortadan kalktı ve `quran-tr-diyanet` iznini beklemeye gerek kalmadı. Dinî doğruluk ayrı bir eksen: her dua `reviewed: false` ve ekranda uyarı görünüyor.',
  },
  {
    id: 'ilmihal',
    scope: 'İlmihal metinleri (abdest, namaz, oruç, zekât)',
    attribution: 'Diyanet İşleri Başkanlığı İlmihali esas alınmıştır',
    clearance: 'own-work',
    note:
      'Telif değerlendirmesi: fıkhî hükümlerin kendisi (abdestin kaç farzı olduğu, orucu neyin bozduğu) bir olgudur ve telif konusu değildir; telif yalnızca belirli bir ifadeyi korur. Metinler Diyanet İlmihali kaynak alınarak, ifade tamamen kendimize ait olacak şekilde yazıldı ve kaynak her ekranda gösteriliyor. ' +
      'Bu bir hukuki görüş değil, kayda geçirilmiş bir değerlendirmedir; itiraz gelirse metinlerin yeniden yazılması gerekebilir.',
  },
  {
    id: 'zikir-templates',
    scope: 'Zikir şablonları ve tesbihat setleri',
    attribution: 'Buhârî, Müslim, Tirmizî',
    clearance: 'own-work',
    note: 'Arapça metinler kamu malı; Türkçe anlamlar bize ait. Nassa dayanmayan tekrar sayıları `source` alanı boş bırakılarak işaretlendi, yani kaynağı olan ile yaygın uygulamadan gelen ayırt edilebiliyor.',
  },
  {
    id: 'daily-verse-hadith',
    scope: 'Günün âyeti ve hadisi',
    attribution: 'Kaynak her metnin altında ayrıca belirtilir',
    clearance: 'own-work',
    note: 'Arapça metinler kamu malı, Türkçe anlamlar bize ait. Sınırlı bir başlangıç kümesi; zamanla genişletilecek.',
  },
] as const;

export function isReleaseReady(source: ContentSource): boolean {
  if (!RELEASE_READY.includes(source.clearance)) return false;
  if (source.clearance === 'open-license' && !source.license) return false;
  if (source.clearance === 'permitted' && !source.permissionRef) return false;
  return true;
}

/** Yayına hazır olmayan kaynaklar — sürüm öncesi kontrol listesi */
export function blockingSources(): ContentSource[] {
  return CONTENT_SOURCES.filter((source) => !isReleaseReady(source));
}
