import { useEffect, useState } from "react";
import { DrawItem, GameResult, JebiOptionInput } from "../types/app";
import JebiSetupView from "../components/game/JebiSetupView"; // 💡 새로 만들 컴포넌트
import PlayView from "../components/game/PlayView";
import ResultView from "../components/game/ResultView";
import { useOutletContext } from "react-router-dom";

export default function JebiPage() {
  const { setTitle } = useOutletContext<{ setTitle: (t: string) => void }>();

  const [step, setStep] = useState<"SETUP" | "PLAY" | "RESULT">("SETUP");
  // 💡 유저가 제비뽑기 셋업 창에서 입력했던 상태를 부모 페이지에서 보관
  const [savedConfig, setSavedConfig] = useState<{
    options: JebiOptionInput[];
    slotTitle: string;
    editingSlotId: string | null;
  }>({
    options: [
      { id: "init-1", text: "", isWinner: false },
      { id: "init-2", text: "", isWinner: false },
    ],
    slotTitle: "",
    editingSlotId: null,
  });
  const [initialPool, setInitialPool] = useState<DrawItem[]>([]);
  const [finalResults, setFinalResults] = useState<GameResult[]>([]);

  useEffect(() => {
    setTitle("제비뽑기");
  }, [setTitle]);

  // 💡 커스텀 모드는 모든 카드를 다 뽑았을 때(남은 풀이 0일 때) 끝나는 게임입니다.
  const checkIsGameOver = (currentPool: DrawItem[]) => {
    return currentPool.length === 0;
  };

  // JebiSetupView에서 [아이패드(당첨), 꽝, 스타벅스(당첨)...] 이런 리스트를 다 완성하고 시작을 누르면 실행됨
  const handleStartCustomGame = (
    createdItems: DrawItem[],
    rawConfig: {
      options: JebiOptionInput[];
      slotTitle: string;
      editingSlotId: string | null;
    },
  ) => {
    // 1. 유저의 입력 셋업 정보 기억
    setSavedConfig(rawConfig);

    // 2. 게임 풀 저장 및 스텝 이동
    setInitialPool(createdItems); // 유저가 직접 만든 풀 주입
    setStep("PLAY"); // 💡 동일한 PlayView로 화면 전환!

    // 모바일 뒤로가기 방어: 히스토리에 가짜 state 하나 밀어넣기
    window.history.pushState({ internalStep: "PLAY" }, "");
  };

  // 2. 💡 [핵심!] 브라우저 뒤로가기(popstate) 감지 이벤트 등록
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // PLAY 단계에서 뒤로가기를 누른 경우
      if (step === "PLAY") {
        // 유저 확인창 (선택사항, 원치 않으시면 confirm 문을 빼고 바로 setStep 하셔도 됩니다)
        if (
          window.confirm(
            "진행 중인 게임이 초기화됩니다. 설정으로 돌아가시겠습니까?",
          )
        ) {
          setStep("SETUP");
        } else {
          // 취소를 누른 경우, 사용자를 다시 PLAY 상태 히스토리에 묶어둠
          window.history.pushState({ step: "PLAY" }, "");
        }
      } else if (step === "RESULT") {
        // RESULT 단계에서 뒤로가기를 누른 경우 SETUP으로 복귀
        setStep("SETUP");
      }
    };

    // 뒤로가기/앞으로가기 시 실행될 리스너 등록
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [step]); // 💡 step이 바뀔 때마다 리스너가 최신 step 상태를 참조할 수 있도록 의존성 배열 지정

  return (
    <>
      {step === "SETUP" && (
        <JebiSetupView
          onStart={handleStartCustomGame}
          initialConfig={savedConfig} // 💡 이전 입력 상태 전달!
        />
      )}

      {step === "PLAY" && (
        <PlayView
          initialPool={initialPool}
          checkIsGameOver={checkIsGameOver} // 모든 풀 소진 시 종료되는 조건 전달
          onGameEnd={(results) => {
            setFinalResults(results);
            setStep("RESULT");
          }}
        />
      )}

      {step === "RESULT" && (
        <ResultView results={finalResults} onReset={() => setStep("SETUP")} />
      )}
    </>
  );
}
