/**
 * Cihazdaki hesabı, Diyanet'in RESMÎ YAYINLADIĞI vakitlerle karşılaştırır.
 *
 * Referans değerler namazvakitleri.diyanet.gov.tr'den alındı.
 * Diyanet'in API servisi (awqatsalah.diyanet.gov.tr) artık boş sayfa
 * döndürüyor, bu yüzden veri elle toplandı.
 *
 * Bu karşılaştırmanın önemi: Diyanet kendi "temkin" payını uyguluyor,
 * yani saf astronomik hesabın resmî vakitten sapması bekleniyor.
 * Sapmanın büyüklüğü ve tutarlılığı, düzeltme uygulayıp
 * uygulayamayacağımızı belirliyor.
 *
 * Kullanım:  node scripts/compare-diyanet.mjs
 */
import {
  CalculationMethod,
  Coordinates,
  HighLatitudeRule,
  Madhab,
  PrayerTimes,
} from 'adhan';

const TR_LABELS = ['İmsak', 'Güneş', 'Öğle', 'İkindi', 'Akşam', 'Yatsı'];
const KEYS = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

const TR_MONTHS = {
  Ocak: 1, Şubat: 2, Mart: 3, Nisan: 4, Mayıs: 5, Haziran: 6,
  Temmuz: 7, Ağustos: 8, Eylül: 9, Ekim: 10, Kasım: 11, Aralık: 12,
};

/** [tarih, imsak, güneş, öğle, ikindi, akşam, yatsı] */
const ANKARA_RAW = [
  ['07 Ağustos 2026','04:07','05:45','12:59','16:50','20:04','21:35'],
  ['08 Ağustos 2026','04:08','05:46','12:59','16:50','20:02','21:34'],
  ['09 Ağustos 2026','04:10','05:47','12:59','16:49','20:01','21:32'],
  ['10 Ağustos 2026','04:11','05:48','12:59','16:49','20:00','21:30'],
  ['11 Ağustos 2026','04:13','05:49','12:59','16:48','19:59','21:29'],
  ['12 Ağustos 2026','04:14','05:50','12:59','16:48','19:57','21:27'],
  ['13 Ağustos 2026','04:15','05:51','12:59','16:47','19:56','21:25'],
  ['14 Ağustos 2026','04:17','05:52','12:58','16:47','19:55','21:23'],
  ['15 Ağustos 2026','04:18','05:53','12:58','16:46','19:53','21:22'],
  ['16 Ağustos 2026','04:20','05:54','12:58','16:46','19:52','21:20'],
  ['17 Ağustos 2026','04:21','05:55','12:58','16:45','19:51','21:18'],
  ['18 Ağustos 2026','04:22','05:56','12:58','16:44','19:49','21:16'],
  ['19 Ağustos 2026','04:24','05:57','12:57','16:44','19:48','21:15'],
  ['20 Ağustos 2026','04:25','05:58','12:57','16:43','19:46','21:13'],
  ['21 Ağustos 2026','04:26','05:59','12:57','16:42','19:45','21:11'],
  ['22 Ağustos 2026','04:28','06:00','12:57','16:42','19:44','21:09'],
  ['23 Ağustos 2026','04:29','06:01','12:56','16:41','19:42','21:07'],
  ['24 Ağustos 2026','04:30','06:02','12:56','16:40','19:41','21:06'],
  ['25 Ağustos 2026','04:32','06:03','12:56','16:39','19:39','21:04'],
  ['26 Ağustos 2026','04:33','06:03','12:56','16:39','19:38','21:02'],
  ['27 Ağustos 2026','04:34','06:04','12:55','16:38','19:36','21:00'],
  ['28 Ağustos 2026','04:36','06:05','12:55','16:37','19:35','20:58'],
  ['29 Ağustos 2026','04:37','06:06','12:55','16:36','19:33','20:57'],
  ['30 Ağustos 2026','04:38','06:07','12:54','16:35','19:32','20:55'],
  ['31 Ağustos 2026','04:39','06:08','12:54','16:34','19:30','20:53'],
  ['01 Eylül 2026','04:41','06:09','12:54','16:34','19:28','20:51'],
  ['02 Eylül 2026','04:42','06:10','12:53','16:33','19:27','20:49'],
  ['03 Eylül 2026','04:43','06:11','12:53','16:32','19:25','20:47'],
  ['04 Eylül 2026','04:44','06:12','12:53','16:31','19:24','20:45'],
  ['05 Eylül 2026','04:46','06:13','12:52','16:30','19:22','20:44'],
  ['06 Eylül 2026','04:47','06:14','12:52','16:29','19:20','20:42'],
  ['01 Ocak 2026','06:33','08:03','12:57','15:20','17:41','19:05'],
  ['02 Ocak 2026','06:33','08:03','12:57','15:21','17:41','19:06'],
  ['03 Ocak 2026','06:33','08:03','12:58','15:21','17:42','19:07'],
  ['04 Ocak 2026','06:34','08:04','12:58','15:22','17:43','19:08'],
  ['05 Ocak 2026','06:34','08:04','12:59','15:23','17:44','19:09'],
  ['06 Ocak 2026','06:34','08:04','12:59','15:24','17:45','19:09'],
  ['07 Ocak 2026','06:34','08:03','13:00','15:25','17:46','19:10'],
  ['08 Ocak 2026','06:34','08:03','13:00','15:26','17:47','19:11'],
  ['09 Ocak 2026','06:34','08:03','13:01','15:26','17:48','19:12'],
  ['10 Ocak 2026','06:34','08:03','13:01','15:27','17:49','19:13'],
  ['11 Ocak 2026','06:34','08:03','13:01','15:28','17:50','19:14'],
  ['12 Ocak 2026','06:34','08:03','13:02','15:29','17:51','19:15'],
  ['13 Ocak 2026','06:33','08:02','13:02','15:30','17:52','19:15'],
  ['14 Ocak 2026','06:33','08:02','13:02','15:31','17:53','19:16'],
  ['15 Ocak 2026','06:33','08:02','13:03','15:32','17:54','19:17'],
  ['16 Ocak 2026','06:33','08:01','13:03','15:33','17:55','19:18'],
  ['17 Ocak 2026','06:33','08:01','13:04','15:34','17:56','19:19'],
  ['18 Ocak 2026','06:32','08:00','13:04','15:35','17:57','19:20'],
  ['19 Ocak 2026','06:32','08:00','13:04','15:36','17:59','19:21'],
  ['20 Ocak 2026','06:31','07:59','13:04','15:37','18:00','19:22'],
  ['21 Ocak 2026','06:31','07:59','13:05','15:38','18:01','19:23'],
  ['22 Ocak 2026','06:31','07:58','13:05','15:39','18:02','19:24'],
  ['23 Ocak 2026','06:30','07:57','13:05','15:40','18:03','19:25'],
  ['24 Ocak 2026','06:30','07:57','13:06','15:41','18:04','19:26'],
  ['25 Ocak 2026','06:29','07:56','13:06','15:42','18:06','19:27'],
  ['26 Ocak 2026','06:29','07:55','13:06','15:43','18:07','19:28'],
  ['27 Ocak 2026','06:28','07:55','13:06','15:44','18:08','19:29'],
  ['28 Ocak 2026','06:27','07:54','13:06','15:45','18:09','19:30'],
  ['29 Ocak 2026','06:27','07:53','13:07','15:46','18:10','19:31'],
  ['30 Ocak 2026','06:26','07:52','13:07','15:47','18:11','19:32'],
];

