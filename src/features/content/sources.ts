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
    id: 'quran-tr-diyanet',
    scope: 'Türkçe meal',
    attribution: 'Diyanet İşleri Başkanlığı Meali',
    clearance: 'pending',
    note: 'Diyanet Hukuk Müşavirliği’ne izin talebi gönderilecek. İzin gelene kadar mealler uygulamaya girmez; yalnızca Arapça metin gösterilir. Kaynak göstermek izin yerine geçmez.',
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
    scope: 'Hadis Türkçe çevirileri',
    attribution: 'Çeviri kaynağı belirlenecek',
    clearance: 'pending',
    note: 'Türkçe hadis çevirileri telif altında. Ayrıca her rivayetin sıhhat derecesi ehil biri tarafından doğrulanmalı — bu telif meselesinden ayrı ve daha ağır bir sorumluluk.',
  },
  {
    id: 'ilmihal',
    scope: 'İlmihal metinleri (abdest, namaz, oruç, zekât)',
    attribution: 'Kaynak belirlenecek',
    clearance: 'pending',
    note: 'Diyanet İlmihali telif altında. Ayrıca dinî doğruluk riski taşır: yanlış tarif edilmiş bir abdest doğrudan kullanıcının ibadetini etkiler. Hanefî ve Şâfiî için ayrı ayrı onaylanmalı.',
  },
  {
    id: 'zikir-templates',
    scope: 'Zikir şablonları ve tesbihat setleri',
    attribution: 'Buhârî, Müslim, Tirmizî',
    clearance: 'draft',
    note: 'Arapça metinler ve sayılar yaygın kabul gören kaynaklardan; yine de yayın öncesi gözden geçirilecek. Nassa dayanmayan sayılar `source` alanı boş bırakılarak işaretlendi.',
  },
  {
    id: 'daily-verse-hadith',
    scope: 'Günün âyeti ve hadisi',
    attribution: 'Kaynak metinlerde ayrı ayrı belirtilir',
    clearance: 'draft',
    note: 'Arayüzün çalıştığını görmek için sınırlı taslak içerik. Meal izni ve hadis sıhhati onaylanınca genişletilecek.',
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
