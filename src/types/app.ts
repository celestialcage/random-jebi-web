export type GameMode = "YES-OR-NO" | "LUCKY-DRAW" | "JEBI" | "CUSTOM";

export type CardData<T> = {
  label: string;
  emoji: string;
  value: T;
};

// 양자택일용
export type YN = "y" | "n";

// useDrawGame 커스텀훅용
export interface DrawItem {
  id: string;
  text: string;
  isWinner?: boolean;
}

export interface GameResult {
  round: number;
  drawnItem: DrawItem;
}

// Jebi용
// 유저가 설정창에서 한 줄씩 작성하는 원본 데이터 타입
export interface JebiOptionInput {
  id: string;
  text: string;
  isWinner: boolean;
}

// 로컬스토리지 슬롯에 통째로 저장될 데이터 포맷
export interface SavedSlot {
  id: string;
  title: string; // 세트 이름 (예: "트럼프 문양 뽑기")
  items: JebiOptionInput[];
  createdAt: number;
}
