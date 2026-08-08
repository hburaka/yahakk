import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { useLocation } from '@/features/prayer-times/use-location';
import {
  readMargins,
  usePrayerSettings,
} from '@/features/prayer-times/use-prayer-settings';

import { registerRefreshTask } from './refresh-task';
import {
  readNotificationSettings,
  useNotificationSettings,
} from './settings';
import { rescheduleAll, type ScheduleResult } from './scheduler';

/**
 * Bildirimleri konum ve ayarlarla senkron tutar.
 *
 * Uygulama öne geldiğinde de yeniden planlanıyor. Sebebi mimari bir
 * sınır: sunucumuz olmadığı için push bildirimi gönderemiyoruz,
 * bildirimler cihazda önceden planlanıyor ve iOS'un 64 bildirim
 * tavanı yüzünden ancak ~10 gün ileriye kadar gidebiliyor. Kullanıcı
 * uygulamayı hiç açmazsa bildirimler o pencerenin sonunda kesilir;
 * her açılışta pencereyi ileri kaydırmak bunu telafi ediyor.
 */
export function useNotificationSync(): ScheduleResult | null {
  const locationState = useLocation();
  const prayerSettings = usePrayerSettings();
  const { settings } = useNotificationSettings();
  const [result, setResult] = useState<ScheduleResult | null>(null);

  const location =
    locationState.status === 'ready' ? locationState.location : null;

  const settingsKey = JSON.stringify(settings);

  useEffect(() => {
    if (!location) return;
    let cancelled = false;

    async function sync() {
      if (!location) return;
      try {
        const next = await rescheduleAll(
          location,
          {
            method: prayerSettings.calculationMethod,
            asrMethod: prayerSettings.asrMethod,
            highLatitudeRule: prayerSettings.highLatitudeRule,
            margins: readMargins(),
          },
          // Depodan taze okunuyor: `settings` nesnesinin kimliği her
          // render değişiyor, onu bağımlılığa koymak sonsuz döngü
          // yaratırdı. `settingsKey` yalnızca değişimi tetikliyor.
          readNotificationSettings()
        );
        if (!cancelled) setResult(next);
      } catch {
        // Planlama başarısız olduysa sessiz kalma; ayarlar ekranı
        // sonucun null olmasından "bilinmiyor" durumunu gösterir.
        if (!cancelled) setResult(null);
      }
    }

    sync();
    // Arka plan görevi de pencereyi kaydırmayı deniyor; uygulama hiç
    // açılmasa bile bildirimler bir süre daha devam etsin.
    registerRefreshTask();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') sync();
    });

    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, [
    location,
    prayerSettings.calculationMethod,
    prayerSettings.asrMethod,
    prayerSettings.highLatitudeRule,
    prayerSettings.margins.maghrib,
    prayerSettings.margins.fajr,
    settingsKey,
  ]);

  return result;
}
