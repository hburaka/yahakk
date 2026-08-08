import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';

import { QIBLA_ALIGNED_TOLERANCE } from './bearing';

/**
 * Kıbleyi titreşimle bulma.
 *
 * Ekrana bakmadan yön bulmayı sağlıyor: telefonu çevirirken titreşim
 * sıklaşıyorsa kıbleye yaklaşıyorsun, seyrekleşiyorsa uzaklaşıyorsun.
 * Çocuk oyunundaki "sıcak-soğuk" mantığı.
 *
 * ## Neden var
 *
 * Bu ekran görme engelli bir kullanıcı için ÇALIŞMIYORDU. Tek geri
 * bildirim, hizalandığı anda gelen bir titreşimdi; hizalanana kadar
 * hiçbir şey yoktu. Yani kullanıcı telefonu rastgele çevirip şansa
 * denk getirmeyi beklemek zorundaydı. Kıble, günde beş kez ihtiyaç
 * duyulan bir şey.
 *
 * Gören kullanıcı için de işe yarıyor: telefona bakmadan, hatta cepten
 * çıkarmadan yön bulunabiliyor.
 *
 * ## Hizalanınca neden susmuyor
 *
 * Sessizlik belirsiz. Kör bir kullanıcı için "durdu" ile "bozuldu"
 * arasında fark yok. Hizalandığında önce belirgin bir onay, ardından
 * yavaş ve sakin bir nabız geliyor: sessizlik hiçbir zaman bilgi
 * taşımıyor.
 */

/** Sapma bu açıdan büyükken en seyrek aralık (ms) */
const SLOWEST_MS = 1100;
/** Hizaya çok yakınken en sık aralık (ms) */
const FASTEST_MS = 140;
/** Bu açıdan sonrası "çok uzak" sayılır, aralık sabitlenir */
const FAR_ANGLE = 90;
/** Hizalıyken teyit nabzının aralığı */
const HOLD_MS = 1600;

/**
 * Sapma açısını titreşim aralığına çevirir.
 *
 * Doğrusal değil karesel: kıbleye yaklaşırken sıklaşma hızlanıyor.
 * Doğrusal eğride son 20 derecede fark hissedilmiyordu, kullanıcı
 * hizaya girdiğini ancak onay titreşiminde anlıyordu.
 */
export function intervalForDelta(absDelta: number): number {
  const clamped = Math.min(Math.max(absDelta, 0), FAR_ANGLE);
  const ratio = clamped / FAR_ANGLE;
  return FASTEST_MS + (SLOWEST_MS - FASTEST_MS) * ratio * ratio;
}

export function useQiblaHaptics({
  delta,
  isAligned,
  enabled,
}: {
  /** Kıbleye göre işaretli sapma açısı; null ise pusula hazır değil */
  delta: number | null;
  isAligned: boolean;
  enabled: boolean;
}) {
  /*
    Pusula saniyede onlarca kez güncelleniyor. Değerler ref'te tutuluyor
    ki zamanlayıcı her okumada yeniden kurulmasın — kurulsaydı titreşim
    aralığı hiçbir zaman dolmaz ve tek bir darbe bile gelmezdi.
  */
  const deltaRef = useRef(delta);
  const alignedRef = useRef(isAligned);

  // Yazma render sırasında değil, render sonrası. Bağımlılık dizisi yok:
  // her güncellemede tazelenmesi gereken bir değer bu.
  useEffect(() => {
    deltaRef.current = delta;
    alignedRef.current = isAligned;
  });

  /** Hizaya yeni girildiğinde bir kez onay vermek için */
  const announcedAlignment = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    let timer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    function tick() {
      if (cancelled) return;

      const current = deltaRef.current;

      // Pusula henüz güvenilir değil: titreşim yok. Yanlış yöne
      // güvenle titremek, hiç titrememekten kötü.
      if (current === null) {
        timer = setTimeout(tick, SLOWEST_MS);
        return;
      }

      if (alignedRef.current) {
        if (!announcedAlignment.current) {
          announcedAlignment.current = true;
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
          // Teyit nabzı — "hâlâ kıbledesin"
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        timer = setTimeout(tick, HOLD_MS);
        return;
      }

      announcedAlignment.current = false;

      const absDelta = Math.abs(current);
      // Hizaya yaklaştıkça darbe de sertleşiyor; yalnızca sıklık
      // değişseydi hızlı çevirirken fark edilmiyordu.
      Haptics.impactAsync(
        absDelta <= QIBLA_ALIGNED_TOLERANCE * 3
          ? Haptics.ImpactFeedbackStyle.Medium
          : Haptics.ImpactFeedbackStyle.Light
      );

      timer = setTimeout(tick, intervalForDelta(absDelta));
    }

    tick();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      announcedAlignment.current = false;
    };
  }, [enabled]);
}
