import {
  HADITHS,
  VERSES,
  hadithForDay,
  verseForDay,
  type HadithGrade,
} from './data';

/**
 * "Günün âyeti" ancak paylaşılan bir şeyse anlamlı: aynı gün uygulamayı
 * açan herkes aynı metni görmeli, her açılışta değişmemeli.
 */
describe('günlük seçim kararlı', () => {
  it('aynı tarih her zaman aynı âyeti verir', () => {
    for (const iso of ['2026-08-08', '2026-01-01', '2026-12-31']) {
      const first = verseForDay(iso);
      for (let i = 0; i < 20; i += 1) {
        expect(verseForDay(iso).id).toBe(first.id);
      }
    }
  });

  it('aynı tarih her zaman aynı hadisi verir', () => {
    const first = hadithForDay('2026-08-08');
    for (let i = 0; i < 20; i += 1) {
      expect(hadithForDay('2026-08-08').id).toBe(first.id);
    }
  });

  it('gün değişince metin de değişebiliyor', () => {
    const ids = new Set<string>();
    for (let day = 1; day <= 28; day += 1) {
      const iso = `2026-03-${String(day).padStart(2, '0')}`;
      ids.add(verseForDay(iso).id);
    }
    // Bir aylık pencerede havuzun tamamı dolaşılmalı; tek metne
    // takılırsa "günün âyeti" anlamını kaybeder.
    expect(ids.size).toBe(VERSES.length);
  });

  it('âyet ve hadis aynı ritimde tekrarlanmıyor', () => {
    // İkisi aynı kaydırmayı kullansaydı her zaman aynı çiftler gelirdi.
    const pairs = new Set<string>();
    for (let day = 1; day <= 28; day += 1) {
      const iso = `2026-03-${String(day).padStart(2, '0')}`;
      pairs.add(`${verseForDay(iso).id}|${hadithForDay(iso).id}`);
    }
    expect(pairs.size).toBeGreaterThan(VERSES.length);
  });
});

describe('içerik bütünlüğü', () => {
  it('her âyette Arapça metin, meal ve kaynak var', () => {
    for (const verse of VERSES) {
      expect(verse.arabic.length).toBeGreaterThan(0);
      expect(verse.meaning.length).toBeGreaterThan(0);
      expect(verse.surah.length).toBeGreaterThan(0);
      expect(verse.reference).toMatch(/^\d+:\d+$/);
    }
  });

  /**
   * Sıhhat derecesi ve kaynak zorunlu. Kaynağı belirsiz bir rivayeti
   * sahihmiş gibi göstermek, bu alandaki en ağır hatalardan biri —
   * yanlış mealden farklı bir sorumluluk doğuruyor.
   */
  it('her hadiste kaynak ve sıhhat derecesi var', () => {
    const allowed: HadithGrade[] = ['sahih', 'hasen'];
    for (const hadith of HADITHS) {
      expect(hadith.text.length).toBeGreaterThan(0);
      expect(hadith.source.length).toBeGreaterThan(0);
      expect(allowed).toContain(hadith.grade);
    }
  });

  it('kimlikler tekil', () => {
    expect(new Set(VERSES.map((v) => v.id)).size).toBe(VERSES.length);
    expect(new Set(HADITHS.map((h) => h.id)).size).toBe(HADITHS.length);
  });
});
