import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { storage, StorageKeys } from '@/core/store/storage';
import {
  configurePurchases,
  readPremium,
  restorePurchases,
} from '@/features/iap/purchases';

import { initializeAds, requestTrackingIfDue } from './initialize';

type AdsContextValue = {
  /** SDK başlatıldı mı; false ise hiçbir reklam gösterilmez */
  ready: boolean;
  canRequestAds: boolean;
  isPersonalized: boolean;
  /** Destek satın alması yapılmış mı */
  isPremium: boolean;
  /** Ezan o an çalıyor mu — reklamı kesen bağlamlardan biri */
  isAdhanPlaying: boolean;
  setAdhanPlaying: (playing: boolean) => void;
  refreshPremium: () => Promise<void>;
  restore: () => Promise<boolean>;
};

const DEFAULT: AdsContextValue = {
  ready: false,
  canRequestAds: false,
  isPersonalized: false,
  isPremium: false,
  isAdhanPlaying: false,
  setAdhanPlaying: () => undefined,
  refreshPremium: async () => undefined,
  restore: async () => false,
};

const AdsContext = createContext<AdsContextValue>(DEFAULT);

/** Açılış sayısı — ATT isteminin zamanlaması buna bağlı */
function bumpLaunchCount(): number {
  const current = Number(storage.getString(StorageKeys.launchCount) ?? '0');
  const next = Number.isFinite(current) ? current + 1 : 1;
  storage.set(StorageKeys.launchCount, String(next));
  return next;
}

export function AdsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState({
    ready: false,
    canRequestAds: false,
    isPersonalized: false,
    isPremium: false,
  });
  const [isAdhanPlaying, setAdhanPlaying] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      const launches = bumpLaunchCount();

      // Satın alma önce: kullanıcı destek olmuşsa reklam altyapısını
      // hiç başlatmaya gerek yok.
      const purchases = await configurePurchases();
      if (cancelled) return;

      if (purchases.isPremium) {
        setState({
          ready: true,
          canRequestAds: false,
          isPersonalized: false,
          isPremium: true,
        });
        return;
      }

      // ATT istemi karşılama akışında değil, birkaç açılış sonra.
      await requestTrackingIfDue(launches);
      if (cancelled) return;

      const ads = await initializeAds();
      if (cancelled) return;

      setState({
        ready: ads.ready,
        canRequestAds: ads.canRequestAds,
        isPersonalized: ads.isPersonalized,
        isPremium: false,
      });
    }

    start();
    return () => {
      cancelled = true;
    };
  }, []);

  const refreshPremium = useCallback(async () => {
    const premium = await readPremium();
    setState((previous) => ({ ...previous, isPremium: premium }));
  }, []);

  const restore = useCallback(async () => {
    const premium = await restorePurchases();
    setState((previous) => ({ ...previous, isPremium: premium }));
    return premium;
  }, []);

  const value = useMemo<AdsContextValue>(
    () => ({
      ...state,
      isAdhanPlaying,
      setAdhanPlaying,
      refreshPremium,
      restore,
    }),
    [state, isAdhanPlaying, refreshPremium, restore]
  );

  return <AdsContext value={value}>{children}</AdsContext>;
}

export function useAds(): AdsContextValue {
  return use(AdsContext);
}
