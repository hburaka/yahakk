/**
 * AdGate — reklamın nerede gösterilemeyeceğini koda gömen kural.
 *
 * Bu bir stil tercihi değil, ürünün duruşu (bkz. PRODUCT.md ilke 5).
 * Rakiplerin tamamı ibadet ekranlarına reklam koyuyor; bizim store
 * açıklamamızda "Kıble, tesbih ve dua ekranlarında asla reklam
 * göstermiyoruz" cümlesi olacak. Bu cümlenin doğru kalması iyi niyete
 * değil, teste bağlı olmalı.
 *
 * Yaklaşım **izin listesi**: bir rota burada açıkça sayılmıyorsa reklam
 * gösterilmez. Yeni bir ekran eklendiğinde varsayılan "reklamsız"
 * oluyor; unutulan bir ekran yüzünden ibadet bölünmüyor.
 */

/** Reklam gösterilmesine izin verilen rotalar */
export const AD_ALLOWED_ROUTES = [
  /** Namaz vakitleri — alt sabit banner */
  '/(tabs)',
  '/(tabs)/index',
  /** Rehber liste ekranı — listede native reklam, detayda asla */
  '/(tabs)/rehber',
  /** Ayarlar ve alt ekranları */
  '/(tabs)/ayarlar',
  '/konum-sec',
  '/vakit-ayarlari',
  '/okuma-ayarlari',
  '/tesbih-gorunum',
] as const;

/**
 * Reklamın kesinlikle gösterilemeyeceği rotalar.
 *
 * İzin listesi zaten bunları dışarıda bırakıyor; burada ayrıca
 * sayılmalarının sebebi niyeti belgelemek ve testin bu ekranları
 * isim isim doğrulayabilmesi.
 */
export const AD_FORBIDDEN_ROUTES = [
  /** Kullanıcı yön arıyor; banner ekranı daraltıyor ve dikkat dağıtıyor */
  '/(tabs)/kible',
  /** Zikir akışı bölünmez */
  '/(tabs)/tesbih',
  '/zikir-sec',
  '/tesbih-rapor',
  /** Arapça metin ve meal okunurken reklam saygısızlık olarak algılanıyor */
  '/dua/[id]',
  '/ilmihal/[id]',
  /** İlk açılışta kullanıcıya önce uygulama tanıtılır */
  '/onboarding',
] as const;

export type AdBlockReason =
  | 'route'
  | 'premium'
  | 'prayerTime'
  | 'adhanPlaying'
  | 'consent';

export type AdContext = {
  /** expo-router pathname */
  route: string;
  /** Kullanıcı destek satın alması yaptı mı */
  isPremium: boolean;
  /** Sıradaki vakte kalan dakika; null ise bilinmiyor */
  minutesToNextPrayer: number | null;
  /** Ezan sesi o an çalıyor mu */
  isAdhanPlaying: boolean;
  /** Rıza (UMP/ATT) akışı tamamlandı mı */
  hasConsent: boolean;
};

/**
 * Vaktin bu kadar dakika öncesi ve sonrası reklamsız.
 *
 * Kullanıcı namaza hazırlanırken uygulamayı açıyor; o anda reklam
 * göstermek, günün en yanlış anında araya girmek demek.
 */
export const PRAYER_QUIET_MINUTES = 10;

export type AdDecision =
  | { allowed: true }
  | { allowed: false; reason: AdBlockReason };

/**
 * Reklam gösterilebilir mi.
 *
 * Sıra bilinçli: en güçlü yasaklar önce değerlendiriliyor ki bir
 * hata durumunda varsayılan davranış "gösterme" olsun.
 */
export function canShowAd(context: AdContext): AdDecision {
  if (isForbiddenRoute(context.route)) {
    return { allowed: false, reason: 'route' };
  }
  if (!isAllowedRoute(context.route)) {
    return { allowed: false, reason: 'route' };
  }
  if (context.isAdhanPlaying) {
    return { allowed: false, reason: 'adhanPlaying' };
  }
  if (context.isPremium) {
    return { allowed: false, reason: 'premium' };
  }
  if (!context.hasConsent) {
    return { allowed: false, reason: 'consent' };
  }
  if (
    context.minutesToNextPrayer !== null &&
    Math.abs(context.minutesToNextPrayer) <= PRAYER_QUIET_MINUTES
  ) {
    return { allowed: false, reason: 'prayerTime' };
  }
  return { allowed: true };
}

/** Rota eşleştirme; dinamik segmentler ([id]) desen olarak karşılaştırılır */
function matches(route: string, pattern: string): boolean {
  if (pattern === route) return true;
  const patternParts = pattern.split('/').filter(Boolean);
  const routeParts = route.split('/').filter(Boolean);
  if (patternParts.length !== routeParts.length) return false;
  return patternParts.every(
    (part, index) =>
      (part.startsWith('[') && part.endsWith(']')) || part === routeParts[index]
  );
}

export function isForbiddenRoute(route: string): boolean {
  return AD_FORBIDDEN_ROUTES.some((pattern) => matches(route, pattern));
}

export function isAllowedRoute(route: string): boolean {
  return AD_ALLOWED_ROUTES.some((pattern) => matches(route, pattern));
}
