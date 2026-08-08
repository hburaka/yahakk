import * as Localization from 'expo-localization';
import * as Location from 'expo-location';

import type { NewLocation } from '@/core/db/schema';

/**
 * Şehir arama.
 *
 * 81 il ve ~970 ilçenin koordinatını uygulamaya gömmek yerine cihazın
 * coğrafi kodlama servisi kullanılıyor. Sebepler:
 *  - Koordinatları elle listelemek hata kaynağı; birkaç kilometrelik
 *    sapma vakti dakikalarca kaydırabiliyor.
 *  - Yurt dışı da aynı ekranla çalışıyor, ayrı veri gerekmiyor.
 *  - Paket boyutu artmıyor.
 *
 * Karşılığında arama **internet istiyor**. Bu kabul edilebilir: konum
 * seçmek tek seferlik bir kurulum adımı ve sonuç kalıcı olarak
 * kaydediliyor; vakit hesabı bundan sonra tamamen çevrimdışı.
 */

export type LocationCandidate = NewLocation & { label: string };

function deviceTimezone(): string {
  return Localization.getCalendars()[0]?.timeZone ?? 'Europe/Istanbul';
}

function coordinateId(latitude: number, longitude: number): string {
  return `coord:${latitude.toFixed(4)},${longitude.toFixed(4)}`;
}

/** Aynı noktayı gösteren sonuçları eler */
function dedupe(items: LocationCandidate[]): LocationCandidate[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export type SearchOutcome =
  | { status: 'ok'; results: LocationCandidate[] }
  | { status: 'empty' }
  | { status: 'offline' };

export async function searchLocations(query: string): Promise<SearchOutcome> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return { status: 'empty' };

  let matches: Location.LocationGeocodedLocation[];
  try {
    // Türkiye eki, "Konya" gibi tek kelimelik aramaların dünyanın başka
    // yerlerindeki adaşlarına düşmesini engelliyor. Kullanıcı zaten
    // ülke yazdıysa ikinci arama gereksiz kalıyor, o yüzden ikisi de
    // deneniyor ve sonuçlar birleştiriliyor.
    const [local, global] = await Promise.all([
      Location.geocodeAsync(`${trimmed}, Türkiye`).catch(() => []),
      Location.geocodeAsync(trimmed).catch(() => []),
    ]);
    matches = [...local, ...global];
  } catch {
    return { status: 'offline' };
  }

  if (matches.length === 0) return { status: 'empty' };

  const timezone = deviceTimezone();
  const candidates: LocationCandidate[] = [];

  for (const match of matches.slice(0, 8)) {
    let name = trimmed;
    let region: string | null = null;
    let countryCode = 'TR';

    try {
      const [place] = await Location.reverseGeocodeAsync({
        latitude: match.latitude,
        longitude: match.longitude,
      });
      if (place) {
        name = place.district ?? place.subregion ?? place.city ?? trimmed;
        region = place.city ?? place.region ?? null;
        countryCode = place.isoCountryCode ?? countryCode;
        if (region === name) region = place.region ?? null;
      }
    } catch {
      // Ad çözümlenemedi; aranan metinle devam. Vakit hesabı için
      // koordinat yeterli, isim kozmetik.
    }

    candidates.push({
      id: coordinateId(match.latitude, match.longitude),
      name,
      region,
      countryCode,
      latitude: match.latitude,
      longitude: match.longitude,
      timezone,
      label: region ? `${name}, ${region}` : name,
    });
  }

  const unique = dedupe(candidates);
  return unique.length > 0 ? { status: 'ok', results: unique } : { status: 'empty' };
}
