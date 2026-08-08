import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Screen, Text } from '@/core/ui/components';
import { ChoiceChips } from '@/core/ui/options';
import { Section } from '@/core/ui/section';
import { useTheme } from '@/core/ui/theme-context';
import { usePeriodPalette } from '@/features/prayer-times/use-period-palette';
import {
  EFFECT_COLOR_LABELS,
  EFFECT_COLOR_VALUES,
  EFFECT_SIZE_LABELS,
  EFFECT_SIZE_RADIUS,
  HAPTIC_LABELS,
  TAP_EFFECT_HINTS,
  TAP_EFFECT_LABELS,
  tapHaptic,
  useTesbihAppearance,
  type EffectColor,
  type EffectSize,
  type HapticStrength,
  type TapEffect,
} from '@/features/tesbih/appearance';

const PREVIEW_HEIGHT = 190;


export default function TesbihGorunumScreen() {
  const { colors, spacing, radii } = useTheme();
  const period = usePeriodPalette();
  const { appearance, update } = useTesbihAppearance();

  const [tap, setTap] = useState<{ x: number; y: number; id: number } | null>(
    null
  );
  const ripple = useSharedValue(0);
  const pulse = useSharedValue(0);

  const color =
    appearance.effectColor === 'period'
      ? period.accent
      : EFFECT_COLOR_VALUES[appearance.effectColor];
  const radius = EFFECT_SIZE_RADIUS[appearance.effectSize];

  const rippleStyle = useAnimatedStyle(() => ({
    opacity: 0.35 * (1 - ripple.value),
    transform: [{ scale: 0.15 + ripple.value * 0.85 }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + 0.08 * Math.sin(pulse.value * Math.PI) }],
  }));

  return (
    <Screen scroll edges={{ top: false }}>
      {/* Ayarları okuyarak değil, dokunarak seçmek gerekiyor —
          "su damlası" ile "nabız" arasındaki fark ancak hissedilir. */}
      <Text
        variant="label"
        color="textMuted"
        style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
        DENEMEK İÇİN DOKUNUN
      </Text>

      <Pressable
        onPress={(event) => {
          const { locationX, locationY } = event.nativeEvent;
          setTap({ x: locationX, y: locationY, id: (tap?.id ?? 0) + 1 });
          tapHaptic(appearance.hapticStrength);

          if (appearance.tapEffect === 'ripple') {
            ripple.value = 0;
            ripple.value = withTiming(1, {
              duration: 520,
              easing: Easing.out(Easing.quad),
            });
          } else if (appearance.tapEffect === 'pulse') {
            pulse.value = 0;
            pulse.value = withTiming(1, {
              duration: 260,
              easing: Easing.out(Easing.quad),
            });
          }
        }}
        accessibilityRole="button"
        accessibilityLabel="Dokunuş efektini dene"
        style={{
          height: PREVIEW_HEIGHT,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: radii.lg,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          overflow: 'hidden',
        }}>
        {appearance.tapEffect === 'ripple' && tap ? (
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
              rippleStyle,
            ]}
          />
        ) : null}
        <Animated.View style={pulseStyle}>
          <Text variant="countdown" style={{ fontSize: 72, lineHeight: 78 }}>
            33
          </Text>
        </Animated.View>
      </Pressable>

      <Section
        first
        title="Dokunuş efekti"
        description={TAP_EFFECT_HINTS[appearance.tapEffect]}>
        <ChoiceChips<TapEffect>
          options={(Object.keys(TAP_EFFECT_LABELS) as TapEffect[]).map(
            (value) => ({ value, label: TAP_EFFECT_LABELS[value] })
          )}
          selected={appearance.tapEffect}
          onSelect={(tapEffect) => update({ tapEffect })}
        />
      </Section>

      {appearance.tapEffect === 'ripple' ? (
        <>
          <Section
            title="Renk"
            description="Vakit rengi, günün hangi vaktinde olduğunuza göre kendiliğinden değişir.">
            <ChoiceChips<EffectColor>
              options={(Object.keys(EFFECT_COLOR_LABELS) as EffectColor[]).map(
                (value) => ({ value, label: EFFECT_COLOR_LABELS[value] })
              )}
              selected={appearance.effectColor}
              onSelect={(effectColor) => update({ effectColor })}
            />
          </Section>

          <Section title="Boyut">
            <ChoiceChips<EffectSize>
              options={(Object.keys(EFFECT_SIZE_LABELS) as EffectSize[]).map(
                (value) => ({ value, label: EFFECT_SIZE_LABELS[value] })
              )}
              selected={appearance.effectSize}
              onSelect={(effectSize) => update({ effectSize })}
            />
          </Section>
        </>
      ) : null}

      <Section
        title="Titreşim"
        description="Yalnızca normal dokunuşu etkiler. Her 100'de gelen ve hedefe ulaşınca gelen titreşimler her zaman belirgin kalır — onlar geri bildirim değil, bilgi.">
        <ChoiceChips<HapticStrength>
          options={(Object.keys(HAPTIC_LABELS) as HapticStrength[]).map(
            (value) => ({ value, label: HAPTIC_LABELS[value] })
          )}
          selected={appearance.hapticStrength}
          onSelect={(hapticStrength) => update({ hapticStrength })}
        />
      </Section>

      <View style={{ height: spacing.xxxl }} />
    </Screen>
  );
}
