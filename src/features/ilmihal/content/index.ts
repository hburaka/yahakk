import type { IlmihalTopicContent } from '../types';

import { ABDEST } from './abdest';
import { BAYRAM, CEMAAT, CENAZE, CUMA } from './cemaat';
import {
  NAMAZI_BOZANLAR,
  NAMAZIN_FARZLARI,
  NAMAZIN_KILINISI,
} from './namaz';
import { KAZA, SEFERILIK, SEHIV_SECDESI } from './namaz-durumlar';
import { ABDEST_BOZAN, GUSUL, TEYEMMUM } from './temizlik';

/**
 * İlmihal konuları.
 *
 * Hepsi Diyanet İşleri Başkanlığı İlmihali esas alınarak hazırlanıyor.
 * Kaynak seçimi bilinçli: metin zaten ehil bir kurulun onayından geçmiş.
 * Yine de aktarma ve özetleme sırasında hata olabileceği için her
 * konunun `reviewed` alanı var ve onaylanmamış içerik arayüzde uyarıyla
 * gösteriliyor.
 */
const TOPICS: readonly IlmihalTopicContent[] = [
  ABDEST,
  ABDEST_BOZAN,
  GUSUL,
  TEYEMMUM,
  NAMAZIN_FARZLARI,
  NAMAZIN_KILINISI,
  NAMAZI_BOZANLAR,
  SEHIV_SECDESI,
  CEMAAT,
  CUMA,
  BAYRAM,
  CENAZE,
  SEFERILIK,
  KAZA,
];

export const ILMIHAL_CONTENT: Record<string, IlmihalTopicContent> =
  Object.fromEntries(TOPICS.map((topic) => [topic.id, topic]));

export function getIlmihalTopic(id: string): IlmihalTopicContent | undefined {
  return ILMIHAL_CONTENT[id];
}

/** Henüz yazılmamış konular — Rehber listesinde soluk gösterilir */
export function hasContent(id: string): boolean {
  return id in ILMIHAL_CONTENT;
}
