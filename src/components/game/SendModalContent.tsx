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
    <div
      className={cn(
        "space-y-[20px] rounded-[24px] bg-white p-[24px] text-center",
        className,
      )}
    >
      <div className="space-y-[10px]">
        <div aria-hidden="true" className="text-[64px] leading-none">
          {emoji}
        </div>
        <h2 className="text-[16px] font-bold text-indigo-900">{`${label}의 의견`}</h2>
      </div>
      <div className="relative rounded-[20px] border border-indigo-100 bg-indigo-50 px-[16px] py-[24px]">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[-7px] h-[12px] w-[12px] -translate-x-1/2 rotate-45 border-l border-t border-indigo-100 bg-indigo-50"
        />
        <p className="break-words text-[44px] font-bold leading-tight text-indigo-700">
          {result}
        </p>
      </div>
      <p className="text-[13px] leading-relaxed text-slate-500">
        이 한마디가 마음에 드나요?
      </p>
      <button
        type="button"
        onClick={onClose}
        className="min-h-[52px] w-full rounded-[14px] bg-indigo-600 px-[16px] text-[16px] font-bold text-white hover:bg-indigo-700 active:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
      >
        닫기
      </button>
    </div>
  );
}
