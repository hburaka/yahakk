import type { Madhab } from '@/features/rehber/data';

/**
 * İlmihal içeriğinin yapısı.
 *
 * ⚠️ Bu içerik **dinî doğruluk** riski taşır — telif meselesinden ayrı
 * ve daha ağırdır. Yanlış tarif edilmiş bir abdest doğrudan kullanıcının
 * ibadetini etkiler. Bu yüzden:
 *
 *  - Her konu bir `source` taşımak zorunda (nereden alındığı belli olsun)
 *  - Mezhebe göre değişen her metin `madhab` ile işaretli
 *  - `reviewed` alanı false olduğu sürece arayüzde uyarı gösterilir
 *
 * Kaynak olarak Diyanet İşleri Başkanlığı İlmihali esas alınıyor: zaten
 * ehil bir kurulun onayından geçmiş metin, bizim yazıp sonradan
 * onaylatmamızdan güvenli.
 */

export type IlmihalStep = {
  /** Adım başlığı — "Elleri yıkamak" */
  title: string;
  /** Adımın anlatımı */
  body: string;
  /** Bu adım farz mı, sünnet mi, âdâb mı */
  ruling?: 'farz' | 'vacip' | 'sunnet' | 'adab';
};

export type IlmihalSectionContent = {
  heading: string;
  /** Düz paragraf metni */
  paragraphs?: string[];
  /** Sıralı adımlar — abdest, namaz gibi uygulamalı konularda */
  steps?: IlmihalStep[];
  /** Maddeler — farzların, bozan durumların listesi */
  items?: string[];
};

export type IlmihalTopicContent = {
  id: string;
  title: string;
  /**
   * Mezhebe göre değişiyorsa her mezhep için ayrı içerik.
   * Değişmiyorsa `shared` doldurulur ve mezhep etiketi gösterilmez.
   */
  byMadhab?: Record<Madhab, IlmihalSectionContent[]>;
  shared?: IlmihalSectionContent[];
  /** Kaynak künyesi — arayüzde her zaman gösterilir */
  source: string;
  /**
   * Ehil biri tarafından gözden geçirildi mi.
   * False olduğu sürece arayüzde uyarı görünür ve yayına çıkamaz.
   */
  reviewed: boolean;
};

export function contentFor(
  topic: IlmihalTopicContent,
  madhab: Madhab
): IlmihalSectionContent[] {
  return topic.shared ?? topic.byMadhab?.[madhab] ?? [];
}

/** Konu mezhebe göre değişiyor mu — arayüzde etiket bunun için */
export function isMadhabSpecific(topic: IlmihalTopicContent): boolean {
  return topic.byMadhab !== undefined;
}
