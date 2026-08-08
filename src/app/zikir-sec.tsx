import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Screen, Text } from '@/core/ui/components';
import { MIN_TOUCH_TARGET } from '@/core/ui/theme';
import { useTheme } from '@/core/ui/theme-context';
import { usePeriodPalette } from '@/features/prayer-times/use-period-palette';
import {
  CATEGORY_LABELS,
  getZikirTemplate,
  ZIKIR_SETS,
  ZIKIR_TEMPLATES,
  type ZikirCategory,
  type ZikirSet,
  type ZikirTemplate,
} from '@/features/tesbih/data/zikir-templates';
import {
  setFavoriteId,
  templateFavoriteId,
  useZikirFavorites,
} from '@/features/tesbih/use-zikir-favorites';
import { useZikirSelection } from '@/features/tesbih/use-zikir-selection';

/** Şablonların gösterim sırası — en çok kullanılanlar üstte */
const CATEGORY_ORDER: ZikirCategory[] = [
  'tevhid',
  'tesbihat',
  'gunluk',
  'salavat',
  'istigfar',
];

function ZikirRow({
  template,
  isSelected,
  onPress,
  isFavorite,
  onToggleFavorite,
}: {
  template: ZikirTemplate;
  isSelected: boolean;
  onPress: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const { colors, spacing, radii } = useTheme();
  const period = usePeriodPalette();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`${template.name}, ${template.transliteration}, varsayılan hedef ${template.defaultCount}`}
      style={({ pressed }) => ({
        gap: spacing.xs,
        padding: spacing.md,
        borderRadius: radii.md,
        minHeight: MIN_TOUCH_TARGET,
        backgroundColor: isSelected
          ? period.accentSoft
          : pressed
            ? colors.surfaceAlt
            : colors.surface,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: isSelected ? period.accent : colors.border,
      })}>
      <View
        style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <Text variant="bodyStrong" style={{ flex: 1 }}>
          {template.name}
        </Text>
        {isSelected ? (
          <MaterialCommunityIcons
            name="check"
            size={20}
            color={period.accent}
          />
        ) : null}
        <FavoriteStar
          isFavorite={isFavorite}
          onToggle={onToggleFavorite}
          label={template.name}
        />
      </View>

      <Text variant="arabic" style={{ textAlign: 'right' }}>
        {template.arabic}
      </Text>
      <Text variant="transliteration" color="textSecondary" scalable>
        {template.transliteration}
      </Text>
      <Text variant="caption" color="textSecondary" scalable>
        {template.meaning}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          marginTop: spacing.xs,
        }}>
        <Text variant="label" color="textMuted">
          VARSAYILAN {template.defaultCount}
        </Text>
        {/* Kaynak rozeti yalnızca nassa dayanan sayılarda gösterilir;
            yaygın kullanımdan gelen sayılar "sünnette geçiyor" gibi
            sunulmamalı. */}
        {template.source ? (
          <Text variant="label" color="textMuted" style={{ flex: 1 }}>
            · {template.source}
          </Text>
        ) : null}
      </View>

      {template.virtue ? (
        <Text variant="caption" color="textMuted" scalable>
          {template.virtue}
        </Text>
      ) : null}
    </Pressable>
  );
}

/**
 * Favori yıldızı. Satırın kendisinden ayrı bir dokunma hedefi —
 * favoriye almak ile o zikri seçmek farklı niyetler.
 */
function FavoriteStar({
  isFavorite,
  onToggle,
  label,
}: {
  isFavorite: boolean;
  onToggle: () => void;
  label: string;
}) {
  const { colors, spacing } = useTheme();
  const period = usePeriodPalette();

  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="switch"
      accessibilityState={{ checked: isFavorite }}
      accessibilityLabel={
        isFavorite
          ? `${label} favorilerden çıkar`
          : `${label} favorilere ekle`
      }
      hitSlop={spacing.sm}
      style={({ pressed }) => ({
        width: MIN_TOUCH_TARGET,
        height: MIN_TOUCH_TARGET,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.5 : 1,
      })}>
      <MaterialCommunityIcons
        name={isFavorite ? 'star' : 'star-outline'}
        size={22}
        color={isFavorite ? period.accent : colors.textMuted}
      />
    </Pressable>
  );
}

