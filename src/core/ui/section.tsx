import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/core/ui/components';
import { useTheme } from '@/core/ui/theme-context';

/**
 * Ayar ekranlarının bölüm başlığı.
 *
 * Bölümler yalnızca boşlukla ayrıldığında, her biri kendi çerçeveli
 * satırlarını taşıdığı için hepsi tek bir yığın gibi görünüyordu.
 * Saç teli inceliğinde bir ayraç, kart kullanmadan sınırı belli ediyor
 * (bkz. DESIGN.md — ayrım boşlukla, gerekirse ince ayraçla).
 *
 * Üç ayar ekranı bu bileşeni paylaşıyor; ayrı ayrı kopyalanmış üç
 * sürüm zamanla ayrışıyordu.
 */
export function Section({
  title,
  description,
  children,
  /** İlk bölümde ayraç gösterilmez — üstünde ayıracak bir şey yok */
  first = false,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  first?: boolean;
}) {
  const { colors, spacing } = useTheme();

  return (
    <View
      style={{
        marginTop: first ? spacing.lg : spacing.section,
        paddingTop: first ? 0 : spacing.xl,
        borderTopWidth: first ? 0 : StyleSheet.hairlineWidth,
        borderTopColor: colors.border,
        gap: spacing.md,
      }}>
      <View style={{ gap: spacing.xs }}>
        <Text variant="heading">{title}</Text>
        {description ? (
          <Text variant="caption" color="textSecondary">
            {description}
          </Text>
        ) : null}
      </View>
      {children}
    </View>
  );
}
