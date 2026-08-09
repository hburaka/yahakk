import { duaCount } from './content';
import { ESMA_COUNT, ESMAUL_HUSNA } from './esma';
import { hasArabicScript } from './types';

/**
 * 99 kayıtlık bir liste elle yazıldığında hata gözle bulunmaz: bir sıra
 * numarası atlanır, bir isim iki kez yazılır, bir Arapça alan boş kalır
 * ve kimse fark etmez. Testin işi bu.
 *
 * İsimlerin dinî doğruluğunu test edemem — o ehil birinin işi.
 */
describe('Esmâü’l-Hüsnâ', () => {
  it('tam doksan dokuz isim', () => {
    expect(ESMAUL_HUSNA).toHaveLength(99);
    expect(ESMA_COUNT).toBe(99);
  });

  it('sıra numaraları 1’den 99’a kesintisiz', () => {
    // Atlanan veya tekrarlanan bir numara listeyi sessizce bozar.
    const orders = ESMAUL_HUSNA.map((name) => name.order);
    expect(orders).toEqual(Array.from({ length: 99 }, (_, i) => i + 1));
  });

  it('hiçbir isim tekrarlamıyor', () => {
    const names = ESMAUL_HUSNA.map((name) => name.transliteration);
    expect(new Set(names).size).toBe(99);

    const arabic = ESMAUL_HUSNA.map((name) => name.arabic);
    expect(new Set(arabic).size).toBe(99);
  });

  it('hiçbir alan boş değil', () => {
    for (const name of ESMAUL_HUSNA) {
      expect(name.arabic.trim().length).toBeGreaterThan(0);
      expect(name.transliteration.trim().length).toBeGreaterThan(0);
      expect(name.meaning.trim().length).toBeGreaterThan(0);
    }
  });

  it('Arapça alanı gerçekten Arapça, okunuş ve anlam değil', () => {
    for (const name of ESMAUL_HUSNA) {
      expect(hasArabicScript(name.arabic)).toBe(true);
      expect(hasArabicScript(name.transliteration)).toBe(false);
      expect(hasArabicScript(name.meaning)).toBe(false);
    }
  });

  it('Rehber listesinde doğru sayıyla görünüyor', () => {
    // Ayrı bir yapıda tutulduğu için `duasFor` boş döner; sayı yine de
    // doğru olmalı, yoksa satır "hazırlanıyor" diye soluk kalır.
    expect(duaCount('esma')).toBe(99);
  });
});
