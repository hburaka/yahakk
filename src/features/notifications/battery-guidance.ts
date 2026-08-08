import { Platform } from 'react-native';

/**
 * Android'de bildirim kaçması bu kategorinin bir numaralı şikayeti.
 *
 * Sebep uygulama değil, üreticilerin agresif pil yönetimi: Xiaomi,
 * Huawei, Oppo, Vivo ve Samsung arka planda bekleyen uygulamaları
 * öldürüyor ve planlanmış alarmları düşürüyor. Kullanıcı "ezan
 * gelmedi" diye şikayet ediyor, biz de "telefonunuzun ayarı" diyemeyiz
 * — doğru ayarı bulmasına yardım etmemiz gerekiyor.
 *
 * Marka adları `Platform.constants.Manufacturer` üzerinden okunuyor;
 * expo-device'a bağımlılık eklemeye değmez.
 */

export type BatteryGuidance = {
  /** Bu cihazda agresif pil yönetimi bilinen bir sorun mu */
  isAggressive: boolean;
  manufacturer: string | null;
  /** Kullanıcının izleyeceği adımlar */
  steps: string[];
};

const AGGRESSIVE_VENDORS: Record<string, string[]> = {
  xiaomi: [
    'Ayarlar → Uygulamalar → Uygulamaları yönet → bu uygulama',
    '"Otomatik başlatma" seçeneğini açın',
    '"Pil tasarrufu" → "Kısıtlama yok" seçin',
  ],
  redmi: [
    'Ayarlar → Uygulamalar → Uygulamaları yönet → bu uygulama',
    '"Otomatik başlatma" seçeneğini açın',
    '"Pil tasarrufu" → "Kısıtlama yok" seçin',
  ],
  poco: [
    'Ayarlar → Uygulamalar → Uygulamaları yönet → bu uygulama',
    '"Otomatik başlatma" seçeneğini açın',
    '"Pil tasarrufu" → "Kısıtlama yok" seçin',
  ],
  huawei: [
    'Ayarlar → Pil → Uygulama başlatma',
    'Bu uygulamayı "Elle yönet" yapın',
    'Otomatik başlatma, ikincil başlatma ve arka planda çalışmayı açın',
  ],
  honor: [
    'Ayarlar → Pil → Uygulama başlatma',
    'Bu uygulamayı "Elle yönet" yapın',
    'Otomatik başlatma ve arka planda çalışmayı açın',
  ],
  oppo: [
    'Ayarlar → Pil → Pil optimizasyonu',
    'Bu uygulamayı "Optimize etme" olarak işaretleyin',
    'Ayarlar → Uygulama yönetimi → Otomatik başlatmayı açın',
  ],
  realme: [
    'Ayarlar → Pil → Pil optimizasyonu',
    'Bu uygulamayı "Optimize etme" olarak işaretleyin',
  ],
  vivo: [
    'Ayarlar → Pil → Arka plan güç tüketimi yönetimi',
    'Bu uygulamaya arka planda çalışma izni verin',
  ],
  oneplus: [
    'Ayarlar → Pil → Pil optimizasyonu',
    'Bu uygulamayı "Optimize etme" olarak işaretleyin',
  ],
  samsung: [
    'Ayarlar → Pil → Arka plan kullanım sınırları',
    'Bu uygulamanın "Uyuyan uygulamalar" listesinde OLMADIĞINDAN emin olun',
    'Ayarlar → Uygulamalar → bu uygulama → Pil → "Kısıtlanmamış" seçin',
  ],
};

const GENERIC_STEPS = [
  'Ayarlar → Uygulamalar → bu uygulama → Pil',
  'Pil optimizasyonunu kapatın veya "Kısıtlanmamış" seçin',
];

export function getBatteryGuidance(): BatteryGuidance {
  if (Platform.OS !== 'android') {
    return { isAggressive: false, manufacturer: null, steps: [] };
  }

  const constants = Platform.constants as { Manufacturer?: string };
  const manufacturer = constants.Manufacturer ?? null;
  const key = manufacturer?.toLowerCase().trim() ?? '';

  const matched = Object.keys(AGGRESSIVE_VENDORS).find((vendor) =>
    key.includes(vendor)
  );

  return {
    isAggressive: matched !== undefined,
    manufacturer,
    steps: matched ? AGGRESSIVE_VENDORS[matched] : GENERIC_STEPS,
  };
}
