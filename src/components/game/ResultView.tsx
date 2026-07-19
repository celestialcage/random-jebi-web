import { GameResult } from "../../types/app";

interface Props {
  results: GameResult[];
  onReset: () => void;
}

export default function ResultView({ results, onReset }: Props) {
  return (
    <div>
      <div>result</div>
      {results.map((result) => (
        <div key={result.round}>
          {result.round}회차: {result.drawnItem.text}
        </div>
      ))}
      <button onClick={onReset}>다시 시작</button>
    </div>
  );
}
