import {
  distanceToKaaba,
  qiblaBearing,
  signedAngleDelta,
  KAABA,
} from './bearing';

/**
 * Referans değerler yayınlanmış kıble açılarıyla karşılaştırıldı.
 * New York özellikle önemli: oradan kıble sezgiye aykırı biçimde
 * KUZEYDOĞUYU gösterir (büyük daire rotası kutba yakın geçer) ve düz
 * harita mantığıyla yazılmış kodlar tam burada patlar.
 */
describe('kıble açısı', () => {
  const cases: [string, number, number, number][] = [
    ['İstanbul', 41.0082, 28.9784, 152],
    ['Londra', 51.5074, -0.1278, 119],
    ['New York', 40.7128, -74.006, 58],
  ];

  it.each(cases)('%s için yayınlanan açıyla tutuyor', (_, lat, lng, expected) => {
    const bearing = qiblaBearing({ latitude: lat, longitude: lng });
    expect(Math.abs(bearing - expected)).toBeLessThanOrEqual(1.5);
  });

  it('Diyarbakır neredeyse tam güneyi gösterir', () => {
    // Mekke'nin boylamı 39.83, Diyarbakır'ınki 40.23 — yani Kâbe
    // neredeyse tam güneyde, çok hafif batıda.
    const bearing = qiblaBearing({ latitude: 37.9144, longitude: 40.2306 });
    expect(bearing).toBeGreaterThan(178);
    expect(bearing).toBeLessThan(184);
  });

  it('her zaman 0-360 aralığında kalır', () => {
    for (let lat = -80; lat <= 80; lat += 20) {
      for (let lng = -180; lng <= 180; lng += 30) {
        const bearing = qiblaBearing({ latitude: lat, longitude: lng });
        expect(bearing).toBeGreaterThanOrEqual(0);
        expect(bearing).toBeLessThan(360);
        expect(Number.isFinite(bearing)).toBe(true);
      }
    }
  });
});

describe('Kâbe mesafesi', () => {
  it('Kâbe üzerinde sıfırdır', () => {
    expect(distanceToKaaba(KAABA)).toBeCloseTo(0, 3);
  });

  it('İstanbul için yaklaşık 2400 km', () => {
    const km = distanceToKaaba({ latitude: 41.0082, longitude: 28.9784 });
    expect(km).toBeGreaterThan(2300);
    expect(km).toBeLessThan(2500);
  });
});

describe('açı farkı', () => {
  it('en kısa yolu işaretli olarak verir', () => {
    expect(signedAngleDelta(10, 20)).toBeCloseTo(10);
    expect(signedAngleDelta(20, 10)).toBeCloseTo(-10);
  });

  it('359 ile 1 arasında uzun yoldan dönmez', () => {
    // Filtresiz bir hesapta bu 358 derece çıkar ve pusula ters yöne
    // tam tur atar.
    expect(signedAngleDelta(359, 1)).toBeCloseTo(2);
    expect(signedAngleDelta(1, 359)).toBeCloseTo(-2);
  });

  it('sonuç daima (-180, 180] aralığındadır', () => {
    for (let from = 0; from < 360; from += 17) {
      for (let to = 0; to < 360; to += 23) {
        const delta = signedAngleDelta(from, to);
        expect(delta).toBeGreaterThan(-181);
        expect(delta).toBeLessThanOrEqual(180);
      }
    }
  });
});
