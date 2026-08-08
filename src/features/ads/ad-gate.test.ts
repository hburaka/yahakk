import {
  AD_ALLOWED_ROUTES,
  AD_FORBIDDEN_ROUTES,
  canShowAd,
  isAllowedRoute,
  isForbiddenRoute,
  normalizeRoute,
  PRAYER_QUIET_MINUTES,
  type AdContext,
} from './ad-gate';

/**
 * Bu testler bir stil tercihini değil, ürünün store açıklamasında yer
 * alacak bir sözü koruyor: "Kıble, tesbih ve dua ekranlarında asla
 * reklam göstermiyoruz."
 *
 * ⚠️ İlk yazımda bu testler geçti ama hatayı korumadı, **hatayı
 * kodladı**: rotaları `/(tabs)/kible` biçiminde yazmıştım, oysa
 * `usePathname()` grup segmentlerini döndürmüyor ve gerçek değer
 * `/kible`. Sonuç: hiçbir rota eşleşmedi, reklam her yerde kapandı,
 * yasak ekranlar tesadüfen temiz kaldı. Testler de aynı yanlış
 * varsayımı paylaştığı için sessiz kaldı.
 *
 * Bu yüzden aşağıda **gerçek pathname'ler** kullanılıyor ve pozitif
 * durum (izinli ekranda reklam GÖSTERİLEBİLMESİ) ayrıca doğrulanıyor —
 * kural yanlışsa artık testler de düşer.
 */

const base: AdContext = {
  route: '/',
  isPremium: false,
  minutesToNextPrayer: 120,
  isAdhanPlaying: false,
  hasConsent: true,
};

/** expo-router'ın gerçekten ürettiği yollar */
const REAL_PATHS = {
  vakitler: '/',
  kible: '/kible',
  tesbih: '/tesbih',
  rehber: '/rehber',
  ayarlar: '/ayarlar',
  zikirSec: '/zikir-sec',
  rapor: '/tesbih-rapor',
  duaDetay: '/dua/sabah-aksam',
  ilmihalDetay: '/ilmihal/abdest',
  onboarding: '/onboarding',
} as const;

describe('rota normalleştirme', () => {
  it('grup segmentlerini atar', () => {
    expect(normalizeRoute('/(tabs)/kible')).toBe('/kible');
    expect(normalizeRoute('/(tabs)/index')).toBe('/');
  });

  it('index sonunu kök yola indirger', () => {
    expect(normalizeRoute('/index')).toBe('/');
    expect(normalizeRoute('/')).toBe('/');
  });

  it('gerçek pathname biçimini değiştirmez', () => {
    expect(normalizeRoute('/kible')).toBe('/kible');
    expect(normalizeRoute('/dua/sabah-aksam')).toBe('/dua/sabah-aksam');
  });
});

describe('AdGate — yasak bölgeler (gerçek pathname)', () => {
  it.each([
    ['Kıble', REAL_PATHS.kible],
    ['Tesbih', REAL_PATHS.tesbih],
    ['Zikir seçimi', REAL_PATHS.zikirSec],
    ['Tesbihat raporu', REAL_PATHS.rapor],
    ['Dua detayı', REAL_PATHS.duaDetay],
    ['İlmihal detayı', REAL_PATHS.ilmihalDetay],
    ['Karşılama', REAL_PATHS.onboarding],
  ])('%s ekranında reklam gösterilmez (%s)', (_, route) => {
    expect(canShowAd({ ...base, route })).toEqual({
      allowed: false,
      reason: 'route',
    });
    expect(isForbiddenRoute(route)).toBe(true);
    expect(isAllowedRoute(route)).toBe(false);
  });

  it('grup segmentli eski biçim de yasak kalır', () => {
    // Rota biçimi ileride değişirse kural yine tutmalı.
    for (const route of ['/(tabs)/kible', '/(tabs)/tesbih']) {
      expect(canShowAd({ ...base, route }).allowed).toBe(false);
    }
  });

  it('dua ve ilmihal detayı hangi kimlikle olursa olsun yasak', () => {
    for (const id of ['abdest', 'yemek-duasi', '123', 'a-b-c']) {
      expect(canShowAd({ ...base, route: `/dua/${id}` }).allowed).toBe(false);
      expect(canShowAd({ ...base, route: `/ilmihal/${id}` }).allowed).toBe(
        false
      );
    }
  });

  it('tanınmayan yeni bir ekran varsayılan olarak reklamsızdır', () => {
    expect(canShowAd({ ...base, route: '/henuz-olmayan-ekran' })).toEqual({
      allowed: false,
      reason: 'route',
    });
  });
});

