import { PropsWithChildren } from "react";
import cn from "classnames";
import { CardData } from "../../types/app";

interface CardsProps<T> {
  cardData: CardData<T>[];
  className?: string;
  onClick: (value: T) => void;
}

export default function Cards<T>({
  cardData,
  className,
  onClick,
}: CardsProps<Cn<T>>) {
  return (
    <div className={cn("w-full h-full flex flex-col gap-y-7", className)}>
      {cardData.map((c) => (
        <Card key={c.label} emoji={c.emoji} value={c.value} onClick={onClick}>
          {c.label}
        </Card>
      ))}
    </div>
  );
}

interface CardProps<T> {
  emoji: string;
  value: T;
  onClick: (value: T) => void;
}

export function Card<T>({
  children,
  className,
  emoji,
  value,
  onClick,
}: PropsWithChildren<Cn<CardProps<T>>>) {
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
