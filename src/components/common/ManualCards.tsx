import { PropsWithChildren } from "react";
import cn from "classnames";

export default function ManualCards({
  className,
  children,
}: PropsWithChildren<Cn>) {
  return (
    <div className={cn("flex w-full flex-col gap-[14px]", className)}>
      {children}
    </div>
  );
}

interface ManualCardProps<T> {
  emoji: string;
  value: T;
  onClick: (value: T) => void;
}

export function ManualCard<T>({
  children,
  className,
  emoji,
  value,
  onClick,
}: PropsWithChildren<Cn<ManualCardProps<T>>>) {
  const handleClick = () => {
    onClick(value);
    // console.log("클릭된 데이터의 value:", value);
  };

  return (
    <button
      type="button"
      className={cn(
        "group flex min-h-[168px] w-full flex-col items-center justify-center gap-[12px] rounded-[24px] border border-indigo-100 bg-white p-[20px] text-indigo-950 shadow-sm",
        "hover:border-indigo-300 hover:bg-indigo-50/40 active:bg-indigo-50 motion-safe:transition-transform motion-safe:active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
        className,
      )}
      onClick={handleClick}
    >
      <div
        aria-hidden="true"
        className="text-[56px] leading-none motion-safe:transition-transform motion-safe:group-hover:-translate-y-[3px]"
      >
        {emoji}
      </div>
      <div className="text-[18px] font-bold">{children}</div>
    </button>
  );
}
