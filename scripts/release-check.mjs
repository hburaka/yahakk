#!/usr/bin/env node
/**
 * Yayın öncesi kontrol listesi.
 *
 * `npm run release-check`
 *
 * ## Neden var
 *
 * Bu projede en büyük risk teknik değil: **onaylanmamış dinî içeriğin
 * kazayla yayına gitmesi.** Yanlış tarif edilmiş bir abdest ya da eksik
 * yazılmış bir dua, doğrudan kullanıcının ibadetini etkiler ve bunu
 * fark etmesinin bir yolu yoktur.
 *
 * Ekranlarda uyarı var ama uyarı bir kapı değil. `sources.ts` içindeki
 * `blockingSources()` bir dönem yazıldı ve hiçbir yerde kullanılmadı —
 * yani var görünen ama aslında olmayan bir koruma. Bu betik o boşluğu
 * kapatıyor.
 *
 * ## Neden test değil de betik
 *
 * Jest testine konsaydı bugün kırmızı olurdu (her şey onaylanmamış) ve
 * geliştirme boyunca kırmızı duran bir test kısa sürede görmezden
 * gelinir. Bu bir yayın kapısı, gelişim kapısı değil.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Google'ın herkese açık test reklam kimliği öneki */
const ADMOB_TEST_PREFIX = 'ca-app-pub-3940256099942544';
/** Klasör adından gelen geçici paket kimliği */
const PLACEHOLDER_PACKAGE = 'com.yahakk.app';

const results = [];

function check(name, ok, detail, severity = 'blocker') {
  results.push({ name, ok, detail, severity });
}

function readIfExists(path) {
  const full = join(root, path);
  return existsSync(full) ? readFileSync(full, 'utf8') : null;
}

/**
 * Bir klasördeki .ts dosyalarında bir kalıbı sayar.
 *
 * Kalıp **kendi satırında** aranıyor. Serbest arama yapıldığında
 * yorumlardaki "hepsi `reviewed: false`" gibi cümleler de sayılıyordu
 * ve rakam gerçekten bir fazla çıkıyordu. Güvenilmeyen bir sayı, hiç
 * sayı olmamasından kötü: kullanıcı 47 görüp 46'yı onaylayınca "bir
 * tane kaldı" sanır ve aramaya çıkar.
 */
function countInDir(dir, pattern) {
  const full = join(root, dir);
  if (!existsSync(full)) return 0;
  let total = 0;
  for (const file of readdirSync(full)) {
    if (!file.endsWith('.ts') || file.endsWith('.test.ts')) continue;
    const text = readFileSync(join(full, file), 'utf8');
    total += (text.match(pattern) ?? []).length;
  }
  return total;
}

// ───────────────────────── İçerik ─────────────────────────

const unreviewedIlmihal = countInDir(
  'src/features/ilmihal/content',
  /^\s*reviewed:\s*false,?\s*$/gm
);
check(
  'İlmihal içeriği onaylandı',
  unreviewedIlmihal === 0,
  unreviewedIlmihal > 0
    ? `${unreviewedIlmihal} konu hâlâ reviewed: false. Ehil biri okumadan yayına giremez.`
    : 'Tüm konular onaylı.'
);

const unreviewedDua = countInDir(
  'src/features/dua/content',
  /^\s*reviewed:\s*false,?\s*$/gm
);
check(
  'Dua içeriği onaylandı',
  unreviewedDua === 0,
  unreviewedDua > 0
    ? `${unreviewedDua} dua hâlâ reviewed: false.`
    : 'Tüm dualar onaylı.'
);

const sources = readIfExists('src/features/content/sources.ts') ?? '';
const pendingSources = (sources.match(/clearance:\s*'(pending|draft)'/g) ?? [])
  .length;
check(
  'İçerik kaynakları yayına hazır',
  pendingSources === 0,
  pendingSources > 0
    ? `${pendingSources} kaynak hâlâ pending/draft. Telif izni gelmeden o metinler yayına giremez.`
    : 'Tüm kaynaklar temiz.'
);

// ─────────────────────── Yapılandırma ───────────────────────

const appJson = JSON.parse(readIfExists('app.json') ?? '{}');
const expo = appJson.expo ?? {};

const pkg = expo.android?.package ?? '';
check(
  'Paket kimliği kesinleşti',
  pkg !== PLACEHOLDER_PACKAGE && pkg.length > 0,
  pkg === PLACEHOLDER_PACKAGE
    ? `"${pkg}" klasör adından geliyor. İlk mağaza gönderiminden sonra DEĞİŞTİRİLEMEZ.`
    : pkg
);

