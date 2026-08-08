import {
  AdsConsent,
  MaxAdContentRating,
  MobileAds,
} from 'react-native-google-mobile-ads';

/**
 * Reklam altyapısının başlatılması.
 *
 * ⚠️ Kod tarafındaki ayar tek başına yetmez. AdMob konsolunda
 * **Blocking controls → Manage sensitive categories** altından şunlar
 * bloklanmalı: Dating, Gambling & betting, Alcohol, Sexually
 * suggestive, Religion (rakip inanç reklamı gelmesin), Politics,
 * Get-rich-quick, Cosmetic procedures.
 *
 * Bir dua ekranının yanında flört ya da kumar reklamı çıkması bu
 * kategoride tek yıldız üretir. `maxAdContentRating: G` bunların
 * çoğunu keser ama kategori blokları konsoldan ayrıca yapılmalı.
 */

export type AdsInitResult = {
  /** Rıza durumu reklam istemeye izin veriyor mu */
  canRequestAds: boolean;
  /** Kişiselleştirilmiş reklam gösterilebilir mi */
  isPersonalized: boolean;
  /** Başlatma tamamlandı mı; false ise reklam gösterilmez */
  ready: boolean;
};

const FAILED: AdsInitResult = {
  canRequestAds: false,
  isPersonalized: false,
  ready: false,
};

export async function initializeAds(): Promise<AdsInitResult> {
  try {
    // Rıza önce: GDPR/EEA bölgesinde rıza alınmadan reklam isteği
    // yapmak politika ihlali. `gatherConsent` gerekiyorsa formu
    // gösteriyor, gerekmiyorsa sessizce geçiyor.
    let canRequestAds = true;
    let isPersonalized = false;

    try {
      const info = await AdsConsent.gatherConsent();
      canRequestAds = info.canRequestAds;
      const choices = await AdsConsent.getUserChoices();
      isPersonalized = choices.selectPersonalisedAds ?? false;
    } catch {
      // Rıza akışı başarısızsa reklam gösterilir ama
      // kişiselleştirilmez — güvenli taraf bu.
      isPersonalized = false;
    }

    await MobileAds().setRequestConfiguration({
      // Genel izleyici derecesi: yetişkin içerik, kumar ve alkol
      // reklamlarının büyük kısmını baştan eler.
      maxAdContentRating: MaxAdContentRating.G,
      tagForChildDirectedTreatment: false,
      tagForUnderAgeOfConsent: false,
    });

    await MobileAds().initialize();

    return { canRequestAds, isPersonalized, ready: true };
  } catch {
    return FAILED;
  }
}

/**
 * iOS izleme izni (ATT).
 *
 * Karşılama akışında **sorulmuyor**. İlk açılışta üst üste gelen izin
 * istemleri reddedilme oranını artırıyor; kullanıcı uygulamayı birkaç
 * kez kullandıktan sonra sorulduğunda kabul oranı belirgin yükseliyor.
 *
 * Reddedilirse reklamlar yine gösteriliyor, sadece kişiselleştirilmiyor.
 */
export const ATT_PROMPT_AFTER_LAUNCHES = 3;

export async function requestTrackingIfDue(
  launchCount: number
): Promise<boolean> {
  if (launchCount < ATT_PROMPT_AFTER_LAUNCHES) return false;

  try {
    const TrackingTransparency = await import('expo-tracking-transparency');
    const { status } = await TrackingTransparency.getTrackingPermissionsAsync();
    if (status !== 'undetermined') return false;

    await TrackingTransparency.requestTrackingPermissionsAsync();
    return true;
  } catch {
    // Android'de bu modül yok; sessizce geçiliyor.
    return false;
  }
}
