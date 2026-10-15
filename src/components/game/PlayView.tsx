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
    <div className="mx-auto w-full min-w-0 space-y-[24px] px-[12px] pt-[20px] pb-[calc(112px+env(safe-area-inset-bottom))] text-slate-800">
      <div className="space-y-[6px]">
        <p className="text-[12px] font-semibold tracking-wide text-indigo-600">
          눌러보자!
        </p>
        <h1 className="text-[24px] font-bold tracking-tight">
          {currentResult ? "어떤 결과가 나왔을까요?" : "뽑기 게임"}
        </h1>
        <p className="text-[14px] leading-relaxed text-slate-500">
          {currentResult
            ? "결과를 확인한 뒤 다음으로 넘어가세요."
            : "아래 버튼을 눌러 한 장을 뽑아주세요."}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-[8px] rounded-[14px] border border-indigo-100 bg-indigo-50 px-[16px] py-[12px]">
        <h2 className="text-[14px] font-semibold text-indigo-900">
          남은 뽑기 개수: {pool.length}개
        </h2>
        <span className="text-[12px] font-medium text-indigo-600">
          {results.length} / {initialPool.length}장 공개
        </span>
      </div>

      {/* 추첨은 기존 draw를 그대로 사용하며, 결과를 확인하기 전에는 다음 추첨을 막습니다. */}
      <div aria-live="polite" aria-atomic="true">
        {currentResult ? (
          <section
            key={results.length}
            aria-label="이번 추첨 결과"
            className={`flex min-h-[280px] flex-col items-center justify-center gap-[16px] rounded-[24px] border bg-white px-[20px] py-[28px] text-center shadow-sm ${currentResult.isWinner ? "border-indigo-300" : "border-slate-200"}`}
          >
            <span className="text-[12px] font-semibold tracking-wide text-slate-500">
              {results.length}번째 제비
            </span>
            <span
              aria-hidden="true"
              className={`flex h-[72px] w-[72px] items-center justify-center rounded-full text-[36px] motion-safe:animate-[pulse_600ms_ease-out_1] ${currentResult.isWinner ? "bg-indigo-100 text-indigo-600" : "bg-violet-50 text-violet-500"}`}
            >
              {currentResult.isWinner ? "★" : "✦"}
            </span>
            <h3 className="w-full whitespace-pre-wrap break-words text-[28px] font-bold leading-snug text-indigo-950">
              {currentResult.text}
            </h3>
            <p
              className={`rounded-full px-[14px] py-[8px] text-[14px] font-semibold ${currentResult.isWinner ? "bg-indigo-50 text-indigo-700" : "bg-slate-100 text-slate-600"}`}
            >
              {currentResult.isWinner
                ? "🎉 당첨입니다!"
                : "일반 선택지가 나왔어요"}
            </p>
          </section>
        ) : (
          <div className="relative px-[8px] pb-[12px] pt-[8px]">
            <div
              aria-hidden="true"
              className="absolute inset-x-[16px] inset-y-[8px] rotate-3 rounded-[24px] border border-violet-200 bg-violet-100"
            />
            <div className="relative flex min-h-[280px] flex-col items-center justify-center gap-[16px] rounded-[24px] border border-indigo-200 bg-white px-[20px] py-[28px] text-center shadow-sm">
              <span className="text-[12px] font-semibold tracking-wide text-indigo-500">
                {results.length + 1}번째 제비
              </span>
              <span
                aria-hidden="true"
                className="flex h-[80px] w-[80px] items-center justify-center rounded-[24px] bg-indigo-50 text-[48px] font-bold text-indigo-400"
              >
                ?
              </span>
              <p className="text-[18px] font-bold text-indigo-900">
                두구두구...
              </p>
              <p className="text-[13px] text-slate-500">
                뽑기 버튼을 눌러보세요
              </p>
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-[13px] leading-relaxed text-slate-500">
        {isGameOver
          ? "이번 추첨이 끝났어요. 전체 결과를 확인해보세요."
          : currentResult
            ? "확인한 결과는 마지막에 모아서 볼 수 있어요."
            : "이미 뽑은 제비는 다시 나오지 않아요."}
      </p>

      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[430px] border-t border-indigo-100 bg-white/95 px-[16px] pt-[12px] pb-[calc(12px+env(safe-area-inset-bottom))] backdrop-blur">
        {currentResult ? (
          <button
            type="button"
            onClick={() => {
              setCurrentResult(null);
              if (isGameOver) {
                onGameEnd(results);
              }
            }}
            className="min-h-[56px] w-full rounded-[16px] bg-indigo-600 px-[16px] text-[16px] font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 active:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            {isGameOver ? "결과 보러가기" : "다음 뽑기 진행"}
          </button>
        ) : (
          <button
            type="button"
            onClick={draw}
            disabled={pool.length === 0 || isGameOver}
            className="min-h-[56px] w-full rounded-[16px] bg-indigo-600 px-[16px] text-[16px] font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 active:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            한 장 뽑기
          </button>
        )}
      </div>
    </div>
  );
}
