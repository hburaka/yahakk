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

import { Button, IconButton } from '@/core/ui/button';
import { Screen, Text } from '@/core/ui/components';
import { MIN_TOUCH_TARGET } from '@/core/ui/theme';
import { useTheme } from '@/core/ui/theme-context';
import { usePeriodPalette } from '@/features/prayer-times/use-period-palette';
import {
  EFFECT_COLOR_VALUES,
  EFFECT_SIZE_RADIUS,
  POINT_EFFECTS,
  useTesbihAppearance,
  type TapEffect,
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

type TapPoint = { x: number; y: number; id: number };

/**
 * Dokunulan noktada çizilen efekt — su damlası veya çember.
 *
 * İkisi de aynı geometriyi kullanıyor, farkı doluluk: `ripple` dolu bir
 * daire, `halo` yalnızca kenar çizgisi. Çember daha az yer kaplıyor ve
 * arkasındaki Arapça metni örtmüyor; hızlı zikir çekenler için daha
 * sakin bir seçenek.
 *
 * Sadece `transform` ve `opacity` animasyonu var; genişlik/yükseklik
 * gibi düzen özelliklerini animate etmek her karede yeniden yerleşim
 * tetikliyor ve hızlı dokunuşta gözle görülür takılma yapıyor.
 */
function TapPointEffect({
  tap,
  effect,
  color,
  radius,
}: {
  tap: TapPoint | null;
  effect: TapEffect;
  color: string;
  radius: number;
}) {
  const progress = useSharedValue(0);
  const isHalo = effect === 'halo';

  useEffect(() => {
    if (!tap) return;
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: isHalo ? 460 : 520,
      easing: Easing.out(Easing.quad),
    });
  }, [tap, isHalo, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: (isHalo ? 0.55 : 0.35) * (1 - progress.value),
    // Çember daha küçük başlayıp daha çok büyüyor; dolu daireyle aynı
    // eğride ilerlerse ince çizgi ilk karelerde nokta gibi görünüyor.
    transform: [
      { scale: (isHalo ? 0.05 : 0.15) + progress.value * (isHalo ? 1.1 : 0.85) },
    ],
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
          ...(isHalo
            ? { borderWidth: 2, borderColor: color }
            : { backgroundColor: color }),
        },
        style,
      ]}
    />
  );
}

/**
 * Ekranın kenarından içeri doğru kısa bir parlama.
 *
 * Dokunulan noktayı işaretlemiyor, bütün ekranın "kaydettim" demesini
 * sağlıyor. Ekrana bakmadan, göz ucuyla sayanlar için: efekt nerede
 * olduğunu aramaya gerek kalmıyor.
 */
function TapGlow({ tap, color }: { tap: TapPoint | null; color: string }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!tap) return;
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: 420,
      easing: Easing.out(Easing.quad),
    });
  }, [tap, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: 0.5 * (1 - progress.value),
  }));

  if (!tap) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderWidth: 4,
          borderColor: color,
          borderRadius: 4,
        },
        style,
      ]}
    />
  );
}

/**
 * Sayının kendi hareketi — nabız veya yaylanma.
 *
 * `pulse` büyütüp küçültüyor, `bounce` aşağı indirip yerine oturtuyor.
 * İkincisi daha az dikkat çekiyor; büyüyen sayı, satır yüksekliği sabit
 * olduğu için komşu satırlara doğru taşıyormuş gibi görünüyor.
 */
function useCounterMotion(tap: TapPoint | null, effect: TapEffect) {
  const progress = useSharedValue(0);
  const active = effect === 'pulse' || effect === 'bounce';
  const isBounce = effect === 'bounce';

  useEffect(() => {
    if (!tap || !active) return;
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: isBounce ? 300 : 260,
      easing: Easing.out(Easing.quad),
    });
  }, [tap, active, isBounce, progress]);

  return useAnimatedStyle(() => {
    if (!active) return {};
    const wave = Math.sin(progress.value * Math.PI);
    return isBounce
      ? { transform: [{ translateY: 10 * wave }] }
      : { transform: [{ scale: 1 + 0.08 * wave }] };
  });
}

