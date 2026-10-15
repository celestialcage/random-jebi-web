import { useState } from "react";

interface Props {
  onStart: (total: number, winners: number) => void;
  initialConfig: { total: number; winners: number };
}

const MAX_TOTAL = 99; // 💡 상수로 상단에 선언!

export default function LuckyDrawSetupView({ onStart, initialConfig }: Props) {
  // 💡 1. 상태를 'string'으로 관리하여 빈 값("") 입력을 허용합니다.
  const [totalInput, setTotalInput] = useState<string>(
    String(initialConfig?.total ?? 2),
  );
  const [winnersInput, setWinnersInput] = useState<string>(
    String(initialConfig?.winners ?? 1),
  );

  // 실제 연산에 사용할 숫자 값 (유효하지 않으면 기본값 0)
  const total = parseInt(totalInput, 10) || 0;
  const winners = parseInt(winnersInput, 10) || 0;

  // ➕ / ➖ 버튼 핸들러
  const handleStepTotal = (step: number) => {
    // 최소 2명, 최대 MAX_TOTAL명 제한
    const nextValue = Math.max(2, Math.min(MAX_TOTAL, total + step));
    // const nextValue = Math.max(2, total + step); // 최소 2명 제한
    setTotalInput(String(nextValue));

    if (nextValue < winners) {
      setWinnersInput(String(nextValue));
    }
  };

  const handleStepWinners = (step: number) => {
    const nextValue = Math.max(1, Math.min(total - 1, winners + step)); // 1 ~ total-1 제한
    setWinnersInput(String(nextValue));
  };

  // ⌨️ 키패드 직접 입력 핸들러 (문자열 상태 그대로 반영)
  const handleInputChange = (
    inputValue: string,
    setter: (val: string) => void,
    isTotal: boolean,
  ) => {
    // 💡 데스크탑 문자 입력 방어: 숫자만 남기고 전부 제거 정규식
    const onlyNums = inputValue.replace(/[^0-9]/g, "");

    // 첫 글자가 0이면 제거 (예: 05 -> 5), 단 아예 빈 값("")은 허용하여 지울 수 있게 함
    let sanitized = onlyNums === "" ? "" : String(parseInt(onlyNums, 10));

    // 💡 입력창에 직접 숫자를 칠 때 Max값 체크
    if (isTotal && sanitized !== "") {
      const numValue = parseInt(sanitized, 10);
      if (numValue > MAX_TOTAL) {
        sanitized = String(MAX_TOTAL); // 999를 치면 자동으로 99로 바꿔줌
      }
    }

    setter(sanitized);

    // 💡 실시간 상한선 체크 디테일
    const numValue = parseInt(sanitized, 10) || 0;
    if (isTotal) {
      if (numValue > 1 && numValue < winners) {
        setWinnersInput(String(numValue - 1));
      }
    } else {
      if (numValue > total - 1) {
        setWinnersInput(String(total - 1)); // 당첨자가 참가자-1를 넘으면 참가자 수-1로 고정
      }
    }
  };

  // 🚀 시작 버튼 클릭 핸들러
  const handleSubmit = () => {
    // 최종 검증: 비어있거나 말도 안 되는 숫자 방어
    if (total < 2 || total > MAX_TOTAL || winners < 1) {
      alert(`참가 인원은 2명부터 ${MAX_TOTAL}명까지 가능합니다.`);
      return;
    }
    onStart(total, winners);
  };

  return (
    <div className="mx-auto w-full min-w-0 space-y-[24px] px-[12px] pt-[20px] pb-[calc(112px+env(safe-area-inset-bottom))] text-slate-800">
      <div className="space-y-[6px]">
        <p className="text-[12px] font-semibold tracking-wide text-indigo-600">
          두근두근 럭키드로우
        </p>
        <h1 className="text-[24px] font-bold tracking-tight">당첨자 뽑기!</h1>
        <p className="text-[14px] leading-relaxed text-slate-500">
          참가 인원과 당첨자 수를 입력하세요.
        </p>
      </div>
      <div className="space-y-[16px]">
        <section
          aria-labelledby="lucky-total-label"
          className="space-y-[16px] rounded-[20px] border border-slate-200 bg-white p-[16px] shadow-sm"
        >
          <div className="space-y-[6px]">
            <h2 className="text-[16px] font-bold">
              <label id="lucky-total-label" htmlFor="lucky-total">
                총 참가 인원
              </label>
            </h2>
            <p
              id="lucky-total-help"
              className="text-[13px] leading-relaxed text-slate-500"
            >
              2명부터 99명까지 참여할 수 있어요.
            </p>
          </div>
          <div className="flex items-center gap-[12px] rounded-[16px] bg-slate-50 p-[12px]">
            <button
              type="button"
              onClick={() => handleStepTotal(-1)}
              aria-label="총 참가 인원 줄이기"
              className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[14px] border border-slate-200 bg-white text-[24px] font-medium text-indigo-600 shadow-sm hover:bg-indigo-50 active:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
            >
              <span aria-hidden="true">−</span>
            </button>
            <div className="min-w-0 flex-1">
              <input
                id="lucky-total"
                aria-describedby="lucky-total-help"
                inputMode="numeric"
                pattern="[0-9]*"
                value={totalInput}
                onChange={(e) =>
                  handleInputChange(e.target.value, setTotalInput, true)
                }
                placeholder="0"
                className="h-[56px] w-full min-w-0 rounded-[12px] border border-transparent bg-transparent text-center text-[32px] font-bold tabular-nums text-indigo-900 focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
              <span
                aria-hidden="true"
                className="block text-center text-[12px] font-medium text-slate-500"
              >
                명
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleStepTotal(1)}
              aria-label="총 참가 인원 늘리기"
              className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[14px] border border-slate-200 bg-white text-[24px] font-medium text-indigo-600 shadow-sm hover:bg-indigo-50 active:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>
        </section>
        <section
          aria-labelledby="lucky-winners-label"
          className="space-y-[16px] rounded-[20px] border border-slate-200 bg-white p-[16px] shadow-sm"
        >
          <div className="space-y-[6px]">
            <h2 className="text-[16px] font-bold">
              <label id="lucky-winners-label" htmlFor="lucky-winners">
                당첨자 수
              </label>
            </h2>
            <p
              id="lucky-winners-help"
              className="text-[13px] leading-relaxed text-slate-500"
            >
              행운을 가져갈 인원을 정해주세요.
            </p>
          </div>
          <div className="flex items-center gap-[12px] rounded-[16px] bg-slate-50 p-[12px]">
            <button
              type="button"
              onClick={() => handleStepWinners(-1)}
              aria-label="당첨자 수 줄이기"
              className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[14px] border border-slate-200 bg-white text-[24px] font-medium text-indigo-600 shadow-sm hover:bg-indigo-50 active:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
            >
              <span aria-hidden="true">−</span>
            </button>
            <div className="min-w-0 flex-1">
              <input
                id="lucky-winners"
                aria-describedby="lucky-winners-help"
                inputMode="numeric"
                pattern="[0-9]*"
                value={winnersInput}
                onChange={(e) =>
                  handleInputChange(e.target.value, setWinnersInput, false)
                }
                placeholder="0"
                className="h-[56px] w-full min-w-0 rounded-[12px] border border-transparent bg-transparent text-center text-[32px] font-bold tabular-nums text-indigo-900 focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
              <span
                aria-hidden="true"
                className="block text-center text-[12px] font-medium text-slate-500"
              >
                명
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleStepWinners(1)}
              aria-label="당첨자 수 늘리기"
              className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[14px] border border-slate-200 bg-white text-[24px] font-medium text-indigo-600 shadow-sm hover:bg-indigo-50 active:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>
        </section>
      </div>
      <div className="rounded-[16px] border border-violet-100 bg-violet-50/70 p-[16px] text-[13px] leading-relaxed text-slate-600">
        <p className="font-semibold text-indigo-900">
          숫자를 눌러 직접 입력할 수도 있어요.
        </p>
        <p className="mt-[4px]">
          준비가 끝나면 아래 버튼을 눌러 추첨을 시작하세요.
        </p>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[430px] border-t border-indigo-100 bg-white/95 px-[16px] pt-[12px] pb-[calc(12px+env(safe-area-inset-bottom))] backdrop-blur">
        <button
          type="button"
          onClick={handleSubmit}
          className="min-h-[56px] w-full rounded-[16px] bg-indigo-600 px-[16px] text-[16px] font-bold text-white shadow-md shadow-indigo-200 transition-colors hover:bg-indigo-700 active:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          게임 시작하기
        </button>
      </div>
    </div>
  );
}
