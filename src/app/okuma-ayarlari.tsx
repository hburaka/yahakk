import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Screen, Text } from '@/core/ui/components';
import { Section } from '@/core/ui/section';
import {
  ARABIC_FONTS,
  arabicScales,
  MIN_TOUCH_TARGET,
  READING_FONTS,
  readingScales,
  SCALE_LABELS,
  type ArabicFont,
  type ArabicScale,
  type FontChoice,
  type ReadingFont,
  type ReadingScale,
} from '@/core/ui/theme';
import { useTheme } from '@/core/ui/theme-context';
import { usePeriodPalette } from '@/features/prayer-times/use-period-palette';

function Chip({
  label,
  isSelected,
  onPress,
  accessibilityLabel,
}: {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  accessibilityLabel: string;
}) {
  const { colors, spacing, radii } = useTheme();
  const period = usePeriodPalette();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={accessibilityLabel}
      style={{
        minHeight: MIN_TOUCH_TARGET,
        justifyContent: 'center',
        paddingHorizontal: spacing.lg,
        borderRadius: radii.pill,
        backgroundColor: isSelected ? period.accentSoft : 'transparent',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: isSelected ? period.accent : colors.border,
      }}>
      <Text variant="bodyStrong" color={isSelected ? 'text' : 'textSecondary'}>
        {label}
      </Text>
    </Pressable>
  );
}

function FontOption({
  choice,
  isSelected,
  onPress,
  sample,
  isArabic,
}: {
  choice: FontChoice;
  isSelected: boolean;
  onPress: () => void;
  sample: string;
  isArabic: boolean;
}) {
  const { colors, spacing, radii } = useTheme();
  const period = usePeriodPalette();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`${choice.label}. ${choice.hint}`}
      style={{
        gap: spacing.xs,
        padding: spacing.md,
        borderRadius: radii.md,
        backgroundColor: isSelected ? period.accentSoft : 'transparent',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: isSelected ? period.accent : colors.border,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.md,
        }}>
        <Text variant="bodyStrong">{choice.label}</Text>
        {/* Örnek metin seçeneğin kendi yazı tipiyle çizilir — kullanıcı
            seçmeden önce farkı görür. */}
        <Text
          variant={isArabic ? 'heading' : 'body'}
          color="textSecondary"
          style={{
            fontFamily: choice.regular,
            ...(isArabic ? { fontSize: 22, lineHeight: 40 } : null),
          }}>
          {sample}
        </Text>
      </View>
      <Text variant="caption" color="textMuted">
        {choice.hint}
      </Text>
    </Pressable>
  );
}


export default function OkumaAyarlariScreen() {
  const theme = useTheme();
  const { colors, spacing } = theme;

  return (
    <Screen edges={{ top: false }}>
      {/*
        Önizleme yukarıda sabit, ayarlar altında kayıyor. Ayarı
        değiştirirken sonucunu aynı anda görmek şart — aşağı kaydırıp
        geri dönerek ayar yapmak yaşlı kullanıcı için kullanılamaz.
      */}
      <View
        style={{
          paddingHorizontal: spacing.xl,
          paddingTop: spacing.lg,
          paddingBottom: spacing.lg,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
          gap: spacing.sm,
        }}>
        <Text variant="label" color="textMuted">
          ÖNİZLEME
        </Text>
        <Text variant="arabic" style={{ textAlign: 'right' }}>
          رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً
        </Text>
        <Text variant="transliteration" scalable color="textSecondary">
          Rabbenâ âtinâ fi’d-dünyâ haseneten
        </Text>
        <Text variant="body" scalable>
          Rabbimiz! Bize dünyada iyilik ver.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.xl,
          paddingBottom: spacing.xxxl,
        }}>
        <Section
          first
          title="Türkçe metin boyutu"
          description="Okunuş, meal ve ilmihal metinlerine uygulanır. Arayüzü etkilemez.">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {(Object.keys(readingScales) as ReadingScale[]).map((scale) => (
              <Chip
                key={scale}
                label={SCALE_LABELS[scale]}
                isSelected={theme.readingScale === scale}
                onPress={() => theme.setReadingScale(scale)}
                accessibilityLabel={`Türkçe metin boyutu ${SCALE_LABELS[scale]}`}
              />
            ))}
          </View>
        </Section>

        <Section title="Türkçe yazı tipi">
          <View style={{ gap: spacing.sm }}>
            {(Object.keys(READING_FONTS) as ReadingFont[]).map((font) => (
              <FontOption
                key={font}
                choice={READING_FONTS[font]}
                isSelected={theme.readingFont === font}
                onPress={() => theme.setReadingFont(font)}
                sample="Işığın ağır"
                isArabic={false}
              />
            ))}
          </View>
        </Section>

        <Section
          title="Arapça metin boyutu"
          description="Türkçe boyutundan bağımsızdır. Arapça harekeleriyle geldiği için aynı puntoda daha küçük okunur.">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {(Object.keys(arabicScales) as ArabicScale[]).map((scale) => (
              <Chip
                key={scale}
                label={SCALE_LABELS[scale]}
                isSelected={theme.arabicScale === scale}
                onPress={() => theme.setArabicScale(scale)}
                accessibilityLabel={`Arapça metin boyutu ${SCALE_LABELS[scale]}`}
              />
            ))}
          </View>
        </Section>

        <Section title="Arapça yazı tipi">
          <View style={{ gap: spacing.sm }}>
            {(Object.keys(ARABIC_FONTS) as ArabicFont[]).map((font) => (
              <FontOption
                key={font}
                choice={ARABIC_FONTS[font]}
                isSelected={theme.arabicFont === font}
                onPress={() => theme.setArabicFont(font)}
                sample="بِسْمِ اللّٰهِ"
                isArabic
              />
            ))}
          </View>
        </Section>
      </ScrollView>
    </Screen>
  );
}
