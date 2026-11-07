// 양자택일 모드의 기본 캐릭터 프리셋 (데이터만 모아둔 파일)
import { CardPreset } from "../domain/yesOrNo";

export const CARD_PRESETS: Record<string, CardPreset> = {
  angelDevil: {
    id: "angelDevil",
    label: "천사 / 악마",
    cards: [
      { label: "천사", emoji: "😇", value: "y" },
      { label: "악마", emoji: "😈", value: "n" },
    ],
  },
  parents: {
    id: "parents",
    label: "엄마 / 아빠",
    cards: [
      { label: "엄마", emoji: "👩", value: "y" },
      { label: "아빠", emoji: "👨", value: "n" },
    ],
  },
  grandParents: {
    id: "grandParents",
    label: "할머니 / 할아버지",
    cards: [
      { label: "할머니", emoji: "👵", value: "y" },
      { label: "할아버지", emoji: "👴", value: "n" },
    ],
  },
  siblings: {
    id: "siblings",
    label: "여동생 / 남동생",
    cards: [
      { label: "여동생", emoji: "👧", value: "y" },
      { label: "남동생", emoji: "👦", value: "n" },
    ],
  },
  // 계속 추가...
};

export const PRESET_KEYS = Object.keys(CARD_PRESETS);
