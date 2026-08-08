import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Ekran okuyucu desteği.
 *
 * ## Neden gerekiyor
 *
 * Uygulama, ekran okuyucunun açık olup olmadığını hiç bilmiyordu. Bu,
 * iki ayrı soruna yol açıyor:
 *
 * 1. **Sayaç okunamaz hale geliyordu.** Tesbih ekranının etiketi
 *    "Say. 3 / 100" idi ve her dokunuşta değişiyordu. TalkBack odaktaki
 *    öğenin etiketi değişince onu yeniden okuyor; yani her zikirde
 *    ekran konuşuyordu. Zikir çekerken sürekli konuşan bir telefon,
 *    zikri bölüyor.
 * 2. **Önemli anlar sessiz geçiyordu.** Hedefe ulaşmak, sette bir
 *    sonraki adıma geçmek — hiçbiri duyurulmuyordu. Gören kullanıcı
 *    ekranda görüyor, görmeyen kullanıcı hiç öğrenmiyordu.
 *
 * Çözüm: etiketi sabit tutup yalnızca **anlamlı anlarda** duyuru yapmak.
 */

/**
 * Ekran okuyucuya bir cümle okutur.
 *
 * Ekran okuyucu kapalıysa hiçbir şey yapmaz, o yüzden çağıran tarafın
 * kontrol etmesine gerek yok.
 */
export function announce(message: string): void {
  AccessibilityInfo.announceForAccessibility(message);
}

/**
 * Ekran okuyucu açık mı.
 *
 * Davranışı uyarlamak için: örneğin sayaç etiketine sayıyı gömmek
 * gören kullanıcıya zarar vermiyor ama ekran okuyucuda her dokunuşta
 * konuşmaya yol açıyor.
 */
export function useScreenReader(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;

    AccessibilityInfo.isScreenReaderEnabled().then((value) => {
      if (!cancelled) setEnabled(value);
    });

    // Kullanıcı uygulama açıkken TalkBack'i açıp kapatabilir.
    const subscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      (value) => setEnabled(value)
    );

    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, []);

  return enabled;
}