/**
 * Hızlı geçiş şeridi.
 *
 * Namaz sonrası tesbihat günde beş kez açılıyor; her seferinde listeye
 * girip gezmek kabul edilemez. Favoriler burada tek dokunuşla
 * değişiyor; tam liste yanındaki liste düğmesinde.
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
    Şerit = favori listesi. Başka kaynak yok.

    Tek kural olmasının sebebi: önce "favoriler + varsayılanlar" karışık
    gösteriliyordu ve kullanıcı hangisinin kendi seçimi olduğunu
    anlayamıyordu. Yıldızladığı zikir altı benzer çipin arasına karışıp
    kayboluyordu.

    İlk açılıştaki beş çip de gerçek favori kaydı (bkz.
    DEFAULT_FAVORITE_IDS) — yıldızı kaldırılınca şeritten çıkıyorlar.
    Gördüğün şey her zaman senin listen.

    Sıralama kullanım sıklığına göre değil, favoriye ekleme sırasına
    göre. Sıklık, günde beş kez aynı yere bakan biri için şeridin
    sırasını sürekli değiştirir ve kas hafızasını bozar.
  */
  const items = favoriteIds
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

  /*
    Kullanıcı bütün favorilerini kaldırabilir. Şeridi sessizce yok
    etmek yerine geri dönüş yolunu gösteriyoruz; aksi halde özellik
    kaybolmuş gibi görünür.
  */
  if (items.length === 0) {
    return (
      <View style={{ paddingHorizontal: spacing.xl }}>
        <Text variant="caption" color="textMuted">
          Favori zikriniz yok. Yandaki listeden yıldızladıklarınız burada
          görünür.
        </Text>
      </View>
    );
  }

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
  const counterStyle = useCounterMotion(tap, appearance.tapEffect);

  const effectColor =
    appearance.effectColor === 'period'
      ? period.accent
      : EFFECT_COLOR_VALUES[appearance.effectColor];
  const effectRadius = EFFECT_SIZE_RADIUS[appearance.effectSize];

  return (
    <Screen>
      {/*
        Ekranın üstünde yalnızca durum var, kontrol yok.

        Önce burada başlık satırı ve favori şeridi duruyordu: içeriği
        görmeden önce iki sıra kontrol geçiyordun ve tek zikirde ilk sıra
        neredeyse boştu. Bu ekranda yapılan iş "aç ve dokun"; zikri
        değiştirmek arada bir yapılan bir hazırlık. Kontroller aşağıya,
        başparmağın rahat eriştiği yere alındı — 6,7 inçlik bir telefonda
        ekranın üstü tek elle zor erişiliyor.

        Tek zikirde burası tamamen boş kalıyor ve öyle olması doğru.
      */}
      {isSet && selected.set ? (
        <View
          style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.sm }}>
          <Text variant="caption" color="textSecondary" numberOfLines={2}>
            {`${selected.set.name} · ${selected.stepIndex + 1}. adım / ${selected.totalSteps}`}
          </Text>
        </View>
      ) : null}

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
        {POINT_EFFECTS.includes(appearance.tapEffect) ? (
          <TapPointEffect
            tap={tap}
            effect={appearance.tapEffect}
            color={effectColor}
            radius={effectRadius}
          />
        ) : null}
        {appearance.tapEffect === 'glow' ? (
          <TapGlow tap={tap} color={effectColor} />
        ) : null}
        {/*
          `pointerEvents="none"` bir hatayı çözüyor: dokunuş dalgası
          sayının üzerine basıldığında sol üst köşede çıkıyordu.

          Sebebi `locationX/locationY`nin dokunulan ÖĞEYE göre ölçülmesi.
          Boş alana basınca hedef Pressable oluyor ve koordinat doğru
          geliyor; sayının üstüne basınca hedef sayı oluyor ve koordinat
          onun kendi içinde küçük bir değere düşüyor, dalga da oraya
          çiziliyordu.

          İçerik dokunuşa hiç katılmayınca hedef her zaman Pressable
          kalıyor ve koordinat tutarlı oluyor. Bu blokta tıklanabilir bir
          şey zaten yok.
        */}
        <View
          pointerEvents="none"
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
            <Animated.View style={counterStyle}>
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

      {/*
        Kontrol bölgesi. Sayaç alanının dışında, tek bir ayraçla
        ayrılmış: sayarken yanlışlıkla basılmasın.

        İki sıra var ve sırası bilinçli. Üstte zikir değiştirme (oturum
        ARASINDA yapılan iş), altta geri al ve sıfırla (oturum SIRASINDA
        yapılan iş). Sık kullanılan başparmağa daha yakın.
      */}
      <View
        style={{
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            paddingRight: spacing.xl,
            paddingTop: spacing.sm,
          }}>
          <View style={{ flex: 1 }}>
            <QuickSwitcher selection={selected} favoriteIds={favorites.ids} />
          </View>
          {/*
            Burada "Değiştir" yazan geniş bir buton vardı. Yanındaki
            şerit zaten favorileri gösteriyor; bu düğmenin tek işi tam
            listeyi açmak, onu anlatmak için kelimeye gerek yok.
          */}
          <IconButton
            icon="format-list-bulleted"
            onPress={() => router.push('/zikir-sec')}
            accessibilityLabel="Tüm zikirler; favorileri buradan düzenleyin"
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: spacing.md,
            paddingTop: spacing.sm,
            paddingBottom: spacing.lg,
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

          <IconButton
            icon="chart-timeline-variant"
            onPress={() => router.push('/tesbih-rapor')}
            accessibilityLabel="Tesbihat raporu ve istatistikler"
          />

          <Button
            variant="quiet"
            icon="refresh"
            label="Sıfırla"
            onPress={counter.reset}
            disabled={counter.count === 0}
          />
        </View>
      </View>
    </Screen>
  );
}
