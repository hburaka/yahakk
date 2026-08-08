import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { Location as LocationRow } from '@/core/db/schema';
import {
  calculateDayTimes,
  type AsrMethod,
  type CalculationMethodKey,
  type HighLatitudeRuleKey,
} from '@/features/prayer-times/calculate';
import { marginFor, type PrayerMargins } from '@/features/prayer-times/margins';
import {
  PRAYER_A11Y_LABELS,
  PRAYER_LABELS,
  PRAYER_ORDER,
  type PrayerKey,
} from '@/features/prayer-times/types';

import {
  NOTIFICATION_SOUNDS,
  readNotificationSettings,
  type NotificationSettings,
} from './settings';

/**
 * iOS aynı anda en fazla **64** bekleyen yerel bildirim tutar; sınırı
 * aşan planlamalar sessizce düşer. Tavanın altında pay bırakıyoruz ki
 * ileride eklenecek imsak/kandil bildirimleri de sığsın.
 */
const MAX_PENDING = 58;

/** Kaç günlük ileriye planlanacağı — sınıra göre kısalabilir */
const HORIZON_DAYS = 10;

export type ScheduleOptions = {
  method: CalculationMethodKey;
  asrMethod: AsrMethod;
  highLatitudeRule: HighLatitudeRuleKey;
  /** İftar ihtiyat payı; ekranla bildirim ayrışmasın diye burada da uygulanır */
  margins: PrayerMargins;
};

export type ScheduleResult = {
  scheduled: number;
  /** Planlanan son bildirimin zamanı — kullanıcıya "şu tarihe kadar" demek için */
  coveredUntil: Date | null;
  /** Bildirim izni verilmedi */
  denied: boolean;
};

export async function ensureNotificationSetup(): Promise<boolean> {
  const existing = await Notifications.getPermissionsAsync();
  let granted = existing.granted;

  if (!granted && existing.canAskAgain) {
    const requested = await Notifications.requestPermissionsAsync();
    granted = requested.granted;
  }

  if (Platform.OS === 'android') {
    // Android 8'den beri bildirim sesi **kanala** bağlı ve kanal
    // oluşturulduktan sonra sesi değiştirilemiyor. Bu yüzden her ses
    // seçeneği için ayrı bir kanal açılıyor; kullanıcı sesi
    // değiştirdiğinde bildirimler diğer kanala planlanıyor.
    for (const choice of Object.values(NOTIFICATION_SOUNDS)) {
      await Notifications.setNotificationChannelAsync(choice.channelId, {
        name: `Namaz vakitleri — ${choice.label}`,
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        bypassDnd: false,
        // Alan hiç verilmezse sistem varsayılanı kullanılıyor.
        ...(choice.kind === 'silent'
          ? { sound: null }
          : choice.kind === 'bundled'
            ? { sound: choice.file }
            : null),
      });
    }
  }

  return granted;
}

function isoDatePlus(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function bodyFor(prayer: PrayerKey, at: Date, reminderMinutes: number): string {
  const time = at.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  if (reminderMinutes > 0) {
    return `${PRAYER_LABELS[prayer]} vaktine ${reminderMinutes} dakika kaldı (${time})`;
  }
  return prayer === 'sunrise'
    ? `Güneş doğdu (${time})`
    : `${PRAYER_LABELS[prayer]} vakti girdi (${time})`;
}

type Candidate = { at: Date; prayer: PrayerKey };

/**
 * Bekleyen tüm bildirimleri iptal edip yeniden planlar.
 *
 * Her seferinde sıfırdan planlanmasının sebebi: konum, hesaplama
 * yöntemi veya vakit tercihleri değiştiğinde eski bildirimlerin
 * hangisinin geçersiz kaldığını takip etmek, hepsini silip yeniden
 * kurmaktan daha kırılgan.
 */
export async function rescheduleAll(
  location: LocationRow,
  options: ScheduleOptions,
  settings: NotificationSettings = readNotificationSettings()
): Promise<ScheduleResult> {
  const granted = await ensureNotificationSetup();
  if (!granted) {
    await Notifications.cancelAllScheduledNotificationsAsync();
    return { scheduled: 0, coveredUntil: null, denied: true };
  }

  const now = Date.now();
  const candidates: Candidate[] = [];

  for (let day = 0; day < HORIZON_DAYS; day += 1) {
    const iso = isoDatePlus(day);
    const times = calculateDayTimes(location, iso, options);

    for (const prayer of PRAYER_ORDER) {
      if (!settings.enabled[prayer]) continue;

      const at = new Date(
        times[prayer].getTime() +
          marginFor(prayer, options.margins) * 60_000 -
          settings.reminderMinutes * 60_000
      );
      // Geçmiş vakitler planlanamaz; bugünün geçmiş vakitleri elenir.
      if (at.getTime() <= now) continue;

      candidates.push({ at, prayer });
    }
  }

  candidates.sort((a, b) => a.at.getTime() - b.at.getTime());
  const selected = candidates.slice(0, MAX_PENDING);

  await Notifications.cancelAllScheduledNotificationsAsync();

  const soundChoice = NOTIFICATION_SOUNDS[settings.sound];

  for (const candidate of selected) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: PRAYER_A11Y_LABELS[candidate.prayer],
        body: bodyFor(candidate.prayer, candidate.at, settings.reminderMinutes),
        // iOS'ta ses bildirim başına; Android'de kanaldan geliyor.
        // `true` sistem varsayılanı demek, dize ise paketteki dosya.
        sound:
          soundChoice.kind === 'silent'
            ? false
            : soundChoice.kind === 'bundled'
              ? soundChoice.file
              : true,
        data: { prayer: candidate.prayer, locationId: location.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: candidate.at,
        channelId: soundChoice.channelId,
      },
    });
  }

  return {
    scheduled: selected.length,
    coveredUntil: selected.at(-1)?.at ?? null,
    denied: false,
  };
}

/** Tanı amaçlı — ayarlar ekranında "şu kadar bildirim planlı" demek için */
export async function countPending(): Promise<number> {
  const pending = await Notifications.getAllScheduledNotificationsAsync();
  return pending.length;
}
