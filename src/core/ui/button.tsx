import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/core/ui/components';
import { MIN_TOUCH_TARGET } from '@/core/ui/theme';
import { useTheme } from '@/core/ui/theme-context';

/**
 * Uygulamanın tek buton dili.
 *
 * Neden var: bu bileşen yazılmadan önce projede on ayrı buton muamelesi
 * vardı. Kimi çerçeveli kimi çerçevesiz, kimi yüzey renkli kimi şeffaf,
 * kimi soluk metinli. En kötüsü tesbih ekranının üst düğmeleriydi:
 * çerçevesiz, şeffaf ve `textSecondary` renkli oldukları için ekrandaki
 * açıklama yazılarından ayırt edilemiyorlardı.
 *
 * Üç seviye var, üçü de bilinçli olarak az:
 *
 * - `primary`  — ekranın asıl eylemi. Mürekkep dolgulu, yazı ters renkte.
 * - `secondary` — varsayılan. Saç teli çerçeve + yüzey rengi.
 * - `quiet`    — yoğun bir bağlamda tekrarlayan yardımcı eylemler.
 *   Çerçevesi yok ama **arka planı var**; şeffaf bırakılırsa yine
 *   metinden ayırt edilemez hale gelir.
 *
 * ## Neden birincil buton vakit rengiyle dolu değil
 *
 * DESIGN.md metin renklerinin her zaman nötr eksenden gelmesini şart
 * koşuyor, böylece kontrast oranı günün vaktinden bağımsız olarak AAA
 * kalıyor. Vakit rengini zemin yapıp üstüne yazı koymak bu garantiyi
 * bozardı: sabah soluk altın, gece lacivert — aynı yazı bir vakitte
 * okunur, diğerinde okunmaz olurdu. Bu yüzden dolgu mürekkep ekseninden
 * geliyor; vakit rengi seçili durumu göstermeye ayrılmış durumda
 * (bkz. `options.tsx`).
 */

export type ButtonVariant = 'primary' | 'secondary' | 'quiet';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  /** Etiketin solunda görünür */
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  /** Etiketin sağında görünür — genelde chevron */
  trailingIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  disabled?: boolean;
  /** İşlem sürüyor: etiket kalır, sağda dönen gösterge belirir */
  busy?: boolean;
  /** Satırın tamamını kaplasın mı; varsayılan içeriği kadar geniştir */
  fullWidth?: boolean;
  accessibilityLabel?: string;
};

export function Button({
  label,
  onPress,
  variant = 'secondary',
  icon,
  trailingIcon,
  disabled = false,
  busy = false,
  fullWidth = false,
  accessibilityLabel,
}: ButtonProps) {
  const { colors, spacing, radii } = useTheme();

  const isPrimary = variant === 'primary';
  const contentColor = isPrimary ? colors.background : colors.text;
  const iconColor = isPrimary ? colors.background : colors.textSecondary;

  const surface = (pressed: boolean) => {
    if (isPrimary) return pressed ? colors.textSecondary : colors.text;
    if (variant === 'quiet') return pressed ? colors.border : colors.surfaceAlt;
    return pressed ? colors.surfaceAlt : colors.surface;
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || busy}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: disabled || busy, busy }}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        alignSelf: fullWidth ? 'stretch' : 'flex-start',
        minHeight: MIN_TOUCH_TARGET,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: radii.pill,
        borderWidth: variant === 'secondary' ? StyleSheet.hairlineWidth : 0,
        borderColor: colors.borderStrong,
        backgroundColor: surface(pressed),
        opacity: disabled ? 0.4 : 1,
      })}>
      {icon ? (
        <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
      ) : null}
      {/*
        `flexShrink` ve tek satır sınırı bilinçli. Uzun etiketler (şehir
        adları gibi) sarmalayınca ikon, metin ve ok alt alta düşüp buton
        üç satıra yayılıyordu. Buton tek satırlık bir kontroldür;
        sığmayan etiket üç noktayla kısalır, sessizce kaybolmaz.
      */}
      <Text
        variant="button"
        numberOfLines={1}
        style={{ color: contentColor, flexShrink: 1 }}>
        {label}
      </Text>
      {busy ? (
        <ActivityIndicator size="small" color={contentColor} />
      ) : trailingIcon ? (
        <MaterialCommunityIcons
          name={trailingIcon}
          size={20}
          color={iconColor}
        />
      ) : null}
    </Pressable>
  );
}

/**
 * Yan yana duran buton grubu. Aralarındaki boşluğu ve sarmalamayı tek
 * yerden tutar; her ekranın kendi flex satırını kurması sonucu butonlar
 * arası mesafe ekrandan ekrana değişiyordu.
 */
export function ButtonRow({ children }: { children: React.ReactNode }) {
  const { spacing } = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: spacing.sm,
      }}>
      {children}
    </View>
  );
}
