import { Outlet, useLocation, useNavigate } from "react-router";
import BackIcon from "../assets/icons/left-chevron-svgrepo-com.svg?react";
import HomeIcon from "../assets/icons/home-svgrepo-com.svg?react";
import { useState } from "react";
import cn from "classnames";

export default function GamePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [title, setTitle] = useState("");

  return (
    <div className="flex flex-col h-full w-full">
      <div className="relative flex items-center justify-between h-46 border-b-1 border-gray-300 px-4">
        {/* 모바일 앱 바 스타일로 상단 헤더 정렬 */}
        <button onClick={() => navigate(-1)} className="z-10">
          <BackIcon className="w-26 h-26" />
        </button>
        {/* 타이틀 영역 (헤더의 완전한 정중앙에 위치) */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "font-semibold text-19 tracking-tight text-gray800",
          )}
        >
          {title}
        </div>
        {/* 오른쪽 밸런스용 빈 공간 (오른쪽에도 아이콘이 들어올 수 있으니 비워둠) */}
        <button className="z-10 mr-6" onClick={() => navigate(`/main`)}>
          <HomeIcon className="w-26 h-26" />
        </button>
      </div>
      {/* 게임 실제 내용물 영역 context로 child에 props로 보냄 */}
      <div className="flex-1 p-4">
        <Outlet context={{ setTitle }} />
      </div>
    </div>
  );
}
