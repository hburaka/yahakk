import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import type { Location as LocationRow } from '@/core/db/schema';

import {
  formatCountdown,
  formatMinutes,
  spellCountdown,
  spellMinutes,
} from '@/features/prayer-times/period';
import { DailyContent } from '@/features/daily/daily-content';
import { marginFor } from '@/features/prayer-times/margins';
import {
  PRAYER_A11Y_LABELS,
  PRAYER_LABELS,
  PRAYER_ORDER,
  type PrayerKey,
} from '@/features/prayer-times/types';
import { useDaySchedule } from '@/features/prayer-times/use-day-schedule';
import { usePeriodPalette } from '@/features/prayer-times/use-period-palette';
import { Screen, Text } from '@/core/ui/components';
import { MIN_TOUCH_TARGET } from '@/core/ui/theme';
import { useTheme } from '@/core/ui/theme-context';

const RAIL_COLUMN_WIDTH = 26;
const RAIL_WIDTH = 2;

/** Vakitlerin tarife üzerindeki durumu — renk tek başına bilgi taşımaz */
type RowState = 'past' | 'next' | 'upcoming';

function TimetableRow({
  prayerKey,
  minutes,
  state,
  isFirst,
  isLast,
  marginMinutes,
}: {
  prayerKey: PrayerKey;
  minutes: number;
  state: RowState;
  isFirst: boolean;
  isLast: boolean;
  /** Bu vakte uygulanmış işaretli ihtiyat payı; 0 ise rozet gösterilmez */
  marginMinutes: number;
}) {
  const { colors, spacing } = useTheme();
  const period = usePeriodPalette();

  const isNext = state === 'next';
  const textColor =
    state === 'past' ? 'textMuted' : isNext ? 'text' : 'textSecondary';

  const dotSize = isNext ? 12 : 7;

  const stateSuffix = isNext
    ? ', sıradaki vakit'
    : state === 'past'
      ? ', geçti'
      : '';

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${PRAYER_A11Y_LABELS[prayerKey]}, ${spellMinutes(minutes)}${stateSuffix}`}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: MIN_TOUCH_TARGET,
        borderRadius: 10,
        backgroundColor: isNext ? period.accentSoft : 'transparent',
        paddingRight: spacing.md,
      }}>
      <View
        style={{
          width: RAIL_COLUMN_WIDTH,
          alignSelf: 'stretch',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            position: 'absolute',
            width: RAIL_WIDTH,
            backgroundColor: colors.border,
            top: isFirst ? '50%' : 0,
            bottom: isLast ? '50%' : 0,
          }}
        />
        <View
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: isNext ? period.accent : colors.borderStrong,
            // Nokta rayın üzerine biniyor; zemin renginde bir halka
            // olmadan çizgi noktanın içinden geçiyormuş gibi duruyor.
            borderWidth: 3,
            borderColor: colors.background,
          }}
        />
      </View>

      <Text
        variant={isNext ? 'bodyStrong' : 'body'}
        color={textColor}
        style={{ flex: 1, paddingLeft: spacing.sm }}>
        {PRAYER_LABELS[prayerKey]}
      </Text>

      {/* İhtiyat payı gizlenmez: kullanıcı gördüğü saatin hesaplanan
          vakit mi yoksa kendi eklediği pay mı olduğunu bilmeli.
          İmsak geriye, akşam ileriye kaydığı için işaret de gösteriliyor. */}
      {marginMinutes !== 0 ? (
        <Text
          variant="label"
          color="textMuted"
          style={{ marginRight: spacing.sm }}>
          {marginMinutes > 0 ? '+' : '−'}
          {Math.abs(marginMinutes)} dk
        </Text>
      ) : null}

      <Text variant="time" color={textColor}>
        {formatMinutes(minutes)}
      </Text>
    </View>
  );
}

function LocationHeader({ location }: { location: LocationRow }) {
  const { colors, spacing } = useTheme();
  const label = location.region
    ? `${location.name}, ${location.region}`
    : location.name;

  return (
    <Link href="/konum-sec" asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Konum: ${label}. Değiştirmek için dokunun.`}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          gap: spacing.xs,
          minHeight: MIN_TOUCH_TARGET,
          opacity: pressed ? 0.6 : 1,
        })}>
      <MaterialCommunityIcons
        name="map-marker-outline"
        size={18}
        color={colors.textSecondary}
      />
      <Text variant="body" color="textSecondary">
        {label}
      </Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={18}
          color={colors.textMuted}
        />
      </Pressable>
    </Link>
  );
}

/**
 * Konum yoksa ekran boş kalmaz. Konum izni bir kolaylık, zorunluluk
 * değil — kullanıcı reddettiyse elle seçim yolu açık kalmalı.
 */
