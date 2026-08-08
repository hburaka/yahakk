import { and, eq } from 'drizzle-orm';
import { useCallback, useEffect, useState } from 'react';

import { db } from '@/core/db/client';
import { favorites } from '@/core/db/schema';

/**
 * Favori kimliği, seçim kodlamasıyla aynı: `t:<şablon>` tekil zikir,
 * `s:<set>` zincirli set. Böylece favori listesi doğrudan hızlı geçiş
 * şeridine ve seçim mantığına beslenebiliyor.
 */
export type FavoriteId = string;

export function templateFavoriteId(templateId: string): FavoriteId {
  return `t:${templateId}`;
}

export function setFavoriteId(setId: string): FavoriteId {
  return `s:${setId}`;
}

export type ZikirFavorites = {
  ids: FavoriteId[];
  isFavorite: (id: FavoriteId) => boolean;
  toggle: (id: FavoriteId) => void;
  isLoading: boolean;
};

type FavoritesState = { ids: FavoriteId[]; isLoading: boolean };

/**
 * Kullanıcının işaretlediği zikirler ve setler.
 *
 * Sabit bir "en çok kullanılanlar" listesi kimseye tam uymuyor —
 * herkesin zikir alışkanlığı farklı. Favoriler hızlı geçiş şeridini
 * besliyor; hiç favori yoksa şerit varsayılan listeye düşüyor.
 */
export function useZikirFavorites(): ZikirFavorites {
  const [state, setState] = useState<FavoritesState>({
    ids: [],
    isLoading: true,
  });
  /** Yazma başarısız olursa gerçek durumu geri okumak için artırılır */
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      let ids: FavoriteId[] = [];
      try {
        const rows = await db
          .select()
          .from(favorites)
          .where(eq(favorites.kind, 'zikir'));
        ids = rows.map((row) => row.itemId);
      } catch {
        // Okuma başarısızsa favorisiz devam edilir; şerit varsayılan
        // listeye düşer, kullanıcı hiçbir şey kaybetmez.
      }
      if (cancelled) return;
      setState({ ids, isLoading: false });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const toggle = useCallback((id: FavoriteId) => {
    // Ekran anında tepki versin diye önce yerel durum güncelleniyor,
    // veritabanı arkadan takip ediyor.
    setState((previous) => {
      const removing = previous.ids.includes(id);

      const work = removing
        ? db
            .delete(favorites)
            .where(and(eq(favorites.kind, 'zikir'), eq(favorites.itemId, id)))
        : db
            .insert(favorites)
            .values({ kind: 'zikir', itemId: id })
            .onConflictDoNothing();

      Promise.resolve(work).catch(() => {
        // Yazma başarısızsa gerçek durumu geri oku; kullanıcı favoriye
        // aldığını sanıp kaybetmesin.
        setReloadToken((token) => token + 1);
      });

      return {
        ...previous,
        ids: removing
          ? previous.ids.filter((item) => item !== id)
          : [...previous.ids, id],
      };
    });
  }, []);

  return {
    ids: state.ids,
    isLoading: state.isLoading,
    isFavorite: useCallback(
      (id: FavoriteId) => state.ids.includes(id),
      [state.ids]
    ),
    toggle,
  };
}
