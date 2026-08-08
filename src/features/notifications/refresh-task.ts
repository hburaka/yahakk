import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import { eq } from 'drizzle-orm';

import { db } from '@/core/db/client';
import { locations } from '@/core/db/schema';
import { storage, StorageKeys } from '@/core/store/storage';
import {
  CALCULATION_METHOD_LABELS,
  HIGH_LATITUDE_RULE_LABELS,
  type AsrMethod,
  type CalculationMethodKey,
  type HighLatitudeRuleKey,
} from '@/features/prayer-times/calculate';
import { readMargins } from '@/features/prayer-times/use-prayer-settings';

import { rescheduleAll } from './scheduler';

export const REFRESH_TASK = 'yahakk-refresh-notifications';

/**
 * Bildirim penceresini arka planda ileri kaydırır.
 *
 * Neden gerekli: sunucumuz olmadığı için push gönderemiyoruz,
 * bildirimler cihazda önceden planlanıyor ve iOS'un 64 bildirim tavanı
 * yüzünden ancak ~10 gün ileriye gidiyor. Uygulama açılışında pencere
 * kayıyor; bu görev, kullanıcı uygulamayı hiç açmadığında da kaydırmayı
 * deniyor.
 *
 * ⚠️ **Garanti değil.** iOS bu görevi ne zaman çalıştıracağına kendi
 * karar veriyor (BGTaskScheduler) ve uygulama az kullanılıyorsa
 * seyrekleştiriyor. Android'de WorkManager daha güvenilir ama üretici
 * pil yöneticileri araya giriyor — pil optimizasyonu rehberinin sebebi
 * bu. Yani bu görev sorunu azaltıyor, ortadan kaldırmıyor.
 */
TaskManager.defineTask(REFRESH_TASK, async () => {
  try {
    const locationId = storage.getString(StorageKeys.selectedLocationId);
    if (!locationId) return BackgroundTask.BackgroundTaskResult.Success;

    const rows = await db
      .select()
      .from(locations)
      .where(eq(locations.id, locationId))
      .limit(1);

    const location = rows[0];
    if (!location) return BackgroundTask.BackgroundTaskResult.Success;

    const method = storage.getString(StorageKeys.calculationMethod);
    const highLat = storage.getString(StorageKeys.highLatitudeRule);

    await rescheduleAll(location, {
      method:
        method !== undefined && method in CALCULATION_METHOD_LABELS
          ? (method as CalculationMethodKey)
          : 'turkey',
      asrMethod: (storage.getString(StorageKeys.asrMethod) === 'sani'
        ? 'sani'
        : 'evvel') as AsrMethod,
      highLatitudeRule:
        highLat !== undefined && highLat in HIGH_LATITUDE_RULE_LABELS
          ? (highLat as HighLatitudeRuleKey)
          : 'auto',
      margins: readMargins(),
    });

    return BackgroundTask.BackgroundTaskResult.Success;
  } catch {
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

/**
 * Günde iki kez denemesi yeterli: pencere 10 günlük, bir gün kaçsa bile
 * fark etmiyor. Daha sık denemek pil harcamaktan başka işe yaramaz.
 */
const MINIMUM_INTERVAL_MINUTES = 12 * 60;

export async function registerRefreshTask(): Promise<void> {
  try {
    const status = await BackgroundTask.getStatusAsync();
    if (status !== BackgroundTask.BackgroundTaskStatus.Available) return;

    const already = await TaskManager.isTaskRegisteredAsync(REFRESH_TASK);
    if (already) return;

    await BackgroundTask.registerTaskAsync(REFRESH_TASK, {
      minimumInterval: MINIMUM_INTERVAL_MINUTES,
    });
  } catch {
    // Kayıt başarısızsa uygulama açılışındaki tazeleme devrede kalıyor;
    // kullanıcı için tek fark, pencerenin daha seyrek kayması.
  }
}
