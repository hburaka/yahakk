import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams } from 'expo-router';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';

import { storage, StorageKeys } from '@/core/store/storage';
import { Screen, Text } from '@/core/ui/components';
import { MIN_TOUCH_TARGET } from '@/core/ui/theme';
import { useTheme } from '@/core/ui/theme-context';
import { getIlmihalTopic } from '@/features/ilmihal/content';
import {
  contentFor,
  isMadhabSpecific,
  type IlmihalSectionContent,
  type IlmihalStep,
} from '@/features/ilmihal/types';
import { usePeriodPalette } from '@/features/prayer-times/use-period-palette';
import { MADHAB_LABELS, type Madhab } from '@/features/rehber/data';

const RULING_LABELS: Record<NonNullable<IlmihalStep['ruling']>, string> = {
  farz: 'FARZ',
  vacip: 'VACİP',
  sunnet: 'SÜNNET',
  adab: 'ÂDÂB',
};

/**
 * Onaylanmamış içerik uyarısı.
 *
 * Bu uygulamayı yazan kişi ilahiyatçı değil. Metin Diyanet İlmihali'nden
 * alınsa bile özetleme ve aktarma sırasında hata olabilir. Kullanıcının
 * bunu bilmeden ibadetini buna göre yapması, uygulamanın yol açabileceği
 * en ağır zarar — o yüzden uyarı gizlenmiyor, en üstte duruyor.
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
        Bu metin henüz ehil biri tarafından gözden geçirilmedi. Kaynağı
        Diyanet İlmihali&apos;dir, ancak aktarımda hata olabilir. Şüpheye
        düştüğünüz noktada kaynağa veya müftülüğe başvurun.
      </Text>
    </View>
  );
}

function Step({ step, index }: { step: IlmihalStep; index: number }) {
  const { colors, spacing } = useTheme();
  const period = usePeriodPalette();

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: spacing.md,
        paddingVertical: spacing.sm,
      }}>
      <Text variant="time" color="textMuted" style={{ minWidth: 26 }}>
        {index + 1}
      </Text>
      <View style={{ flex: 1, gap: spacing.xs }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            flexWrap: 'wrap',
          }}>
          <Text variant="bodyStrong" scalable>
            {step.title}
          </Text>
          {step.ruling ? (
            <View
              style={{
                paddingHorizontal: spacing.sm,
                paddingVertical: 1,
                borderRadius: 4,
                backgroundColor:
                  step.ruling === 'farz' ? period.accentSoft : colors.surfaceAlt,
              }}>
              <Text variant="label" color="textSecondary">
                {RULING_LABELS[step.ruling]}
              </Text>
            </View>
          ) : null}
        </View>
        <Text variant="body" color="textSecondary" scalable>
          {step.body}
        </Text>
      </View>
    </View>
  );
}

function Section({ section }: { section: IlmihalSectionContent }) {
  const { colors, spacing } = useTheme();

  return (
    <View style={{ gap: spacing.md }}>
      <Text variant="heading">{section.heading}</Text>

      {section.paragraphs?.map((paragraph) => (
        <Text key={paragraph} variant="body" color="textSecondary" scalable>
          {paragraph}
        </Text>
      ))}

      {section.items ? (
        <View style={{ gap: spacing.sm }}>
          {section.items.map((item, index) => (
            <View
              key={item}
              style={{ flexDirection: 'row', gap: spacing.md }}>
              <Text variant="body" color="textMuted" style={{ minWidth: 26 }}>
                {index + 1}
              </Text>
              <Text variant="body" style={{ flex: 1 }} scalable>
                {item}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {section.steps ? (
        <View
          style={{
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: colors.border,
          }}>
          {section.steps.map((step, index) => (
            <Step key={step.title} step={step} index={index} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

export default function IlmihalDetayScreen() {
  const { colors, spacing, radii } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [storedMadhab] = useMMKVString(StorageKeys.madhab, storage);
  const madhab: Madhab = storedMadhab === 'safii' ? 'safii' : 'hanefi';

  const topic = getIlmihalTopic(id ?? '');

  if (!topic) {
    return (
      <Screen scroll edges={{ top: false }}>
        <View style={{ marginTop: spacing.xxl, gap: spacing.md }}>
          <Text variant="title">Bu konu henüz hazır değil</Text>
          <Text variant="body" color="textSecondary">
            İlmihal metinleri Diyanet İlmihali esas alınarak hazırlanıyor ve
            her biri gözden geçirildikten sonra ekleniyor.
          </Text>
        </View>
      </Screen>
    );
  }

  const sections = contentFor(topic, madhab);
  const madhabSpecific = isMadhabSpecific(topic);

  return (
    <Screen scroll edges={{ top: false }}>
      <View style={{ marginTop: spacing.lg, gap: spacing.lg }}>
        <Text variant="title">{topic.title}</Text>

        {/*
          Mezhep etiketi gizlenemez. Abdestin farz sayısı ve abdesti
          bozan durumlar iki mezhepte farklı; etiketsiz gösterim
          okuyucunun bir kısmına yanlış bilgi vermek olur.
        */}
        {madhabSpecific ? (
          <View
            style={{
              alignSelf: 'flex-start',
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
              borderRadius: radii.pill,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: colors.borderStrong,
            }}>
            <Text variant="label" color="textSecondary">
              {MADHAB_LABELS[madhab].toLocaleUpperCase('tr-TR')} MEZHEBİNE GÖRE
            </Text>
          </View>
        ) : null}

        {!topic.reviewed ? <ReviewNotice /> : null}
      </View>

      <View style={{ marginTop: spacing.section, gap: spacing.section }}>
        {sections.map((section) => (
          <Section key={section.heading} section={section} />
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
        <Text variant="caption" color="textSecondary">
          Kaynak: {topic.source}
        </Text>
        <Text variant="caption" color="textMuted">
          Buradaki bilgiler genel durumlar içindir. Kendi durumunuza özel bir
          sorunuz varsa müftülüğe danışın.
        </Text>

        {/*
          Hata bildirimi: bu uygulamayı yazan ilahiyatçı değil. Hatayı
          en iyi okuyanlar bulur — onlara kolay bir yol açmak, tek
          başına yapılan her kontrolden daha etkili.
        */}
        <Pressable
          onPress={() =>
            Linking.openURL(
              `mailto:hburaka@gmail.com?subject=${encodeURIComponent(
                `Yahakk ilmihal düzeltme: ${topic.title} (${MADHAB_LABELS[madhab]})`
              )}&body=${encodeURIComponent(
                'Hatalı bulduğunuz kısmı ve doğrusunu yazabilir misiniz?\n\n'
              )}`
            )
          }
          accessibilityRole="button"
          accessibilityLabel="Bu bilgide hata bildir"
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            alignSelf: 'flex-start',
            minHeight: MIN_TOUCH_TARGET,
            paddingHorizontal: spacing.md,
            borderRadius: radii.pill,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
            backgroundColor: pressed ? colors.surfaceAlt : 'transparent',
          })}>
          <MaterialCommunityIcons
            name="flag-outline"
            size={18}
            color={colors.textSecondary}
          />
          <Text variant="bodyStrong" color="textSecondary">
            Bu bilgide hata var
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}
