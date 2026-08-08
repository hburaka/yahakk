import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Screen, Text } from '@/core/ui/components';
import { useTheme } from '@/core/ui/theme-context';
import { describeDirection } from '@/features/qibla/bearing';
import { useQibla } from '@/features/qibla/use-qibla';
import { usePeriodPalette } from '@/features/prayer-times/use-period-palette';

const DIAL_SIZE = 276;
const RING_WIDTH = 1.5;
const TICK_COUNT = 12;

/** Kadranın dönen kısmı: yön çentikleri ve kıble işareti */
function Dial({
  heading,
  bearing,
  isAligned,
  isTrusted,
}: {
  heading: number;
  bearing: number;
  isAligned: boolean;
  isTrusted: boolean;
}) {
  const { colors } = useTheme();
  const period = usePeriodPalette();
  const rotation = useSharedValue(0);

  useEffect(() => {
    // 359° → 1° geçişinde ibrenin uzun yoldan dönmemesi için açıyı
    // sarmalamadan, en yakın eşdeğer değere taşıyoruz.
    //
    // Süre kısa tutuldu: sensör saniyede onlarca güncelleme yolluyor ve
    // uzun bir animasyon bir sonraki güncelleme gelmeden bitemiyor.
    // Sonuç, ibrenin sürekli geride sürüklenmesi oluyordu. Titreme
    // zaten kancadaki alçak geçiren filtrede kesiliyor.
    const current = rotation.value;
    const shortest = ((-heading - current + 540) % 360) - 180;
    rotation.value = withTiming(current + shortest, {
      duration: 70,
      easing: Easing.linear,
    });
  }, [heading, rotation]);

  const dialStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const markerColor = isTrusted ? period.accent : colors.borderStrong;

  return (
    <Animated.View
      style={[
        {
          width: DIAL_SIZE,
          height: DIAL_SIZE,
          borderRadius: DIAL_SIZE / 2,
          borderWidth: RING_WIDTH,
          borderColor: colors.border,
          alignItems: 'center',
          justifyContent: 'center',
        },
        dialStyle,
      ]}>
      {Array.from({ length: TICK_COUNT }, (_, index) => {
        const isCardinal = index % 3 === 0;
        return (
          <View
            key={index}
            style={{
              position: 'absolute',
              width: DIAL_SIZE,
              height: DIAL_SIZE,
              alignItems: 'center',
              transform: [{ rotate: `${index * (360 / TICK_COUNT)}deg` }],
            }}>
            <View
              style={{
                width: isCardinal ? 2 : 1,
                height: isCardinal ? 14 : 8,
                marginTop: 10,
                backgroundColor: isCardinal
                  ? colors.borderStrong
                  : colors.border,
              }}
            />
          </View>
        );
      })}

      {/* Kıble işareti — kadranın üzerinde bearing açısında duruyor */}
      <View
        style={{
          position: 'absolute',
          width: DIAL_SIZE,
          height: DIAL_SIZE,
          alignItems: 'center',
          transform: [{ rotate: `${bearing}deg` }],
        }}>
        <View
          style={{
            width: isAligned ? 18 : 13,
            height: isAligned ? 18 : 13,
            borderRadius: 10,
            marginTop: isAligned ? 24 : 27,
            backgroundColor: markerColor,
          }}
        />
        <View
          style={{
            width: 2,
            flex: 1,
            marginBottom: DIAL_SIZE / 2,
            backgroundColor: markerColor,
            opacity: isTrusted ? 1 : 0.5,
          }}
        />
      </View>
    </Animated.View>
  );
}

function CalibrationNotice() {
  const { colors, spacing } = useTheme();
  return (
    <View style={{ alignItems: 'center', gap: spacing.sm, maxWidth: 300 }}>
      <MaterialCommunityIcons
        name="rotate-3d-variant"
        size={30}
        color={colors.textSecondary}
      />
      <Text variant="heading" style={{ textAlign: 'center' }}>
        Pusula kalibrasyon istiyor
      </Text>
      <Text variant="body" color="textSecondary" style={{ textAlign: 'center' }}>
        Telefonu havada birkaç kez sekiz çizer gibi çevirin. Metal masa,
        hoparlör ve manyetik telefon tutucularından uzaklaşın.
      </Text>
      <Text variant="caption" color="textMuted" style={{ textAlign: 'center' }}>
        Yön, güvenilir olana kadar gösterilmiyor.
      </Text>
    </View>
  );
}

