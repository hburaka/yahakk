import { and, desc, eq } from 'drizzle-orm';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';

import { db } from '@/core/db/client';
import { zikirSessions } from '@/core/db/schema';

import { readAppearance, tapHaptic } from './appearance';

/**
 * Sayacın neyi saydığı. Zincirli setlerde her adım kendi oturumunu
 * tutuyor — 20/33 Elhamdülillah'ta bırakılırsa oradan devam edilsin.
 */
export type CounterScope =
  | { kind: 'template'; templateId: string }
  | { kind: 'set'; setId: string; stepIndex: number; templateId: string };

function scopeKey(scope: CounterScope): string {
  return scope.kind === 'template'
    ? `t:${scope.templateId}`
    : `s:${scope.setId}:${scope.stepIndex}`;
}

/**
 * Ara kilometre taşı aralığı. 1000'lik bir zikirde her 100'de, 99-499
 * arasında her 33'te bildirim verilir; 33'lük kısa zikirlerde ara
 * bildirim yok — sürekli titreşim zikri bölüyor.
 */
function milestoneInterval(target: number): number {
  if (target >= 500) return 100;
  if (target >= 99) return 33;
  return 0;
}

function todayIso(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export type CounterState = {
  count: number;
  /** 0-1 arası ilerleme */
  progress: number;
  isComplete: boolean;
  /** Son artışta bir kilometre taşına basıldı mı — görsel geri bildirim için */
  justHitMilestone: boolean;
  /** Yarım kalmış bir oturum bulunup devam ediliyor mu */
  resumed: boolean;
  /** Kayıt yüklenene kadar sayı gösterilmemeli, yoksa 0'dan zıplıyor */
  isLoading: boolean;
  increment: () => void;
  undo: () => void;
  reset: () => void;
};

/**
 * Sayım durumu, ait olduğu kapsamla birlikte tutuluyor. Böylece
 * "yükleniyor" ayrı bir bayrak olmadan türetiliyor: kayıtlı kapsam
 * seçili olandan farklıysa henüz yüklenmemiş demektir. Efekt içinde
 * senkron setState yapmaktan da kurtuluyoruz.
 */
type CountState = { key: string; count: number; resumed: boolean };

/**
 * Zikir sayacı — sayım React state'inde, kalıcılık SQLite'ta.
 *
 * Sayı neden veritabanından canlı okunmuyor: her dokunuşta sorgu dönmesi
 * sayacı gözle görülür biçimde geciktiriyor. React state anlık tepki
 * veriyor, veritabanına yazma arkada sıraya giriyor. Uygulama beklenmedik
 * şekilde kapansa bile en fazla son bir dokunuş kaybolur.
 */
export function useCounter(
  scope: CounterScope,
  target: number,
  /** Hedefe ulaşıldığında çağrılır — sette sonraki adıma geçmek için */
  onComplete?: () => void
): CounterState {
  const key = scopeKey(scope);

  // Kapsam ilkel değerlere ayrıştırılıyor: nesne kimliği her render
  // değiştiği için doğrudan bağımlılık olarak kullanılamaz, ref'e
  // yazmak da render sırasında yasak.
  const templateId = scope.templateId;
  const setId = scope.kind === 'set' ? scope.setId : '';
  const stepIndex = scope.kind === 'set' ? scope.stepIndex : null;

  const [state, setState] = useState<CountState>({
    key: '',
    count: 0,
    resumed: false,
  });
  const [justHitMilestone, setJustHitMilestone] = useState(false);

  const sessionId = useRef<string | null>(null);
  const milestoneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Geri çağrı ref'te tutuluyor ki her render'da increment yeniden kurulmasın */
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);
  /** Yazma sırası — art arda dokunuşlarda güncellemeler karışmasın */
  const writeQueue = useRef<Promise<unknown>>(Promise.resolve());

  const isLoading = state.key !== key;
  const count = isLoading ? 0 : state.count;
  const resumed = isLoading ? false : state.resumed;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      let restored: CountState = { key, count: 0, resumed: false };
      let foundId: string | null = null;

      try {
        const filter =
          stepIndex === null
            ? and(
                eq(zikirSessions.templateId, templateId),
                eq(zikirSessions.status, 'active'),
                eq(zikirSessions.setId, '')
              )
            : and(
                eq(zikirSessions.setId, setId),
                eq(zikirSessions.setStepIndex, stepIndex),
                eq(zikirSessions.status, 'active')
              );

        const rows = await db
          .select()
          .from(zikirSessions)
          .where(filter)
          .orderBy(desc(zikirSessions.updatedAt))
          .limit(1);

        const existing = rows[0];
        if (existing) {
          foundId = existing.id;
          restored = {
            key,
            count: existing.currentCount,
            resumed: existing.currentCount > 0,
          };
        }
      } catch {
        // Okuma başarısızsa sıfırdan başlanır; kullanıcı sayamaz duruma
        // düşmesin diye hata yutuluyor.
      }

      if (cancelled) return;
      sessionId.current = foundId;
      setState(restored);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [key, templateId, setId, stepIndex]);

  /** Yazmaları sıraya alır; sıradaki bir hata zinciri kırmasın */
  const enqueue = useCallback((work: () => Promise<unknown>) => {
    writeQueue.current = writeQueue.current.then(work).catch(() => undefined);
  }, []);

  const persist = useCallback(
    (nextCount: number, nextTarget: number) => {
      enqueue(async () => {
        const now = Math.floor(Date.now() / 1000);
        const isComplete = nextCount >= nextTarget;

        if (!sessionId.current) {
          const id = `${key}-${Date.now()}`;
          sessionId.current = id;
          await db.insert(zikirSessions).values({
            id,
            templateId,
            // Tekil zikirlerde boş dize kullanılıyor: NULL karşılaştırması
            // SQL'de her zaman NULL döndüğü için sorgu filtresi tutmuyor.
            setId,
            setStepIndex: stepIndex,
            targetCount: nextTarget,
            currentCount: nextCount,
            status: isComplete ? 'completed' : 'active',
            date: todayIso(),
            startedAt: now,
            updatedAt: now,
            completedAt: isComplete ? now : null,
          });
          if (isComplete) sessionId.current = null;
          return;
        }

        await db
          .update(zikirSessions)
          .set({
            currentCount: nextCount,
            targetCount: nextTarget,
            status: isComplete ? 'completed' : 'active',
            updatedAt: now,
            completedAt: isComplete ? now : null,
          })
          .where(eq(zikirSessions.id, sessionId.current));

        // Hedefe ulaşan oturum kapandı; bir sonraki sayım yeni bir
        // oturum açsın diye kimlik bırakılıyor.
        if (isComplete) sessionId.current = null;
      });
    },
    [enqueue, key, templateId, setId, stepIndex]
  );

  const flashMilestone = useCallback(() => {
    setJustHitMilestone(true);
    if (milestoneTimer.current) clearTimeout(milestoneTimer.current);
    milestoneTimer.current = setTimeout(() => setJustHitMilestone(false), 450);
  }, []);

  useEffect(
    () => () => {
      if (milestoneTimer.current) clearTimeout(milestoneTimer.current);
    },
    []
  );

  const increment = useCallback(() => {
    setState((previous) => {
      // Kayıt yüklenmeden dokunulursa sayım başlatılmaz; yarım oturum
      // gelmek üzereyken 1'den başlamak veriyi bozar.
      if (previous.key !== key) return previous;

      const next = previous.count + 1;
      const interval = milestoneInterval(target);

      // Hedef ve kilometre taşı titreşimleri kullanıcı ayarından
      // bağımsız olarak belirgin kalıyor: 100'e ulaştığını hissetmek
      // normal dokunuş geri bildiriminden farklı bir bilgi.
      if (next === target) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        flashMilestone();
        onCompleteRef.current?.();
      } else if (interval > 0 && next % interval === 0) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        flashMilestone();
      } else {
        tapHaptic(readAppearance().hapticStrength);
      }

      persist(next, target);
      return { key, count: next, resumed: false };
    });
  }, [key, target, flashMilestone, persist]);

  const undo = useCallback(() => {
    setState((previous) => {
      if (previous.key !== key) return previous;
      const next = Math.max(0, previous.count - 1);
      persist(next, target);
      return { key, count: next, resumed: false };
    });
  }, [key, persist, target]);

  const reset = useCallback(() => {
    setState({ key, count: 0, resumed: false });
    // Yarım kalan oturum "terk edildi" olarak kapatılıyor; silmek yerine
    // saklamak günlük istatistiğin doğru kalmasını sağlıyor.
    const current = sessionId.current;
    sessionId.current = null;
    if (!current) return;

    enqueue(() =>
      db
        .update(zikirSessions)
        .set({
          status: 'abandoned',
          updatedAt: Math.floor(Date.now() / 1000),
        })
        .where(eq(zikirSessions.id, current))
    );
  }, [enqueue, key]);

  return {
    count,
    progress: target > 0 ? Math.min(1, count / target) : 0,
    isComplete: !isLoading && count >= target,
    justHitMilestone,
    resumed,
    isLoading,
    increment,
    undo,
    reset,
  };
}
