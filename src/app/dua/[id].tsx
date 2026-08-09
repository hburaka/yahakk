import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams } from 'expo-router';
import { Linking, StyleSheet, View } from 'react-native';

import { Button } from '@/core/ui/button';
import { Screen, Text } from '@/core/ui/components';
import { useTheme } from '@/core/ui/theme-context';
import { duasFor, ESMA_CATEGORY_ID } from '@/features/dua/content';
import { ESMA_SOURCE, ESMAUL_HUSNA, type DivineName } from '@/features/dua/esma';
import type { Dua } from '@/features/dua/types';
import { DUA_CATEGORIES } from '@/features/rehber/data';

/**
 * Onaylanmamış içerik uyarısı.
 *
 * İlmihaldekiyle aynı gerekçe: bu uygulamayı yazan kişi ilahiyatçı
 * değil. Arapça metin kamu malı olsa bile aktarımda hata olabilir ve
 * kullanıcının bunu bilmeden ibadetini buna göre yapması uygulamanın
 * yol açabileceği en ağır zarar.
 */
function ReviewNotice() {
  const { colors, spacing, radii } = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: spacing.sm,
        padding: spacing.md,
        borderRadius: radii.md,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
        backgroundColor: colors.surface,
      }}>
      <MaterialCommunityIcons
        name="alert-circle-outline"
        size={20}
        color={colors.warning}
      />
      <Text variant="caption" color="textSecondary" style={{ flex: 1 }}>
        Bu metinler henüz ehil biri tarafından gözden geçirilmedi. Arapça
        metinler klasik kaynaklardan, Türkçe anlamlar bize ait sade
        çevirilerdir. Şüpheye düştüğünüz yerde kaynağa başvurun.
      </Text>
    </View>
  );
}

/**
 * Tek bir dua.
 *
 * Üç katman aynı sırayla: Arapça, okunuş, anlam. Sıra bilinçli —
 * okumayı bilen doğrudan Arapçaya bakıyor, bilmeyen okunuşa iniyor,
 * ikisi de anlamı en sonda arıyor.
 */
function DuaBlock({ dua, isFirst }: { dua: Dua; isFirst: boolean }) {
  const { colors, spacing } = useTheme();

  return (
    <View
      style={{
        gap: spacing.md,
        paddingTop: isFirst ? 0 : spacing.xl,
        marginTop: isFirst ? 0 : spacing.xl,
        borderTopWidth: isFirst ? 0 : StyleSheet.hairlineWidth,
        borderTopColor: colors.border,
      }}>
      <View style={{ gap: spacing.xs }}>
        <Text variant="heading" scalable>
          {dua.title}
        </Text>
        {dua.when ? (
          <Text variant="caption" color="textSecondary">
            {dua.when}
          </Text>
        ) : null}
      </View>

      {/*
        Arapça sağa dayalı ve kendi ölçeğinde. `alignSelf: 'stretch'`
        şart: kap içeriğe göre daralırsa uzun metin erken sarıyor.
      */}
      <Text
        variant="arabic"
        style={{ textAlign: 'right', writingDirection: 'rtl' }}>
        {dua.arabic}
      </Text>

      <Text variant="transliteration" color="textSecondary">
        {dua.transliteration}
      </Text>

      <Text variant="body" scalable>
        {dua.meaning}
      </Text>

      {dua.reference ? (
        <Text variant="caption" color="textMuted">
          {dua.reference}
        </Text>
      ) : null}
    </View>
  );
}

/**
 * Esmâü'l-Hüsnâ satırı.
 *
 * Dua bloğundan bilinçli olarak farklı: 99 kayıt uzun kartlarla
 * gösterilirse liste okunamaz hale geliyor. Burada sıra numarası solda
 * sabit bir sütunda, isim ve karşılığı yanında, Arapça sağda —
 * uygulamanın tarife dilinin devamı.
 */
