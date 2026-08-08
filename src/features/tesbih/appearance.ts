import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { useMMKVString } from 'react-native-mmkv';

import { storage } from '@/core/store/storage';

const KEY = 'tesbih.appearance';

/** Dokunuş geri bildirimi biçimi */
export type TapEffect = 'ripple' | 'pulse' | 'none';

export const TAP_EFFECT_LABELS: Record<TapEffect, string> = {
  ripple: 'Su damlası',
  pulse: 'Nabız',
  none: 'Yok',
};

export const TAP_EFFECT_HINTS: Record<TapEffect, string> = {
  ripple: 'Dokunduğunuz noktadan bir halka yayılır',
  pulse: 'Sayı kısaca büyüyüp küçülür',
  none: 'Görsel geri bildirim olmaz',
};

/**
 * Efekt rengi.
 *
 * Varsayılan `period`: uygulamanın tek kromatik rolü olan vakit rengini
 * takip eder, tasarım sistemiyle tutarlı kalır. Diğerleri kişiselleştirme
 * için — bu ekran uygulamanın en dokunsal yeri, burada biraz keyfe
 * izin vermek sistemi bozmuyor.
 */
export type EffectColor = 'period' | 'emerald' | 'gold' | 'rose' | 'ink';

export const EFFECT_COLOR_LABELS: Record<EffectColor, string> = {
  period: 'Vakit rengi',
  emerald: 'Zümrüt',
  gold: 'Altın',
  rose: 'Gül',
  ink: 'Mürekkep',
};

/** `period` dışındakiler için sabit renkler */
export const EFFECT_COLOR_VALUES: Record<
  Exclude<EffectColor, 'period'>,
  string
> = {
  emerald: '#2E9E78',
  gold: '#C9974A',
  rose: '#C4657A',
  ink: '#8A8F94',
};

export type EffectSize = 'small' | 'medium' | 'large';

export const EFFECT_SIZE_LABELS: Record<EffectSize, string> = {
  small: 'Küçük',
  medium: 'Orta',
  large: 'Büyük',
};

/** Dalganın ulaşacağı yarıçap (pt) */
export const EFFECT_SIZE_RADIUS: Record<EffectSize, number> = {
  small: 70,
  medium: 120,
  large: 190,
};

export type HapticStrength = 'off' | 'light' | 'medium' | 'strong';

export const HAPTIC_LABELS: Record<HapticStrength, string> = {
  off: 'Kapalı',
  light: 'Hafif',
  medium: 'Orta',
  strong: 'Güçlü',
};

export type TesbihAppearance = {
  tapEffect: TapEffect;
  effectColor: EffectColor;
  effectSize: EffectSize;
  hapticStrength: HapticStrength;
};

export const DEFAULT_APPEARANCE: TesbihAppearance = {
  tapEffect: 'ripple',
  effectColor: 'period',
  effectSize: 'medium',
  hapticStrength: 'light',
};

function parse(raw: string | undefined): TesbihAppearance {
  if (!raw) return DEFAULT_APPEARANCE;
  try {
    const parsed = JSON.parse(raw) as Partial<TesbihAppearance>;
    return {
      tapEffect:
        parsed.tapEffect && parsed.tapEffect in TAP_EFFECT_LABELS
          ? parsed.tapEffect
          : DEFAULT_APPEARANCE.tapEffect,
      effectColor:
        parsed.effectColor && parsed.effectColor in EFFECT_COLOR_LABELS
          ? parsed.effectColor
          : DEFAULT_APPEARANCE.effectColor,
      effectSize:
        parsed.effectSize && parsed.effectSize in EFFECT_SIZE_LABELS
          ? parsed.effectSize
          : DEFAULT_APPEARANCE.effectSize,
      hapticStrength:
        parsed.hapticStrength && parsed.hapticStrength in HAPTIC_LABELS
          ? parsed.hapticStrength
          : DEFAULT_APPEARANCE.hapticStrength,
    };
  } catch {
    return DEFAULT_APPEARANCE;
  }
}

/** Hook dışından okumak için — sayaç kancası titreşimi burada seçiyor */
export function readAppearance(): TesbihAppearance {
  return parse(storage.getString(KEY));
}

/**
 * Seçilen yoğunluğa göre normal dokunuş titreşimi.
 * Kilometre taşı ve hedef titreşimleri bundan bağımsız; onlar her zaman
 * daha belirgin, yoksa 100'e ulaştığın anlaşılmıyor.
 */
export function tapHaptic(strength: HapticStrength): void {
  switch (strength) {
    case 'off':
      return;
    case 'light':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return;
    case 'medium':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      return;
    case 'strong':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      return;
  }
}

export function useTesbihAppearance() {
  const [raw, setRaw] = useMMKVString(KEY, storage);
  const appearance = parse(raw);

  const update = useCallback(
    (patch: Partial<TesbihAppearance>) => {
      setRaw(JSON.stringify({ ...appearance, ...patch }));
    },
    [appearance, setRaw]
  );

  return { appearance, update };
}
