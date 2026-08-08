import {
  AD_FORBIDDEN_ROUTES,
  canShowAd,
  isAllowedRoute,
  isForbiddenRoute,
  PRAYER_QUIET_MINUTES,
  type AdContext,
} from './ad-gate';

/**
 * Bu testler bir stil tercihini değil, ürünün store açıklamasında yer
 * alacak bir sözü koruyor: "Kıble, tesbih ve dua ekranlarında asla
 * reklam göstermiyoruz." Söz iyi niyete bırakılırsa altı ay sonra biri
 * "bir tanecik banner" ekler.
 */

const base: AdContext = {
  route: '/(tabs)/index',
  isPremium: false,
  minutesToNextPrayer: 120,
  isAdhanPlaying: false,
  hasConsent: true,
};

describe('AdGate — yasak bölgeler', () => {
  it.each(AD_FORBIDDEN_ROUTES)('%s ekranında reklam gösterilmez', (route) => {
    const decision = canShowAd({ ...base, route });
    expect(decision).toEqual({ allowed: false, reason: 'route' });
  });

  it('ibadet ekranları izin listesinde bulunmaz', () => {
    for (const route of AD_FORBIDDEN_ROUTES) {
      expect(isAllowedRoute(route)).toBe(false);
      expect(isForbiddenRoute(route)).toBe(true);
    }
  });

  it('dua detayı dinamik kimlikle de yasaktır', () => {
    expect(canShowAd({ ...base, route: '/dua/sabah-aksam' })).toEqual({
      allowed: false,
      reason: 'route',
    });
    expect(canShowAd({ ...base, route: '/ilmihal/abdest' })).toEqual({
      allowed: false,
      reason: 'route',
    });
  });

  it('tanınmayan yeni bir ekran varsayılan olarak reklamsızdır', () => {
    // İzin listesi yaklaşımının asıl faydası bu: ileride eklenecek bir
    // ekran unutulsa bile ibadet bölünmüyor.
    expect(canShowAd({ ...base, route: '/henuz-olmayan-ekran' })).toEqual({
      allowed: false,
      reason: 'route',
    });
  });
});

describe('AdGate — izinli bölgeler', () => {
  it('namaz vakitleri ekranında reklam gösterilebilir', () => {
    expect(canShowAd(base)).toEqual({ allowed: true });
  });

  it('rehber listesinde gösterilir, detayında gösterilmez', () => {
    expect(canShowAd({ ...base, route: '/(tabs)/rehber' })).toEqual({
      allowed: true,
    });
    expect(canShowAd({ ...base, route: '/dua/yemek' }).allowed).toBe(false);
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
        route: '/(tabs)/tesbih',
        minutesToNextPrayer: 500,
        hasConsent: true,
      })
    ).toEqual({ allowed: false, reason: 'route' });
  });
});