function Unavailable({ title, detail }: { title: string; detail: string }) {
  const { colors, spacing } = useTheme();
  return (
    <View style={{ alignItems: 'center', gap: spacing.sm, maxWidth: 300 }}>
      <MaterialCommunityIcons
        name="compass-off-outline"
        size={30}
        color={colors.textSecondary}
      />
      <Text variant="heading" style={{ textAlign: 'center' }}>
        {title}
      </Text>
      <Text variant="body" color="textSecondary" style={{ textAlign: 'center' }}>
        {detail}
      </Text>
    </View>
  );
}

export default function KibleScreen() {
  const { colors, spacing } = useTheme();
  const period = usePeriodPalette();
  const state = useQibla();

  const wasAligned = useRef(false);
  const isAligned = state.status === 'ready' && state.isAligned;

  useEffect(() => {
    if (isAligned && !wasAligned.current) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    wasAligned.current = isAligned;
  }, [isAligned]);

  /**
   * Ekran okuyucu her 60 ms'de bir konuşamaz. Açıyı 10 derecelik
   * kovalara yuvarlayıp etiketi seyrek değiştiriyoruz; görme engelli
   * kullanıcı dönen bir ibreyi takip edemez, sözel yönlendirme
   * tek erişim yolu.
   */
  const spokenDirection = useMemo(() => {
    if (state.status !== 'ready') return undefined;
    return describeDirection(Math.round(state.delta / 10) * 10);
  }, [state]);

  const centered = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.xxl,
  } as const;

  if (state.status === 'noPermission' || state.status === 'noSensor') {
    return (
      <Screen>
        <View style={centered}>
          {state.status === 'noPermission' ? (
            <Unavailable
              title="Konum izni gerekiyor"
              detail="Kıble yönü bulunduğunuz noktaya göre hesaplanıyor. Konum bilginiz cihazınızdan çıkmaz."
            />
          ) : (
            <Unavailable
              title="Bu cihazda pusula yok"
              detail="Kıble açısını bir pusulayla bulmanız gerekiyor. Açıyı hesaplayabilmemiz için konum izni yeterli."
            />
          )}
        </View>
      </Screen>
    );
  }

  const isReady = state.status === 'ready';

  return (
    <Screen>
      <View style={centered}>
        <View
          accessible
          accessibilityRole="image"
          accessibilityLabel={
            isReady
              ? `Kıble pusulası. ${spokenDirection}`
              : 'Kıble pusulası. Yön henüz gösterilmiyor.'
          }
          accessibilityLiveRegion="polite"
          style={{ alignItems: 'center' }}>
          {/* Sabit tepe işaretçisi — kullanıcı kıble işaretini buraya getirir */}
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: 7,
              borderRightWidth: 7,
              borderTopWidth: 10,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderTopColor: isAligned ? period.accent : colors.textMuted,
              marginBottom: spacing.sm,
            }}
          />

          <View
            style={{
              borderRadius: (DIAL_SIZE + 28) / 2,
              padding: 14,
              backgroundColor: isAligned ? period.accentSoft : 'transparent',
            }}>
            <Dial
              heading={isReady ? state.heading : 0}
              bearing={isReady ? state.bearing : 0}
              isAligned={isAligned}
              isTrusted={isReady}
            />
          </View>
        </View>

        {state.status === 'ready' ? (
          <View style={{ alignItems: 'center', gap: spacing.xs }}>
            <Text variant="display">{Math.round(state.bearing)}°</Text>
            <Text variant="body" color="textSecondary">
              {state.isAligned
                ? 'Kıble yönündesiniz'
                : describeDirection(state.delta)}
            </Text>
          </View>
        ) : state.status === 'calibrating' ? (
          <CalibrationNotice />
        ) : (
          <Text variant="body" color="textSecondary">
            Konum alınıyor…
          </Text>
        )}
      </View>

      {state.status === 'ready' ? (
        <View
          style={{
            paddingHorizontal: spacing.xl,
            paddingBottom: spacing.lg,
            paddingTop: spacing.md,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: colors.border,
            gap: spacing.xs,
          }}>
          <Text variant="caption" color="textSecondary">
            Kâbe {Math.round(state.distanceKm).toLocaleString('tr-TR')} km uzakta
          </Text>
          <Text variant="caption" color="textMuted">
            Yön gerçek kuzeye göredir, manyetik sapma düzeltilmiştir.
          </Text>
        </View>
      ) : null}
    </Screen>
  );
}