function NeedsLocation({ reason }: { reason: 'denied' | 'unavailable' }) {
  const { colors, spacing, radii } = useTheme();

  return (
    <Screen scroll>
      <View style={{ marginTop: spacing.xxl, gap: spacing.md }}>
        <MaterialCommunityIcons
          name="map-marker-question-outline"
          size={32}
          color={colors.textSecondary}
        />
        <Text variant="title">Konum gerekiyor</Text>
        <Text variant="body" color="textSecondary">
          {reason === 'denied'
            ? 'Namaz vakitleri bulunduğunuz yere göre hesaplanıyor. Konum iznini açabilir ya da şehrinizi elle seçebilirsiniz.'
            : 'Konumunuz alınamadı. Şehrinizi elle seçebilirsiniz.'}
        </Text>
        <Text variant="caption" color="textMuted">
          Konum bilginiz cihazınızda kalır, hiçbir sunucuya gönderilmez.
        </Text>

        <Link href="/konum-sec" asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Şehir seç"
            style={({ pressed }) => ({
              marginTop: spacing.md,
              alignSelf: 'flex-start',
              minHeight: MIN_TOUCH_TARGET,
              justifyContent: 'center',
              paddingHorizontal: spacing.xl,
              borderRadius: radii.pill,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: colors.borderStrong,
              backgroundColor: pressed ? colors.surfaceAlt : colors.surface,
            })}>
            <Text variant="bodyStrong">Şehir seç</Text>
          </Pressable>
        </Link>
      </View>
    </Screen>
  );
}

function formatLongDate(iso: string): string {
  const date = new Date(`${iso}T12:00:00`);
  try {
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default function VakitlerScreen() {
  const { colors, spacing } = useTheme();
  const period = usePeriodPalette();
  const state = useDaySchedule();

  if (state.status === 'loading') {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.textSecondary} />
        </View>
      </Screen>
    );
  }

  if (state.status === 'needsLocation') {
    return <NeedsLocation reason={state.reason} />;
  }

  const { location, schedule, next, remainingSeconds, margins } = state;
  const nextIndex = PRAYER_ORDER.indexOf(next.key);

  return (
    <Screen scroll>
      <LocationHeader location={location} />

      {/*
        Sıradaki vakit bloğu sola dayalı ve vakit adı geri sayımla ortak
        temel çizgide. Ortalanmış dev sayı + küçük etiket düzeni SaaS
        "hero metric" kalıbına düşüyor; tarife dili ondan kaçınıyor.
      */}
      <View
        accessible
        accessibilityRole="header"
        accessibilityLabel={`Sıradaki vakit ${PRAYER_A11Y_LABELS[next.key]}${next.isTomorrow ? ', yarın' : ''}, ${spellMinutes(next.at)}. ${spellCountdown(remainingSeconds)}`}
        style={{ marginTop: spacing.lg }}>
        <Text variant="title">
          {PRAYER_LABELS[next.key]}
          {next.isTomorrow ? (
            <Text variant="heading" color="textMuted">
              {'  yarın'}
            </Text>
          ) : null}
        </Text>

        {/*
          "kaldı" süslemek için değil, okunabilirlik için burada.
          Birimsiz haliyle "Akşam 24:30" bir saat gibi okunuyordu; hemen
          altındaki "Vakit 20:19" satırıyla birlikte iki farklı saat
          gösteriliyormuş izlenimi veriyordu. Yaşlı kullanıcı hedefli bir
          uygulamada bu, ekranın en önemli sayısının yanlış anlaşılması
          demek. Ekran okuyucu zaten "kaldı" diyordu (spellCountdown),
          gören kullanıcıya söylenmiyordu.
        */}
        <Text variant="countdown" style={{ marginTop: spacing.xs }}>
          {formatCountdown(remainingSeconds)}
          <Text variant="heading" color="textMuted">
            {'  kaldı'}
          </Text>
        </Text>

        <View
          style={{
            width: 56,
            height: 3,
            borderRadius: 2,
            backgroundColor: period.accent,
            marginTop: spacing.md,
          }}
        />

        <Text
          variant="body"
          color="textSecondary"
          style={{ marginTop: spacing.md }}>
          Vakit {formatMinutes(next.at)}
        </Text>
      </View>

      <View style={{ marginTop: spacing.section }}>
        {PRAYER_ORDER.map((key, index) => (
          <TimetableRow
            key={key}
            prayerKey={key}
            minutes={schedule.times[key]}
            state={
              index === nextIndex
                ? 'next'
                : index < nextIndex
                  ? 'past'
                  : 'upcoming'
            }
            isFirst={index === 0}
            isLast={index === PRAYER_ORDER.length - 1}
            marginMinutes={marginFor(key, margins)}
          />
        ))}
      </View>

      <View
        style={{
          marginTop: spacing.xl,
          paddingTop: spacing.md,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
          gap: spacing.xs,
        }}>
        <Text variant="caption" color="textSecondary">
          {formatLongDate(schedule.date)}
        </Text>
        {/* Kaynak şeffaf gösteriliyor: kullanıcı gördüğü vaktin resmî mi
            yoksa hesaplanmış mı olduğunu bilmeli. */}
        <Text variant="caption" color="textMuted">
          {schedule.source === 'diyanet'
            ? 'Kaynak: Diyanet İşleri Başkanlığı'
            : 'Cihazda hesaplandı'}
        </Text>
      </View>

      <View
        style={{
          marginTop: spacing.section,
          paddingTop: spacing.xl,
          marginBottom: spacing.xxxl,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
        }}>
        <DailyContent isoDate={schedule.date} />
      </View>
    </Screen>
  );
}
