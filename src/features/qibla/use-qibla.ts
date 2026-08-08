import geomagnetism from 'geomagnetism';
import * as Location from 'expo-location';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useLocation } from '@/features/prayer-times/use-location';

import {
  distanceToKaaba,
  qiblaBearing,
  signedAngleDelta,
  QIBLA_ALIGNED_TOLERANCE,
  type Coordinates,
} from './bearing';

/**
 * Pusula güvenilirliği. expo-location 0-3 arası bir seviye veriyor:
 * 3 yüksek, 2 orta, 1 düşük, 0 yok. iOS'ta bu sırasıyla <20°, <35°,
 * <50°, >50° belirsizliğe karşılık geliyor.
 */
export type HeadingQuality = 'unreliable' | 'low' | 'medium' | 'high';

/** Bu seviyeye ulaşınca yön gösterilmeye BAŞLANIR */
const TRUST_ENTER = 2;
/**
 * Bu seviyenin altına düşünce yön gösterilmeyi BIRAKIR.
 *
 * Giriş ve çıkış eşiği bilerek farklı: Android'de accuracy sürekli
 * 1 ile 2 arasında zıplıyor. Tek eşik kullanılırsa kadran saniyede
 * birkaç kez görünüp kayboluyor ve ekran bozuk görünüyor.
 */
const TRUST_EXIT = 1;

/**
 * Ham manyetometre okuması birkaç derece titriyor. Filtresiz
 * kullanılırsa ibre yerinde duramıyor. 0.2 katsayısı, gözle görülür
 * gecikme yaratmadan titremeyi kesiyor.
 */
const SMOOTHING = 0.2;

function qualityFromAccuracy(accuracy: number): HeadingQuality {
  if (accuracy >= 3) return 'high';
  if (accuracy >= 2) return 'medium';
  if (accuracy >= 1) return 'low';
  return 'unreliable';
}

/** Açıları en kısa yoldan yumuşatır; 359°→1° geçişinde geri sarmaz */
function smoothAngle(previous: number, next: number): number {
  const delta = ((next - previous + 540) % 360) - 180;
  return (previous + delta * SMOOTHING + 360) % 360;
}

export type QiblaState =
  | { status: 'loading' }
  | { status: 'noPermission' }
  | { status: 'noSensor' }
  /** Sensör çalışıyor ama güvenilecek kadar değil — yön GÖSTERİLMEZ */
  | { status: 'calibrating'; quality: HeadingQuality }
  | {
      status: 'ready';
      /** Cihazın gerçek kuzeye göre baktığı yön */
      heading: number;
      /** Kâbe'nin gerçek kuzeye göre yönü */
      bearing: number;
      /** Hedefe kalan işaretli açı; pozitif = sağa dön */
      delta: number;
      isAligned: boolean;
      distanceKm: number;
      quality: HeadingQuality;
    };

/**
 * Manyetik kuzeyden gerçek kuzeye düzeltme (declination).
 *
 * Yalnızca cihaz `trueHeading` vermediğinde kullanılır. Türkiye'de
 * sapma 4-7 derece civarında; düzeltilmezse kıble gözle görülür
 * biçimde kayar.
 */
function magneticDeclination(coordinates: Coordinates): number {
  try {
    return geomagnetism
      .model()
      .point([coordinates.latitude, coordinates.longitude]).decl;
  } catch {
    return 0;
  }
}

type SensorState = {
  heading: number | null;
  accuracy: number;
  trusted: boolean;
  failed: boolean;
};

export function useQibla(): QiblaState {
  const locationState = useLocation();
  const [sensor, setSensor] = useState<SensorState>({
    heading: null,
    accuracy: 0,
    trusted: false,
    failed: false,
  });
  /** Yumuşatma için son değer; render'a girmediği için ref'te */
  const smoothed = useRef<number | null>(null);

  const latitude =
    locationState.status === 'ready' ? locationState.location.latitude : null;
  const longitude =
    locationState.status === 'ready' ? locationState.location.longitude : null;

  // Nesne kimliği sabitlenmeli: her render'da yeni bir `coordinates`
  // üretilirse aşağıdaki efekt pusula aboneliğini sürekli kurup
  // yıkıyor ve sensör hiç kararlı okuma veremiyor.
  const coordinates = useMemo<Coordinates | null>(
    () =>
      latitude !== null && longitude !== null ? { latitude, longitude } : null,
    [latitude, longitude]
  );

  const declination = useMemo(
    () => (coordinates ? magneticDeclination(coordinates) : 0),
    [coordinates]
  );

  useEffect(() => {
    if (!coordinates) return;
    let subscription: Location.LocationSubscription | null = null;
    let cancelled = false;

    async function subscribe() {
      try {
        subscription = await Location.watchHeadingAsync((update) => {
          if (cancelled) return;

          // trueHeading -1 ise cihaz gerçek kuzeyi veremiyor; manyetik
          // okumayı kendimiz düzeltiyoruz.
          const raw =
            update.trueHeading >= 0
              ? update.trueHeading
              : (update.magHeading + declination + 360) % 360;

          const next =
            smoothed.current === null
              ? raw
              : smoothAngle(smoothed.current, raw);
          smoothed.current = next;

          setSensor((previous) => {
            const trusted = previous.trusted
              ? update.accuracy >= TRUST_EXIT
              : update.accuracy >= TRUST_ENTER;

            return {
              heading: next,
              accuracy: update.accuracy,
              trusted,
              failed: false,
            };
          });
        });
      } catch {
        if (!cancelled) {
          setSensor((previous) => ({ ...previous, failed: true }));
        }
      }
    }

    subscribe();

    return () => {
      cancelled = true;
      smoothed.current = null;
      subscription?.remove();
    };
  }, [coordinates, declination]);

  if (locationState.status === 'needsSelection') {
    return { status: 'noPermission' };
  }
  if (sensor.failed) return { status: 'noSensor' };
  if (!coordinates || sensor.heading === null) return { status: 'loading' };

  const quality = qualityFromAccuracy(sensor.accuracy);
  if (!sensor.trusted) return { status: 'calibrating', quality };

  const bearing = qiblaBearing(coordinates);
  const delta = signedAngleDelta(sensor.heading, bearing);

  return {
    status: 'ready',
    heading: sensor.heading,
    bearing,
    delta,
    isAligned: Math.abs(delta) <= QIBLA_ALIGNED_TOLERANCE,
    distanceKm: distanceToKaaba(coordinates),
    quality,
  };
}
