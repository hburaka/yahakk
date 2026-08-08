import { useCallback } from 'react';
import { useMMKVString } from 'react-native-mmkv';

import { storage, StorageKeys } from '@/core/store/storage';

import {
  getZikirTemplate,
  ZIKIR_SETS,
  ZIKIR_TEMPLATES,
  type ZikirSet,
  type ZikirTemplate,
} from './data/zikir-templates';

const FALLBACK_TEMPLATE = ZIKIR_TEMPLATES[0];

function findSet(id: string): ZikirSet | undefined {
  return ZIKIR_SETS.find((s) => s.id === id);
}

export type ZikirSelection = {
  kind: 'template' | 'set';
  /** Şu anda sayılan zikir — sette bulunulan adımın şablonu */
  template: ZikirTemplate;
  /** Şu anki adımın hedefi */
  target: number;

  /** Set seçiliyse dolu */
  set: ZikirSet | null;
  stepIndex: number;
  totalSteps: number;
  /** Sıradaki adımın şablonu — kullanıcıya "sonraki" olarak gösterilir */
  nextTemplate: ZikirTemplate | null;
  isLastStep: boolean;

  selectTemplate: (id: string) => void;
  selectSet: (id: string) => void;
  /** Yalnızca tekil zikirde geçerli; sette hedefler sabittir */
  setTarget: (value: number) => void;
  /** Sonraki adıma geçer; son adımdaysa başa döner */
  advanceStep: () => void;
  restartSet: () => void;
};

/**
 * Tesbih ekranının ne saydığını belirler: tek bir zikir ya da zincirli
 * bir set (namaz tesbihatı gibi).
 *
 * Sette hedef sayılar sabittir ve kullanıcı değiştiremez — 33/33/33/1
 * dizisinin sayıları setin kendisinin parçası.
 */
export function useZikirSelection(): ZikirSelection {
  const [storedId, setStoredId] = useMMKVString(
    StorageKeys.selectedZikirId,
    storage
  );
  const [storedTarget, setStoredTarget] = useMMKVString(
    StorageKeys.zikirTarget,
    storage
  );
  const [storedStep, setStoredStep] = useMMKVString(
    StorageKeys.zikirSetStep,
    storage
  );

  const raw = storedId ?? `t:${FALLBACK_TEMPLATE.id}`;
  const isSet = raw.startsWith('s:');
  const bareId = raw.slice(2);

  const set = isSet ? (findSet(bareId) ?? null) : null;

  const parsedStep = Number(storedStep);
  const stepIndex =
    set && Number.isFinite(parsedStep)
      ? Math.min(Math.max(0, Math.round(parsedStep)), set.steps.length - 1)
      : 0;

  const currentStep = set?.steps[stepIndex];
  const stepTemplate = currentStep
    ? getZikirTemplate(currentStep.templateId)
    : undefined;

  const singleTemplate = isSet
    ? undefined
    : (getZikirTemplate(bareId) ?? undefined);

  const template = stepTemplate ?? singleTemplate ?? FALLBACK_TEMPLATE;

  const parsedTarget = Number(storedTarget);
  const target = currentStep
    ? currentStep.count
    : Number.isFinite(parsedTarget) && parsedTarget > 0
      ? Math.round(parsedTarget)
      : template.defaultCount;

  const nextStep = set?.steps[stepIndex + 1];
  const nextTemplate = nextStep
    ? (getZikirTemplate(nextStep.templateId) ?? null)
    : null;

  const selectTemplate = useCallback(
    (id: string) => {
      const next = getZikirTemplate(id);
      if (!next) return;
      setStoredId(`t:${next.id}`);
      setStoredTarget(String(next.defaultCount));
      setStoredStep('0');
    },
    [setStoredId, setStoredTarget, setStoredStep]
  );

  const selectSet = useCallback(
    (id: string) => {
      if (!findSet(id)) return;
      setStoredId(`s:${id}`);
      setStoredStep('0');
    },
    [setStoredId, setStoredStep]
  );

  const setTarget = useCallback(
    (value: number) => {
      if (isSet) return;
      setStoredTarget(String(Math.max(1, Math.round(value))));
    },
    [isSet, setStoredTarget]
  );

  const advanceStep = useCallback(() => {
    if (!set) return;
    const next = stepIndex + 1;
    setStoredStep(String(next >= set.steps.length ? 0 : next));
  }, [set, stepIndex, setStoredStep]);

  const restartSet = useCallback(() => setStoredStep('0'), [setStoredStep]);

  return {
    kind: set ? 'set' : 'template',
    template,
    target,
    set,
    stepIndex,
    totalSteps: set?.steps.length ?? 1,
    nextTemplate,
    isLastStep: set ? stepIndex === set.steps.length - 1 : true,
    selectTemplate,
    selectSet,
    setTarget,
    advanceStep,
    restartSet,
  };
}
