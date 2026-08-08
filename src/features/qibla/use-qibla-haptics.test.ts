import { intervalForDelta } from './use-qibla-haptics';

/**
 * Titreşim aralığı, görme engelli kullanıcının kıbleyi bulmasının tek
 * yolu. "Yaklaşınca sıklaşır" sözü doğru olmazsa kullanıcı yanlış yöne
 * yönelir — bu, uygulamanın verebileceği en ağır zararlardan biri.
 *
 * Eğrinin kendisi hissedilerek ayarlanır; test yalnızca sözün her zaman
 * tutulduğunu garantiliyor.
 */
describe('kıble titreşim aralığı', () => {
  it('yaklaştıkça kısalır — istisnasız', () => {
    let previous = Infinity;
    for (let angle = 180; angle >= 0; angle -= 1) {
      const current = intervalForDelta(angle);
      expect(current).toBeLessThanOrEqual(previous);
      previous = current;
    }
  });

  it('hizada en sık, uzakta en seyrek', () => {
    expect(intervalForDelta(0)).toBeLessThan(intervalForDelta(45));
    expect(intervalForDelta(45)).toBeLessThan(intervalForDelta(90));
  });

  it('titreşimler üst üste binmeyecek kadar seyrek kalır', () => {
    // Dokunsal motorun toparlanması için alt sınır. Daha sık aralık
    // sürekli titreşime dönüşüyor ve yön bilgisi kayboluyor.
    for (let angle = 0; angle <= 180; angle += 1) {
      expect(intervalForDelta(angle)).toBeGreaterThanOrEqual(120);
    }
  });

  it('en seyrek hâlde bile kullanıcıyı beklemede bırakmaz', () => {
    // Üst sınır: bir buçuk saniyeden uzun sessizlik, kör kullanıcıya
    // "bozuldu" hissi veriyor.
    expect(intervalForDelta(180)).toBeLessThanOrEqual(1500);
  });

  it('90 derecenin ötesi aynı kabul edilir', () => {
    // Tam ters yöne bakmakla 100 derece sapmış olmak arasında pratik
    // fark yok; ikisinde de "çok uzaksın" bilgisi yeterli.
    expect(intervalForDelta(90)).toBe(intervalForDelta(180));
  });

  it('geçersiz açıya karşı dayanıklı', () => {
    expect(Number.isFinite(intervalForDelta(-30))).toBe(true);
    expect(intervalForDelta(-30)).toBe(intervalForDelta(0));
  });
});
