/**
 * Kâbe'ye yön ve mesafe hesabı.
 *
 * Yön, büyük daire (great-circle) başlangıç açısıdır — düz haritada
 * çizilen doğru değil. Uzak enlemlerde ikisi belirgin biçimde ayrışır;
 * Türkiye için fark küçüktür ama Kuzey Avrupa'daki kullanıcılar için
 * onlarca derece olabilir.
 */

/** Kâbe'nin koordinatları (Mescid-i Haram) */
export const KAABA = {
  latitude: 21.4224779,
  longitude: 39.8251832,
} as const;

const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
const toDegrees = (radians: number) => (radians * 180) / Math.PI;

export type Coordinates = { latitude: number; longitude: number };

/**
 * Verilen konumdan Kâbe'ye **gerçek kuzeye göre** başlangıç açısı (0-360).
 *
 * Dikkat: bu değer gerçek kuzeye göredir. Cihaz pusulası manyetik kuzey
 * verirse aradaki sapma (declination) düzeltilmeden kullanılmamalıdır —
 * Türkiye'de bu sapma 5-7 derece civarındadır ve düzeltilmezse kıble
 * gözle görülür biçimde kayar.
 */
export function qiblaBearing(from: Coordinates): number {
  const phi1 = toRadians(from.latitude);
  const phi2 = toRadians(KAABA.latitude);
  const deltaLambda = toRadians(KAABA.longitude - from.longitude);

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  return (toDegrees(Math.atan2(y, x)) + 360) % 360;
}

/** Kâbe'ye kuş uçuşu mesafe, kilometre */
export function distanceToKaaba(from: Coordinates): number {
  const phi1 = toRadians(from.latitude);
  const phi2 = toRadians(KAABA.latitude);
  const deltaPhi = toRadians(KAABA.latitude - from.latitude);
  const deltaLambda = toRadians(KAABA.longitude - from.longitude);

  const a =
    Math.sin(deltaPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;

  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * İki açı arasındaki en kısa işaretli fark (-180, 180].
 * Pozitif değer hedefin saat yönünde olduğunu söyler.
 */
export function signedAngleDelta(from: number, to: number): number {
  return ((((to - from) % 360) + 540) % 360) - 180;
}

/**
 * Pusula açısını en yakın yön adına çevirir. Ekran okuyucu için;
 * görme engelli kullanıcı dönen bir ibreyi takip edemez, "sağa doğru
 * çeyrek tur" tarzı bir ifadeye ihtiyaç duyar.
 */
export function describeDirection(delta: number): string {
  const magnitude = Math.abs(Math.round(delta));
  if (magnitude <= QIBLA_ALIGNED_TOLERANCE) return 'Kıble yönündesiniz';
  const side = delta > 0 ? 'sağa' : 'sola';
  return `${magnitude} derece ${side} dönün`;
}

/**
 * "Hizalandı" geri bildiriminin eşiği. Bu bir fıkhî hüküm değil,
 * yalnızca arayüz geri bildirimi içindir — kıblenin geçerlilik sınırı
 * ayrı bir meseledir ve uygulama bu konuda hüküm vermez.
 */
export const QIBLA_ALIGNED_TOLERANCE = 4;
