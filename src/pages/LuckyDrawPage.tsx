import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import LuckyDrawSetupView from "../components/game/LuckyDrawSetupView";
import PlayView from "../components/game/PlayView";
import ResultView from "../components/game/ResultView";
import { DrawItem, GameResult } from "../types/app";

// 참가인원 당첨인원 입력
// 뽑기 기계 이미지
// 뽑기 버튼
// 당첨자 발표 및 풀에서 제거
// 모두 뽑을 때까지 계속할 수 있음

type Steps = "SETUP" | "PLAY" | "RESULT";

export default function LuckyDrawPage() {
  const { setTitle } = useOutletContext<{ setTitle: (t: string) => void }>();

  const [step, setStep] = useState<Steps>("SETUP");

  // pool과 결과를 받아올 상태 지정
  const [initialPool, setInitialPool] = useState<DrawItem[]>([]);
  // 💡 유저가 세팅했던 값을 부모 페이지에서 보관합니다.
  const [savedConfig, setSavedConfig] = useState({ total: 2, winners: 1 });
  const [finalResults, setFinalResults] = useState<GameResult[]>([]);

  // 종료 조건 함수를 저장할 상태 (함수를 State에 넣을 때는 초기화 방식을 사용해야 함)
  const [checkIsGameOverFn, setCheckIsGameOverFn] = useState<
    (pool: DrawItem[], results: GameResult[]) => boolean
  >(() => () => false);

  useEffect(() => {
    setTitle("럭키드로우");
  }, [setTitle]);

  // SetupView에서 입력 완료 시 실행될 함수
  const handleStartGame = (total: number, winners: number) => {
    // 💡 0. 세팅값을 부모 상태에 기억시킵니다.
    setSavedConfig({ total, winners });

    // 1. 초기 풀 자동 빌드
    const generatedPool: DrawItem[] = [
      ...Array(winners)
        .fill(null)
        .map((_, i) => ({
          id: `w-${i}`,
          text: `당첨자 ${i + 1}`,
          isWinner: true,
        })),
      ...Array(total - winners)
        .fill(null)
        .map((_, i) => ({
          id: `l-${i}`,
          text: `참가자 ${i + 1}`,
          isWinner: false,
        })),
    ];

    // 2. 종료 조건 주입: 결과 리스트 중 'isWinner'인 개수가 처음 설정한 winners에 도달하면 끝
    const checkIsGameOver = (
      _currentPool: DrawItem[],
      nextResults: GameResult[],
    ) => {
      const currentWinnersCount = nextResults.filter(
        (r) => r.drawnItem.isWinner,
      ).length;
      return currentWinnersCount >= winners;
    };

    // 3. 생성된 데이터들을 부모 State에 저장해서 밑에 렌더링될 PlayView가 쓸 수 있게 전달합니다.
    setInitialPool(generatedPool);
    setCheckIsGameOverFn(() => checkIsGameOver); // 함수 자체를 상태에 넣을 때는 콜백으로 감싸야
    setStep("PLAY");

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

  const handleGameEnd = (results: GameResult[]) => {
    setFinalResults(results);
    setStep("RESULT");
  };

  return (
    <>
      {step === "SETUP" && (
        <LuckyDrawSetupView
          onStart={handleStartGame}
          initialConfig={savedConfig}
        />
      )}
      {step === "PLAY" && (
        <PlayView
          initialPool={initialPool}
          checkIsGameOver={checkIsGameOverFn}
          onGameEnd={handleGameEnd}
        />
      )}
      {step === "RESULT" && (
        <ResultView results={finalResults} onReset={() => setStep("SETUP")} />
      )}
    </>
  );
}
