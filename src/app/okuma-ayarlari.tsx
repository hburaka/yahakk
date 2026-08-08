import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Screen, Text } from '@/core/ui/components';
import { ChoiceChips } from '@/core/ui/options';
import { Section } from '@/core/ui/section';
import {
  ARABIC_FONTS,
  arabicScales,
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
      /* Seçilmemiş kart da yüzey rengini taşır. Şeffaf bırakıldığında
         dokunulabilir olduğu belli olmuyordu; ekranın geri kalanıyla
         aynı zemine oturup düz metin gibi görünüyordu. */
      style={({ pressed }) => ({
        gap: spacing.xs,
        padding: spacing.md,
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
          <ChoiceChips<ReadingScale>
            options={(Object.keys(readingScales) as ReadingScale[]).map(
              (scale) => ({ value: scale, label: SCALE_LABELS[scale] })
            )}
            selected={theme.readingScale}
            onSelect={theme.setReadingScale}
            labelFor={(option) => `Türkçe metin boyutu ${option.label}`}
          />
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
          <ChoiceChips<ArabicScale>
            options={(Object.keys(arabicScales) as ArabicScale[]).map(
              (scale) => ({ value: scale, label: SCALE_LABELS[scale] })
            )}
            selected={theme.arabicScale}
            onSelect={theme.setArabicScale}
            labelFor={(option) => `Arapça metin boyutu ${option.label}`}
          />
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
