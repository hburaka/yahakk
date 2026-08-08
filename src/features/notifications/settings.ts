import { useCallback } from 'react';
import { useMMKVString } from 'react-native-mmkv';

import { storage } from '@/core/store/storage';
import type { PrayerKey } from '@/features/prayer-times/types';

const KEY = 'notifications.settings';

/**
 * Bildirim sesi.
 *
 * Şimdilik yalnızca sistem sesi ve sessiz var — ezan kaydı telifi
 * netleşmeden pakete konmayacak. Yapı özel sesler eklenebilecek şekilde
 * kuruldu: yeni bir seçenek eklemek `NOTIFICATION_SOUNDS`'a bir satır
 * ve ses dosyasını `assets/audio/` altına koymak demek.
 *
 * Not: iOS'ta özel bildirim sesi **30 saniyeden kısa** olmak ve uygulama
 * paketinde bulunmak zorunda. Tam ezan 2-4 dakika olduğu için bildirim
 * sesi ancak kısa bir giriş olabilir; tam ezan uygulama içinde çalınır.
 */
export type NotificationSound = 'default' | 'silent';

export type SoundChoice = {
  label: string;
  hint: string;
  /** Android kanal kimliği — kanal sesi oluşturulduktan sonra değişmiyor */
  channelId: string;
  /**
   * `system`  : cihazın varsayılan bildirim sesi
   * `silent`  : ses yok
   * `bundled` : uygulama paketindeki dosya (`file` dolu olur)
   *
   * Bu ayrım şart: ses alanına `'default'` dizesi verilirse hem iOS hem
   * Android bunu "default" adlı bir dosya sanıp bulamıyor ve hata veriyor.
   * Varsayılan ses, alanı hiç vermemekle seçiliyor.
   */
  kind: 'system' | 'silent' | 'bundled';
  file?: string;
};

export const NOTIFICATION_SOUNDS: Record<NotificationSound, SoundChoice> = {
  default: {
    label: 'Bildirim sesi',
    hint: 'Telefonunuzun varsayılan bildirim sesi',
    channelId: 'prayer-default',
    kind: 'system',
  },
  silent: {
    label: 'Sessiz',
    hint: 'Yalnızca titreşim, ses çıkmaz',
    channelId: 'prayer-silent',
    kind: 'silent',
  },
};

export type NotificationSettings = {
  /** Hangi vakitlerde bildirim gelsin */
  enabled: Record<PrayerKey, boolean>;
  /** Vakitten kaç dakika önce hatırlatılsın; 0 = tam vaktinde */
  reminderMinutes: number;
  sound: NotificationSound;
};

/**
 * Varsayılan: beş vakit açık, güneş kapalı.
 *
 * Güneş bir namaz vakti değil, sabah namazının çıkış vaktidir.
 * Varsayılan olarak açık gelirse kullanıcı günde altı bildirim alır ve
 * altıncısının ne olduğunu anlamaz — isteyen ayarlardan açar.
 */
export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: {
    fajr: true,
    sunrise: false,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
  },
  reminderMinutes: 0,
  sound: 'default',
};

export const REMINDER_OPTIONS = [0, 5, 10, 15, 30] as const;

export function reminderLabel(minutes: number): string {
  return minutes === 0 ? 'Tam vaktinde' : `${minutes} dakika önce`;
}

function parse(raw: string | undefined): NotificationSettings {
  if (!raw) return DEFAULT_NOTIFICATION_SETTINGS;
  try {
    const parsed = JSON.parse(raw) as Partial<NotificationSettings>;
    return {
      enabled: {
        ...DEFAULT_NOTIFICATION_SETTINGS.enabled,
        ...(parsed.enabled ?? {}),
      },
      reminderMinutes:
        typeof parsed.reminderMinutes === 'number' ? parsed.reminderMinutes : 0,
      sound:
        parsed.sound && parsed.sound in NOTIFICATION_SOUNDS
          ? parsed.sound
          : 'default',
    };
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}

/** Hook dışından okumak için — planlayıcı React ağacının dışında çalışıyor */
export function readNotificationSettings(): NotificationSettings {
  return parse(storage.getString(KEY));
}

export function useNotificationSettings() {
  const [raw, setRaw] = useMMKVString(KEY, storage);
  const settings = parse(raw);

  const togglePrayer = useCallback(
    (prayer: PrayerKey, value: boolean) => {
      const next: NotificationSettings = {
        ...settings,
        enabled: { ...settings.enabled, [prayer]: value },
      };
      setRaw(JSON.stringify(next));
    },
    [settings, setRaw]
  );

  const setReminderMinutes = useCallback(
    (minutes: number) => {
      setRaw(JSON.stringify({ ...settings, reminderMinutes: minutes }));
    },
    [settings, setRaw]
  );

  const setSound = useCallback(
    (sound: NotificationSound) => {
      setRaw(JSON.stringify({ ...settings, sound }));
    },
    [settings, setRaw]
  );

  return { settings, togglePrayer, setReminderMinutes, setSound };
}
