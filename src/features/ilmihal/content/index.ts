import type { IlmihalTopicContent } from '../types';

import { ABDEST } from './abdest';

/**
 * İlmihal konuları.
 *
 * Hepsi Diyanet İşleri Başkanlığı İlmihali esas alınarak hazırlanıyor.
 * Kaynak seçimi bilinçli: metin zaten ehil bir kurulun onayından geçmiş.
 * Yine de aktarma ve özetleme sırasında hata olabileceği için her
 * konunun `reviewed` alanı var ve onaylanmamış içerik arayüzde uyarıyla
 * gösteriliyor.
 */
export const ILMIHAL_CONTENT: Record<string, IlmihalTopicContent> = {
  [ABDEST.id]: ABDEST,
};

export function getIlmihalTopic(id: string): IlmihalTopicContent | undefined {
  return ILMIHAL_CONTENT[id];
}

/** Henüz yazılmamış konular — Rehber listesinde soluk gösterilir */
export function hasContent(id: string): boolean {
  return id in ILMIHAL_CONTENT;
}
