import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  View,
} from 'react-native';
import { useMMKVString } from 'react-native-mmkv';

import { useAds } from '@/features/ads/ads-context';
import { exportBackup, importBackup } from '@/features/backup/backup';
import {
  isPurchaseAvailable,
  purchaseSupport,
} from '@/features/iap/purchases';
import {
  HAPTIC_LABELS,
  TAP_EFFECT_LABELS,
  useTesbihAppearance,
} from '@/features/tesbih/appearance';

import { storage, StorageKeys } from '@/core/store/storage';
import { Screen, Text } from '@/core/ui/components';
import { OptionCard, OptionGroup, type Option } from '@/core/ui/options';
import { Section } from '@/core/ui/section';
import {
  ARABIC_FONTS,
  MIN_TOUCH_TARGET,
  READING_FONTS,
  SCALE_LABELS,
} from '@/core/ui/theme';
import { useTheme, type ThemePreference } from '@/core/ui/theme-context';
import { ASR_METHOD_LABELS } from '@/features/prayer-times/calculate';
import { usePrayerSettings } from '@/features/prayer-times/use-prayer-settings';

const THEME_OPTIONS: readonly Option<ThemePreference>[] = [
  { value: 'system', label: 'Sistem', hint: 'Cihaz ayarını takip eder' },
  { value: 'light', label: 'Açık' },
  { value: 'dark', label: 'Koyu' },
  {
    value: 'night',
    label: 'Gece',
    hint: 'Karanlıkta okumak için kısılmış, sıcak renkler',
  },
];

function DataRow({
  icon,
  title,
  subtitle,
  onPress,
  busy,
}: {
  icon:
    | 'tray-arrow-up'
    | 'tray-arrow-down'
    | 'heart-outline'
    | 'restore';
  title: string;
  subtitle: string;
  onPress: () => void;
  busy: boolean;
}) {
  const { colors } = useTheme();

  return (
    <OptionCard
      onPress={onPress}
      disabled={busy}
      accessibilityLabel={`${title}. ${subtitle}`}>
      <MaterialCommunityIcons
        name={icon}
        size={22}
        color={colors.textSecondary}
      />
      <View style={{ flex: 1 }}>
        <Text variant="bodyStrong">{title}</Text>
        <Text variant="caption" color="textSecondary">
          {subtitle}
        </Text>
      </View>
      {busy ? <ActivityIndicator color={colors.textSecondary} /> : null}
    </OptionCard>
  );
}

/**
 * Alt ekrana götüren satır. Eylem satırlarıyla (DataRow) aynı kabı
 * kullanıyor; ikisinin farklı görünmesi için bir sebep yok, ikisi de
 * "dokun, bir şey olsun" vaat ediyor.
 */
function NavRow({
  icon,
  title,
  subtitle,
  href,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle: string;
  href: '/okuma-ayarlari' | '/vakit-ayarlari' | '/tesbih-gorunum';
}) {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <OptionCard
      onPress={() => router.push(href)}
      accessibilityRole="link"
      accessibilityLabel={`${title}. ${subtitle}`}>
      <MaterialCommunityIcons
        name={icon}
        size={22}
        color={colors.textSecondary}
      />
      <View style={{ flex: 1 }}>
        <Text variant="bodyStrong">{title}</Text>
        <Text variant="caption" color="textSecondary">
          {subtitle}
        </Text>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={22}
        color={colors.textMuted}
      />
    </OptionCard>
  );
}

type Madhab = 'hanefi' | 'safii';

const MADHAB_OPTIONS: readonly Option<Madhab>[] = [
  {
    value: 'hanefi',
    label: 'Hanefî',
    hint: 'İlmihal içeriği Hanefî mezhebine göre gösterilir',
  },
  {
    value: 'safii',
    label: 'Şâfiî',
    hint: 'İlmihal içeriği Şâfiî mezhebine göre gösterilir',
  },
];

