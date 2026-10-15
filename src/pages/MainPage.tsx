import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import cn from "classnames";

export default function MainPage() {
  return (
    <div className="mx-auto w-full min-w-0 space-y-[28px] px-[16px] pt-[28px] pb-[calc(24px+env(safe-area-inset-bottom))] text-slate-800">
      <header className="space-y-[8px]">
        <p className="text-[12px] font-semibold tracking-wide text-indigo-600">
          랜덤 뽑기 게임
        </p>
        <h1 className="text-[28px] font-bold leading-snug tracking-tight">
          오늘은 무엇을
          <br />
          뽑아볼까?
        </h1>
        <p className="text-[14px] leading-relaxed text-slate-500">
          고민하지말고 GO
        </p>
      </header>

      <nav aria-label="게임 선택" className="space-y-[12px]">
        <ModeTile
          path="yes-or-no"
          emoji="⚖️"
          description="OX - 누구 말을 들을까?"
        >
          양자택일
        </ModeTile>
        <ModeTile
          path="lucky-draw"
          emoji="🎯"
          description="참가 인원을 정하고 당첨자 뽑기"
        >
          럭키드로우
        </ModeTile>
        <ModeTile
          path="jebi"
          emoji="🎟️"
          description="선택지를 직접 넣은 제비뽑기"
        >
          제비뽑기
        </ModeTile>
        <ModeTile
          path="custom"
          emoji="🪄"
          description="커스터마이징 게임 모드"
          disabled
        >
          커스텀 모드
        </ModeTile>
      </nav>

      <p className="text-center text-[12px] leading-relaxed text-slate-500">
        ENJOY✨
      </p>
    </div>
  );
}

function ModeTile({
  children,
  path,
  emoji,
  description,
  disabled = false,
}: PropsWithChildren<{
  path: string;
  emoji: string;
  description: string;
  disabled?: boolean;
}>) {
  const className = cn(
    "flex min-h-[112px] w-full items-center gap-[14px] rounded-[20px] border p-[16px] text-left",
    disabled
      ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
      : "border-indigo-100 bg-white text-indigo-950 shadow-sm hover:border-indigo-300 hover:bg-indigo-50/40 active:bg-indigo-50 motion-safe:transition-transform motion-safe:active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
  );
  const content = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          "flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[16px] text-[28px]",
          disabled ? "bg-slate-200/60" : "bg-indigo-50",
        )}
      >
        {emoji}
      </span>
      <span className="min-w-0 flex-1 space-y-[6px]">
        <span className="flex flex-wrap items-center gap-[8px] text-[18px] font-bold">
          {children}
          {disabled && (
            <span className="rounded-full bg-slate-200 px-[8px] py-[4px] text-[11px] font-semibold text-slate-600">
              준비 중
            </span>
          )}
        </span>
        <span className="block text-[13px] leading-relaxed text-slate-500">
          {description}
        </span>
      </span>
      {!disabled && (
        <span aria-hidden="true" className="text-[24px] text-indigo-300">
          ›
        </span>
      )}
    </>
  );

  return disabled ? (
    <button type="button" disabled className={className}>
      {content}
    </button>
  ) : (
    <Link className={className} to={`/game/${path}`}>
      {content}
    </Link>
  );
}
