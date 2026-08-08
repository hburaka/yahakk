import {
  CalculationMethod,
  Coordinates,
  HighLatitudeRule,
  Madhab,
  PrayerTimes,
} from 'adhan';

import type { DaySchedule, PrayerKey } from './types';

/**
 * Cihazda astronomik hesap. Türkiye'de Diyanet'in yayınladığı vakitler
 * kullanılır; bu motor yurt dışı ve çevrimdışı yedeği içindir.
 *
 * Not: Diyanet kendi "temkin" payını uyguladığı için saf astronomik
 * hesap Türkiye'de resmî vakitten 1-2 dakika sapabilir. Bu yüzden
 * TR içinde bu motor yalnızca anlık görüntü yoksa devreye girer ve
 * arayüzde kaynak "Hesaplanmış" olarak gösterilir.
 */

export type CalculationMethodKey =
  | 'turkey'
  | 'mwl'
  | 'isna'
  | 'ummAlQura'
  | 'egyptian'
  | 'karachi'
  | 'dubai'
  | 'kuwait'
  | 'qatar'
  | 'singapore'
  | 'moonsighting'
  | 'tehran';

export const CALCULATION_METHOD_LABELS: Record<CalculationMethodKey, string> = {
  turkey: 'Türkiye (Diyanet)',
  mwl: 'Müslüman Dünya Birliği',
  isna: 'Kuzey Amerika (ISNA)',
  ummAlQura: 'Ümmü’l-Kurâ (Mekke)',
  egyptian: 'Mısır Genel Araştırma Kurumu',
  karachi: 'Karaçi',
  dubai: 'Dubai',
  kuwait: 'Kuveyt',
  qatar: 'Katar',
  singapore: 'Singapur',
  moonsighting: 'Moonsighting Committee',
  tehran: 'Tahran',
};

const METHOD_FACTORIES = {
  turkey: CalculationMethod.Turkey,
  mwl: CalculationMethod.MuslimWorldLeague,
  isna: CalculationMethod.NorthAmerica,
  ummAlQura: CalculationMethod.UmmAlQura,
  egyptian: CalculationMethod.Egyptian,
  karachi: CalculationMethod.Karachi,
  dubai: CalculationMethod.Dubai,
  kuwait: CalculationMethod.Kuwait,
  qatar: CalculationMethod.Qatar,
  singapore: CalculationMethod.Singapore,
  moonsighting: CalculationMethod.MoonsightingCommittee,
  tehran: CalculationMethod.Tehran,
} as const;

/**
 * İkindi vaktinin belirlenme yöntemi.
 *
 * - `evvel`: gölge = cismin 1 katı + zeval gölgesi (Şâfiî ve cumhur).
 *   **Diyanet bunu yayınlar**, Türkiye'deki camiler buna göre ezan okur.
 * - `sani` : gölge = cismin 2 katı + zeval gölgesi (Hanefî).
 *
 * Mezhep ayarına otomatik bağlanmaz: Türkiye'deki Hanefîlerin çoğu
 * pratikte Diyanet'in yayınladığı asr-ı evvel vaktini kullanıyor.
 * Kullanıcı bunu ayarlardan ayrıca seçer.
 */
export type AsrMethod = 'evvel' | 'sani';

export const ASR_METHOD_LABELS: Record<AsrMethod, string> = {
  evvel: 'Asr-ı evvel (Diyanet)',
  sani: 'Asr-ı sânî (Hanefî)',
};

/**
 * Yüksek enlem kuralı.
 *
 * Kuzey Avrupa'da yazın güneş yeterince batmadığı için imsak ve yatsı
 * astronomik olarak hiç oluşmayabilir ya da uçuk saatlere kayar
 * (Berlin, Ağustos: saf hesapla imsak 02:57). Bu kurallar o durumda
 * geceyi bölerek makul bir vakit üretir.
 *
 * Ayar olarak sunulmasının sebebi: hangi kuralın kullanılacağı bir
 * içtihat meselesi ve bölgeden bölgeye değişiyor. Aynı şehirdeki iki
 * cami farklı kural kullanabiliyor; uygulama kullanıcı adına karar
 * vermemeli. Türkiye'de bu ayarın pratikte etkisi yok.
 */
export type HighLatitudeRuleKey =
  | 'auto'
  | 'middleOfTheNight'
  | 'seventhOfTheNight'
  | 'twilightAngle';

export const HIGH_LATITUDE_RULE_LABELS: Record<HighLatitudeRuleKey, string> = {
  auto: 'Otomatik (konuma göre)',
  middleOfTheNight: 'Gecenin ortası',
  seventhOfTheNight: 'Gecenin yedide biri',
  twilightAngle: 'Şafak açısı',
};

export type CalculationOptions = {
  method: CalculationMethodKey;
  asrMethod: AsrMethod;
  /** IANA saat dilimi — "Europe/Istanbul" */
  timezone: string;
  /** Verilmezse konuma göre otomatik seçilir */
  highLatitudeRule?: HighLatitudeRuleKey;
};

