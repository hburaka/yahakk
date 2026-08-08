import { usePathname } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
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
 * Reklam birimleri.
 *
 * Gerçek AdMob kimlikleri hesap açıldığında buraya girilecek. Geliştirme
 * sırasında Google'ın test kimlikleri kullanılıyor — gerçek kimlikle
 * geliştirme yapmak hesabın askıya alınmasına yol açıyor.
 */
const AD_UNITS = {
  banner: __DEV__ ? TestIds.ADAPTIVE_BANNER : TestIds.ADAPTIVE_BANNER,
} as const;

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

  if (!ads.ready || !decision.allowed || failed) return null;

  return (
    <View
      style={{
        alignItems: 'center',
        paddingVertical: spacing.xs,
        backgroundColor: colors.background,
      }}>
      <BannerAd
        unitId={AD_UNITS.banner}
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
