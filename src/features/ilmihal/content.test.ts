import { ILMIHAL_SECTIONS } from '@/features/rehber/data';

import { getIlmihalTopic, hasContent, ILMIHAL_CONTENT } from './content';
import { contentFor, isMadhabSpecific } from './types';

/**
 * Bu testler dinî içeriğin **yapısal** doğruluğunu koruyor.
 *
 * Metnin dinî doğruluğunu test edemem — o ehil birinin işi. Ama şunları
 * edebilirim: bir mezhebin içeriği eksik kalmasın, bölüm boş
 * gösterilmesin, kaynağı olmayan konu eklenmesin. Bunlar sessizce
 * geçtiğinde kullanıcı ya boş ekran görür ya da kendi mezhebine ait
 * olmayan bilgiyi okur — ikincisi çok daha tehlikeli.
 */

const topics = Object.values(ILMIHAL_CONTENT);

describe('ilmihal içerik bütünlüğü', () => {
  it('her konunun kaynağı var', () => {
    for (const topic of topics) {
      expect(topic.source.length).toBeGreaterThan(0);
    }
  });

  it('her konunun içeriği dolu', () => {
    for (const topic of topics) {
      const hasShared = (topic.shared?.length ?? 0) > 0;
      const hasByMadhab = topic.byMadhab !== undefined;
      expect(hasShared || hasByMadhab).toBe(true);
    }
  });

  /**
   * En kritik test. Mezhebe göre değişen bir konuda tek mezhebin
   * içeriği yazılıp diğeri unutulursa, o mezhebi seçmiş kullanıcı boş
   * ekran görür — ya da daha kötüsü, ileride bir hata sonucu diğer
   * mezhebin metnini okur.
   */
  it('mezhebe göre değişen her konuda iki mezhep de dolu', () => {
    for (const topic of topics) {
      if (!isMadhabSpecific(topic)) continue;

      const hanefi = contentFor(topic, 'hanefi');
      const safii = contentFor(topic, 'safii');

      expect(hanefi.length).toBeGreaterThan(0);
      expect(safii.length).toBeGreaterThan(0);
    }
  });

  it('mezhebe göre değişen konularda iki metin gerçekten farklı', () => {
    // Kopyala-yapıştır sonucu iki mezhebe aynı metnin konması, mezhep
    // etiketini yalancı hâle getirir.
    for (const topic of topics) {
      if (!isMadhabSpecific(topic)) continue;
      const hanefi = JSON.stringify(contentFor(topic, 'hanefi'));
      const safii = JSON.stringify(contentFor(topic, 'safii'));
      expect(hanefi).not.toBe(safii);
    }
  });

  it('hiçbir bölüm boş değil', () => {
    for (const topic of topics) {
      const sections = [
        ...(topic.shared ?? []),
        ...(topic.byMadhab?.hanefi ?? []),
        ...(topic.byMadhab?.safii ?? []),
      ];

      for (const section of sections) {
        expect(section.heading.length).toBeGreaterThan(0);
        const filled =
          (section.paragraphs?.length ?? 0) +
          (section.items?.length ?? 0) +
          (section.steps?.length ?? 0);
        expect(filled).toBeGreaterThan(0);
      }
    }
  });

  it('her adımın başlığı ve anlatımı var', () => {
    for (const topic of topics) {
      const sections = [
        ...(topic.shared ?? []),
        ...(topic.byMadhab?.hanefi ?? []),
        ...(topic.byMadhab?.safii ?? []),
      ];
      for (const section of sections) {
        for (const step of section.steps ?? []) {
          expect(step.title.length).toBeGreaterThan(0);
          expect(step.body.length).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe('Rehber listesiyle uyum', () => {
  const listedIds = ILMIHAL_SECTIONS.flatMap((section) =>
    section.topics.map((topic) => topic.id)
  );

  it('yazılan her içerik Rehber listesinde karşılık buluyor', () => {
    // İçeriği olup listede olmayan konuya kullanıcı hiç ulaşamaz.
    for (const id of Object.keys(ILMIHAL_CONTENT)) {
      expect(listedIds).toContain(id);
    }
  });

  it('hasContent listedeki kimliklerle tutarlı', () => {
    for (const id of listedIds) {
      expect(hasContent(id)).toBe(getIlmihalTopic(id) !== undefined);
    }
  });

  it('mezhep etiketi liste ile içerik arasında tutarlı', () => {
    // Listede "mezhebe göre değişir" denip içerikte tek metin varsa
    // (veya tersi) kullanıcıya yanlış bir güven veriliyor.
    for (const section of ILMIHAL_SECTIONS) {
      for (const listed of section.topics) {
        const topic = getIlmihalTopic(listed.id);
        if (!topic) continue;
        expect(isMadhabSpecific(topic)).toBe(listed.madhabSpecific);
      }
    }
  });
});
