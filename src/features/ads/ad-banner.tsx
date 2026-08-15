import Constants from 'expo-constants';
import { usePathname } from 'expo-router';
import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';

import { useTheme } from '@/core/ui/theme-context';
import { useDaySchedule } from '@/features/prayer-times/use-day-schedule';

import { canShowAd } from './ad-gate';
import { useAds } from './ads-context';

/**
 * Banner reklam birimi.
 *
 * İki kural var ve ikisi de hesabın askıya alınmasını önlüyor:
 *
 * 1. **Geliştirmede her zaman test kimliği.** Gerçek kimlikle
 *    geliştirme yapmak, kendi reklamına tıklamak sayılıyor ve AdMob
 *    bunu geçersiz trafik olarak işaretliyor.
 * 2. **Yayında test kimliği YOK.** Gerçek kimlik girilmemişse banner
 *    hiç gösterilmiyor. Test reklamı göstermek gelir üretmediği gibi
 *    kullanıcıya "AdMob Adaptive Banner" yazan bir kutu göstermek
 *    demek — reklamsız olmak ondan iyidir.
 *
 * Kimlik `app.json` içindeki `extra` alanından okunuyor; kod
 * değiştirmeden girilebilsin diye.
 */
type AdExtra = {
  admobBannerAndroid?: string;
  admobBannerIos?: string;
};

function resolveBannerUnitId(): string | null {
  if (__DEV__) return TestIds.ADAPTIVE_BANNER;

  const extra = (Constants.expoConfig?.extra ?? {}) as AdExtra;
  const id =
    Platform.OS === 'ios' ? extra.admobBannerIos : extra.admobBannerAndroid;

  return id && id.length > 0 ? id : null;
}

/**
 * Ekranın altına yerleşen banner.
 *
 * Kendi başına karar vermiyor: gösterilip gösterilmeyeceğini AdGate
 * belirliyor ve AdGate izin listesiyle çalışıyor. Bu bileşeni yanlış
 * bir ekrana koymak reklamı oraya getirmez — kural bileşende değil,
 * kapıda.
 */
export function AdBanner() {
  const { colors, spacing } = useTheme();
  const pathname = usePathname();
  const ads = useAds();
  const schedule = useDaySchedule();
  // Hangi rotada yüklenemediği saklanıyor; bayrağı efektle sıfırlamak
  // yerine türetmek zincirleme render yaratmıyor.
  const [failedRoute, setFailedRoute] = useState<string | null>(null);
  const failed = failedRoute === pathname;

  const minutesToNextPrayer =
    schedule.status === 'ready'
      ? Math.round(schedule.remainingSeconds / 60)
      : null;

  const decision = canShowAd({
    route: pathname,
    isPremium: ads.isPremium,
    minutesToNextPrayer,
    isAdhanPlaying: ads.isAdhanPlaying,
    hasConsent: ads.canRequestAds,
  });

  // Yayında gerçek kimlik yoksa banner hiç gösterilmiyor; test reklamı
  // kullanıcıya "AdMob Adaptive Banner" yazan bir kutu göstermek demek.
  const unitId = resolveBannerUnitId();

  if (!ads.ready || !decision.allowed || failed || !unitId) return null;

  return (
    <View
      style={{
        alignItems: 'center',
        paddingVertical: spacing.xs,
        backgroundColor: colors.background,
        // İçerikten ince bir çizgiyle ayrılıyor: reklamın nerede başladığı
        // belirsiz kalırsa kullanıcı onu uygulamanın parçası sanıyor.
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.border,
      }}>
      <BannerAd
        unitId={unitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          // Rıza yoksa veya ATT reddedildiyse kişiselleştirme kapalı.
          requestNonPersonalizedAdsOnly: !ads.isPersonalized,
        }}
        // Reklam yüklenemezse boş bir şerit bırakmak yerine hiç
        // göstermiyoruz; boşluk düzeni bozuyor.
        onAdFailedToLoad={() => setFailedRoute(pathname)}
      />
    </View>
  );
}
