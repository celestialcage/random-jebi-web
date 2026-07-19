import { PropsWithChildren } from "react";
import cn from "classnames";

export default function ManualCards({
  className,
  children,
}: PropsWithChildren<Cn>) {
  return (
    <div className={cn("w-full h-full flex flex-col gap-y-7", className)}>
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
      className={cn(
        "w-full h-full flex flex-col justify-center items-center",
        "text-gray900 rounded-10 bg-white shadow-sm",
        className,
      )}
      onClick={handleClick}
    >
      <div className="text-48 mb-8">{emoji}</div>
      <div className="text-20 font-semibold">{children}</div>
    </button>
  );
}
