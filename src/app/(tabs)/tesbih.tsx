import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useKeepAwake } from 'expo-keep-awake';
import { Link } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Screen, Text } from '@/core/ui/components';
import { MIN_TOUCH_TARGET } from '@/core/ui/theme';
import { useTheme } from '@/core/ui/theme-context';
import { usePeriodPalette } from '@/features/prayer-times/use-period-palette';
import {
  EFFECT_COLOR_VALUES,
  EFFECT_SIZE_RADIUS,
  useTesbihAppearance,
} from '@/features/tesbih/appearance';
import {
  getZikirTemplate,
  ZIKIR_SETS,
} from '@/features/tesbih/data/zikir-templates';
import {
  useCounter,
  type CounterScope,
} from '@/features/tesbih/use-counter';
import { useZikirFavorites } from '@/features/tesbih/use-zikir-favorites';
import { useZikirSelection } from '@/features/tesbih/use-zikir-selection';

const RAIL_WIDTH = 3;
/** Hızlı geçiş şeridinin sabit yüksekliği (çip 40 + nefes) */
const QUICK_ROW_HEIGHT = 52;

/** Hızlı geçiş şeridinde setlerden sonra gelen tekil zikirler */
const QUICK_TEMPLATE_IDS = [
  'tehlil',
  'estagfirullah',
  'salavat-kisa',
  'subhanallahi-ve-bihamdihi',
];

function ControlButton({
  icon,
  label,
  onPress,
  disabled,
}: {
  icon: 'undo-variant' | 'refresh';
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const { colors, spacing, radii } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        minHeight: MIN_TOUCH_TARGET,
        paddingHorizontal: spacing.lg,
        borderRadius: radii.pill,
        opacity: disabled ? 0.35 : 1,
        backgroundColor: pressed ? colors.surfaceAlt : 'transparent',
      })}>
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={colors.textSecondary}
      />
      <Text variant="bodyStrong" color="textSecondary">
        {label}
      </Text>
    </Pressable>
  );
}

type TapPoint = { x: number; y: number; id: number };

/**
 * Dokunuş dalgası — su damlası gibi, dokunulan noktadan yayılır.
 *
 * Sadece `transform` ve `opacity` animasyonu var; genişlik/yükseklik
 * gibi düzen özelliklerini animate etmek her karede yeniden yerleşim
 * tetikliyor ve hızlı dokunuşta gözle görülür takılma yapıyor.
 */
function TapRipple({
  tap,
  color,
  radius,
}: {
  tap: TapPoint | null;
  color: string;
  radius: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!tap) return;
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: 520,
      easing: Easing.out(Easing.quad),
    });
  }, [tap, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: 0.35 * (1 - progress.value),
    transform: [{ scale: 0.15 + progress.value * 0.85 }],
  }));

  if (!tap) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left: tap.x - radius,
          top: tap.y - radius,
          width: radius * 2,
          height: radius * 2,
          borderRadius: radius,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

/** Sayının kısa nabzı — dalga yerine tercih edilebiliyor */
function usePulse(tap: TapPoint | null, enabled: boolean) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!tap || !enabled) return;
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: 260,
      easing: Easing.out(Easing.quad),
    });
  }, [tap, enabled, progress]);

  return useAnimatedStyle(() => ({
    transform: [
      { scale: 1 + 0.08 * Math.sin(progress.value * Math.PI) },
    ],
  }));
}

/**
 * Hızlı geçiş şeridi.
 *
 * Namaz sonrası tesbihat günde beş kez açılıyor; her seferinde modala
 * girip liste gezmek kabul edilemez. En çok kullanılanlar burada tek
 * dokunuşla değişiyor, tam liste "Değiştir"de kalıyor.
 */
