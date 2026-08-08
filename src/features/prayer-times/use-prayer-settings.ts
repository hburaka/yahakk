import { useCallback } from 'react';
import { useMMKVString } from 'react-native-mmkv';

import { storage, StorageKeys } from '@/core/store/storage';

import {
  CALCULATION_METHOD_LABELS,
  HIGH_LATITUDE_RULE_LABELS,
  type AsrMethod,
  type CalculationMethodKey,
  type HighLatitudeRuleKey,
} from './calculate';
import { clampMargin, type PrayerMargins } from './margins';

export type PrayerSettings = {
  asrMethod: AsrMethod;
  setAsrMethod: (value: AsrMethod) => void;
  calculationMethod: CalculationMethodKey;
  setCalculationMethod: (value: CalculationMethodKey) => void;
  highLatitudeRule: HighLatitudeRuleKey;
  setHighLatitudeRule: (value: HighLatitudeRuleKey) => void;
  /** Sahur ve iftar ihtiyat payları, ikisi de varsayılan 0 */
  margins: PrayerMargins;
  setMaghribMargin: (minutes: number) => void;
  setFajrMargin: (minutes: number) => void;
};

/** Hook dışından okumak için — bildirim planlayıcı React ağacının dışında */
export function readMargins(): PrayerMargins {
  return {
    fajr: clampMargin(storage.getString(StorageKeys.fajrMargin)),
    maghrib: clampMargin(storage.getString(StorageKeys.maghribMargin)),
  };
}

/**
 * Vakit hesabını etkileyen ayarlar.
 *
 * Varsayılanlar Türkiye'ye göre: Diyanet metodu ve asr-ı evvel.
 * Bunlar mezhep ayarına bağlı DEĞİL — Türkiye'deki Hanefîlerin çoğu
 * pratikte Diyanet'in yayınladığı ikindiyi kullanıyor, mezhep seçimi
 * ikindiyi kendiliğinden değiştirseydi kullanıcı camiyle uyuşmayan
 * bir vakit görürdü.
 */
export function usePrayerSettings(): PrayerSettings {
  const [asr, setAsr] = useMMKVString(StorageKeys.asrMethod, storage);
  const [method, setMethod] = useMMKVString(
    StorageKeys.calculationMethod,
    storage
  );
  const [highLat, setHighLat] = useMMKVString(
    StorageKeys.highLatitudeRule,
    storage
  );
  const [maghribRaw, setMaghribRaw] = useMMKVString(
    StorageKeys.maghribMargin,
    storage
  );
  const [fajrRaw, setFajrRaw] = useMMKVString(StorageKeys.fajrMargin, storage);

  const maghribMargin = clampMargin(maghribRaw);
  const fajrMargin = clampMargin(fajrRaw);

  return {
    asrMethod: asr === 'sani' ? 'sani' : 'evvel',
    setAsrMethod: useCallback((value) => setAsr(value), [setAsr]),

    calculationMethod:
      method !== undefined && method in CALCULATION_METHOD_LABELS
        ? (method as CalculationMethodKey)
        : 'turkey',
    setCalculationMethod: useCallback((value) => setMethod(value), [setMethod]),

    highLatitudeRule:
      highLat !== undefined && highLat in HIGH_LATITUDE_RULE_LABELS
        ? (highLat as HighLatitudeRuleKey)
        : 'auto',
    setHighLatitudeRule: useCallback((value) => setHighLat(value), [setHighLat]),

    margins: { fajr: fajrMargin, maghrib: maghribMargin },
    setMaghribMargin: useCallback(
      (minutes: number) =>
        setMaghribRaw(String(Math.max(0, Math.round(minutes)))),
      [setMaghribRaw]
    ),
    setFajrMargin: useCallback(
      (minutes: number) => setFajrRaw(String(Math.max(0, Math.round(minutes)))),
      [setFajrRaw]
    ),
  };
}
