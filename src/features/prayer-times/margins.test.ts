import {
  applyMargins,
  DEFAULT_MARGINS,
  hasAnyMargin,
  marginFor,
  RECOMMENDED_MARGINS,
} from './margins';
import type { DaySchedule } from './types';

const schedule: DaySchedule = {
  date: '2026-08-08',
  times: {
    fajr: 4 * 60 + 8,
    sunrise: 5 * 60 + 46,
    dhuhr: 12 * 60 + 59,
    asr: 16 * 60 + 50,
    maghrib: 20 * 60 + 2,
    isha: 21 * 60 + 34,
  },
  source: 'calculated',
};

/**
 * İhtiyat payının yönü kritik ve ters çevrilirse fark edilmesi zor:
 * her iki durumda da saat "kayıyor", ama biri orucu erken açtırıyor
 * diğeri sahuru kaçırtıyor.
 */
describe('ihtiyat payı yönü', () => {
  it('imsak geriye kayar, akşam ileriye', () => {
    expect(marginFor('fajr', { fajr: 3, maghrib: 0 })).toBe(-3);
    expect(marginFor('maghrib', { fajr: 0, maghrib: 2 })).toBe(2);
  });

  it('diğer vakitlere dokunmaz', () => {
    const margins = { fajr: 5, maghrib: 5 };
    for (const prayer of ['sunrise', 'dhuhr', 'asr', 'isha'] as const) {
      expect(marginFor(prayer, margins)).toBe(0);
    }
  });

  it('önerilen değerler yönleriyle birlikte doğru uygulanır', () => {
    const result = applyMargins(schedule, RECOMMENDED_MARGINS);
    // Sahur: geç kalmamak için imsak öne çekilir.
    expect(result.times.fajr).toBe(schedule.times.fajr - 1);
    // İftar: erken olmamak için akşam geriye itilir.
    expect(result.times.maghrib).toBe(schedule.times.maghrib + 2);
  });
});

describe('pay uygulanması', () => {
  it('pay yokken tarife hiç değişmez', () => {
    expect(applyMargins(schedule, DEFAULT_MARGINS)).toBe(schedule);
    expect(hasAnyMargin(DEFAULT_MARGINS)).toBe(false);
  });

  it('yalnızca imsak ve akşamı değiştirir', () => {
    const result = applyMargins(schedule, { fajr: 2, maghrib: 3 });
    expect(result.times.sunrise).toBe(schedule.times.sunrise);
    expect(result.times.dhuhr).toBe(schedule.times.dhuhr);
    expect(result.times.asr).toBe(schedule.times.asr);
    expect(result.times.isha).toBe(schedule.times.isha);
  });

  it('kaynak ve tarih korunur', () => {
    const result = applyMargins(schedule, { fajr: 1, maghrib: 1 });
    expect(result.source).toBe(schedule.source);
    expect(result.date).toBe(schedule.date);
  });

  it('vakit sırası bozulmaz', () => {
    // Makul paylarla imsak güneşin, akşam yatsının önünde kalmalı.
    const result = applyMargins(schedule, { fajr: 5, maghrib: 5 });
    expect(result.times.fajr).toBeLessThan(result.times.sunrise);
    expect(result.times.maghrib).toBeLessThan(result.times.isha);
  });
});
