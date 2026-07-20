import { useCallback, useState } from "react";
import { DrawItem, GameResult } from "../../types/app";
import { shuffle } from "../../utils/shuffle";

interface UseDrawGameProps {
  initialPool: DrawItem[];
  // 게임 종료 조건을 외부에서 커스텀할 수 있게 열어주기
  checkIsGameOver: (pool: DrawItem[], results: GameResult[]) => boolean;
}

export default function useDrawGame({
  initialPool,
  checkIsGameOver,
}: UseDrawGameProps) {
  const [pool, setPool] = useState<DrawItem[]>(() => shuffle(initialPool));
  const [results, setResults] = useState<GameResult[]>([]);
  const [currentResult, setCurrentResult] = useState<DrawItem | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // 하나 뽑기 로직
  const draw = useCallback(() => {
    if (pool.length === 0 || isGameOver) return;

    // 최적화된 무작위 추출 (마지막 요소를 꺼내는 방식이 O(1)이라 효율적)
    const nextPool = [...pool];
    const nextItem = nextPool.pop()!; // 이미 셔플되었으므로 끝에서 꺼냄

    const nextResults: GameResult[] = [
      ...results,
      { round: results.length + 1, drawnItem: nextItem },
    ];

    setPool(nextPool);
    setCurrentResult(nextItem);
    setResults(nextResults);

    // 종료 조건 판단
    if (checkIsGameOver(nextPool, nextResults)) {
      setIsGameOver(true);
    }
  }, [pool, results, isGameOver, checkIsGameOver]);

  const resetGame = useCallback((_newPool: DrawItem[]) => {
    setPool(() => shuffle(initialPool));
    setResults([]);
    setCurrentResult(null);
    setIsGameOver(false);
  }, []);

  return {
    pool,
    results,
    currentResult,
    isGameOver,
    draw,
    resetGame,
    setCurrentResult, // 모달을 닫을 때 null로 초기화하는 용도
  };
}
