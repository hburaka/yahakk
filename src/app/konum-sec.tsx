import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useMMKVString } from 'react-native-mmkv';

import { db } from '@/core/db/client';
import { locations, type Location as LocationRow } from '@/core/db/schema';
import { storage, StorageKeys } from '@/core/store/storage';
import { Screen, Text } from '@/core/ui/components';
import { MIN_TOUCH_TARGET } from '@/core/ui/theme';
import { useTheme } from '@/core/ui/theme-context';
import { usePeriodPalette } from '@/features/prayer-times/use-period-palette';
import {
  searchLocations,
  type LocationCandidate,
} from '@/features/prayer-times/search-location';

type SearchState =
  | { status: 'idle' }
  | { status: 'searching' }
  | { status: 'results'; items: LocationCandidate[] }
  | { status: 'empty' }
  | { status: 'offline' };

function Row({
  title,
  subtitle,
  icon,
  isSelected,
  onPress,
}: {
  title: string;
  subtitle?: string;
  icon: 'map-marker-outline' | 'magnify' | 'crosshairs-gps';
  isSelected?: boolean;
  onPress: () => void;
}) {
  const { colors, spacing, radii } = useTheme();
  const period = usePeriodPalette();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      accessibilityState={{ selected: !!isSelected }}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        minHeight: MIN_TOUCH_TARGET,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: radii.md,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: isSelected ? period.accent : colors.border,
        backgroundColor: isSelected
          ? period.accentSoft
          : pressed
            ? colors.surfaceAlt
            : 'transparent',
      })}>
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={isSelected ? period.accent : colors.textSecondary}
      />
      <View style={{ flex: 1 }}>
        <Text variant="body">{title}</Text>
        {subtitle ? (
          <Text variant="caption" color="textMuted">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {isSelected ? (
        <MaterialCommunityIcons name="check" size={20} color={period.accent} />
      ) : null}
    </Pressable>
  );
}

export default function KonumSecScreen() {
  const { colors, spacing, radii } = useTheme();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [search, setSearch] = useState<SearchState>({ status: 'idle' });
  const [saved, setSaved] = useState<LocationRow[]>([]);
  const [selectedId, setSelectedId] = useMMKVString(
    StorageKeys.selectedLocationId,
    storage
  );

  useEffect(() => {
    let cancelled = false;
    db.select()
      .from(locations)
      .then((rows) => {
        if (!cancelled) setSaved(rows);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const runSearch = useCallback(async () => {
    setSearch({ status: 'searching' });
    const outcome = await searchLocations(query);
    if (outcome.status === 'ok') {
      setSearch({ status: 'results', items: outcome.results });
    } else {
      setSearch({ status: outcome.status });
    }
  }, [query]);

  const choose = useCallback(
    async (candidate: LocationCandidate) => {
      try {
        const { label, ...row } = candidate;
        void label;
        await db.insert(locations).values(row).onConflictDoNothing();
      } catch {
        // Satır zaten varsa sorun değil; seçim yine de yapılıyor.
      }
      setSelectedId(candidate.id);
      router.back();
    },
    [router, setSelectedId]
  );

  return (
    <Screen scroll edges={{ top: false }}>
      <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            paddingHorizontal: spacing.md,
            minHeight: MIN_TOUCH_TARGET,
            borderRadius: radii.md,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
            backgroundColor: colors.surface,
          }}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={colors.textMuted}
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={runSearch}
            returnKeyType="search"
            placeholder="Şehir veya ilçe adı"
            placeholderTextColor={colors.textMuted}
            accessibilityLabel="Şehir ara"
            style={{
              flex: 1,
              paddingVertical: spacing.sm,
              fontSize: 17,
              color: colors.text,
            }}
          />
          {search.status === 'searching' ? (
            <ActivityIndicator color={colors.textSecondary} />
          ) : null}
        </View>

        <Text variant="caption" color="textMuted">
          Arama internet gerektirir. Seçtiğiniz konum kaydedilir ve vakitler
          bundan sonra çevrimdışı hesaplanır.
        </Text>
      </View>

      {search.status === 'results' ? (
        <View style={{ marginTop: spacing.xl, gap: spacing.sm }}>
          <Text variant="label" color="textMuted">
            SONUÇLAR
          </Text>
          {search.items.map((item) => (
            <Row
              key={item.id}
              icon="map-marker-outline"
              title={item.label}
              subtitle={`${item.latitude.toFixed(3)}, ${item.longitude.toFixed(3)}`}
              onPress={() => choose(item)}
            />
          ))}
        </View>
      ) : null}

      {search.status === 'empty' ? (
        <View style={{ marginTop: spacing.xl, gap: spacing.xs }}>
          <Text variant="bodyStrong">Sonuç bulunamadı</Text>
          <Text variant="body" color="textSecondary">
            Şehir adını farklı yazmayı deneyin. İlçe bulunamıyorsa bağlı
            olduğu ili aratabilirsiniz — vakitler arasındaki fark genellikle
            bir dakikanın altındadır.
          </Text>
        </View>
      ) : null}

      {search.status === 'offline' ? (
        <View style={{ marginTop: spacing.xl, gap: spacing.xs }}>
          <Text variant="bodyStrong" color="danger">
            Arama yapılamadı
          </Text>
          <Text variant="body" color="textSecondary">
            İnternet bağlantınızı kontrol edip tekrar deneyin. Daha önce
            kaydettiğiniz konumlar aşağıda ve çevrimdışı çalışır.
          </Text>
        </View>
      ) : null}

      {saved.length > 0 ? (
        <View style={{ marginTop: spacing.section, gap: spacing.sm }}>
          <Text variant="label" color="textMuted">
            KAYITLI KONUMLAR
          </Text>
          {saved.map((row) => (
            <Row
              key={row.id}
              icon="map-marker-outline"
              title={row.region ? `${row.name}, ${row.region}` : row.name}
              isSelected={row.id === selectedId}
              onPress={() => {
                setSelectedId(row.id);
                router.back();
              }}
            />
          ))}
        </View>
      ) : null}

      <View style={{ height: spacing.xxxl }} />
    </Screen>
  );
}
