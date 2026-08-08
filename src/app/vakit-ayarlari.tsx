import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Linking, StyleSheet, Switch, View } from 'react-native';

import { Button } from '@/core/ui/button';
import { Screen, Text } from '@/core/ui/components';
import { OptionGroup } from '@/core/ui/options';
import { Section } from '@/core/ui/section';
import { MIN_TOUCH_TARGET } from '@/core/ui/theme';
import { useTheme } from '@/core/ui/theme-context';
import { getBatteryGuidance } from '@/features/notifications/battery-guidance';
import {
  NOTIFICATION_SOUNDS,
  REMINDER_OPTIONS,
  reminderLabel,
  useNotificationSettings,
  type NotificationSound,
} from '@/features/notifications/settings';
import { useNotificationSync } from '@/features/notifications/use-notification-sync';
import {
  ASR_METHOD_LABELS,
  CALCULATION_METHOD_LABELS,
  HIGH_LATITUDE_RULE_LABELS,
  type AsrMethod,
  type CalculationMethodKey,
  type HighLatitudeRuleKey,
} from '@/features/prayer-times/calculate';
import {
  hasAnyMargin,
  MARGIN_OPTIONS,
  marginLabel,
  RECOMMENDED_MARGINS,
} from '@/features/prayer-times/margins';
import {
  PRAYER_LABELS,
  PRAYER_ORDER,
  type PrayerKey,
} from '@/features/prayer-times/types';
import { usePrayerSettings } from '@/features/prayer-times/use-prayer-settings';


function BatteryWarning() {
  const { colors, spacing, radii } = useTheme();
  const guidance = getBatteryGuidance();

  if (!guidance.isAggressive) return null;

  return (
    <View
      style={{
        gap: spacing.sm,
        padding: spacing.md,
        borderRadius: radii.md,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
        backgroundColor: colors.surface,
      }}>
      <View
        style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <MaterialCommunityIcons
          name="battery-alert-variant-outline"
          size={20}
          color={colors.warning}
        />
        <Text variant="bodyStrong" style={{ flex: 1 }}>
          {guidance.manufacturer} cihazlarda bildirim kaçabilir
        </Text>
      </View>
      <Text variant="caption" color="textSecondary">
        Bu marka, arka planda bekleyen uygulamaları pil tasarrufu için
        kapatıyor ve planlanmış ezan bildirimleri düşebiliyor. Aşağıdaki
        ayarı yaparsanız sorun ortadan kalkar.
      </Text>
      <View style={{ gap: spacing.xs, marginTop: spacing.xs }}>
        {guidance.steps.map((step, index) => (
          <Text key={step} variant="caption" color="textSecondary">
            {index + 1}. {step}
          </Text>
        ))}
      </View>
      <View style={{ marginTop: spacing.xs }}>
        <Button
          label="Ayarları aç"
          icon="cog-outline"
          onPress={() => Linking.openSettings()}
          accessibilityLabel="Uygulama ayarlarını aç"
        />
      </View>
    </View>
  );
}

