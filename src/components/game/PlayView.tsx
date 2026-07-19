import useDrawGame from "../../hooks/game/useDrawGame";
import { DrawItem, GameResult } from "../../types/app";

interface PlayViewProps {
  initialPool: DrawItem[];
  checkIsGameOver: (pool: DrawItem[], results: GameResult[]) => boolean;
  onGameEnd: (results: GameResult[]) => void;
}

export default function PlayView({
  initialPool,
  checkIsGameOver,
  onGameEnd,
}: PlayViewProps) {
  // 공통 훅 사용
  const { pool, currentResult, isGameOver, draw, setCurrentResult, results } =
    useDrawGame({
      initialPool,
      checkIsGameOver,
    });

  return (
    <div className="flex flex-col items-center justify-center">
      <h2>남은 뽑기 개수: {pool.length}개</h2>

      <button
        onClick={draw}
        disabled={pool.length === 0}
        className="w-full max-w-xs py-4 bg-blue-500 text-white rounded-2xl active:scale-95 transition-transform"
      >
        뽑기! 🎁
      </button>

      {/* 당첨/탈락 알림 모달 */}
      {currentResult && (
        <div className="modal">
          <h3>{currentResult.text}</h3>
          <p>
            {currentResult.isWinner ? "🎉 당첨입니다!" : "😢 다음 기회에..."}
          </p>

          <button
            onClick={() => {
              setCurrentResult(null); // 모달 닫기
              if (isGameOver) {
                onGameEnd(results); // 모달 닫힐 때 완전히 끝났으면 결과 페이지로 이동
              }
            }}
          >
            {isGameOver ? "결과 보러가기" : "다음 뽑기 진행"}
          </button>
        </div>
      )}
    </div>
  );
}
