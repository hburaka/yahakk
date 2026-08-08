import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';

import { storage, StorageKeys } from '@/core/store/storage';
import { Button } from '@/core/ui/button';
import { Screen, Text } from '@/core/ui/components';
import { GroupLabel } from '@/core/ui/section';
import { MIN_TOUCH_TARGET } from '@/core/ui/theme';
import { useTheme } from '@/core/ui/theme-context';
import { usePeriodPalette } from '@/features/prayer-times/use-period-palette';
import { hasContent } from '@/features/ilmihal/content';
import {
  DUA_CATEGORIES,
  ILMIHAL_SECTIONS,
  MADHAB_LABELS,
  type Madhab,
} from '@/features/rehber/data';

type Tab = 'dua' | 'ilmihal';

function SegmentedControl({
  value,
  onChange,
}: {
  value: Tab;
  onChange: (next: Tab) => void;
}) {
  const { colors, spacing, radii } = useTheme();
  const period = usePeriodPalette();

  const options: { key: Tab; label: string }[] = [
    { key: 'dua', label: 'Dualar' },
    { key: 'ilmihal', label: 'İlmihal' },
  ];

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: spacing.xs,
        padding: spacing.xs,
        borderRadius: radii.pill,
        backgroundColor: colors.surfaceAlt,
      }}>
      {options.map((option) => {
        const isSelected = option.key === value;
        return (
          <Pressable
            key={option.key}
            onPress={() => onChange(option.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            style={{
              flex: 1,
              minHeight: MIN_TOUCH_TARGET - 8,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: radii.pill,
              backgroundColor: isSelected ? colors.surface : 'transparent',
              borderWidth: isSelected ? StyleSheet.hairlineWidth : 0,
              borderColor: period.accent,
            }}>
            <Text
              variant="bodyStrong"
              color={isSelected ? 'text' : 'textSecondary'}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function ListRow({
  title,
  meta,
  isFirst,
  disabled,
  onPress,
}: {
  title: string;
  meta?: string;
  isFirst?: boolean;
  /** İçeriği henüz yazılmamış konular soluk ve dokunulamaz */
  disabled?: boolean;
  onPress?: () => void;
}) {
  const { colors, spacing } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={
        disabled
          ? `${title}, henüz hazır değil`
          : meta
            ? `${title}, ${meta}`
            : title
      }
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => ({
        opacity: disabled ? 0.45 : 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        minHeight: MIN_TOUCH_TARGET,
        paddingVertical: spacing.sm,
        borderTopWidth: isFirst ? 0 : StyleSheet.hairlineWidth,
        borderTopColor: colors.border,
        backgroundColor: pressed ? colors.surfaceAlt : 'transparent',
      })}>
      <Text variant="body" style={{ flex: 1 }} scalable>
        {title}
      </Text>
      {meta ? (
        <Text variant="caption" color="textMuted">
          {meta}
        </Text>
      ) : null}
      <MaterialCommunityIcons
        name="chevron-right"
        size={22}
        color={colors.textMuted}
      />
    </Pressable>
  );
}

/**
 * Mezhep etiketi opsiyonel değil. Abdestin ve namazın tarifi Hanefî ile
 * Şâfiî'de ayrışıyor; etiketsiz gösterim okuyucunun bir kısmına yanlış
 * bilgi vermek anlamına geliyor.
 */
function MadhabBanner({ madhab }: { madhab: Madhab }) {
  const { colors, spacing, radii } = useTheme();

  return (
    <Link href="/(tabs)/ayarlar" asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`İçerik ${MADHAB_LABELS[madhab]} mezhebine göre gösteriliyor. Değiştirmek için dokunun.`}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          minHeight: MIN_TOUCH_TARGET,
          paddingHorizontal: spacing.md,
          borderRadius: radii.md,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          backgroundColor: pressed ? colors.surfaceAlt : colors.surface,
        })}>
        <MaterialCommunityIcons
          name="information-outline"
          size={19}
          color={colors.textSecondary}
        />
        <Text variant="caption" color="textSecondary" style={{ flex: 1 }}>
          İçerik {MADHAB_LABELS[madhab]} mezhebine göre
        </Text>
        <Text variant="caption" color="textSecondary">
          Değiştir
        </Text>
      </Pressable>
    </Link>
  );
}

export default function RehberScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('dua');
  const [storedMadhab] = useMMKVString(StorageKeys.madhab, storage);
  const madhab: Madhab = storedMadhab === 'safii' ? 'safii' : 'hanefi';

  return (
    <Screen scroll>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.md,
        }}>
        <Text variant="title">Rehber</Text>

        {/* Okuma ayarları okuma yerinden erişilebilir olmalı — kullanıcı
            metni okurken büyütmek ister, Ayarlar'a gidip dönmek istemez.
            Önce yalnızca opaklık değişen çerçevesiz bir metindi; başlığın
            yanında düz yazı gibi duruyordu. */}
        <Button
          variant="quiet"
          icon="format-size"
          label="Aa"
          onPress={() => router.push('/okuma-ayarlari')}
          accessibilityLabel="Okuma ayarları: yazı boyutu ve yazı tipi"
        />
      </View>

      <View style={{ marginTop: spacing.lg }}>
        <SegmentedControl value={tab} onChange={setTab} />
      </View>

      {tab === 'dua' ? (
        <View style={{ marginTop: spacing.xl }}>
          {DUA_CATEGORIES.map((category, index) => (
            <ListRow
              key={category.id}
              title={category.title}
              meta={`${category.count}`}
              isFirst={index === 0}
            />
          ))}
        </View>
      ) : (
        <View style={{ marginTop: spacing.lg, gap: spacing.xl }}>
          <MadhabBanner madhab={madhab} />

          {ILMIHAL_SECTIONS.map((section) => (
            <View key={section.id}>
              <GroupLabel>{section.title}</GroupLabel>
              {section.topics.map((topic, index) => {
                const ready = hasContent(topic.id);
                return (
                  <ListRow
                    key={topic.id}
                    title={topic.title}
                    meta={
                      !ready
                        ? 'hazırlanıyor'
                        : topic.madhabSpecific
                          ? MADHAB_LABELS[madhab]
                          : undefined
                    }
                    isFirst={index === 0}
                    disabled={!ready}
                    onPress={() =>
                      router.push({
                        pathname: '/ilmihal/[id]',
                        params: { id: topic.id },
                      })
                    }
                  />
                );
              })}
            </View>
          ))}
        </View>
      )}

      <View
        style={{
          marginTop: spacing.section,
          marginBottom: spacing.xxxl,
          paddingTop: spacing.md,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
        }}>
        {/* Not sekmeye göre değişiyor: ilmihal metinleri yazıldı ama
            onaylanmadı, dua metinleri henüz hiç girilmedi. Tek bir genel
            uyarı ikisini de yanlış anlatır ve zamanla okunmaz hale gelir. */}
        <Text variant="caption" color="textMuted">
          {tab === 'dua'
            ? 'Dua metinleri henüz girilmedi. Kaynak ve telif durumu netleşmeden uygulamaya eklenmeyecek.'
            : 'İlmihal metinleri Diyanet İşleri Başkanlığı İlmihali esas alınarak hazırlandı, henüz ehil biri tarafından gözden geçirilmedi. Tereddüt ettiğiniz konuda müftülüğe danışın.'}
        </Text>
      </View>
    </Screen>
  );
}
