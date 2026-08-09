import { DUA_CATEGORIES } from '@/features/rehber/data';

import {
  ALL_DUAS,
  duaCount,
  duasFor,
  ESMA_CATEGORY_ID,
} from './content';
import { hasArabicScript } from './types';

/**
 * Dinî metnin doğruluğunu test edemem — o ehil birinin işi. Ama şunları
 * edebilirim: Arapça alanı gerçekten Arapça olsun, hiçbir alan boş
 * kalmasın, kimlikler çakışmasın, kategori listesiyle içerik ayrışmasın.
 *
 * Bunlar sessizce geçtiğinde kullanıcı ya boş ekran görür ya da eksik
 * bir dua okur.
 */

describe('dua içerik bütünlüğü', () => {
  it('kimlikler benzersiz', () => {
    const ids = ALL_DUAS.map((dua) => dua.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('hiçbir alan boş değil', () => {
    for (const dua of ALL_DUAS) {
      expect(dua.title.trim().length).toBeGreaterThan(0);
      expect(dua.arabic.trim().length).toBeGreaterThan(0);
      expect(dua.transliteration.trim().length).toBeGreaterThan(0);
      expect(dua.meaning.trim().length).toBeGreaterThan(0);
    }
  });

  /**
   * Kopyala-yapıştır sırasında Arapça alanın latin metinle dolması
   * gözle fark edilmiyor: ekranda okunuş iki kez görünüyor ve kimse
   * eksik olanı aramıyor.
   */
  it('Arapça alanı gerçekten Arapça harf içeriyor', () => {
    for (const dua of ALL_DUAS) {
      expect(hasArabicScript(dua.arabic)).toBe(true);
    }
  });

  it('okunuş ve anlam Arapça harf içermiyor', () => {
    // Ters yönde kayma: Arapça metnin okunuş alanına düşmesi.
    for (const dua of ALL_DUAS) {
      expect(hasArabicScript(dua.transliteration)).toBe(false);
      expect(hasArabicScript(dua.meaning)).toBe(false);
    }
  });

  it('okunuş ve anlam birbirinden farklı', () => {
    for (const dua of ALL_DUAS) {
      expect(dua.transliteration).not.toBe(dua.meaning);
    }
  });

  it('her duanın kaynağı var', () => {
    // Kaynaksız dinî metin yayınlanamaz; okuyucu nereye başvuracağını
    // bilmeli.
    for (const dua of ALL_DUAS) {
      expect(dua.reference?.trim().length ?? 0).toBeGreaterThan(0);
    }
  });
});

describe('kategori listesiyle uyum', () => {
  const categoryIds = DUA_CATEGORIES.map((category) => category.id);

  it('her dua var olan bir kategoriye bağlı', () => {
    // Olmayan kategoriye bağlı dua hiçbir ekranda görünmez.
    for (const dua of ALL_DUAS) {
      expect(categoryIds).toContain(dua.categoryId);
    }
  });

  it('sayı gerçek içerikten geliyor', () => {
    for (const id of categoryIds) {
      // Esmâü'l-Hüsnâ ayrı bir yapıda tutuluyor (bkz. `esma.ts`), o
      // yüzden `duasFor` boş döner ama sayısı 99'dur. Kendi testi var.
      if (id === ESMA_CATEGORY_ID) continue;
      expect(duaCount(id)).toBe(duasFor(id).length);
    }
  });

  it('içeriği olmayan kategori sıfır döndürüyor, patlamıyor', () => {
    expect(duaCount('boyle-bir-kategori-yok')).toBe(0);
    expect(duasFor('boyle-bir-kategori-yok')).toEqual([]);
  });
});
