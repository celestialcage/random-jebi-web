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
  };

  const handleGameEnd = (results: GameResult[]) => {
    setFinalResults(results);
    setStep("RESULT");
  };

  return (
    <>
      {step === "SETUP" && <LuckyDrawSetupView onStart={handleStartGame} />}
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
