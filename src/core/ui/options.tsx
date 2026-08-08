import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/core/ui/components';
import { MIN_TOUCH_TARGET } from '@/core/ui/theme';
import { useTheme } from '@/core/ui/theme-context';
import { usePeriodPalette } from '@/features/prayer-times/use-period-palette';

/**
 * Ayar ekranlarının ortak seçim bileşenleri.
 *
 * Buraya çıkarılmalarının sebebi: aynı radyo satırı ve aynı hap düğmesi
 * dört ayrı ekranda kopyalanmıştı ve zamanla birbirinden ayrıştı. Kimi
 * çerçeveliydi kimi değil, kimi basılınca tepki veriyordu kimi vermiyordu.
 * Sonuçta kullanıcı aynı ekranda bazı satırları dokunulabilir sanıyor,
 * bazılarını düz yazı sanıyordu.
 *
 * Ortak kural: **seçilmemiş bir seçenek de dokunulabilir göründüğünü
 * belli eder.** Yani çerçevesi ve yüzey rengi vardır, şeffaf değildir.
 * Yalnızca seçili olan vakit rengiyle ayrışır.
 */

export type Option<T extends string> = {
  value: T;
  label: string;
  hint?: string;
};

/**
 * Dikey radyo listesi. Seçeneğin bir açıklaması varsa (hint) veya
 * seçenekler uzunsa bunu kullan.
 */
export function OptionGroup<T extends string>({
  options,
  selected,
  onSelect,
  labelFor,
}: {
  options: readonly Option<T>[];
  selected: T;
  onSelect: (value: T) => void;
  /** Ekran okuyucu etiketi; verilmezse etiket ve ipucu birleştirilir */
  labelFor?: (option: Option<T>) => string;
}) {
  const { colors, spacing, radii } = useTheme();
  const period = usePeriodPalette();

  return (
    <View accessibilityRole="radiogroup" style={{ gap: spacing.xs }}>
      {options.map((option) => {
        const isSelected = option.value === selected;
        return (
          <Pressable
            key={option.value}
            onPress={() => onSelect(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={
              labelFor?.(option) ??
              (option.hint ? `${option.label}. ${option.hint}` : option.label)
            }
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
                  : colors.surface,
            })}>
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                borderWidth: 2,
                borderColor: isSelected ? period.accent : colors.borderStrong,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {isSelected ? (
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: period.accent,
                  }}
                />
              ) : null}
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodyStrong">{option.label}</Text>
              {option.hint ? (
                <Text variant="caption" color="textSecondary">
                  {option.hint}
                </Text>
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

/**
 * Yatay hap düğmeleri. Seçenekler kısa ve az sayıdaysa (boyut, renk,
 * titreşim gibi) satır satır liste yerine bunu kullan.
 */
export function ChoiceChips<T extends string>({
  options,
  selected,
  onSelect,
  labelFor,
}: {
  options: readonly Option<T>[];
  selected: T;
  onSelect: (value: T) => void;
  labelFor?: (option: Option<T>) => string;
}) {
  const { colors, spacing, radii } = useTheme();
  const period = usePeriodPalette();

  return (
    <View
      accessibilityRole="radiogroup"
      style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
      {options.map((option) => {
        const isSelected = option.value === selected;
        return (
          <Pressable
            key={option.value}
            onPress={() => onSelect(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={labelFor?.(option) ?? option.label}
            style={({ pressed }) => ({
              minHeight: MIN_TOUCH_TARGET,
              justifyContent: 'center',
              paddingHorizontal: spacing.lg,
              borderRadius: radii.pill,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: isSelected ? period.accent : colors.border,
              backgroundColor: isSelected
                ? period.accentSoft
                : pressed
                  ? colors.surfaceAlt
                  : colors.surface,
            })}>
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

/**
 * Tek başına duran, dokunulabilir kart. Bir ayara veya alt ekrana
 * götüren satırlar ile eylem düğmeleri bunu kullanır — böylece seçim
 * satırlarıyla aynı dilde görünürler.
 */
export function OptionCard({
  onPress,
  disabled,
  children,
  accessibilityLabel,
  accessibilityRole = 'button',
}: {
  onPress: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  accessibilityLabel: string;
  accessibilityRole?: 'button' | 'link';
}) {
  const { colors, spacing, radii } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        minHeight: MIN_TOUCH_TARGET,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: radii.md,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
        backgroundColor: pressed ? colors.surfaceAlt : colors.surface,
        opacity: disabled ? 0.5 : 1,
      })}>
      {children}
    </Pressable>
  );
}
