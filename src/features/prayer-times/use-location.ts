import { eq } from 'drizzle-orm';
import * as Localization from 'expo-localization';
import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';
import { useMMKVString } from 'react-native-mmkv';

import { db } from '@/core/db/client';
import { locations, type Location as LocationRow } from '@/core/db/schema';
import { storage, StorageKeys } from '@/core/store/storage';

export type LocationState =
  | { status: 'loading' }
  /**
   * Konum izni yok ya da alınamadı. Uygulama burada durmaz — kullanıcı
   * elle il/ilçe seçebilir. Konum izni bir kolaylık, zorunluluk değil.
   */
  | { status: 'needsSelection'; reason: 'denied' | 'unavailable' }
  | { status: 'ready'; location: LocationRow };

function deviceTimezone(): string {
  return Localization.getCalendars()[0]?.timeZone ?? 'Europe/Istanbul';
}

/** GPS'ten gelen konum için kimlik — koordinat tabanlı, kararlı */
function coordinateId(latitude: number, longitude: number): string {
  return `coord:${latitude.toFixed(4)},${longitude.toFixed(4)}`;
}

async function readLocation(id: string): Promise<LocationRow | undefined> {
  const rows = await db
    .select()
    .from(locations)
    .where(eq(locations.id, id))
    .limit(1);
  return rows[0];
}

/**
 * Cihazın konumunu alır, insan okunur bir ada çevirir ve kaydeder.
 *
 * Ters coğrafi kodlama başarısız olabilir (ağ yok, servis kapalı);
 * o durumda konum yine de kullanılır, sadece adı koordinat olur.
 * Vakit hesabı için ad değil koordinat gerekiyor — isim kozmetik.
 */
async function captureCurrentLocation(): Promise<LocationRow | null> {
  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  const { latitude, longitude } = position.coords;
  const id = coordinateId(latitude, longitude);

  let name = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
  let region: string | null = null;
  let countryCode = 'TR';

  try {
    const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (place) {
      name = place.district ?? place.subregion ?? place.city ?? name;
      region = place.city ?? place.region ?? null;
      countryCode = place.isoCountryCode ?? countryCode;
      // "Kadıköy, İstanbul" yerine "Kadıköy, Kadıköy" çıkmasın.
      if (region === name) region = place.region ?? null;
    }
  } catch {
    // Ad çözümlenemedi; koordinat adıyla devam.
  }

  const row = {
    id,
    name,
    region,
    countryCode,
    latitude,
    longitude,
    timezone: deviceTimezone(),
  };

  await db.insert(locations).values(row).onConflictDoNothing();
  return (await readLocation(id)) ?? null;
}

export function useLocation(): LocationState & { refresh: () => void } {
  const [selectedId, setSelectedId] = useMMKVString(
    StorageKeys.selectedLocationId,
    storage
  );
  const [state, setState] = useState<LocationState>({ status: 'loading' });
  const [nonce, setNonce] = useState(0);

  const refresh = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      // Daha önce seçilmiş bir konum varsa onu kullan — her açılışta
      // GPS uyandırmak hem yavaş hem pil yakıyor.
      if (selectedId) {
        const existing = await readLocation(selectedId);
        if (existing && !cancelled) {
          setState({ status: 'ready', location: existing });
          return;
        }
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) {
        if (!cancelled) {
          setState({ status: 'needsSelection', reason: 'denied' });
        }
        return;
      }

      try {
        const captured = await captureCurrentLocation();
        if (cancelled) return;

        if (captured) {
          setSelectedId(captured.id);
          setState({ status: 'ready', location: captured });
        } else {
          setState({ status: 'needsSelection', reason: 'unavailable' });
        }
      } catch {
        if (!cancelled) {
          setState({ status: 'needsSelection', reason: 'unavailable' });
        }
      }
    }

    resolve();
    return () => {
      cancelled = true;
    };
  }, [selectedId, setSelectedId, nonce]);

  return { ...state, refresh };
}