export default function AyarlarScreen() {
  const {
    preference,
    setPreference,
    readingScale,
    readingFont,
    arabicFont,
    spacing,
    colors,
    radii,
  } = useTheme();

  const { asrMethod } = usePrayerSettings();
  const [storedMadhab, setStoredMadhab] = useMMKVString(
    StorageKeys.madhab,
    storage
  );

  const { appearance } = useTesbihAppearance();
  const ads = useAds();
  const purchaseAvailable = isPurchaseAvailable();
  const [busy, setBusy] = useState<
    'export' | 'import' | 'support' | 'restore' | null
  >(null);

  const handleSupport = useCallback(async () => {
    setBusy('support');
    try {
      const result = await purchaseSupport();
      if (result.status === 'ok') {
        await ads.refreshPremium();
        Alert.alert(
          'Teşekkürler',
          'Desteğiniz için teşekkür ederiz. Reklamlar kapatıldı.'
        );
      } else if (result.status === 'unavailable') {
        Alert.alert(
          'Şu an kullanılamıyor',
          'Satın alma henüz yapılandırılmadı. Uygulama mağazaya çıktığında etkinleşecek.'
        );
      } else if (result.status === 'failed') {
        Alert.alert('Satın alma tamamlanamadı', 'Lütfen tekrar deneyin.');
      }
    } finally {
      setBusy(null);
    }
  }, [ads]);

  const handleRestore = useCallback(async () => {
    setBusy('restore');
    try {
      const restored = await ads.restore();
      Alert.alert(
        restored ? 'Geri yüklendi' : 'Satın alma bulunamadı',
        restored
          ? 'Reklamsız sürüm yeniden etkinleştirildi.'
          : 'Bu hesapta daha önce yapılmış bir satın alma bulunamadı.'
      );
    } finally {
      setBusy(null);
    }
  }, [ads]);

  const handleExport = useCallback(async () => {
    setBusy('export');
    try {
      const result = await exportBackup();
      if (result.status === 'unavailable') {
        Alert.alert(
          'Paylaşma kullanılamıyor',
          'Bu özellik uygulamanın güncel derlemesini gerektiriyor.'
        );
      } else if (result.status === 'failed') {
        Alert.alert('Yedek alınamadı', 'Dosya oluşturulurken bir sorun oldu.');
      }
    } finally {
      setBusy(null);
    }
  }, []);

  const handleImport = useCallback(async () => {
    setBusy('import');
    try {
      const result = await importBackup();
      if (result.status === 'invalid') {
        Alert.alert('Yedek okunamadı', result.reason);
      } else if (result.status === 'ok') {
        Alert.alert(
          'Yedek geri yüklendi',
          `${result.summary.sessions} zikir kaydı, ${result.summary.favorites} favori ve ayarlarınız aktarıldı.`
        );
      }
    } catch {
      Alert.alert('Yedek yüklenemedi', 'Dosya işlenirken bir sorun oldu.');
    } finally {
      setBusy(null);
    }
  }, []);
  const madhab: Madhab = storedMadhab === 'safii' ? 'safii' : 'hanefi';

  return (
    <Screen scroll>
      <Text variant="title">Ayarlar</Text>

      <Section
        first
        title="Görünüm"
        description="Gece modu, imsak öncesi karanlıkta okumak için mavi ışığı kısar.">
        <OptionGroup
          options={THEME_OPTIONS}
          selected={preference}
          onSelect={setPreference}
        />
      </Section>

      <Section
        title="Okuma"
        description="Yazı boyutu ve yazı tipi. Türkçe ve Arapça ayrı ayrı ayarlanır.">
        <NavRow
          icon="format-size"
          title="Okuma ayarları"
          subtitle={`${READING_FONTS[readingFont].label} · ${SCALE_LABELS[readingScale]} · Arapça ${ARABIC_FONTS[arabicFont].label}`}
          href="/okuma-ayarlari"
        />
      </Section>

      <Section
        title="Mezhep"
        description="İlmihal içeriği bu seçime göre değişir. Namaz vakitlerini etkilemez — ikindi vakti ayrı bir ayardır.">
        <OptionGroup
          options={MADHAB_OPTIONS}
          selected={madhab}
          onSelect={setStoredMadhab}
        />
      </Section>

      <Section
        title="Vakit ve bildirimler"
        description="İkindi tercihi, hangi vakitlerde bildirim geleceği ve hesaplama yöntemi.">
        <NavRow
          icon="bell-outline"
          title="Vakit ve bildirimler"
          subtitle={ASR_METHOD_LABELS[asrMethod]}
          href="/vakit-ayarlari"
        />
      </Section>

      {/*
        Satın alma yapılandırılmamışsa bu bölüm hiç görünmüyor.
        Anahtar yokken düğmeyi göstermek, basınca "şu an kullanılamıyor"
        diyen bir düğme göstermek demekti. Anahtar girildiğinde bölüm
        kendiliğinden geri geliyor.
      */}
      {purchaseAvailable ? (
      <Section
        title="Uygulamayı destekle"
        description={
          ads.isPremium
            ? 'Desteğiniz için teşekkürler. Reklamlar kapalı.'
            : 'Tek seferlik satın alma; karşılığında reklamlar tamamen kalkar. Bu bir bağış değil, geliştirmeye destektir — toplanan para hayır kurumuna gitmez.'
        }>
        {ads.isPremium ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.md,
              minHeight: MIN_TOUCH_TARGET,
              paddingHorizontal: spacing.md,
              borderRadius: radii.md,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}>
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={22}
              color={colors.success}
            />
            <Text variant="bodyStrong" style={{ flex: 1 }}>
              Reklamsız sürüm etkin
            </Text>
          </View>
        ) : (
          <>
            <DataRow
              icon="heart-outline"
              title="Destek ol, reklamları kaldır"
              subtitle="Tek seferlik"
              onPress={handleSupport}
              busy={busy === 'support'}
            />
            <DataRow
              icon="restore"
              title="Satın alımı geri yükle"
              subtitle="Telefon değiştirdiyseniz"
              onPress={handleRestore}
              busy={busy === 'restore'}
            />
          </>
        )}
      </Section>
      ) : null}

      <Section
        title="Tesbih"
        description="Dokunuş efekti, rengi ve titreşim yoğunluğu.">
        <NavRow
          icon="water-outline"
          title="Tesbih görünümü"
          subtitle={`${TAP_EFFECT_LABELS[appearance.tapEffect]} · ${HAPTIC_LABELS[appearance.hapticStrength]} titreşim`}
          href="/tesbih-gorunum"
        />
      </Section>

      <Section
        title="Veri"
        description="Tüm zikir geçmişiniz ve ayarlarınız tek dosyaya çıkarılıp yeni telefonda geri yüklenebilir. Dosya sizde kalır, hiçbir sunucuya gönderilmez.">
        <DataRow
          icon="tray-arrow-up"
          title="Yedeği dışa aktar"
          subtitle="Paylaşma menüsüyle istediğiniz yere kaydedin"
          onPress={handleExport}
          busy={busy === 'export'}
        />
        <DataRow
          icon="tray-arrow-down"
          title="Yedeği içe aktar"
          subtitle="Hiçbir kayıt silinmez, mevcutlarla birleştirilir"
          onPress={handleImport}
          busy={busy === 'import'}
        />
        <Text variant="caption" color="textMuted">
          Android&apos;de uygulama verisi ayrıca kendi Google
          hesabınızın yedeğine dahil edilir; yeni telefona geçtiğinizde
          kendiliğinden gelir. O yedek de bize değil, size aittir.
        </Text>
      </Section>

      <View style={{ height: spacing.xxxl }} />
    </Screen>
  );
}
