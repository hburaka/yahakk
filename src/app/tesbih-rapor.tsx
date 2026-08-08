import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';

import { Button } from '@/core/ui/button';
import { Screen, Text } from '@/core/ui/components';
import { GroupLabel } from '@/core/ui/section';
import { useTheme } from '@/core/ui/theme-context';
import { usePeriodPalette } from '@/features/prayer-times/use-period-palette';
import {
  clearTesbihHistory,
  useTesbihStats,
  type DailyPoint,
  type ZikirBreakdownRow,
} from '@/features/tesbih/use-stats';

const CHART_HEIGHT = 96;

const tr = (value: number) => value.toLocaleString('tr-TR');

function Divider() {
  const { colors, spacing } = useTheme();
  return (
    <View
      style={{
        marginVertical: spacing.xl,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.border,
      }}
    />
  );
}

/** Ad solda, sayı sağda — tarife satırıyla aynı dil */
function StatRow({ label, value }: { label: string; value: string }) {
  const { spacing } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'baseline',
        paddingVertical: spacing.sm,
      }}>
      <Text variant="body" color="textSecondary" style={{ flex: 1 }}>
        {label}
      </Text>
      <Text variant="time">{value}</Text>
    </View>
  );
}

/**
 * Son 30 günün sütun grafiği.
 *
 * Grafik kütüphanesi kullanılmıyor: 30 ince dikey çubuk için bir
 * bağımlılık eklemek paket boyutuna değmez, ayrıca düz View'lerle
 * çizmek uygulamanın "ray" diline daha yakın duruyor.
 */