function NameRow({ name, isFirst }: { name: DivineName; isFirst: boolean }) {
  const { colors, spacing } = useTheme();

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${name.order}. ${name.transliteration}. ${name.meaning}`}
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.md,
        paddingVertical: spacing.md,
        borderTopWidth: isFirst ? 0 : StyleSheet.hairlineWidth,
        borderTopColor: colors.border,
      }}>
      <Text
        variant="time"
        color="textMuted"
        style={{ minWidth: 32, textAlign: 'right' }}>
        {name.order}
      </Text>

      <View style={{ flex: 1, gap: spacing.xs }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: spacing.md,
          }}>
          <Text variant="bodyStrong" style={{ flex: 1 }} scalable>
            {name.transliteration}
          </Text>
          <Text variant="arabic" style={{ writingDirection: 'rtl' }}>
            {name.arabic}
          </Text>
        </View>
        <Text variant="body" color="textSecondary" scalable>
          {name.meaning}
        </Text>
      </View>
    </View>
  );
}

function EsmaScreen() {
  const { colors, spacing } = useTheme();

  return (
    <Screen scroll edges={{ top: false }}>
      <View style={{ marginTop: spacing.lg, gap: spacing.lg }}>
        <Text variant="title">Esmâü’l-Hüsnâ</Text>
        <ReviewNotice />
      </View>

      <View style={{ marginTop: spacing.xl }}>
        {ESMAUL_HUSNA.map((name, index) => (
          <NameRow key={name.order} name={name} isFirst={index === 0} />
        ))}
      </View>

      <View
        style={{
          marginTop: spacing.section,
          marginBottom: spacing.xxxl,
          paddingTop: spacing.md,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
          gap: spacing.xs,
        }}>
        <Text variant="caption" color="textSecondary">
          Sıralama: {ESMA_SOURCE}
        </Text>
        <Text variant="caption" color="textMuted">
          Türkçe karşılıklar kısa tutuldu. Her ismin ardında ciltlerce tefsir
          var; buradaki tek cümle onun yerine geçmez, yalnızca ismi tanıtır.
        </Text>
      </View>
    </Screen>
  );
}

export default function DuaKategoriScreen() {
  const { colors, spacing } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const category = DUA_CATEGORIES.find((item) => item.id === id);

  // Esmâü'l-Hüsnâ kendi görünümünü kullanıyor; 99 isim dua bloğu
  // düzeninde okunamıyor (bkz. `features/dua/esma.ts`).
  if (id === ESMA_CATEGORY_ID) return <EsmaScreen />;

  const duas = duasFor(id ?? '');

  if (duas.length === 0) {
    return (
      <Screen scroll edges={{ top: false }}>
        <View style={{ marginTop: spacing.xxl, gap: spacing.md }}>
          <Text variant="title">Bu bölüm henüz hazır değil</Text>
          <Text variant="body" color="textSecondary">
            Dua metinleri kaynağıyla birlikte yazılıyor ve her biri gözden
            geçirildikten sonra ekleniyor.
          </Text>
        </View>
      </Screen>
    );
  }

  const unreviewed = duas.some((dua) => !dua.reviewed);

  return (
    <Screen scroll edges={{ top: false }}>
      <View style={{ marginTop: spacing.lg, gap: spacing.lg }}>
        <Text variant="title">{category?.title ?? 'Dualar'}</Text>
        {unreviewed ? <ReviewNotice /> : null}
      </View>

      <View style={{ marginTop: spacing.section }}>
        {duas.map((dua, index) => (
          <DuaBlock key={dua.id} dua={dua} isFirst={index === 0} />
        ))}
      </View>

      <View
        style={{
          marginTop: spacing.section,
          marginBottom: spacing.xxxl,
          paddingTop: spacing.md,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
          gap: spacing.md,
        }}>
        <Text variant="caption" color="textMuted">
          Arapça metinler Kur’an-ı Kerîm ve klasik hadis külliyatındandır.
          Türkçe anlamlar bize aittir; telifli bir mealden alınmamıştır.
        </Text>

        {/* Hatayı en iyi okuyanlar bulur — onlara kolay bir yol açmak,
            tek başına yapılan her kontrolden daha etkili. */}
        <Button
          variant="secondary"
          icon="flag-outline"
          label="Bu metinde hata var"
          accessibilityLabel="Bu metinde hata bildir"
          onPress={() =>
            Linking.openURL(
              `mailto:hburaka@gmail.com?subject=${encodeURIComponent(
                `Yahakk dua düzeltme: ${category?.title ?? id}`
              )}&body=${encodeURIComponent(
                'Hangi dua ve hatalı bulduğunuz kısım:\n\nDoğrusu:\n\n'
              )}`
            )
          }
        />
      </View>
    </Screen>
  );
}
