/**
 * Sallayarak sayma — algılama mantığı.
 *
 * Ekrana bakmadan, nişan almadan saymanın yolu. Görme engelli kullanıcı
 * için asıl çözüm bu: dokunmak için ekranda bir yer bulmak gerekmiyor.
 *
 * ## Asıl tehlike: yanlışlıkla sayma
 *
 * Yanlış ayarlanmış bir eşik, cepte yürürken kendiliğinden sayan bir
 * tesbih demek. Kullanıcı 100 zikir çektiğini sanıp aslında çekmemiş
 * olur — ve görme engelli bir kullanıcının bunu fark etmesinin hiçbir
 * yolu yoktur. Bu yüzden mantık sensörden ayrıldı ve test edildi.
 *
 * İki savunma var:
 *
 * **1. Yön değişimi zorunlu.** Tek bir sarsıntı saymıyor. Sallamak
 * ileri-geri bir harekettir: baskın eksende ivme önce bir yöne, sonra
 * ters yöne gider. Yürüyüş sarsıntısı, telefonu masaya koymak, arabada
 * tümsek — hepsi tek yönlü darbelerdir ve bu koşulu geçemezler.
 *
 * **2. Varsayılan kapalı.** Açan kişi ne yaptığını biliyor.
 *
 * ## Dürüst sınır
 *
 * Bu yöntem kısa sayımlar için (33, 100) uygun. 1000'lik bir zikri
 * sallayarak çekmek yorucudur; orada dokunmak daha rahat. Sallama,
 * dokunmanın yerine geçen bir seçenek değil, ona ulaşamayanlar için
 * bir yol.
 */

/** Sallama sayılması için gereken en küçük sapma (g) */
export const SHAKE_THRESHOLD = 1.1;
/** Ters yöndeki hareketin sayılması için gereken en küçük sapma (g) */
export const REVERSAL_THRESHOLD = 0.7;
/** İlk hareketten sonra ters hareketin beklendiği süre (ms) */
export const REVERSAL_WINDOW_MS = 600;
/** İki sayım arasındaki en kısa süre (ms) */
export const SHAKE_COOLDOWN_MS = 350;

export type ShakeReading = { x: number; y: number; z: number };

export type ShakeState = {
  /** İlk hareketin baskın eksendeki işareti; 0 ise hareket beklenmiyor */
  pendingSign: -1 | 0 | 1;
  /** İlk hareketin zamanı (ms) */
  pendingAt: number;
  /** Son sayımın zamanı (ms) */
  lastCountAt: number;
};

export const initialShakeState: ShakeState = {
  pendingSign: 0,
  pendingAt: 0,
  /*
    Sonsuz geçmiş. `0` yazıldığında "sıfırıncı milisaniyede sayıldı"
    anlamına geliyordu ve uygulamanın ilk saniyesindeki ilk sallayış
    bekleme süresine takılıp sessizce yutuluyordu.
  */
  lastCountAt: Number.NEGATIVE_INFINITY,
};

/**
 * Yerçekimini çıkarıp en baskın eksendeki işaretli ivmeyi verir.
 *
 * Büyüklük yerine tek eksen kullanılmasının sebebi yön bilgisine
 * ihtiyaç duymamız: büyüklük her zaman pozitif olduğu için ileri ile
 * geri hareketi ayırt edemiyor.
 */
export function dominantAxis(reading: ShakeReading): {
  value: number;
  magnitude: number;
} {
  const { x, y, z } = reading;
  // Yerçekimi hangi eksende olursa olsun büyüklükten düşülüyor.
  const magnitude = Math.abs(Math.sqrt(x * x + y * y + z * z) - 1);

  const axes = [x, y, z];
  let dominant = 0;
  for (const axis of axes) {
    if (Math.abs(axis) > Math.abs(dominant)) dominant = axis;
  }

  return { value: dominant, magnitude };
}

export type ShakeResult = { state: ShakeState; counted: boolean };

/**
 * Bir ivmeölçer okumasını değerlendirir.
 *
 * Saf fonksiyon: zamanı dışarıdan alır, durumu döndürür. Böylece
 * yürüyüş ve sallama senaryoları gerçek sensöre ihtiyaç duymadan
 * testte canlandırılabiliyor.
 */
export function stepShake(
  state: ShakeState,
  reading: ShakeReading,
  now: number
): ShakeResult {
  const { value, magnitude } = dominantAxis(reading);
  const sign: -1 | 0 | 1 = value > 0 ? 1 : value < 0 ? -1 : 0;

  // Bekleyen hareketin süresi doldu: baştan başla.
  const expired =
    state.pendingSign !== 0 && now - state.pendingAt > REVERSAL_WINDOW_MS;
  const base: ShakeState = expired
    ? { ...state, pendingSign: 0, pendingAt: 0 }
    : state;

  // İkinci aşama: ters yönde hareket bekleniyor.
  if (base.pendingSign !== 0) {
    const reversed = sign !== 0 && sign !== base.pendingSign;
    if (reversed && magnitude >= REVERSAL_THRESHOLD) {
      if (now - base.lastCountAt < SHAKE_COOLDOWN_MS) {
        return {
          state: { ...base, pendingSign: 0, pendingAt: 0 },
          counted: false,
        };
      }
      return {
        state: { pendingSign: 0, pendingAt: 0, lastCountAt: now },
        counted: true,
      };
    }
    return { state: base, counted: false };
  }

  // İlk aşama: yeterince güçlü bir hareket ters yönü bekletmeye başlar.
  if (magnitude >= SHAKE_THRESHOLD && sign !== 0) {
    return {
      state: { ...base, pendingSign: sign, pendingAt: now },
      counted: false,
    };
  }

  return { state: base, counted: false };
}
