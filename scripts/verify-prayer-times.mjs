import {
  CalculationMethod,
  Coordinates,
  HighLatitudeRule,
  Madhab,
  PrayerTimes,
} from 'adhan';

const KEYS = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

function minutesInTz(date, tz) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date);
  const h = Number(parts.find((p) => p.type === 'hour').value);
  const m = Number(parts.find((p) => p.type === 'minute').value);
  return h * 60 + m;
}

function fmt(mins) {
  return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
}

function compute(lat, lng, iso, tz, methodName, asr) {
  const [y, m, d] = iso.split('-').map(Number);
  const coords = new Coordinates(lat, lng);
  const params = CalculationMethod[methodName]();
  params.madhab = asr === 'sani' ? Madhab.Hanafi : Madhab.Shafi;
  params.highLatitudeRule = HighLatitudeRule.recommended(coords);
  const t = new PrayerTimes(coords, new Date(Date.UTC(y, m - 1, d, 12)), params);
  const out = {};
  for (const k of KEYS) out[k] = minutesInTz(t[k], tz);
  return out;
}

async function aladhan(lat, lng, iso, methodId, school) {
  const [y, m, d] = iso.split('-');
  const url = `https://api.aladhan.com/v1/timings/${d}-${m}-${y}?latitude=${lat}&longitude=${lng}&method=${methodId}&school=${school}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Aladhan ${res.status}`);
  const json = await res.json();
  const t = json.data.timings;
  const toMin = (s) => { const [hh, mm] = s.split(':').map(Number); return hh * 60 + mm; };
  return {
    fajr: toMin(t.Fajr), sunrise: toMin(t.Sunrise), dhuhr: toMin(t.Dhuhr),
    asr: toMin(t.Asr), maghrib: toMin(t.Maghrib), isha: toMin(t.Isha),
  };
}

const ISO = process.argv[2] ?? new Date().toISOString().slice(0, 10);

const CITIES = [
  { name: 'Istanbul', lat: 41.0082, lng: 28.9784, tz: 'Europe/Istanbul' },
  { name: 'Ankara', lat: 39.9334, lng: 32.8597, tz: 'Europe/Istanbul' },
  { name: 'Erzurum', lat: 39.9043, lng: 41.2679, tz: 'Europe/Istanbul' },
  { name: 'Berlin', lat: 52.52, lng: 13.405, tz: 'Europe/Berlin' },
  { name: 'Tromso(69N)', lat: 69.6496, lng: 18.9560, tz: 'Europe/Oslo' },
];

console.log(`Tarih: ${ISO}   (Diyanet metodu, asr-i evvel)\n`);
let maxDiff = 0;

for (const c of CITIES) {
  const mine = compute(c.lat, c.lng, ISO, c.tz, 'Turkey', 'evvel');
  let ref = null;
  try { ref = await aladhan(c.lat, c.lng, ISO, 13, 0); } catch (e) { /* ag yoksa atla */ }

  const ordered = KEYS.every((k, i) => i === 0 || mine[k] >= mine[KEYS[i - 1]]);
  const finite = KEYS.every((k) => Number.isFinite(mine[k]));

  console.log(`${c.name}`);
  console.log('  benim :', KEYS.map((k) => `${k.slice(0, 3)} ${fmt(mine[k])}`).join('  '));
  if (ref) {
    console.log('  aladhan:', KEYS.map((k) => `${k.slice(0, 3)} ${fmt(ref[k])}`).join('  '));
    const diffs = KEYS.map((k) => Math.abs(mine[k] - ref[k]));
    const worst = Math.max(...diffs);
    maxDiff = Math.max(maxDiff, worst);
    console.log(`  fark  : ${diffs.join(', ')} dk   (en buyuk ${worst} dk)`);
  } else {
    console.log('  aladhan: alinamadi');
  }
  console.log(`  sirali: ${ordered ? 'evet' : 'HAYIR'}   gecerli sayi: ${finite ? 'evet' : 'HAYIR'}`);

  const shafi = compute(c.lat, c.lng, ISO, c.tz, 'Turkey', 'evvel').asr;
  const hanafi = compute(c.lat, c.lng, ISO, c.tz, 'Turkey', 'sani').asr;
  console.log(`  ikindi: asr-i evvel ${fmt(shafi)} / asr-i sani ${fmt(hanafi)}  -> sani daha gec mi: ${hanafi > shafi ? 'evet' : 'HAYIR'}`);
  console.log();
}

console.log(`EN BUYUK SAPMA: ${maxDiff} dakika`);
