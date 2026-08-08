import { StyleSheet, View } from 'react-native';

import { Text } from '@/core/ui/components';
import { useTheme } from '@/core/ui/theme-context';
import { usePeriodPalette } from '@/features/prayer-times/use-period-palette';

import { GRADE_LABELS, hadithForDay, verseForDay } from './data';

/**
 * Günün âyeti ve hadisi.
 *
 * Ana ekranda geri sayımın ve tarifenin **altında** duruyor. Ekranın
 * ilkesi "cevap en büyük şeydir" (PRODUCT.md); günde 5-15 kez üç
 * saniyeliğine açılan bir ekranda okuma metni yukarıda olsaydı asıl
 * soruyla yarışırdı. Buraya bilerek gelen kullanıcı görüyor.
 *
 * Metin boyutu kullanıcının okuma ayarını takip ediyor (`scalable`).
 */
export function DailyContent({ isoDate }: { isoDate: string }) {
  const { colors, spacing } = useTheme();
  const period = usePeriodPalette();

  const verse = verseForDay(isoDate);
  const hadith = hadithForDay(isoDate);

  return (
    <View style={{ gap: spacing.section }}>
      <View
        accessible
        accessibilityRole="text"
        accessibilityLabel={`Günün âyeti. ${verse.meaning} ${verse.surah} sûresi ${verse.reference}`}
        style={{ gap: spacing.sm }}>
        <Text variant="label" color="textMuted">
          GÜNÜN ÂYETİ
        </Text>
        <Text variant="arabic" style={{ textAlign: 'right' }}>
          {verse.arabic}
        </Text>
        <Text variant="body" scalable>
          {verse.meaning}
        </Text>
        <Text variant="caption" color="textSecondary">
          {verse.surah} sûresi, {verse.reference}
        </Text>
      </View>

      <View
        accessible
        accessibilityRole="text"
        accessibilityLabel={`Günün hadisi. ${hadith.text} ${hadith.source}, ${GRADE_LABELS[hadith.grade]}`}
        style={{ gap: spacing.sm }}>
        <Text variant="label" color="textMuted">
          GÜNÜN HADİSİ
        </Text>
        {hadith.arabic ? (
          <Text variant="arabic" style={{ textAlign: 'right' }}>
            {hadith.arabic}
          </Text>
        ) : null}
        <Text variant="body" scalable>
          {hadith.text}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            flexWrap: 'wrap',
          }}>
          <Text variant="caption" color="textSecondary" style={{ flexShrink: 1 }}>
            {hadith.source}
          </Text>
          {/*
            Sıhhat derecesi kaynakla birlikte her zaman görünür.
            Derecesi belirtilmemiş bir rivayeti sahihmiş gibi sunmak,
            bu alandaki en ağır hatalardan biri.
          */}
          <View
            style={{
              paddingHorizontal: spacing.sm,
              paddingVertical: 2,
              borderRadius: 4,
              backgroundColor: period.accentSoft,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: colors.border,
            }}>
            <Text variant="label" color="textSecondary">
              {GRADE_LABELS[hadith.grade]}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
