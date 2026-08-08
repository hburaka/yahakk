import {
  ScrollView,
  StyleSheet,
  Text as RNText,
  View,
  type StyleProp,
  type TextProps as RNTextProps,
  type TextStyle,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { NeutralPalette, TypographyToken } from '@/core/ui/theme';
import { useTheme } from '@/core/ui/theme-context';

/**
 * Metin renkleri yalnızca nötr eksenden ve semantik durumlardan seçilir.
 * Vakit rengi bilinçli olarak burada yok: kromatik renk hiçbir zaman
 * metnin rengi olmaz, aksi halde kontrast oranı gün içinde değişirdi.
 */
type TextColor = keyof Pick<
  NeutralPalette,
  'text' | 'textSecondary' | 'textMuted' | 'danger' | 'success' | 'warning'
>;

type TextProps = RNTextProps & {
  variant?: TypographyToken;
  color?: TextColor;
  /**
   * Kullanıcının okuma yazı boyutu tercihini uygular. Dua ve ilmihal
   * metinlerinde açık, arayüz etiketlerinde kapalı olmalı — yoksa sekme
   * etiketleri ve butonlar da büyüyüp düzeni bozuyor.
   */
  scalable?: boolean;
};

export function Text({
  variant = 'body',
  color = 'text',
  scalable = false,
  style,
  ...rest
}: TextProps) {
  const theme = useTheme();
  const token = theme.typography[variant];

  // Arapça kendi ölçeğini ve yazı tipini kullanır — Latin metinden
  // bağımsız, çünkü harekelerle birlikte aynı puntoda daha küçük okunur.
  const isArabic = variant === 'arabic';

  /*
    Okunuş her zaman okuma metnidir; arayüz etiketi olarak kullanılmaz.
    Bu yüzden `scalable` bayrağını beklemeden okuma ölçeğini alıyor.

    Önce opt-in idi ve tesbih ekranında verilmesi unutulmuştu: kullanıcı
    Okuma Ayarları'nda yazıyı büyütüyor, önizlemede büyüdüğünü görüyor,
    tesbih ekranına dönünce hiçbir şey değişmemiş oluyordu. Ayarın
    çalışmadığını sanmak, ayarın gerçekten olmamasından daha kötü.
  */
  const isReadingText = scalable || variant === 'transliteration';
  const usesReadingFont = isArabic || isReadingText;

  const factor = isArabic
    ? theme.arabicScaleFactor
    : isReadingText
      ? theme.readingScaleFactor
      : 1;

  const choice = isArabic ? theme.arabicFontChoice : theme.readingFontChoice;
  const wantsBold = Number(token.fontWeight) >= 600;
  const family = usesReadingFont
    ? wantsBold
      ? choice.bold
      : choice.regular
    : undefined;

  const computed: TextStyle = {
    fontSize: token.fontSize * factor,
    lineHeight: token.lineHeight * factor,
    color: theme.colors[color],
    // Gömülü yazı tipi seçiliyse ağırlığı fontFamily taşıyor. Ayrıca
    // fontWeight vermek Android'de sentetik kalınlaştırma yapıp harfleri
    // bulanıklaştırıyor — az gören kullanıcı için tam ters etki.
    ...(family
      ? { fontFamily: family }
      : { fontWeight: token.fontWeight as TextStyle['fontWeight'] }),
    // Saatler ve geri sayım sabit genişlikli rakam ister; orantılı
    // rakamlarla her saniye sayının genişliği değişip metin zıplıyor.
    ...(token.tabular ? { fontVariant: ['tabular-nums' as const] } : null),
  };

  return <RNText {...rest} style={[computed, style]} />;
}

type ScreenProps = ViewProps & {
  scroll?: boolean;
  edges?: { top?: boolean; bottom?: boolean };
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export function Screen({
  scroll = false,
  edges = { top: true },
  style,
  contentContainerStyle,
  children,
  ...rest
}: ScreenProps) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  const padding: ViewStyle = {
    paddingTop: edges.top ? insets.top : 0,
    paddingBottom: edges.bottom ? insets.bottom : 0,
  };

  if (scroll) {
    return (
      <ScrollView
        style={[styles.flex, { backgroundColor: colors.background }, style]}
        /*
          Güvenli alan payı ile nefes payı TEK nesnede toplanıyor.

          Önce iki ayrı stil nesnesi vardı: birincisi `paddingTop:
          insets.top`, ikincisi `paddingVertical: spacing.lg`. React
          Native'de dizideki sonraki stil kazandığı için `paddingVertical`
          `paddingTop`u tamamen siliyordu — durum çubuğu payı hiç
          uygulanmıyordu. Sonuç: her kaydırmalı ekranda başlık telefonun
          üst menüsüne yapışık başlıyordu.
        */
        contentContainerStyle={[
          {
            paddingHorizontal: spacing.xl,
            paddingTop: (edges.top ? insets.top : 0) + spacing.lg,
            paddingBottom: (edges.bottom ? insets.bottom : 0) + spacing.lg,
          },
          contentContainerStyle,
        ]}
        {...rest}>
        {children}
      </ScrollView>
    );
  }

  return (
    <View
      style={[
        styles.flex,
        { backgroundColor: colors.background },
        padding,
        style,
      ]}
      {...rest}>
      {children}
    </View>
  );
}

/**
 * Henüz yazılmamış modüller için yer tutucu. Boş ekran yerine neyin
 * geleceğini söylüyor; geliştirme sırasında hangi modülün eksik olduğu
 * tek bakışta belli oluyor.
 */
export function ComingSoon({
  title,
  description,
  phase,
}: {
  title: string;
  description: string;
  phase: string;
}) {
  const { colors, spacing } = useTheme();

  return (
    <Screen scroll>
      <Text variant="title">{title}</Text>
      <Text
        variant="body"
        color="textSecondary"
        style={{ marginTop: spacing.md }}>
        {description}
      </Text>
      <View
        style={{
          marginTop: spacing.xl,
          paddingTop: spacing.md,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
        }}>
        <Text variant="label" color="textMuted">
          {phase.toLocaleUpperCase('tr-TR')}
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
