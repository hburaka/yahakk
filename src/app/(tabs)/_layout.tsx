import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
// expo-router bottom-tabs'ı kendi içine gömüyor; ayrı bir paket olarak
// kurulu değil. Bu yol SDK yükseltmesinde değişirse derleme hatası verir
// (sessizce bozulmaz) — o zaman node_modules/expo-router/build içinde
// BottomTabBar'ın yeni yeri aranmalı.
import { BottomTabBar } from 'expo-router/build/react-navigation/bottom-tabs';
import { View } from 'react-native';

import { AdBanner } from '@/features/ads/ad-banner';
import { usePeriodPalette } from '@/features/prayer-times/use-period-palette';
import { useTheme } from '@/core/ui/theme-context';

/**
 * Beş sekme sınırı bilinçli: altı ve üzeri sekme dokunma hedeflerini
 * daraltıyor ve etiketler kesiliyor. Dua ve İlmihal bu yüzden tek bir
 * "Rehber" sekmesinde birleşti.
 *
 * Aktif sekme rengi gün içinde kayıyor — arayüzün tek kromatik rolü
 * içinde bulunulan vakit (bkz. DESIGN.md).
 */
export default function TabsLayout() {
  const { colors, mode } = useTheme();
  const period = usePeriodPalette();

  return <TabsNavigator colors={colors} mode={mode} accent={period.accent} />;
}

function TabsNavigator({
  colors,
  mode,
  accent,
}: {
  colors: ReturnType<typeof useTheme>['colors'];
  mode: ReturnType<typeof useTheme>['mode'];
  accent: string;
}) {
  return (
    <Tabs
      /*
        Banner sekme çubuğunun ÜSTÜNDE, çubuğun kendi kabının içinde.
        Daha önce `<Tabs />` ile kardeş olarak en alta konmuştu; o
        yerleşimde reklam sistem gezinme çubuğunun altında kalıyordu.
        İki sonucu vardı ve ikisi de kabul edilemez: reklam kısmen
        görünmez oluyordu ve geri/ana ekran tuşlarına basarken
        yanlışlıkla tıklanabiliyordu. AdMob'un yanlışlıkla tıklama
        politikası bunu hesap askıya alma sebebi sayıyor.

        BottomTabBar alt güvenli alan payını kendi hesaplıyor; banner
        onun üstünde kaldığı için gezinme çubuğuna hiç değmiyor.
        Hangi sekmede görüneceğine yine AdGate karar veriyor.
      */
      tabBar={(props) => (
        <View style={{ backgroundColor: colors.surface }}>
          <AdBanner />
          <BottomTabBar {...props} />
        </View>
      )}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        sceneStyle: { backgroundColor: colors.background },
      }}
      // Gece modunda sistem koyu tema varsayımını kırmak için key ile
      // yeniden bağlama; tabBarStyle bazı platformlarda cache'leniyor.
      key={mode}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Vakitler',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="mosque" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="kible"
        options={{
          title: 'Kıble',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="compass-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tesbih"
        options={{
          title: 'Tesbih',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="counter" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rehber"
        options={{
          title: 'Rehber',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="book-open-page-variant-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ayarlar"
        options={{
          title: 'Ayarlar',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="cog-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
