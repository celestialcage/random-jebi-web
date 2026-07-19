import { useEffect, useState } from "react";
import { DrawItem, GameResult } from "../types/app";
import JebiSetupView from "../components/game/JebiSetupView"; // 💡 새로 만들 컴포넌트
import PlayView from "../components/game/PlayView";
import ResultView from "../components/game/ResultView";
import { useOutletContext } from "react-router-dom";

export default function JebiPage() {
  const { setTitle } = useOutletContext<{ setTitle: (t: string) => void }>();

  const [step, setStep] = useState<"SETUP" | "PLAY" | "RESULT">("SETUP");
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
  const handleStartCustomGame = (createdItems: DrawItem[]) => {
    setInitialPool(createdItems); // 유저가 직접 만든 풀 주입
    setStep("PLAY"); // 💡 동일한 PlayView로 화면 전환!
  };

  return (
    <>
      {step === "SETUP" && <JebiSetupView onStart={handleStartCustomGame} />}

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