export default function VakitAyarlariScreen() {
  const { colors, spacing, radii } = useTheme();
  const prayer = usePrayerSettings();
  const { settings, togglePrayer, setReminderMinutes, setSound } =
    useNotificationSettings();
  const syncResult = useNotificationSync();

  return (
    <Screen scroll edges={{ top: false }}>
      <Section
        first
        title="İkindi vakti"
        description="Diyanet asr-ı evveli yayınlar; Türkiye'deki camiler buna göre ezan okur. Hanefî ikindiyi seçerseniz diğer beş vakit değişmez, yalnızca ikindi yeniden hesaplanır.">
        <OptionGroup<AsrMethod>
          options={[
            {
              value: 'evvel',
              label: ASR_METHOD_LABELS.evvel,
              hint: 'Gölge, cismin bir katı kadar olunca',
            },
            {
              value: 'sani',
              label: ASR_METHOD_LABELS.sani,
              hint: 'Gölge, cismin iki katı kadar olunca',
            },
          ]}
          selected={prayer.asrMethod}
          onSelect={prayer.setAsrMethod}
        />
      </Section>

      <Section
        title="Oruç ihtiyat payı"
        description="Sahur ve iftar için vakitleri güvenli yöne kaydırır. Yalnızca imsak ve akşamı etkiler, diğer vakitlere dokunmaz.">
        <View
          style={{
            gap: spacing.xs,
            padding: spacing.md,
            borderRadius: radii.md,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
            backgroundColor: colors.surface,
          }}>
          <Text variant="caption" color="textSecondary">
            Ankara ve İstanbul için 122 gün ölçüldü. Pay olmadan akşam
            vaktimiz günlerin yarısında Diyanet&apos;in yayınladığı vakitten
            1-2 dakika erken, imsak ise günlerin %4&apos;ünde 1 dakika geç
            çıkıyor. Aşağıdaki önerilen değerler bu ihtimalleri tamamen
            ortadan kaldırıyor.
          </Text>
        </View>

        <View style={{ gap: spacing.sm }}>
          <Text variant="bodyStrong">Sahur — imsaktan çıkarılır</Text>
          <OptionGroup<string>
            options={MARGIN_OPTIONS.map((minutes) => ({
              value: String(minutes),
              label: marginLabel(minutes),
              hint:
                minutes === RECOMMENDED_MARGINS.fajr
                  ? 'Önerilen'
                  : minutes === 0
                    ? 'Hesabın verdiği vakit, dokunulmadan'
                    : undefined,
            }))}
            selected={String(prayer.margins.fajr)}
            onSelect={(value) => prayer.setFajrMargin(Number(value))}
          />
        </View>

        <View style={{ gap: spacing.sm }}>
          <Text variant="bodyStrong">İftar — akşama eklenir</Text>
          <OptionGroup<string>
            options={MARGIN_OPTIONS.map((minutes) => ({
              value: String(minutes),
              label: marginLabel(minutes),
              hint:
                minutes === RECOMMENDED_MARGINS.maghrib
                  ? 'Önerilen'
                  : minutes === 0
                    ? 'Hesabın verdiği vakit, dokunulmadan'
                    : undefined,
            }))}
            selected={String(prayer.margins.maghrib)}
            onSelect={(value) => prayer.setMaghribMargin(Number(value))}
          />
        </View>

        {hasAnyMargin(prayer.margins) ? (
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
              name="information-outline"
              size={19}
              color={colors.textSecondary}
            />
            <Text variant="caption" color="textSecondary" style={{ flex: 1 }}>
              {prayer.margins.fajr > 0
                ? `İmsak ${prayer.margins.fajr} dakika geri`
                : ''}
              {prayer.margins.fajr > 0 && prayer.margins.maghrib > 0
                ? ', '
                : ''}
              {prayer.margins.maghrib > 0
                ? `akşam ${prayer.margins.maghrib} dakika ileri`
                : ''}{' '}
              kaydırılmış gösteriliyor ve bildirimler de o saatlerde gelecek.
              Bunlar hesaplanan vakit değil, sizin seçtiğiniz paydır — ana
              ekranda ilgili satırda işaretli görünür.
            </Text>
          </View>
        ) : null}
      </Section>

      <Section
        title="Bildirimler"
        description="Hangi vakitlerde bildirim almak istediğinizi seçin.">
        <View>
          {PRAYER_ORDER.map((key: PrayerKey, index) => (
            <View
              key={key}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                minHeight: MIN_TOUCH_TARGET,
                gap: spacing.md,
                borderTopWidth: index === 0 ? 0 : StyleSheet.hairlineWidth,
                borderTopColor: colors.border,
              }}>
              <View style={{ flex: 1 }}>
                <Text variant="body">{PRAYER_LABELS[key]}</Text>
                {key === 'sunrise' ? (
                  <Text variant="caption" color="textMuted">
                    Namaz vakti değil, sabah namazının çıkışı
                  </Text>
                ) : null}
              </View>
              <Switch
                value={settings.enabled[key]}
                onValueChange={(value) => togglePrayer(key, value)}
                accessibilityLabel={`${PRAYER_LABELS[key]} bildirimi`}
              />
            </View>
          ))}
        </View>
      </Section>

      <Section
        title="Bildirim sesi"
        description="Ezan kaydı henüz eklenmedi — telifi net olmayan bir kayıt uygulamaya konmayacak. Şimdilik telefonunuzun bildirim sesi kullanılıyor.">
        <OptionGroup<NotificationSound>
          options={(
            Object.keys(NOTIFICATION_SOUNDS) as NotificationSound[]
          ).map((value) => ({
            value,
            label: NOTIFICATION_SOUNDS[value].label,
            hint: NOTIFICATION_SOUNDS[value].hint,
          }))}
          selected={settings.sound}
          onSelect={setSound}
        />
      </Section>

      <Section title="Hatırlatma zamanı">
        <OptionGroup<string>
          options={REMINDER_OPTIONS.map((minutes) => ({
            value: String(minutes),
            label: reminderLabel(minutes),
          }))}
          selected={String(settings.reminderMinutes)}
          onSelect={(value) => setReminderMinutes(Number(value))}
        />
      </Section>

      <Section title="Bildirim durumu">
        <View
          style={{
            gap: spacing.xs,
            padding: spacing.md,
            borderRadius: radii.md,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
            backgroundColor: colors.surface,
          }}>
          {syncResult === null ? (
            <Text variant="body" color="textSecondary">
              Bildirimler hazırlanıyor…
            </Text>
          ) : syncResult.denied ? (
            <Text variant="body" color="danger">
              Bildirim izni verilmemiş. Vakit bildirimleri gelmeyecek.
            </Text>
          ) : (
            <>
              <Text variant="body">
                {syncResult.scheduled} bildirim planlandı
              </Text>
              {syncResult.coveredUntil ? (
                <Text variant="caption" color="textSecondary">
                  {syncResult.coveredUntil.toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                  })}{' '}
                  tarihine kadar.
                </Text>
              ) : null}
              {/* Bu sınırı gizlemek yanlış olur: kullanıcı uygulamayı
                  hiç açmazsa bildirimler gerçekten kesiliyor. */}
              <Text variant="caption" color="textMuted">
                Sunucumuz olmadığı için bildirimler cihazınızda önceden
                planlanıyor. Uygulamayı ara ara açmanız listeyi ileri
                kaydırır.
              </Text>
            </>
          )}
        </View>

        <BatteryWarning />
      </Section>

      <Section
        title="Hesaplama yöntemi"
        description="Diyanet vakitleri bulunamadığında veya yurt dışındayken kullanılır.">
        <OptionGroup<CalculationMethodKey>
          options={(
            Object.keys(CALCULATION_METHOD_LABELS) as CalculationMethodKey[]
          ).map((value) => ({ value, label: CALCULATION_METHOD_LABELS[value] }))}
          selected={prayer.calculationMethod}
          onSelect={prayer.setCalculationMethod}
        />
      </Section>

      <Section
        title="Yüksek enlem kuralı"
        description="Kuzey Avrupa'da yazın güneş yeterince batmadığı için imsak ve yatsı uçuk saatlere kayabilir. Türkiye'de bu ayarın etkisi yoktur.">
        <OptionGroup<HighLatitudeRuleKey>
          options={(
            Object.keys(HIGH_LATITUDE_RULE_LABELS) as HighLatitudeRuleKey[]
          ).map((value) => ({
            value,
            label: HIGH_LATITUDE_RULE_LABELS[value],
          }))}
          selected={prayer.highLatitudeRule}
          onSelect={prayer.setHighLatitudeRule}
        />
      </Section>

      <View style={{ height: spacing.xxxl }} />
    </Screen>
  );
}
