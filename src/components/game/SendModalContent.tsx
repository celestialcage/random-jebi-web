import cn from "classnames";

interface Props {
  emoji: string;
  label: string;
  result: string | undefined;
  onClose: () => void;
}

export default function SendModalContent({
  emoji,
  label,
  result,
  className,
  onClose,
}: Cn<Props>) {
  return (
    <div className={cn("flex flex-col bg-white rounded-10 h-full", className)}>
      {/* 모달 본문 */}
      <div className="flex flex-col justify-center text-center h-full">
        <div className="text-64">{emoji}</div>
        <div className="text-18 font-semibold">{`${label}의 의견`}</div>
        <div className="text-64 font-semibold">{result}</div>
      </div>
      {/* 모달 푸터: 닫기 버튼 */}
      <div className="border-gray-300 border-t-1 h-80">
        <button
          className="w-full h-full tracking-tight text-xl"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
}