function DailyChart({ daily }: { daily: DailyPoint[] }) {
  const { colors, spacing } = useTheme();
  const period = usePeriodPalette();

  const max = Math.max(...daily.map((point) => point.total), 1);
  const first = daily[0];
  const last = daily[daily.length - 1];

  const label = (iso: string) =>
    new Date(`${iso}T12:00:00`).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
    });

  return (
    <View style={{ gap: spacing.sm }}>
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Son 30 günün grafiği. En yüksek gün ${tr(max)} zikir.`}
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: 3,
          height: CHART_HEIGHT,
        }}>
        {daily.map((point) => (
          <View
            key={point.date}
            style={{
              flex: 1,
              // Sıfır günler de görünsün: tamamen kaybolurlarsa grafik
              // hangi günlerin boş geçtiğini söylemiyor.
              height: Math.max(2, (point.total / max) * CHART_HEIGHT),
              borderRadius: 2,
              backgroundColor:
                point.total > 0 ? period.accent : colors.borderStrong,
            }}
          />
        ))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text variant="caption" color="textMuted">
          {first ? label(first.date) : ''}
        </Text>
        <Text variant="caption" color="textMuted">
          {last ? label(last.date) : ''}
        </Text>
      </View>
    </View>
  );
}

function BreakdownRow({
  row,
  max,
}: {
  row: ZikirBreakdownRow;
  max: number;
}) {
  const { colors, spacing } = useTheme();
  const period = usePeriodPalette();

  return (
    <View style={{ paddingVertical: spacing.sm, gap: spacing.xs }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
        <Text variant="body" style={{ flex: 1 }} numberOfLines={1}>
          {row.name}
        </Text>
        <Text variant="time" color="textSecondary">
          {tr(row.total)}
        </Text>
      </View>
      <View
        style={{
          height: 4,
          borderRadius: 2,
          backgroundColor: colors.surfaceAlt,
          overflow: 'hidden',
        }}>
        <View
          style={{
            width: `${(row.total / max) * 100}%`,
            height: 4,
            borderRadius: 2,
            backgroundColor: period.accent,
          }}
        />
      </View>
    </View>
  );
}

function EmptyReport() {
  const { colors, spacing } = useTheme();
  return (
    <View style={{ marginTop: spacing.xxl, gap: spacing.md }}>
      <MaterialCommunityIcons
        name="chart-timeline-variant"
        size={32}
        color={colors.textSecondary}
      />
      <Text variant="title">Henüz kayıt yok</Text>
      <Text variant="body" color="textSecondary">
        Tesbih sekmesinde zikir çekmeye başladığınızda buraya günlük
        toplamlarınız, zikir dağılımınız ve aralıksız gün seriniz gelecek.
      </Text>
      <Text variant="caption" color="textMuted">
        Bu kayıtlar yalnızca bu telefonda tutulur, hiçbir sunucuya
        gönderilmez.
      </Text>
    </View>
  );
}

export default function TesbihRaporScreen() {
  const { colors, spacing } = useTheme();
  const stats = useTesbihStats();
  const [clearing, setClearing] = useState(false);

  const { allTime, reload } = stats;

  const confirmClear = useCallback(() => {
    Alert.alert(
      'İstatistikler sıfırlansın mı?',
      `${tr(allTime)} zikirlik geçmişiniz, günlük dağılım ve seriler silinecek. Bu işlem geri alınamaz.`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Sıfırla',
          style: 'destructive',
          onPress: async () => {
            setClearing(true);
            try {
              await clearTesbihHistory();
              reload();
            } catch {
              Alert.alert(
                'Sıfırlanamadı',
                'Kayıtlar silinirken bir sorun oldu. Tekrar deneyin.'
              );
            } finally {
              setClearing(false);
            }
          },
        },
      ]
    );
  }, [allTime, reload]);

  if (stats.isLoading) {
    return (
      <Screen edges={{ top: false }}>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.textSecondary} />
        </View>
      </Screen>
    );
  }

  if (stats.allTime === 0) {
    return (
      <Screen scroll edges={{ top: false }}>
        <EmptyReport />
      </Screen>
    );
  }

  const breakdownMax = stats.breakdown[0]?.total ?? 1;

  return (
    <Screen scroll edges={{ top: false }}>
      <View style={{ marginTop: spacing.lg }}>
        <GroupLabel>Bugün</GroupLabel>
        <Text variant="countdown">{tr(stats.today)}</Text>
        <Text variant="body" color="textSecondary">
          çekilen zikir
        </Text>
      </View>

      <Divider />

      <View>
        <StatRow label="Bu hafta" value={tr(stats.week)} />
        <StatRow label="Bu ay" value={tr(stats.month)} />
        <StatRow label="Toplam" value={tr(stats.allTime)} />
      </View>

      <Divider />

      <View>
        <GroupLabel>Son 30 gün</GroupLabel>
        <DailyChart daily={stats.daily} />
      </View>

      <Divider />

      <View>
        <GroupLabel>Zikir dağılımı</GroupLabel>
        {stats.breakdown.map((row) => (
          <BreakdownRow key={row.templateId} row={row} max={breakdownMax} />
        ))}
      </View>

      <Divider />

      <View>
        <StatRow
          label="Aralıksız seri"
          value={`${tr(stats.currentStreak)} gün`}
        />
        <StatRow
          label="En uzun seri"
          value={`${tr(stats.longestStreak)} gün`}
        />
        <StatRow
          label="Tamamlanan tesbihat"
          value={tr(stats.completedSets)}
        />
      </View>

      <View
        style={{
          marginTop: spacing.xl,
          marginBottom: spacing.xxxl,
          paddingTop: spacing.md,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
          gap: spacing.xs,
        }}>
        {/* Sayım kuralı açıkça yazılıyor: kullanıcı toplamın neyi
            içerdiğini bilmeden rakama güvenemez. */}
        <Text variant="caption" color="textSecondary">
          Yarım bırakılan zikirler de toplama dahildir; hedefe ulaşmamak
          o zikrin çekilmediği anlamına gelmez.
        </Text>
        <Text variant="caption" color="textMuted">
          Kayıtlar yalnızca bu telefonda tutulur.
        </Text>

        {/*
          Sıfırlama en altta ve ikincil seviyede duruyor: rapor okumaya
          gelen kullanıcının yolunun üstünde olmamalı. Geri alınamaz bir
          işlem olduğu için onay isteniyor ve onay metninde kaç zikrin
          silineceği yazıyor — "emin misiniz?" tek başına kullanıcıya
          neyi kaybedeceğini söylemiyor.
        */}
        <View style={{ marginTop: spacing.lg }}>
          <Button
            variant="secondary"
            icon="delete-outline"
            label="İstatistikleri sıfırla"
            busy={clearing}
            onPress={confirmClear}
          />
        </View>
      </View>
    </Screen>
  );
}
