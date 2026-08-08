import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { storage, StorageKeys } from '@/core/store/storage';
import { Button } from '@/core/ui/button';
import { Screen, Text } from '@/core/ui/components';
import { useTheme } from '@/core/ui/theme-context';
import { ensureNotificationSetup } from '@/features/notifications/scheduler';

type Step = 'welcome' | 'location' | 'notifications';

function Point({
  icon,
  title,
  body,
}: {
  icon: 'shield-lock-outline' | 'account-off-outline' | 'wifi-off';
  title: string;
  body: string;
}) {
  const { colors, spacing } = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: spacing.md }}>
      <MaterialCommunityIcons
        name={icon}
        size={22}
        color={colors.textSecondary}
        style={{ marginTop: 2 }}
      />
      <View style={{ flex: 1, gap: spacing.xs }}>
        <Text variant="bodyStrong">{title}</Text>
        <Text variant="body" color="textSecondary">
          {body}
        </Text>
      </View>
    </View>
  );
}

export default function OnboardingScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const [step, setStep] = useState<Step>('welcome');
  const [busy, setBusy] = useState(false);

  const finish = useCallback(() => {
    storage.set(StorageKeys.onboardingCompleted, 'true');
    router.replace('/(tabs)');
  }, [router]);

  const askLocation = useCallback(async () => {
    setBusy(true);
    try {
      // İzin istemi burada tetikleniyor, uygulamanın ilk saniyesinde
      // değil: kullanıcı neden istendiğini okuduktan sonra karar
      // versin. Soğuk istem reddedilme oranını ciddi biçimde artırıyor.
      await Location.requestForegroundPermissionsAsync();
    } catch {
      // Reddedilse de akış devam ediyor; elle şehir seçme yolu açık.
    } finally {
      setBusy(false);
      setStep('notifications');
    }
  }, []);

  const askNotifications = useCallback(async () => {
    setBusy(true);
    try {
      await ensureNotificationSetup();
    } catch {
      // İzin verilmezse vakitler yine çalışıyor, sadece bildirim gelmiyor.
    } finally {
      setBusy(false);
      finish();
    }
  }, [finish]);

  return (
    <Screen scroll edges={{ top: true, bottom: true }}>
      {step === 'welcome' ? (
        <View style={{ flex: 1, gap: spacing.xl, paddingTop: spacing.xxl }}>
          <View style={{ gap: spacing.sm }}>
            <Text variant="title">Namaz vakitleri, kıble, tesbih ve dua</Text>
            <Text variant="body" color="textSecondary">
              Hepsi tek uygulamada, internetsiz çalışır.
            </Text>
          </View>

          {/*
            Gizlilik mesajı hoş geldin ekranının kendisi.
            Muslim Pro'nun konum verisi skandalından sonra bu kategoride
            en güçlü koz bu — ve bizim için pazarlama cümlesi değil,
            mimarinin sonucu (bkz. PRODUCT.md).
          */}
          <View style={{ gap: spacing.lg, marginTop: spacing.md }}>
            <Point
              icon="account-off-outline"
              title="Hesap istemiyoruz"
              body="Kayıt yok, e-posta yok, telefon numarası yok. Uygulamayı açtığınız an kullanmaya başlıyorsunuz."
            />
            <Point
              icon="shield-lock-outline"
              title="Konumunuz cihazınızda kalır"
              body="Namaz vakitleri telefonunuzda hesaplanıyor. Nerede olduğunuz hiçbir sunucuya gönderilmiyor, çünkü sunucumuz yok."
            />
            <Point
              icon="wifi-off"
              title="İnternetsiz çalışır"
              body="Vakitler, kıble ve tesbih bağlantı olmadan da çalışır. Zikir geçmişiniz yalnızca sizin telefonunuzda tutulur."
            />
          </View>

          <View style={{ gap: spacing.sm, marginTop: spacing.xl }}>
            <Button fullWidth variant="primary" label="Başlayalım" onPress={() => setStep('location')} />
          </View>
        </View>
      ) : null}

      {step === 'location' ? (
        <View style={{ flex: 1, gap: spacing.lg, paddingTop: spacing.xxl }}>
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={34}
            color={colors.textSecondary}
          />
          <Text variant="title">Konumunuza izin verir misiniz?</Text>
          <Text variant="body" color="textSecondary">
            Namaz vakitleri ve kıble yönü bulunduğunuz noktaya göre
            hesaplanıyor. İzin vermezseniz şehrinizi elle de seçebilirsiniz —
            uygulama yine tam çalışır.
          </Text>
          <Text variant="caption" color="textMuted">
            Konum bilginiz cihazınızdan çıkmaz.
          </Text>

          <View style={{ gap: spacing.sm, marginTop: spacing.xl }}>
            <Button
              fullWidth
              variant="primary"
              label="Konuma izin ver"
              onPress={askLocation}
              busy={busy}
            />
            <Button
              fullWidth
              variant="quiet"
              label="Şehrimi elle seçeceğim"
              onPress={() => setStep('notifications')}
            />
          </View>
        </View>
      ) : null}

      {step === 'notifications' ? (
        <View style={{ flex: 1, gap: spacing.lg, paddingTop: spacing.xxl }}>
          <MaterialCommunityIcons
            name="bell-outline"
            size={34}
            color={colors.textSecondary}
          />
          <Text variant="title">Vakitler girince haber verelim mi?</Text>
          <Text variant="body" color="textSecondary">
            Her namaz vakti için ayrı ayrı açıp kapatabilir, vaktin kaç dakika
            öncesinde hatırlatılacağını seçebilirsiniz.
          </Text>
          <Text variant="caption" color="textMuted">
            Bildirimler telefonunuzda planlanıyor; sunucudan gelmiyor.
          </Text>

          <View style={{ gap: spacing.sm, marginTop: spacing.xl }}>
            <Button
              fullWidth
              variant="primary"
              label="Bildirimlere izin ver"
              onPress={askNotifications}
              busy={busy}
            />
            <Button fullWidth variant="quiet" label="Şimdilik istemiyorum" onPress={finish} />
          </View>
        </View>
      ) : null}

      <View
        style={{
          marginTop: spacing.section,
          paddingTop: spacing.md,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
        }}>
        <Text variant="caption" color="textMuted">
          Bu ayarların hepsini sonradan Ayarlar&apos;dan değiştirebilirsiniz.
        </Text>
      </View>
    </Screen>
  );
}
