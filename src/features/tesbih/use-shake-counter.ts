import { Accelerometer } from 'expo-sensors';
import { useEffect, useRef } from 'react';

import { initialShakeState, stepShake, type ShakeState } from './shake';

/** İvmeölçer okuma sıklığı (ms). Sallama için 50 ms fazlasıyla yeterli */
const SAMPLE_INTERVAL_MS = 50;

/**
 * Sallayarak sayma — sensör bağlantısı.
 *
 * Algılama mantığı `shake.ts`'te ve saf; burada yalnızca ivmeölçere
 * abone olunuyor. Ayrım bilinçli: yanlış sayım riski test edilebilir
 * olmalıydı (bkz. `shake.test.ts`, özellikle "yürürken saymaz").
 *
 * Abonelik yalnızca özellik açıkken ve bu ekran görünürken kuruluyor.
 * İvmeölçeri sürekli açık tutmak hem pili yiyor hem de tesbih ekranı
 * kapalıyken sayım üretme riski doğuruyor.
 */
export function useShakeCounter({
  enabled,
  onShake,
}: {
  enabled: boolean;
  onShake: () => void;
}) {
  const stateRef = useRef<ShakeState>(initialShakeState);

  // Geri çağrı ref'te: her render'da aboneliği yeniden kurmak, sensör
  // akışını kesip sallama ortasında durum kaybına yol açıyordu.
  const onShakeRef = useRef(onShake);
  useEffect(() => {
    onShakeRef.current = onShake;
  });

  useEffect(() => {
    if (!enabled) {
      stateRef.current = initialShakeState;
      return;
    }

    let subscription: { remove: () => void } | null = null;
    let cancelled = false;

    async function subscribe() {
      const available = await Accelerometer.isAvailableAsync().catch(
        () => false
      );
      // Sensörü olmayan cihazda sessizce devre dışı; dokunarak sayma
      // her zaman çalışmaya devam ediyor.
      if (!available || cancelled) return;

      Accelerometer.setUpdateInterval(SAMPLE_INTERVAL_MS);
      subscription = Accelerometer.addListener((reading) => {
        const result = stepShake(stateRef.current, reading, Date.now());
        stateRef.current = result.state;
        if (result.counted) onShakeRef.current();
      });
    }

    subscribe();

    return () => {
      cancelled = true;
      subscription?.remove();
      stateRef.current = initialShakeState;
    };
  }, [enabled]);
}
