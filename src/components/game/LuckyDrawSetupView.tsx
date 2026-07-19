import { useState } from "react";

interface Props {
  onStart: (total: number, winners: number) => void;
}

const MAX_TOTAL = 99; // 💡 상수로 상단에 선언!

export default function LuckyDrawSetupView({ onStart }: Props) {
  // 💡 1. 상태를 'string'으로 관리하여 빈 값("") 입력을 허용합니다.
  const [totalInput, setTotalInput] = useState<string>("2");
  const [winnersInput, setWinnersInput] = useState<string>("1");

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
    <div className="flex flex-col justify-between min-h-[80vh] p-4">
      <div className="space-y-8">
        <h2 className="text-xl font-bold text-gray-800">
          기본 설정을 입력해주세요
        </h2>

        {/* 1. 총 참가 인원 설정 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500">
            총 참가 인원
          </label>
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl border border-gray-200">
            <button
              type="button"
              onClick={() => handleStepTotal(-1)}
              className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-xl font-bold active:scale-95"
            >
              -
            </button>
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              value={totalInput} // 💡 문자열 상태 연결
              onChange={(e) =>
                handleInputChange(e.target.value, setTotalInput, true)
              }
              className="w-50 text-center bg-transparent text-2xl font-bold focus:outline-none"
              placeholder="0"
            />
            <button
              type="button"
              onClick={() => handleStepTotal(1)}
              className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-xl font-bold active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        {/* 2. 당첨자 수 설정 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500">당첨자 수</label>
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl border border-gray-200">
            <button
              type="button"
              onClick={() => handleStepWinners(-1)}
              className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-xl font-bold active:scale-95"
            >
              -
            </button>
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              value={winnersInput} // 💡 문자열 상태 연결
              onChange={(e) =>
                handleInputChange(e.target.value, setWinnersInput, false)
              }
              className="w-50 text-center bg-transparent text-2xl font-bold focus:outline-none"
              placeholder="0"
            />
            <button
              type="button"
              onClick={() => handleStepWinners(1)}
              className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-xl font-bold active:scale-95"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg active:bg-indigo-700 active:scale-[0.99] transition-all text-center"
        >
          게임 시작하기 🪄
        </button>
      </div>
    </div>
  );
}