function QuickSwitcher({
  selection,
  favoriteIds,
}: {
  selection: ReturnType<typeof useZikirSelection>;
  favoriteIds: string[];
}) {
  const { colors, spacing, radii } = useTheme();
  const period = usePeriodPalette();

  // Kullanıcının favorileri varsa şerit onlardan oluşur; yoksa
  // varsayılan liste gösterilir. Boş şerit göstermek, özelliği hiç
  // keşfedilmez hale getiriyor.
  const source =
    favoriteIds.length > 0
      ? favoriteIds
      : [
          ...ZIKIR_SETS.map((set) => `s:${set.id}`),
          ...QUICK_TEMPLATE_IDS.map((id) => `t:${id}`),
        ];

  const items = source
    .map((id) => {
      if (id.startsWith('s:')) {
        const set = ZIKIR_SETS.find((item) => item.id === id.slice(2));
        if (!set) return null;
        return {
          key: id,
          label: set.name,
          isSet: true,
          isSelected: selection.set?.id === set.id,
          onPress: () => selection.selectSet(set.id),
        };
      }

      const template = getZikirTemplate(id.slice(2));
      if (!template) return null;
      return {
        key: id,
        label: template.name,
        isSet: false,
        isSelected:
          selection.kind === 'template' &&
          selection.template.id === template.id,
        onPress: () => selection.selectTemplate(template.id),
      };
    })
    .filter((item) => item !== null);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      // Yatay ScrollView dikey bir flex kabın içinde varsayılan olarak
      // esneyip boşta kalan yüksekliği kaplıyor; ekran ikiye bölünmüş
      // gibi görünmesinin sebebi buydu. Yükseklik sabitleniyor.
      style={{ flexGrow: 0, flexShrink: 0, height: QUICK_ROW_HEIGHT }}
      contentContainerStyle={{
        alignItems: 'center',
        gap: spacing.sm,
        paddingHorizontal: spacing.xl,
      }}>
      {items.map((item) => (
        <Pressable
          key={item.key}
          onPress={item.onPress}
          accessibilityRole="radio"
          accessibilityState={{ selected: item.isSelected }}
          accessibilityLabel={item.label}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.xs,
            height: 40,
            paddingHorizontal: spacing.lg,
            borderRadius: radii.pill,
            backgroundColor: item.isSelected
              ? period.accentSoft
              : 'transparent',
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: item.isSelected ? period.accent : colors.border,
          }}>
          {item.isSet ? (
            <MaterialCommunityIcons
              name="format-list-numbered"
              size={16}
              color={item.isSelected ? period.accent : colors.textMuted}
            />
          ) : null}
          <Text
            variant="caption"
            color={item.isSelected ? 'text' : 'textSecondary'}>
            {item.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

/** Sayım başlamadan önce görünen hızlı hedef seçimi */
function TargetChips({
  options,
  target,
  onSelect,
}: {
  options: readonly number[];
  target: number;
  onSelect: (value: number) => void;
}) {
  const { colors, spacing, radii } = useTheme();
  const period = usePeriodPalette();

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: spacing.sm,
      }}>
      {options.map((value) => {
        const isSelected = value === target;
        return (
          <Pressable
            key={value}
            onPress={() => onSelect(value)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`Hedef ${value}`}
            style={{
              minHeight: MIN_TOUCH_TARGET,
              minWidth: 64,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: spacing.lg,
              borderRadius: radii.pill,
              backgroundColor: isSelected ? period.accentSoft : 'transparent',
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: isSelected ? period.accent : colors.border,
            }}>
            <Text variant="bodyStrong" color={isSelected ? 'text' : 'textSecondary'}>
              {value}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TesbihScreen() {
  // 1000'lik bir zikir uzun sürüyor; ekranın kapanması sayımı bölüyor.
  useKeepAwake();

  const { colors, spacing } = useTheme();
  const period = usePeriodPalette();
  const selected = useZikirSelection();
  const favorites = useZikirFavorites();
  const template = selected.template;
  const isSet = selected.kind === 'set';

  // Kapsam: tekil zikirde şablon, sette adım. Her ikisi de kendi yarım
  // oturumunu tutuyor, o zikre/adıma dönüldüğünde kaldığı yerden devam.
  const scope: CounterScope = useMemo(
    () =>
      isSet && selected.set
        ? {
            kind: 'set',
            setId: selected.set.id,
            stepIndex: selected.stepIndex,
            templateId: template.id,
          }
        : { kind: 'template', templateId: template.id },
    [isSet, selected.set, selected.stepIndex, template.id]
  );

  /**
   * Sette adım tamamlanınca kendiliğinden sonrakine geçilir. Geçiş
   * anında ~1 saniyelik kilit var: 33'e basar basmaz sonraki zikre
   * atlarsak elin ritmi devam edip yanlışlıkla fazladan sayıyor.
   *
   * Geçiş bir efektle değil, tamamlayan dokunuşun kendisiyle
   * tetikleniyor — durum gözlemek yerine olayı yakalamak hem daha
   * doğru hem zincirleme render yaratmıyor.
   */
  const [advancing, setAdvancing] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advanceStep = selected.advanceStep;

  const handleComplete = useCallback(() => {
    if (!isSet) return;
    setAdvancing(true);
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => {
      advanceStep();
      setAdvancing(false);
    }, 900);
  }, [isSet, advanceStep]);

  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    },
    []
  );

  const counter = useCounter(scope, selected.target, handleComplete);
  const notStarted = counter.count === 0;

  const { appearance } = useTesbihAppearance();
  const [tap, setTap] = useState<TapPoint | null>(null);
  const pulseStyle = usePulse(tap, appearance.tapEffect === 'pulse');

  const effectColor =
    appearance.effectColor === 'period'
      ? period.accent
      : EFFECT_COLOR_VALUES[appearance.effectColor];
  const effectRadius = EFFECT_SIZE_RADIUS[appearance.effectSize];

  return (
    <Screen>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.sm,
          gap: spacing.md,
        }}>
        <View style={{ flex: 1 }}>
          <Text variant="bodyStrong" numberOfLines={1}>
            {isSet && selected.set ? selected.set.name : template.name}
          </Text>
          <Text variant="caption" color="textSecondary">
            {isSet
              ? `${selected.stepIndex + 1}/${selected.totalSteps} · ${template.name} · ${selected.target}`
              : `Hedef ${selected.target}`}
          </Text>
        </View>
        <Link href="/tesbih-rapor" asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tesbihat raporu"
            style={({ pressed }) => ({
              width: MIN_TOUCH_TARGET,
              height: MIN_TOUCH_TARGET,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.6 : 1,
            })}>
            <MaterialCommunityIcons
              name="chart-timeline-variant"
              size={22}
              color={colors.textSecondary}
            />
          </Pressable>
        </Link>

        <Link href="/zikir-sec" asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Zikir değiştir"
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.xs,
              minHeight: MIN_TOUCH_TARGET,
              paddingHorizontal: spacing.sm,
              opacity: pressed ? 0.6 : 1,
            })}>
            <Text variant="body" color="textSecondary">
              Değiştir
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={colors.textMuted}
            />
          </Pressable>
        </Link>
      </View>

      <QuickSwitcher selection={selected} favoriteIds={favorites.ids} />

      {/*
        Ekranın gövdesinin tamamı dokunma hedefi. Geri al ve sıfırla
        bilerek bu alanın dışında — sayarken yanlışlıkla basılırsa
        zikir baştan başlar.
      */}
      <Pressable
        onPress={(event) => {
          const { locationX, locationY } = event.nativeEvent;
          setTap((previous) => ({
            x: locationX,
            y: locationY,
            id: (previous?.id ?? 0) + 1,
          }));
          counter.increment();
        }}
        disabled={advancing}
        accessibilityRole="button"
        accessibilityLabel={`Say. ${counter.count} / ${selected.target}`}
        accessibilityHint="Zikri bir artırmak için ekrana dokunun"
        style={{ flex: 1, overflow: 'hidden' }}>
        {appearance.tapEffect === 'ripple' ? (
          <TapRipple tap={tap} color={effectColor} radius={effectRadius} />
        ) : null}
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: spacing.xl,
            gap: spacing.lg,
          }}>
          <View style={{ alignItems: 'center', gap: spacing.xs }}>
            <Text variant="arabic" style={{ textAlign: 'center' }}>
              {template.arabic}
            </Text>
            <Text
              variant="transliteration"
              color="textSecondary"
              style={{ textAlign: 'center' }}>
              {template.transliteration}
            </Text>
          </View>

          <View style={{ alignItems: 'center', gap: spacing.xs }}>
            {/* Kayıt yüklenirken 0 gösterilirse, yarım oturum gelince
                sayı zıplıyor. Yer ayrılıp boş bırakılıyor. */}
            <Animated.View style={pulseStyle}>
              <Text
                variant="countdown"
                style={{
                  fontSize: 96,
                  lineHeight: 104,
                  opacity: counter.isLoading ? 0 : 1,
                  color: counter.justHitMilestone ? period.accent : colors.text,
                }}>
                {String(counter.count)}
              </Text>
            </Animated.View>
            <Text variant="heading" color="textSecondary">
              {`${counter.count} / ${selected.target}`}
            </Text>
            {/* Kalan sayı, hedefe yaklaşırken asıl merak edilen şey */}
            {!counter.isComplete ? (
              <Text variant="caption" color="textMuted">
                {`${selected.target - counter.count} kaldı`}
              </Text>
            ) : null}
            {/* Yarım kalan zikirden devam edildiği söylenmezse kullanıcı
                sayacın sıfırlanmadığını hata sanıyor. */}
            {counter.resumed ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.xs,
                  marginTop: spacing.xs,
                }}>
                <MaterialCommunityIcons
                  name="history"
                  size={15}
                  color={colors.textMuted}
                />
                <Text variant="caption" color="textMuted">
                  Kaldığınız yerden devam
                </Text>
              </View>
            ) : null}
          </View>

          {/* Sette hedefler sabittir — 33/33/33/1 dizisinin sayıları
              setin kendisinin parçası, kullanıcı değiştiremez. */}
          {notStarted && !isSet ? (
            <TargetChips
              options={template.suggestedCounts}
              target={selected.target}
              onSelect={selected.setTarget}
            />
          ) : null}

          {counter.isComplete ? (
            <View style={{ alignItems: 'center', gap: spacing.xs }}>
              <Text variant="bodyStrong" color="success">
                {isSet && !selected.isLastStep
                  ? 'Bu adım tamam'
                  : isSet
                    ? 'Tesbihat tamamlandı'
                    : 'Hedefe ulaştınız'}
              </Text>
              {/* Sonraki zikrin adı geçişten ÖNCE gösteriliyor; kullanıcı
                  neye geçtiğini ekran değişmeden görmeli. */}
              {advancing && selected.nextTemplate ? (
                <Text variant="body" color="textSecondary">
                  {`Sıradaki: ${selected.nextTemplate.name}`}
                </Text>
              ) : null}
              {advancing && !selected.nextTemplate ? (
                <Text variant="body" color="textSecondary">
                  Baştan başlıyor
                </Text>
              ) : null}
            </View>
          ) : null}
        </View>

        {/* İlerleme rayı — sağ kenarda, aşağıdan yukarı dolar */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            right: 0,
            top: spacing.xl,
            bottom: spacing.xl,
            width: RAIL_WIDTH,
            backgroundColor: colors.border,
            borderRadius: RAIL_WIDTH,
            overflow: 'hidden',
            justifyContent: 'flex-end',
          }}>
          <View
            style={{
              width: RAIL_WIDTH,
              height: `${counter.progress * 100}%`,
              backgroundColor: period.accent,
            }}
          />
        </View>
      </Pressable>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: spacing.md,
          paddingTop: spacing.sm,
          paddingBottom: spacing.lg,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
        }}>
        <ControlButton
          icon="undo-variant"
          label="Geri al"
          onPress={counter.undo}
          disabled={counter.count === 0}
        />
        <ControlButton
          icon="refresh"
          label="Sıfırla"
          onPress={counter.reset}
          disabled={counter.count === 0}
        />
      </View>
    </Screen>
  );
}