const ISTANBUL_RAW = [
  ['07 Ağustos 2026','04:17','05:59','13:15','17:07','20:21','21:56'],
  ['08 Ağustos 2026','04:19','06:00','13:15','17:07','20:20','21:54'],
  ['09 Ağustos 2026','04:20','06:01','13:15','17:06','20:19','21:52'],
  ['10 Ağustos 2026','04:22','06:02','13:15','17:06','20:18','21:50'],
  ['11 Ağustos 2026','04:23','06:03','13:14','17:05','20:16','21:49'],
  ['12 Ağustos 2026','04:25','06:04','13:14','17:05','20:15','21:47'],
  ['13 Ağustos 2026','04:26','06:05','13:14','17:04','20:14','21:45'],
  ['14 Ağustos 2026','04:28','06:06','13:14','17:03','20:12','21:43'],
  ['15 Ağustos 2026','04:29','06:07','13:14','17:03','20:11','21:41'],
  ['16 Ağustos 2026','04:31','06:08','13:14','17:02','20:10','21:40'],
  ['17 Ağustos 2026','04:32','06:09','13:13','17:02','20:08','21:38'],
  ['18 Ağustos 2026','04:34','06:10','13:13','17:01','20:07','21:36'],
  ['19 Ağustos 2026','04:35','06:11','13:13','17:00','20:05','21:34'],
  ['20 Ağustos 2026','04:37','06:12','13:13','16:59','20:04','21:32'],
  ['21 Ağustos 2026','04:38','06:13','13:12','16:59','20:02','21:30'],
  ['22 Ağustos 2026','04:39','06:14','13:12','16:58','20:01','21:28'],
  ['23 Ağustos 2026','04:41','06:15','13:12','16:57','19:59','21:27'],
  ['24 Ağustos 2026','04:42','06:16','13:12','16:56','19:58','21:25'],
  ['25 Ağustos 2026','04:44','06:17','13:11','16:56','19:56','21:23'],
  ['26 Ağustos 2026','04:45','06:18','13:11','16:55','19:55','21:21'],
  ['27 Ağustos 2026','04:46','06:19','13:11','16:54','19:53','21:19'],
  ['28 Ağustos 2026','04:48','06:20','13:10','16:53','19:52','21:17'],
  ['29 Ağustos 2026','04:49','06:20','13:10','16:52','19:50','21:15'],
  ['30 Ağustos 2026','04:50','06:21','13:10','16:51','19:48','21:13'],
  ['31 Ağustos 2026','04:52','06:22','13:10','16:50','19:47','21:11'],
  ['01 Eylül 2026','04:53','06:23','13:09','16:49','19:45','21:09'],
  ['02 Eylül 2026','04:54','06:24','13:09','16:49','19:43','21:07'],
  ['03 Eylül 2026','04:56','06:25','13:09','16:48','19:42','21:06'],
  ['04 Eylül 2026','04:57','06:26','13:08','16:47','19:40','21:04'],
  ['05 Eylül 2026','04:58','06:27','13:08','16:46','19:39','21:02'],
  ['06 Eylül 2026','05:00','06:28','13:08','16:45','19:37','21:00'],
  ['01 Ocak 2026','06:50','08:22','13:12','15:32','17:53','19:19'],
  ['02 Ocak 2026','06:50','08:22','13:13','15:33','17:54','19:20'],
  ['03 Ocak 2026','06:50','08:22','13:13','15:34','17:55','19:21'],
  ['04 Ocak 2026','06:51','08:22','13:14','15:34','17:55','19:22'],
  ['05 Ocak 2026','06:51','08:22','13:14','15:35','17:56','19:22'],
  ['06 Ocak 2026','06:51','08:22','13:15','15:36','17:57','19:23'],
  ['07 Ocak 2026','06:51','08:22','13:15','15:37','17:58','19:24'],
  ['08 Ocak 2026','06:51','08:22','13:16','15:38','17:59','19:25'],
  ['09 Ocak 2026','06:51','08:22','13:16','15:39','18:00','19:26'],
  ['10 Ocak 2026','06:51','08:22','13:16','15:40','18:01','19:27'],
  ['11 Ocak 2026','06:51','08:21','13:17','15:41','18:02','19:28'],
  ['12 Ocak 2026','06:50','08:21','13:17','15:42','18:03','19:29'],
  ['13 Ocak 2026','06:50','08:21','13:18','15:43','18:04','19:30'],
  ['14 Ocak 2026','06:50','08:20','13:18','15:44','18:06','19:30'],
  ['15 Ocak 2026','06:50','08:20','13:18','15:45','18:07','19:31'],
  ['16 Ocak 2026','06:50','08:20','13:19','15:46','18:08','19:32'],
  ['17 Ocak 2026','06:49','08:19','13:19','15:47','18:09','19:33'],
  ['18 Ocak 2026','06:49','08:19','13:19','15:48','18:10','19:34'],
  ['19 Ocak 2026','06:49','08:18','13:20','15:49','18:11','19:35'],
  ['20 Ocak 2026','06:48','08:18','13:20','15:50','18:12','19:36'],
  ['21 Ocak 2026','06:48','08:17','13:20','15:51','18:14','19:37'],
  ['22 Ocak 2026','06:47','08:16','13:21','15:52','18:15','19:38'],
  ['23 Ocak 2026','06:47','08:16','13:21','15:53','18:16','19:40'],
  ['24 Ocak 2026','06:46','08:15','13:21','15:54','18:17','19:41'],
  ['25 Ocak 2026','06:46','08:14','13:21','15:55','18:18','19:42'],
  ['26 Ocak 2026','06:45','08:13','13:22','15:56','18:20','19:43'],
  ['27 Ocak 2026','06:44','08:13','13:22','15:57','18:21','19:44'],
  ['28 Ocak 2026','06:44','08:12','13:22','15:58','18:22','19:45'],
  ['29 Ocak 2026','06:43','08:11','13:22','15:59','18:23','19:46'],
  ['30 Ocak 2026','06:42','08:10','13:22','16:00','18:25','19:47'],
];

