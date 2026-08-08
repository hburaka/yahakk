// Ağırlıklar tek tek alt yollarından import ediliyor. Paket kökünden
// import edildiğinde Metro paketteki BÜTÜN ağırlıkları bundle'a alıyor
// (Lora'da 8, Scheherazade'de 4 dosya) — kullanmadığımız italik ve
// kalın varyantlar birkaç megabayt gereksiz yer kaplıyordu.
import { Amiri_400Regular } from '@expo-google-fonts/amiri/400Regular';
import { Amiri_700Bold } from '@expo-google-fonts/amiri/700Bold';
import { AtkinsonHyperlegible_400Regular } from '@expo-google-fonts/atkinson-hyperlegible/400Regular';
import { AtkinsonHyperlegible_700Bold } from '@expo-google-fonts/atkinson-hyperlegible/700Bold';
import { Lora_400Regular } from '@expo-google-fonts/lora/400Regular';
import { Lora_600SemiBold } from '@expo-google-fonts/lora/600SemiBold';
import { ScheherazadeNew_400Regular } from '@expo-google-fonts/scheherazade-new/400Regular';
import { ScheherazadeNew_600SemiBold } from '@expo-google-fonts/scheherazade-new/600SemiBold';
import migrations from '@drizzle/migrations';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import {
  DarkTheme,
  DefaultTheme,
  Redirect,
  Stack,
  ThemeProvider as NavigationThemeProvider,
} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useMMKVString } from 'react-native-mmkv';

import { db } from '@/core/db/client';
import { storage, StorageKeys } from '@/core/store/storage';
import { Text } from '@/core/ui/components';
import { ThemeProvider, useTheme } from '@/core/ui/theme-context';
import { AdsProvider } from '@/features/ads/ads-context';
import { useNotificationSync } from '@/features/notifications/use-notification-sync';
import { usePeriodPalette } from '@/features/prayer-times/use-period-palette';

import '@/global.css';

SplashScreen.preventAutoHideAsync();

/**
 * Uygulama açıkken de vakit bildirimi görünsün. Varsayılan davranış
 * ön plandaki bildirimleri gizliyor; namaz vakti tam da uygulamaya
 * bakarken girebilir ve o an bildirimi bastırmak yanlış olur.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Navigasyon kütüphanesinin kendi tema nesnesini bizim paletimizden
 * türetiyoruz; aksi halde başlık çubuğu ve geçiş animasyonlarının
 * arka planı gece modunda uyumsuz kalıyor.
 */
function useNavigationTheme() {
  const { colors, mode } = useTheme();
  const period = usePeriodPalette();

  return useMemo(() => {
    const base = mode === 'light' ? DefaultTheme : DarkTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: period.accent,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
      },
    };
  }, [colors, mode, period.accent]);
}

function CenteredMessage({ children }: { children: React.ReactNode }) {
  const { colors, spacing } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
        gap: spacing.md,
        backgroundColor: colors.background,
      }}>
      {children}
    </View>
  );
}

/**
 * Çizim yapmaz; yalnızca bildirimleri konum ve ayarlarla senkron tutar.
 * Ayrı bir bileşen olmasının sebebi, kancanın tetiklediği yeniden
 * render'ların navigasyon ağacını gereksiz yere yenilememesi.
 */
function NotificationSync() {
  useNotificationSync();
  return null;
}

function RootNavigator() {
  const { colors, mode } = useTheme();
  const navigationTheme = useNavigationTheme();

  // İlk açılışta karşılama akışına yönlendiriliyor. Bu, konum ve
  // bildirim izinlerinin soğuk istemle değil, gerekçesi okunduktan
  // sonra sorulmasını sağlıyor.
  const [onboarded] = useMMKVString(StorageKeys.onboardingCompleted, storage);
  const needsOnboarding = onboarded !== 'true';

  // Şema migration'ları uygulama açılmadan önce tamamlanmalı; aksi halde
  // ilk ekran henüz var olmayan tablolara sorgu atıyor.
  const { success, error } = useMigrations(db, migrations);

  // Okuma yazı tipleri paket içinden yükleniyor (ağ yok). Açılışta
  // beklemenin sebebi: kullanıcı büyük puntolu bir yazı tipi seçtiyse,
  // metnin önce sistem yazı tipiyle çizilip sonra sıçraması okumayı bozar.
  const [fontsLoaded, fontError] = useFonts({
    Lora_400Regular,
    Lora_600SemiBold,
    AtkinsonHyperlegible_400Regular,
    AtkinsonHyperlegible_700Bold,
    Amiri_400Regular,
    Amiri_700Bold,
    ScheherazadeNew_400Regular,
    ScheherazadeNew_600SemiBold,
  });

  const ready = success && (fontsLoaded || !!fontError);

  useEffect(() => {
    if (ready || error) {
      SplashScreen.hideAsync();
    }
  }, [ready, error]);

  if (error) {
    return (
      <CenteredMessage>
        <Text variant="heading" color="danger">
          Veritabanı hazırlanamadı
        </Text>
        <Text variant="body" color="textSecondary" style={{ textAlign: 'center' }}>
          Uygulamayı kapatıp yeniden açmayı deneyin. Sorun sürerse uygulamayı
          silip yeniden kurmanız gerekebilir.
        </Text>
        <Text variant="caption" color="textMuted" style={{ textAlign: 'center' }}>
          {error.message}
        </Text>
      </CenteredMessage>
    );
  }

  if (!ready) {
    return (
      <CenteredMessage>
        <ActivityIndicator color={colors.textSecondary} />
      </CenteredMessage>
    );
  }

  return (
    <NavigationThemeProvider value={navigationTheme}>
      {/*
        Karşılama akışı bitmeden bildirim planlaması başlamıyor:
        henüz izin istenmemişken planlamaya kalkmak, izin istemini
        gerekçesi okunmadan tetikliyordu.
      */}
      {needsOnboarding ? <Redirect href="/onboarding" /> : <NotificationSync />}
      <StatusBar style={mode === 'light' ? 'dark' : 'light'} />
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="onboarding"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="okuma-ayarlari"
          options={{
            presentation: 'modal',
            title: 'Okuma ayarları',
            headerStyle: { backgroundColor: colors.background },
          }}
        />
        <Stack.Screen
          name="vakit-ayarlari"
          options={{
            presentation: 'modal',
            title: 'Vakit ve bildirimler',
            headerStyle: { backgroundColor: colors.background },
          }}
        />
        <Stack.Screen
          name="zikir-sec"
          options={{
            presentation: 'modal',
            title: 'Zikir seç',
            headerStyle: { backgroundColor: colors.background },
          }}
        />
        <Stack.Screen
          name="tesbih-rapor"
          options={{
            presentation: 'modal',
            title: 'Tesbihat raporu',
            headerStyle: { backgroundColor: colors.background },
          }}
        />
        <Stack.Screen
          name="konum-sec"
          options={{
            presentation: 'modal',
            title: 'Konum seç',
            headerStyle: { backgroundColor: colors.background },
          }}
        />
        <Stack.Screen
          name="tesbih-gorunum"
          options={{
            presentation: 'modal',
            title: 'Tesbih görünümü',
            headerStyle: { backgroundColor: colors.background },
          }}
        />
      </Stack>
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AdsProvider>
          <RootNavigator />
        </AdsProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
