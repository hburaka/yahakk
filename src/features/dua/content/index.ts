import type { Dua } from '../types';

import { NAMAZ_DUALARI } from './namaz';
import { YEMEK_DUALARI } from './yemek';

/**
 * Dua içeriği.
 *
 * Kategoriler `features/rehber/data.ts`'te tanımlı; buradaki her dua
 * oradaki bir kategoriye bağlanıyor. İçeriği henüz yazılmamış
 * kategoriler listede soluk görünüyor ve açılmıyor.
 *
 * Arapça metinler kamu malı (Kur'an ve hadis külliyatı). Türkçe
 * anlamlar telifli bir mealden alınmadı, kendimiz yazdık — telif riski
 * bu şekilde tamamen ortadan kalkıyor. Ama dinî doğruluk ayrı bir eksen:
 * hepsi `reviewed: false` ve ekranda uyarı görünüyor.
 */
const ALL: readonly Dua[] = [...NAMAZ_DUALARI, ...YEMEK_DUALARI];

/** Kategori kimliğinden o kategorinin duaları */
export const DUAS_BY_CATEGORY: Record<string, readonly Dua[]> = ALL.reduce<
  Record<string, Dua[]>
>((acc, dua) => {
  (acc[dua.categoryId] ??= []).push(dua);
  return acc;
}, {});

export function duasFor(categoryId: string): readonly Dua[] {
  return DUAS_BY_CATEGORY[categoryId] ?? [];
}

/**
 * Kategorideki dua sayısı.
 *
 * Rehber listesindeki sayı bir dönem elle yazılıyordu ve içerikten
 * bağımsızdı: liste "12" diyor, ekran boş açılıyordu. Sayı artık
 * içerikten türetiliyor, yani yalan söyleyemez.
 */
export function duaCount(categoryId: string): number {
  return duasFor(categoryId).length;
}

export function hasDuaContent(categoryId: string): boolean {
  return duaCount(categoryId) > 0;
}

/** Tüm dualar — testler ve arama için */
export const ALL_DUAS = ALL;