const PLACES = [
  {
    city: 'Ankara',
    lat: 39.9334,
    lng: 32.8597,
    tz: 'Europe/Istanbul',
    rows: ANKARA_RAW,
  },
  {
    city: 'İstanbul',
    lat: 41.0082,
    lng: 28.9784,
    tz: 'Europe/Istanbul',
    rows: ISTANBUL_RAW,
  },
];

const toMin = (s) => {
  const [h, m] = s.split(':').map(Number);
  return h * 60 + m;
};

function parseTrDate(text) {
  const [day, month, year] = text.trim().split(/\s+/);
  return `${year}-${String(TR_MONTHS[month]).padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function minutesInTz(date, tz) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date);
  return (
    Number(parts.find((p) => p.type === 'hour').value) * 60 +
    Number(parts.find((p) => p.type === 'minute').value)
  );
}

function compute(lat, lng, iso, tz, adjustments) {
  const [y, m, d] = iso.split('-').map(Number);
  const coords = new Coordinates(lat, lng);
  const params = CalculationMethod.Turkey();
  params.madhab = Madhab.Shafi; // Diyanet asr-ı evvel yayınlar
  params.highLatitudeRule = HighLatitudeRule.recommended(coords);
  if (adjustments) params.adjustments = adjustments;
  const t = new PrayerTimes(coords, new Date(Date.UTC(y, m - 1, d, 12)), params);
  return KEYS.map((k) => minutesInTz(t[k], tz));
}

function analyse(adjustments, label) {
  const diffsByPrayer = KEYS.map(() => []);
  let total = 0;
  let exact = 0;
  let worst = 0;

  for (const place of PLACES) {
    const seen = new Set();
    for (const row of place.rows) {
      const iso = parseTrDate(row[0]);
      if (seen.has(iso)) continue;
      seen.add(iso);

      const official = row.slice(1).map(toMin);
      const mine = compute(place.lat, place.lng, iso, place.tz, adjustments);

      official.forEach((o, i) => {
        const diff = mine[i] - o;
        diffsByPrayer[i].push(diff);
        total += 1;
        if (diff === 0) exact += 1;
        worst = Math.max(worst, Math.abs(diff));
      });
    }
  }

  console.log(`\n${label}`);
  console.log(`  karşılaştırılan : ${total} vakit`);
  console.log(`  birebir tutan   : ${exact} (%${Math.round((exact / total) * 100)})`);
  console.log(`  en büyük sapma  : ${worst} dk`);
  console.log('  vakit bazında (ortalama / min / max):');
  diffsByPrayer.forEach((d, i) => {
    const avg = d.reduce((a, b) => a + b, 0) / d.length;
    console.log(
      `    ${TR_LABELS[i].padEnd(7)} ${(avg >= 0 ? '+' : '') + avg.toFixed(2)} dk   [${Math.min(...d)} .. ${Math.max(...d)}]`
    );
  });
  return diffsByPrayer;
}

const before = analyse(null, 'DÜZELTMESİZ');

/**
 * İftar ihtiyat payının etkisi.
 *
 * Sorulan soru: akşam vaktine kaç dakika eklersek, hesabımız Diyanet'in
 * yayınladığı vakitten HİÇBİR ZAMAN erken olmaz? Oruç açarken erken
 * olmak, geç olmaktan farklı bir şey.
 */
console.log('\n═════ İFTAR İHTİYAT PAYI ═════');
console.log('  (akşama eklenir — erken olmamak için)');
const maghribDiffs = before[4];
for (const margin of [0, 1, 2, 3]) {
  const shifted = maghribDiffs.map((d) => d + margin);
  const early = shifted.filter((d) => d < 0).length;
  const late = shifted.filter((d) => d > 0);
  console.log(
    `  +${margin} dk → erken kalan: ${early}/${shifted.length}` +
      `   en fazla geç: ${late.length ? Math.max(...late) : 0} dk`
  );
}

/**
 * Sahur, iftarın simetriği ama ters yönde: burada erken değil GEÇ
 * olmak sorun. İmsakımız Diyanet'inkinden sonra çıkarsa kullanıcı
 * imsaktan sonra yemeye devam eder. Bu yüzden pay çıkarılır.
 */
console.log('\n═════ SAHUR İHTİYAT PAYI ═════');
console.log('  (imsaktan çıkarılır — geç kalmamak için)');
const fajrDiffs = before[0];
for (const margin of [0, 1, 2, 3]) {
  const shifted = fajrDiffs.map((d) => d - margin);
  const late = shifted.filter((d) => d > 0).length;
  const early = shifted.filter((d) => d < 0);
  console.log(
    `  -${margin} dk → geç kalan: ${late}/${shifted.length}` +
      `   en fazla erken: ${early.length ? Math.abs(Math.min(...early)) : 0} dk`
  );
}

// Ortalama sapmanın tersini düzeltme olarak uygula.
const suggested = before.map(
  (d) => -Math.round(d.reduce((a, b) => a + b, 0) / d.length)
);
const adjustments = {
  fajr: suggested[0], sunrise: suggested[1], dhuhr: suggested[2],
  asr: suggested[3], maghrib: suggested[4], isha: suggested[5],
};

console.log(`\nÖnerilen düzeltme (dk): ${JSON.stringify(adjustments)}`);
analyse(adjustments, 'DÜZELTMELİ');