/**
 * Zincirli set satırı. Adımlar tek satırda özetleniyor
 * ("33 Sübhânallâh · 33 Elhamdülillâh · …") — kullanıcı seçmeden önce
 * neyin kaç kere geleceğini görmeli.
 */
function SetRow({
  set,
  isSelected,
  onPress,
  isFavorite,
  onToggleFavorite,
}: {
  set: ZikirSet;
  isSelected: boolean;
  onPress: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const { colors, spacing, radii } = useTheme();
  const period = usePeriodPalette();

  const steps = set.steps.map((step) => {
    const template = getZikirTemplate(step.templateId);
    return `${step.count} ${template?.name ?? step.templateId}`;
  });

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`${set.name}. ${steps.join(', ')}`}
      style={({ pressed }) => ({
        gap: spacing.xs,
        padding: spacing.md,
        borderRadius: radii.md,
        minHeight: MIN_TOUCH_TARGET,
        backgroundColor: isSelected
          ? period.accentSoft
          : pressed
            ? colors.surfaceAlt
            : colors.surface,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: isSelected ? period.accent : colors.border,
      })}>
      <View
        style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <MaterialCommunityIcons
          name="format-list-numbered"
          size={20}
          color={colors.textSecondary}
        />
        <Text variant="bodyStrong" style={{ flex: 1 }}>
          {set.name}
        </Text>
        {isSelected ? (
          <MaterialCommunityIcons name="check" size={20} color={period.accent} />
        ) : null}
        <FavoriteStar
          isFavorite={isFavorite}
          onToggle={onToggleFavorite}
          label={set.name}
        />
      </View>

      <Text variant="caption" color="textSecondary" scalable>
        {set.description}
      </Text>
      <Text variant="caption" color="textMuted" scalable>
        {steps.join('  ·  ')}
      </Text>
      {set.source ? (
        <Text variant="label" color="textMuted">
          {set.source}
        </Text>
      ) : null}
    </Pressable>
  );
}

export default function ZikirSecScreen() {
  const { spacing } = useTheme();
  const router = useRouter();
  const selected = useZikirSelection();
  const favorites = useZikirFavorites();

  return (
    <Screen scroll edges={{ top: false }}>
      {/* Setler en üstte: namaz sonrası en çok kullanılan bu. */}
      <View style={{ marginTop: spacing.lg }}>
        <Text
          variant="label"
          color="textMuted"
          style={{ marginBottom: spacing.sm }}>
          SIRALI SETLER
        </Text>
        <View style={{ gap: spacing.sm }}>
          {ZIKIR_SETS.map((set) => (
            <SetRow
              key={set.id}
              set={set}
              isSelected={selected.set?.id === set.id}
              onPress={() => {
                selected.selectSet(set.id);
                router.back();
              }}
              isFavorite={favorites.isFavorite(setFavoriteId(set.id))}
              onToggleFavorite={() => favorites.toggle(setFavoriteId(set.id))}
            />
          ))}
        </View>
      </View>

      {CATEGORY_ORDER.map((category) => {
        const items = ZIKIR_TEMPLATES.filter((t) => t.category === category);
        if (items.length === 0) return null;

        return (
          <View key={category} style={{ marginTop: spacing.lg }}>
            <Text
              variant="label"
              color="textMuted"
              style={{ marginBottom: spacing.sm }}>
              {CATEGORY_LABELS[category].toLocaleUpperCase('tr-TR')}
            </Text>
            <View style={{ gap: spacing.sm }}>
              {items.map((template) => (
                <ZikirRow
                  key={template.id}
                  template={template}
                  isSelected={
                    selected.kind === 'template' &&
                    template.id === selected.template.id
                  }
                  onPress={() => {
                    selected.selectTemplate(template.id);
                    router.back();
                  }}
                  isFavorite={favorites.isFavorite(
                    templateFavoriteId(template.id)
                  )}
                  onToggleFavorite={() =>
                    favorites.toggle(templateFavoriteId(template.id))
                  }
                />
              ))}
            </View>
          </View>
        );
      })}

      <View style={{ marginTop: spacing.xl, marginBottom: spacing.xxxl }}>
        <Text variant="caption" color="textMuted">
          Kendi zikrini ekleme sırada.
        </Text>
      </View>
    </Screen>
  );
}
