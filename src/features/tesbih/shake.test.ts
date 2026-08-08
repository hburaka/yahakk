import {
  initialShakeState,
  stepShake,
  type ShakeReading,
  type ShakeState,
} from './shake';

/**
 * Bu testlerin asıl işi sallamanın çalıştığını değil, **yanlışlıkla
 * saymadığını** göstermek.
 *
 * Yanlış sayım sessiz bir hata: kullanıcı 100 zikir çektiğini sanır,
 * çekmemiştir ve bunu anlamasının bir yolu yoktur. Görme engelli bir
 * kullanıcı için hiç yoktur. O yüzden gerçek hayattaki hareketler
 * burada canlandırılıyor.
 */

/** Bir dizi okumayı sırayla işleyip toplam sayımı döndürür */
function run(
  readings: { reading: ShakeReading; at: number }[],
  state: ShakeState = initialShakeState
): { counted: number; state: ShakeState } {
  let current = state;
  let counted = 0;
  for (const { reading, at } of readings) {
    const result = stepShake(current, reading, at);
    current = result.state;
    if (result.counted) counted += 1;
  }
  return { counted, state: current };
}

/** Durgun telefon: yalnızca yerçekimi */
const REST: ShakeReading = { x: 0, y: 0, z: -1 };

describe('sallayarak sayma', () => {
  it('durgun telefon saymaz', () => {
    const readings = Array.from({ length: 200 }, (_, i) => ({
      reading: REST,
      at: i * 50,
    }));
    expect(run(readings).counted).toBe(0);
  });

  it('ileri-geri sallayış bir kez sayar', () => {
    const { counted } = run([
      { reading: REST, at: 0 },
      { reading: { x: 2.4, y: 0, z: -1 }, at: 100 },
      { reading: { x: -2.1, y: 0, z: -1 }, at: 260 },
    ]);
    expect(counted).toBe(1);
  });

  /**
   * En kritik test. Yürüyüş, baskın eksende tek yönlü ve tekrarlayan
   * darbeler üretir; ters yön koşulunu geçmemeli.
   */
  it('yürürken saymaz', () => {
    const readings: { reading: ShakeReading; at: number }[] = [];
    // 40 adım, adım başına ~500 ms: dikey eksende tek yönlü darbe
    for (let step = 0; step < 40; step += 1) {
      const base = step * 500;
      readings.push({ reading: REST, at: base });
      readings.push({ reading: { x: 0, y: 0, z: -2.3 }, at: base + 120 });
      readings.push({ reading: { x: 0, y: 0, z: -1.4 }, at: base + 200 });
      readings.push({ reading: REST, at: base + 320 });
    }
    expect(run(readings).counted).toBe(0);
  });

  it('telefonu masaya koymak saymaz', () => {
    const { counted } = run([
      { reading: REST, at: 0 },
      // Tek ve sert bir darbe, ardından durgunluk
      { reading: { x: 0, y: 0, z: -3.8 }, at: 400 },
      { reading: { x: 0, y: 0, z: -1.6 }, at: 480 },
      { reading: REST, at: 600 },
      { reading: REST, at: 1400 },
    ]);
    expect(counted).toBe(0);
  });

  it('ters hareket çok geç gelirse saymaz', () => {
    const { counted } = run([
      { reading: { x: 2.4, y: 0, z: -1 }, at: 0 },
      // Pencere 600 ms; bu okuma geç kaldı
      { reading: { x: -2.4, y: 0, z: -1 }, at: 1200 },
    ]);
    expect(counted).toBe(0);
  });

  it('tek uzun sallayış onlarca sayım üretmez', () => {
    // Eşik üstünde takılı kalan, yön değiştirmeyen bir hareket
    const readings = Array.from({ length: 60 }, (_, i) => ({
      reading: { x: 2.6, y: 0, z: -1 },
      at: i * 30,
    }));
    expect(run(readings).counted).toBe(0);
  });

  it('art arda sallayışlar sırayla sayılır', () => {
    const readings: { reading: ShakeReading; at: number }[] = [];
    for (let shake = 0; shake < 10; shake += 1) {
      const base = shake * 800;
      readings.push({ reading: REST, at: base });
      readings.push({ reading: { x: 2.5, y: 0, z: -1 }, at: base + 100 });
      readings.push({ reading: { x: -2.2, y: 0, z: -1 }, at: base + 280 });
    }
    expect(run(readings).counted).toBe(10);
  });

  it('bekleme süresi dolmadan ikinci sayım olmaz', () => {
    const { counted } = run([
      { reading: { x: 2.5, y: 0, z: -1 }, at: 0 },
      { reading: { x: -2.5, y: 0, z: -1 }, at: 120 },
      // Hemen ardından ikinci bir ileri-geri: bekleme süresi dolmadı
      { reading: { x: 2.5, y: 0, z: -1 }, at: 200 },
      { reading: { x: -2.5, y: 0, z: -1 }, at: 300 },
    ]);
    expect(counted).toBe(1);
  });

  it('hafif titreşim ve el sallaması saymaz', () => {
    const readings = Array.from({ length: 100 }, (_, i) => ({
      reading: {
        x: Math.sin(i / 3) * 0.5,
        y: 0,
        z: -1 + Math.cos(i / 3) * 0.3,
      },
      at: i * 40,
    }));
    expect(run(readings).counted).toBe(0);
  });
});
