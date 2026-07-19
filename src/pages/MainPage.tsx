import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import cn from "classnames";

export default function MainPage() {
  return (
    <div className="w-full h-full flex flex-col gap-y-7 p-10">
      <ModeTile path="yes-or-no" emoji="⚖️">
        양자택일
      </ModeTile>
      <ModeTile path="lucky-draw" emoji="🎯">
        럭키드로우
      </ModeTile>
      <ModeTile path="jebi" emoji="🎟️">
        제비뽑기
      </ModeTile>
      <ModeTile path="custom" emoji="🪄">
        커스텀 모드
      </ModeTile>
    </div>
  );
}

function ModeTile({
  children,
  path,
  emoji,
}: PropsWithChildren<{ path: string; emoji: string }>) {
  return (
    <Link
      className={cn(
        "w-full h-full flex flex-col justify-center items-center",
        "text-gray900 rounded-10 bg-white shadow-sm",
      )}
      to={`/game/${path}`}
    >
      <div className="text-48 mb-8">{emoji}</div>
      <div className="text-20 font-semibold">{children}</div>
    </Link>
  );
}