describe('AdGate — izinli bölgeler gerçekten izin veriyor', () => {
  // Bu blok olmasaydı "her yerde reklam kapalı" hatası yine sessiz
  // geçerdi: yasak testleri o durumda da geçiyor.
  it.each([
    ['Vakitler', REAL_PATHS.vakitler],
    ['Rehber listesi', REAL_PATHS.rehber],
    ['Ayarlar', REAL_PATHS.ayarlar],
    ['Konum seçme', '/konum-sec'],
    ['Vakit ayarları', '/vakit-ayarlari'],
    ['Okuma ayarları', '/okuma-ayarlari'],
    ['Tesbih görünümü', '/tesbih-gorunum'],
  ])('%s ekranında reklam gösterilebilir (%s)', (_, route) => {
    expect(canShowAd({ ...base, route })).toEqual({ allowed: true });
    expect(isAllowedRoute(route)).toBe(true);
  });

  it('izin listesindeki her rota gerçekten eşleşiyor', () => {
    // Listeye yazılıp da eşleşmeyen bir rota kalmasın.
    for (const route of AD_ALLOWED_ROUTES) {
      expect(isAllowedRoute(route)).toBe(true);
      expect(isForbiddenRoute(route)).toBe(false);
    }
  });

  it('yasak listesindeki her rota gerçekten eşleşiyor', () => {
    for (const pattern of AD_FORBIDDEN_ROUTES) {
      const route = pattern.replace('[id]', 'ornek');
      expect(isForbiddenRoute(route)).toBe(true);
    }
  });

  it('izinli ve yasak listeleri kesişmiyor', () => {
    for (const route of AD_ALLOWED_ROUTES) {
      expect(isForbiddenRoute(route)).toBe(false);
    }
  });
});

describe('AdGate — bağlamsal yasaklar', () => {
  it('ezan çalarken reklam gösterilmez', () => {
    expect(canShowAd({ ...base, isAdhanPlaying: true })).toEqual({
      allowed: false,
      reason: 'adhanPlaying',
    });
  });

  it('destek satın alması yapılmışsa reklam gösterilmez', () => {
    expect(canShowAd({ ...base, isPremium: true })).toEqual({
      allowed: false,
      reason: 'premium',
    });
  });

  it('rıza alınmadan reklam gösterilmez', () => {
    expect(canShowAd({ ...base, hasConsent: false })).toEqual({
      allowed: false,
      reason: 'consent',
    });
  });

  it('vaktin yakınında reklam gösterilmez', () => {
    expect(
      canShowAd({ ...base, minutesToNextPrayer: PRAYER_QUIET_MINUTES })
    ).toEqual({ allowed: false, reason: 'prayerTime' });

    // Vaktin hemen sonrası da sessiz: kullanıcı namaza hazırlanıyor.
    expect(
      canShowAd({ ...base, minutesToNextPrayer: -PRAYER_QUIET_MINUTES + 1 })
    ).toEqual({ allowed: false, reason: 'prayerTime' });

    expect(
      canShowAd({ ...base, minutesToNextPrayer: PRAYER_QUIET_MINUTES + 1 })
    ).toEqual({ allowed: true });
  });

  it('yasak ekran, diğer koşullar uygun olsa bile kazanır', () => {
    expect(
      canShowAd({
        ...base,
        route: REAL_PATHS.tesbih,
        minutesToNextPrayer: 500,
        hasConsent: true,
      })
    ).toEqual({ allowed: false, reason: 'route' });
  });
});