/*
  AdMob iki ayrı kimlik istiyor ve ikisi de gerekli:
  - Uygulama kimliği (`~` işaretli) manifeste gömülüyor
  - Reklam birimi kimliği (`/` işaretli) banner'ın kendisi

  Yalnızca birincisi girilirse reklam hiç gösterilmez ve bu sessiz bir
  hata olur; o yüzden ikisi ayrı ayrı kontrol ediliyor.

  Kontroller Android'e bakıyor: iOS'a çıkılmıyor ve oradaki test
  kimliği bir engel değil.
*/
const adPlugin = (expo.plugins ?? []).find(
  (plugin) => Array.isArray(plugin) && plugin[0] === 'react-native-google-mobile-ads'
);
const androidAppId = adPlugin?.[1]?.androidAppId ?? '';
check(
  'AdMob uygulama kimliği (Android)',
  androidAppId.length > 0 && !androidAppId.includes(ADMOB_TEST_PREFIX),
  androidAppId.includes(ADMOB_TEST_PREFIX)
    ? 'Hâlâ Google test kimliği. Yayında hiç gelir üretmez.'
    : androidAppId
);

const bannerAndroid = expo.extra?.admobBannerAndroid ?? '';
check(
  'AdMob banner birimi (Android)',
  bannerAndroid.length > 0 && !bannerAndroid.includes(ADMOB_TEST_PREFIX),
  bannerAndroid.length === 0
    ? 'Boş. Yayında banner hiç gösterilmez — kod bunu bilerek yapıyor, test reklamı göstermektense reklamsız olmak yeğdir.'
    : bannerAndroid
);

const extra = JSON.stringify(expo.extra ?? {});
const hasRevenueCat =
  /"revenueCat(Ios|Android)Key"\s*:\s*"[^"]+"/.test(extra);
/*
  Engel değil, uyarı. Anahtar yokken "Uygulamayı destekle" bölümü
  arayüzde hiç görünmüyor (bkz. `isPurchaseAvailable`), yani kullanıcı
  çalışmayan bir düğmeyle karşılaşmıyor. Uygulama bu hâliyle yayına
  çıkabilir; tek sonucu reklamların kaldırılamaması.
*/
check(
  'RevenueCat anahtarları girildi',
  hasRevenueCat,
  hasRevenueCat
    ? 'Girilmiş.'
    : 'Boş. Destek bölümü arayüzde gizli kalıyor, yani reklamlar kaldırılamıyor. Uygulama yine de çalışıyor; sonradan eklenebilir.',
  'warning'
);

const manifestPermissions = readIfExists('app.json') ?? '';
check(
  'SYSTEM_ALERT_WINDOW engellendi',
  manifestPermissions.includes('SYSTEM_ALERT_WINDOW'),
  manifestPermissions.includes('SYSTEM_ALERT_WINDOW')
    ? 'blockedPermissions içinde.'
    : '"Diğer uygulamaların üzerine çiz" izni yayına gidiyor. Gizliliği satış noktası olan bir uygulamada kötü görünür.',
  'warning'
);

// ───────────────────────── Varlıklar ─────────────────────────

const adhanSound = existsSync(join(root, 'assets/audio'));
check(
  'Ezan/bildirim sesi eklendi',
  adhanSound,
  adhanSound
    ? 'assets/audio mevcut.'
    : 'Ses dosyası yok; telefonun varsayılan bildirim sesi kullanılıyor. Telifi net olmayan kayıt konulmamalı.',
  'warning'
);

// ───────────────────────── Rapor ─────────────────────────

const blockers = results.filter((r) => !r.ok && r.severity === 'blocker');
const warnings = results.filter((r) => !r.ok && r.severity === 'warning');

console.log('\n  YAYIN ÖNCESİ KONTROL\n');
for (const r of results) {
  const mark = r.ok ? '  ✓' : r.severity === 'blocker' ? '  ✗' : '  !';
  console.log(`${mark} ${r.name}`);
  if (!r.ok) console.log(`      ${r.detail}`);
}

console.log('');
if (blockers.length === 0 && warnings.length === 0) {
  console.log('  Yayına hazır.\n');
  process.exit(0);
}

console.log(
  `  ${blockers.length} engel, ${warnings.length} uyarı.\n`
);
if (blockers.length > 0) {
  console.log('  Engeller giderilmeden mağazaya gönderilmemeli.');
  console.log('  En kritiği içerik onayı: bu uygulamanın verebileceği');
  console.log('  en ağır zarar, yanlış bir dinî bilgiye güvenilmesi.\n');
}

process.exit(blockers.length > 0 ? 1 : 0);
