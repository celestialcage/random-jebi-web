import { GameResult } from "../../types/app";

interface Props {
  results: GameResult[];
  onReset: () => void;
}

export default function ResultView({ results, onReset }: Props) {
  // 기존 결과에서 화면에 표시할 당첨 항목만 계산합니다. 추첨 순서는 바꾸지 않습니다.
  const winningResults = results.filter((result) => result.drawnItem.isWinner);

  return (
    <div className="mx-auto w-full min-w-0 space-y-[24px] px-[12px] pt-[20px] pb-[calc(112px+env(safe-area-inset-bottom))] text-slate-800">
      <div className="space-y-[6px]">
        <p className="text-[12px] font-semibold tracking-wide text-indigo-600">
          오늘의 추첨 기록
        </p>
        <h1 className="text-[24px] font-bold tracking-tight">
          두근두근, 결과 모아보기
        </h1>
        <p className="text-[14px] leading-relaxed text-slate-500">
          이번에 뽑은 제비를 순서대로 모았어요.
        </p>
      </div>

      <section
        aria-labelledby="draw-summary-heading"
        className="space-y-[16px] rounded-[24px] border border-indigo-200 bg-white p-[20px] shadow-sm"
      >
        <div className="flex items-center gap-[12px]">
          <span
            aria-hidden="true"
            className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[16px] bg-indigo-50 text-[26px] text-indigo-500"
          >
            ✦
          </span>
          <div>
            <h2
              id="draw-summary-heading"
              className="text-[18px] font-bold text-indigo-950"
            >
              추첨 완료!
            </h2>
            <p className="mt-[4px] text-[13px] text-slate-500">
              총 {results.length}장 공개 · 당첨 {winningResults.length}개
            </p>
          </div>
        </div>
        {winningResults.length > 0 ? (
          <div className="space-y-[10px] border-t border-indigo-100 pt-[16px]">
            <h3 className="text-[13px] font-semibold text-indigo-600">
              행운의 주인공
            </h3>
            <ul className="space-y-[8px]">
              {winningResults.map((result) => (
                <li
                  key={result.round}
                  className="flex items-start gap-[10px] rounded-[12px] bg-indigo-50 p-[12px]"
                >
                  <span aria-hidden="true" className="text-indigo-500">
                    ★
                  </span>
                  <span className="min-w-0 whitespace-pre-wrap break-words text-[16px] font-bold text-indigo-900">
                    {result.drawnItem.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="rounded-[12px] bg-violet-50 p-[12px] text-[14px] leading-relaxed text-slate-600">
            이번 기록에는 당첨으로 표시된 항목이 없어요. 아래에서 뽑은 내용을
            확인해보세요.
          </p>
        )}
      </section>

      <section
        aria-labelledby="draw-history-heading"
        className="space-y-[12px]"
      >
        <h2 id="draw-history-heading" className="text-[16px] font-bold">
          뽑은 순서
        </h2>
        <ol className="space-y-[10px]">
          {results.map((result) => (
            <li
              key={result.round}
              className="flex items-start gap-[12px] rounded-[16px] border border-slate-200 bg-white p-[16px]"
            >
              <span className="flex h-[32px] min-w-[32px] shrink-0 items-center justify-center rounded-full bg-slate-100 px-[6px] text-[12px] font-bold tabular-nums text-slate-500">
                <span className="sr-only">뽑은 순서 </span>
                {result.round}
              </span>
              <div className="min-w-0 flex-1 space-y-[6px]">
                <p className="whitespace-pre-wrap break-words text-[16px] font-semibold leading-relaxed">
                  {result.drawnItem.text}
                </p>
                <span
                  className={`inline-block rounded-full px-[8px] py-[4px] text-[12px] font-semibold ${result.drawnItem.isWinner ? "bg-indigo-50 text-indigo-700" : "bg-slate-100 text-slate-500"}`}
                >
                  {result.drawnItem.isWinner ? "★ 당첨" : "일반"}
                </span>
              </div>
            </li>
          ))}
        </ol>
        {results.length === 0 && (
          <p className="py-[16px] text-[14px] text-slate-500">
            아직 뽑은 제비가 없어요.
          </p>
        )}
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[430px] border-t border-indigo-100 bg-white/95 px-[16px] pt-[12px] pb-[calc(12px+env(safe-area-inset-bottom))] backdrop-blur">
        <button
          type="button"
          onClick={onReset}
          className="min-h-[56px] w-full rounded-[16px] bg-indigo-600 px-[16px] text-[16px] font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 active:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          설정으로 돌아가 다시 시작
        </button>
      </div>
    </div>
  );
}
