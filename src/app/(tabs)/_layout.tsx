import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';

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

  return (
    <>
      <TabsNavigator colors={colors} mode={mode} accent={period.accent} />
      {/*
        Banner sekme çubuğunun hemen üstünde, tek bir yerde duruyor.
        Hangi sekmede görüneceğine kendisi değil AdGate karar veriyor;
        Kıble, Tesbih ve Rehber detaylarında hiç render edilmiyor.
      */}
      <AdBanner />
    </>
  );
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
