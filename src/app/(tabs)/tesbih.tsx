import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useKeepAwake } from 'expo-keep-awake';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Button } from '@/core/ui/button';
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

  /*
    Şerit: önce favoriler, sonra varsayılanlar — hiçbir şey kaybolmadan.

    Önce "favori varsa yalnızca favoriler" mantığı vardı. Tek bir zikri
    yıldızlamak, şeritteki her şeyi (namaz tesbihatı dahil) siliyordu;
    kullanıcı bir şey kazandığını sanırken erişimini kaybediyordu.

    Sıralama kullanım sıklığına göre değil. Sıklık, günde beş kez aynı
    yere bakan biri için şeridin sırasını sürekli değiştirir ve kas
    hafızasını bozar. Kullanıcı neyin nerede duracağına yıldızla kendisi
    karar veriyor.
  */
  const source = useMemo(() => {
    const defaults = [
      ...ZIKIR_SETS.map((set) => `s:${set.id}`),
      ...QUICK_TEMPLATE_IDS.map((id) => `t:${id}`),
    ];
    const seen = new Set(favoriteIds);
    return [...favoriteIds, ...defaults.filter((id) => !seen.has(id))];
  }, [favoriteIds]);

  const items = source
    .map((id) => {
      if (id.startsWith('s:')) {
        const set = ZIKIR_SETS.find((item) => item.id === id.slice(2));
        if (!set) return null;
        return {
          key: id,
          label: set.shortName,
          isSet: true,
          isSelected: selection.set?.id === set.id,
          onPress: () => selection.selectSet(set.id),
        };
      }

      const template = getZikirTemplate(id.slice(2));
      if (!template) return null;
      return {
        key: id,
        label: template.shortName,
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
      /*
        Yatay ScrollView dikey bir flex kabın içinde varsayılan olarak
        esneyip boşta kalan yüksekliği kaplıyor; ekranın ikiye bölünmüş
        görünmesinin sebebi buydu. `flexGrow: 0` + `flexShrink: 0` bunu
        engellemeye yetiyor.

        Burada önce `height: 52` de vardı; o sabit yükseklik çipin ikinci
        satırını kırpıyordu. Sabit değer yerine alt sınır veriliyor:
        şerit kısa adlarda aynı yükseklikte duruyor, uzun adlarda
        büyüyebiliyor.
      */
      style={{ flexGrow: 0, flexShrink: 0, minHeight: QUICK_ROW_HEIGHT }}
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
            // Sabit yükseklik değil. `height: 40` iken uzun zikir adları
            // ikinci satıra kayıp o satır kırpılıyordu: "Sübhânallâhi ve
            // bihamdihî" ekranda "Sübhânallâhi ve" olarak görünüyor,
            // üstelik üç nokta da çıkmadığı için kullanıcı metnin eksik
            // olduğunu anlayamıyordu. Sistem yazı boyutu büyütüldüğünde
            // aynı sorun kısa adlarda da çıkıyordu.
            minHeight: 40,
            paddingVertical: spacing.xs,
            paddingHorizontal: spacing.lg,
            borderRadius: radii.pill,
            backgroundColor: item.isSelected
              ? period.accentSoft
              : colors.surface,
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
              backgroundColor: isSelected ? period.accentSoft : colors.surface,
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
  const router = useRouter();
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
        {/*
          Başlıkta yalnızca ekranın ortasında BULUNMAYAN bilgi durur.

          Önce burada zikrin adı ve hedefi yazıyordu; ikisi de altta
          zaten vardı. Üstelik şablonların çoğunda `name` ile
          `transliteration` birebir aynı metin, yani aynı satır ekranda
          iki kez görünüyordu. Tek zikirde başlık tamamen kalktı.

          Set seçiliyse durum farklı: setin adı ve kaçıncı adımda
          olunduğu aşağıda hiçbir yerde yok. Onlar kalıyor, gerisi
          değil.
        */}
        {isSet && selected.set ? (
          <View style={{ flex: 1 }}>
            <Text variant="bodyStrong" numberOfLines={2}>
              {selected.set.name}
            </Text>
            <Text variant="caption" color="textSecondary">
              {`${selected.stepIndex + 1}. adım / ${selected.totalSteps}`}
            </Text>
          </View>
        ) : (
          <View style={{ flex: 1 }} />
        )}
        {/* Önce çerçevesiz, şeffaf ve soluk renkli düz metindi; ekrandaki
            zikir adından ve açıklamalardan ayırt edilemiyordu. Artık
            uygulamanın ortak buton dilini kullanıyor. */}
        <Button
          label="Değiştir"
          trailingIcon="chevron-right"
          onPress={() => router.push('/zikir-sec')}
          accessibilityLabel="Zikir değiştir"
        />
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
          {/*
            `alignSelf: 'stretch'` şart. Kap `alignItems: 'center'`
            altında kaldığında genişliği en geniş çocuğuna, yani Arapça
            metne kilitleniyordu; okunuş ondan uzun olduğunda ikinci
            satıra kayıyor ve "Sübhânallâhi ve bihamdihî" ekranda
            "Sübhânallâhi ve" olarak görünüyordu. Şerit artık kullanılabilir
            genişliğin tamamını alıyor, metin kendi doğal yerinde sarıyor.
          */}
          <View style={{ alignSelf: 'stretch', gap: spacing.xs }}>
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
        {/* Sessiz seviye: sayaç ekranın asıl eylemi, bunlar yardımcı.
            Yine de arka planları var — şeffaf bırakıldıklarında ekrandaki
            açıklama yazılarından ayırt edilemiyorlardı. */}
        <Button
          variant="quiet"
          icon="undo-variant"
          label="Geri al"
          onPress={counter.undo}
          disabled={counter.count === 0}
        />

        {/*
          Rapor düğmesi ortada. Önce başlıkta duruyordu; oraya sayarken
          bakılmıyor ve salt ikon olarak dekoratif bir simge gibi
          görünüyordu. Burada iki yardımcı eylemin arasında, aynı sessiz
          seviyede duruyor. Sayaç alanının dışında kaldığı için sayarken
          yanlışlıkla basılmıyor.
        */}
        <Pressable
          onPress={() => router.push('/tesbih-rapor')}
          accessibilityRole="button"
          accessibilityLabel="Tesbihat raporu ve istatistikler"
          style={({ pressed }) => ({
            width: MIN_TOUCH_TARGET,
            height: MIN_TOUCH_TARGET,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: MIN_TOUCH_TARGET / 2,
            backgroundColor: pressed ? colors.border : colors.surfaceAlt,
          })}>
          <MaterialCommunityIcons
            name="chart-timeline-variant"
            size={22}
            color={colors.textSecondary}
          />
        </Pressable>

        <Button
          variant="quiet"
          icon="refresh"
          label="Sıfırla"
          onPress={counter.reset}
          disabled={counter.count === 0}
        />
      </View>
    </Screen>
  );
}
