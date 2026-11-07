// 양자택일 모드의 순수 로직
// React, DOM, 저장소 어디에도 의존하지 않습니다.
// → React Native로 옮길 때 이 파일은 그대로 복사해서 쓸 수 있어요.

import { CardData, YN } from "../types/app";

/** 랜덤 함수. 테스트할 때 고정값을 넣을 수 있도록 바깥에서 주입받습니다. */
export type RandomFn = () => number;

export type CardPreset = {
  id: string;
  label: string; // 프리셋 이름 (선택 UI에 노출될 이름)
  cards: [CardData<YN>, CardData<YN>]; // 양자택일이니 항상 2개
};

export const RESULT_SETS = {
  do: { label: "할까?", pool: ["해", "하지마"] },
  buy: { label: "살까?", pool: ["사", "사지마"] },
} as const;

export type YNMode = keyof typeof RESULT_SETS;

export const YN_MODES = Object.keys(RESULT_SETS) as YNMode[];

export const DEFAULT_MODE: YNMode = "do";

/** 각 카드(y/n)를 골랐을 때 나올 답변 */
export type AnswerMap = Record<YN, string>;

/** 배열에서 하나를 무작위로 고릅니다. */
export function pickRandom<T>(items: readonly T[], random: RandomFn = Math.random): T {
  if (items.length === 0) throw new Error("빈 배열에서는 고를 수 없어요.");
  return items[Math.floor(random() * items.length)];
}

/**
 * y/n 카드에 답변을 무작위로 배정합니다.
 * 한 카드가 "해"를 받으면 다른 카드는 반드시 "하지마"를 받습니다.
 */
export function assignAnswers(mode: YNMode, random: RandomFn = Math.random): AnswerMap {
  const [first, second] = RESULT_SETS[mode].pool;
  const yAnswer = pickRandom([first, second], random);
  return {
    y: yAnswer,
    n: yAnswer === first ? second : first,
  };
}

/** 현재 키를 제외한 나머지 중에서 하나를 무작위로 고릅니다. 다른 게 없으면 null. */
export function pickOtherKey(
  keys: readonly string[],
  currentKey: string,
  random: RandomFn = Math.random,
): string | null {
  const others = keys.filter((key) => key !== currentKey);
  return others.length === 0 ? null : pickRandom(others, random);
}