/**
 * Bir Date'i **verilen saat diliminde** gün başından itibaren dakikaya
 * çevirir.
 *
 * Cihazın kendi saat dilimini kullanmak yanlış olurdu: kullanıcı
 * yurt dışındayken memleketinin vakitlerine bakabiliyor, o durumda
 * cihaz saati ile konumun saati farklı.
 */
export function minutesInTimezone(date: Date, timezone: string): number {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(date);

    const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? NaN);
    const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? NaN);

    if (Number.isNaN(hour) || Number.isNaN(minute)) {
      throw new Error('Saat ayrıştırılamadı');
    }
    return hour * 60 + minute;
  } catch {
    // Saat dilimi verisi yoksa cihaz saatine düş. Yanlış olabilir ama
    // ekranın boş kalmasından iyidir; kaynak etiketi kullanıcıyı uyarır.
    return date.getHours() * 60 + date.getMinutes();
  }
}

/**
 * ISO tarihten ("2026-08-07") adhan'ın beklediği Date'i üretir.
 *
 * Öğle 12:00 UTC seçiliyor: UTC-11 ile UTC+12 arasındaki bütün saat
 * dilimlerinde aynı takvim gününe denk gelir, böylece gün sınırında
 * bir gün kayması olmaz.
 */
function dateFromIso(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12));
}

export function todayIso(timezone: string): string {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
  } catch {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  }
}

export type Location = {
  latitude: number;
  longitude: number;
};

/**
 * Vakitleri ham `Date` olarak verir.
 *
 * Bildirim planlaması bunu kullanır: bildirim tetikleyicisi mutlak bir
 * zaman ister ve "şu saat diliminde şu dakika" ifadesini mutlak zamana
 * çevirmek yaz saati geçişlerinde hataya açık. adhan zaten mutlak
 * `Date` üretiyor; arada dakikaya çevirip geri dönmek gereksiz risk.
 */
export function calculateDayTimes(
  location: Location,
  isoDate: string,
  options: Omit<CalculationOptions, 'timezone'>
): Record<PrayerKey, Date> {
  const coordinates = new Coordinates(location.latitude, location.longitude);
  const times = buildPrayerTimes(coordinates, isoDate, options);

  return {
    fajr: times.fajr,
    sunrise: times.sunrise,
    dhuhr: times.dhuhr,
    asr: times.asr,
    maghrib: times.maghrib,
    isha: times.isha,
  };
}

function buildPrayerTimes(
  coordinates: Coordinates,
  isoDate: string,
  options: Omit<CalculationOptions, 'timezone'>
): PrayerTimes {
  const params = METHOD_FACTORIES[options.method]();

  params.madhab = options.asrMethod === 'sani' ? Madhab.Hanafi : Madhab.Shafi;

  const rule = options.highLatitudeRule ?? 'auto';
  params.highLatitudeRule =
    rule === 'middleOfTheNight'
      ? HighLatitudeRule.MiddleOfTheNight
      : rule === 'seventhOfTheNight'
        ? HighLatitudeRule.SeventhOfTheNight
        : rule === 'twilightAngle'
          ? HighLatitudeRule.TwilightAngle
          : HighLatitudeRule.recommended(coordinates);

  return new PrayerTimes(coordinates, dateFromIso(isoDate), params);
}

/**
 * Bir gün için vakitleri, ekranda kullanılan dakika gösterimiyle verir.
 *
 * Yüksek enlemlerde (Kuzey Avrupa) güneş yeterince batmadığı için
 * yatsı ve imsak astronomik olarak oluşmayabilir; yüksek enlem kuralı
 * bu durumda geceyi bölerek makul bir vakit üretir. Kural olmadan
 * kütüphane geçersiz tarih döndürüyor ve ekran boş kalıyor.
 */
export function calculateDaySchedule(
  location: Location,
  isoDate: string,
  options: CalculationOptions
): DaySchedule {
  const coordinates = new Coordinates(location.latitude, location.longitude);
  const times = buildPrayerTimes(coordinates, isoDate, options);
  const toMinutes = (date: Date) => minutesInTimezone(date, options.timezone);

  return {
    date: isoDate,
    times: {
      fajr: toMinutes(times.fajr),
      sunrise: toMinutes(times.sunrise),
      dhuhr: toMinutes(times.dhuhr),
      asr: toMinutes(times.asr),
      maghrib: toMinutes(times.maghrib),
      isha: toMinutes(times.isha),
    },
    source: 'calculated',
  };
}

/**
 * Yalnızca ikindiyi yeniden hesaplar.
 *
 * Kullanıcı Hanefî ikindiyi seçtiğinde Diyanet anlık görüntüsündeki
 * diğer beş vakit korunur, sadece ikindi asr-ı sânîye göre hesaplanır.
 * Böylece kullanıcı hem resmî vakitleri hem tercih ettiği ikindiyi alır.
 */
export function calculateAsr(
  location: Location,
  isoDate: string,
  options: Omit<CalculationOptions, 'asrMethod'> & { asrMethod: AsrMethod }
): number {
  return calculateDaySchedule(location, isoDate, options).times.asr;
}

export const PRAYER_KEYS_FROM_ADHAN: readonly PrayerKey[] = [
  'fajr',
  'sunrise',
  'dhuhr',
  'asr',
  'maghrib',
  'isha',
];
