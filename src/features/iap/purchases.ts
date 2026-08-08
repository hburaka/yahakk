import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Destek satın alması.
 *
 * Tek bir ürün var: **"Uygulamayı destekle"** — karşılığında reklamlar
 * kalkıyor. Ayrı bir "bağış" düğmesi bilinçli olarak yok: İslami bir
 * uygulamada "bağış" ve "sadaka" kelimeleri paranın ihtiyaç sahibine
 * gittiğini düşündürüyor. Para geliştiriciye gidiyorsa bu yanlış
 * beyandır. Karşılığında somut bir şey veren tek satın alma bu
 * karışıklığı tamamen ortadan kaldırıyor (bkz. plan).
 *
 * RevenueCat anahtarı yokken bütün fonksiyonlar sessizce "premium
 * değil" döndürüyor: mağaza hesapları açılmadan da uygulama çalışsın.
 */

export const PREMIUM_ENTITLEMENT = 'premium';

type Extra = { revenueCatIosKey?: string; revenueCatAndroidKey?: string };

function apiKey(): string | null {
  const extra = (Constants.expoConfig?.extra ?? {}) as Extra;
  const key =
    Platform.OS === 'ios' ? extra.revenueCatIosKey : extra.revenueCatAndroidKey;
  return key && key.length > 0 ? key : null;
}

export type PurchasesState = {
  configured: boolean;
  isPremium: boolean;
};

export const NOT_CONFIGURED: PurchasesState = {
  configured: false,
  isPremium: false,
};

async function load() {
  // Tembel yükleme: anahtar yokken native modülü hiç uyandırmıyoruz,
  // ayrıca modülün bulunmadığı bir derlemede uygulama çökmüyor.
  return import('react-native-purchases');
}

export async function configurePurchases(): Promise<PurchasesState> {
  const key = apiKey();
  if (!key) return NOT_CONFIGURED;

  try {
    const { default: Purchases } = await load();
    await Purchases.configure({ apiKey: key });
    return { configured: true, isPremium: await readPremium() };
  } catch {
    return NOT_CONFIGURED;
  }
}

export async function readPremium(): Promise<boolean> {
  if (!apiKey()) return false;
  try {
    const { default: Purchases } = await load();
    const info = await Purchases.getCustomerInfo();
    return info.entitlements.active[PREMIUM_ENTITLEMENT] !== undefined;
  } catch {
    return false;
  }
}

export type PurchaseOutcome =
  | { status: 'ok' }
  | { status: 'cancelled' }
  | { status: 'unavailable' }
  | { status: 'failed' };

export async function purchaseSupport(): Promise<PurchaseOutcome> {
  if (!apiKey()) return { status: 'unavailable' };

  try {
    const { default: Purchases } = await load();
    const offerings = await Purchases.getOfferings();
    const pkg = offerings.current?.availablePackages[0];
    if (!pkg) return { status: 'unavailable' };

    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo.entitlements.active[PREMIUM_ENTITLEMENT]
      ? { status: 'ok' }
      : { status: 'failed' };
  } catch (error) {
    // RevenueCat kullanıcı iptalini hata olarak fırlatıyor; bunu
    // başarısızlık gibi göstermek yanlış olur.
    const cancelled =
      typeof error === 'object' &&
      error !== null &&
      'userCancelled' in error &&
      (error as { userCancelled?: boolean }).userCancelled === true;
    return cancelled ? { status: 'cancelled' } : { status: 'failed' };
  }
}

/**
 * Satın alımı geri yükler. Store'lar bunu zorunlu tutuyor: kullanıcı
 * telefon değiştirdiğinde tekrar ödeme yapmak zorunda kalmamalı.
 */
export async function restorePurchases(): Promise<boolean> {
  if (!apiKey()) return false;
  try {
    const { default: Purchases } = await load();
    const info = await Purchases.restorePurchases();
    return info.entitlements.active[PREMIUM_ENTITLEMENT] !== undefined;
  } catch {
    return false;
  }
}
