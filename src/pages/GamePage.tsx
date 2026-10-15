import { Outlet, useNavigate } from "react-router";
import BackIcon from "../assets/icons/left-chevron-svgrepo-com.svg?react";
import HomeIcon from "../assets/icons/home-svgrepo-com.svg?react";
import { useState } from "react";

export default function GamePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");

  return (
    <div className="flex h-full w-full min-w-0 flex-col">
      <header className="grid min-h-[64px] grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-[8px] border-b border-indigo-100 bg-white/70 px-[12px] py-[8px]">
        <button
          type="button"
          aria-label="뒤로 가기"
          onClick={() => navigate(-1)}
          className="flex h-[44px] w-[44px] items-center justify-center rounded-[12px] hover:bg-indigo-50 active:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
        >
          <BackIcon aria-hidden="true" className="h-[24px] w-[24px]" />
        </button>
        <p className="min-w-0 break-words text-center text-[17px] font-bold tracking-tight text-indigo-950">
          {title}
        </p>
        <button
          type="button"
          aria-label="메인 메뉴로 이동"
          onClick={() => navigate(`/main`)}
          className="flex h-[44px] w-[44px] items-center justify-center rounded-[12px] hover:bg-indigo-50 active:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
        >
          <HomeIcon aria-hidden="true" className="h-[24px] w-[24px]" />
        </button>
      </header>
      <div className="min-w-0 flex-1 p-[4px]">
        <Outlet context={{ setTitle }} />
      </div>
    </div>
  );
}
