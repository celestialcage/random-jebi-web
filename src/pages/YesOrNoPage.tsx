import { useEffect, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { CardData, YN } from "../types/app";
import cn from "classnames";
import ManualCards, { ManualCard } from "../components/common/ManualCards";
import Modal from "../components/common/Modal";
import SendModalContent from "../components/game/SendModalContent";

type CardPreset = {
  id: string;
  label: string; // 프리셋 이름 (선택 UI에 노출될 이름)
  cards: [CardData<YN>, CardData<YN>]; // 양자택일이니 항상 2개
};

const CARD_PRESETS: Record<string, CardPreset> = {
  angelDevil: {
    id: "angelDevil",
    label: "천사 / 악마",
    cards: [
      { label: "천사", emoji: "😇", value: "y" },
      { label: "악마", emoji: "😈", value: "n" },
    ],
  },
  parents: {
    id: "parents",
    label: "엄마 / 아빠",
    cards: [
      { label: "엄마", emoji: "👩", value: "y" },
      { label: "아빠", emoji: "👨", value: "n" },
    ],
  },
  grandParents: {
    id: "grandParents",
    label: "할머니 / 할아버지",
    cards: [
      { label: "할머니", emoji: "👵", value: "y" },
      { label: "할아버지", emoji: "👴", value: "n" },
    ],
  },
  siblings: {
    id: "siblings",
    label: "여동생 / 남동생",
    cards: [
      { label: "여동생", emoji: "👧", value: "y" },
      { label: "남동생", emoji: "👦", value: "n" },
    ],
  },
  // 계속 추가...
};

const RESULT_SETS = {
  do: { label: "할까?", pool: ["해", "하지마"] },
  buy: { label: "살까?", pool: ["사", "사지마"] },
} as const;

type YNMode = keyof typeof RESULT_SETS;

const DEFAULT_MODE: YNMode = "do";

export default function YesOrNoPage() {
  // 부모에서 받은 택배...로 setState
  const { setTitle } = useOutletContext<{ setTitle: (t: string) => void }>();

  const navigate = useNavigate();
  const location = useLocation();

  // const [isOpen, setIsOpen] = useState(location.hash === "#result");
  const isOpen = location.hash === "#result";

  // ui preset
  const presetKeys = Object.keys(CARD_PRESETS);
  const [presetKey, setPresetKey] = useState<string>(
    () => presetKeys[Math.floor(Math.random() * presetKeys.length)],
  );
  const currentPreset = CARD_PRESETS[presetKey];

  const [ynMode, setYnMode] = useState<YNMode>(DEFAULT_MODE);
  const [resultMap, setResultMap] = useState<Record<string, string>>({}); // 선택 결과
  const [pick, setPick] = useState<string | null>(null); // 내가 고른 것
  const [selectedItem, setSelectedItem] = useState<CardData<YN> | null>(null); // 선택한 카드 정보

  // 타이틀 세팅
  useEffect(() => {
    setTitle("양자택일");
  }, [setTitle]);

  // 직접 접속하거나 세트/모드 변경 뒤 과거 결과로 앞으로 가면 빈 결과창을 열지 않습니다.
  useEffect(() => {
    if (location.hash === "#result" && !pick) {
      navigate(location.pathname, { replace: true });
    }
  }, [location.hash, location.pathname, navigate, pick]);

  const handleSelect = (value: YN) => {
    const item = currentPreset.cards.find((item) => item.value === value);
    setSelectedItem(item ?? null);
    setPick(value);
    navigate(`${location.pathname}#result`);
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleModeChange = (newMode: YNMode) => {
    if (newMode === ynMode) return;
    getRandomResult(newMode); // 다른 모드로 바꿀 때만 새 의견 배정
    setYnMode(newMode);
    setPick(null);
    setSelectedItem(null);
  };

  const handlePresetChange = (nextKey: string) => {
    if (nextKey === presetKey || !CARD_PRESETS[nextKey]) return;
    setPresetKey(nextKey);
    getRandomResult(ynMode); // 캐릭터 세트를 바꾸면 현재 고민에 대한 새 의견 배정
    setPick(null);
    setSelectedItem(null);
  };

  const handleRandomPreset = () => {
    const otherKeys = presetKeys.filter((key) => key !== presetKey);
    if (otherKeys.length === 0) return;
    handlePresetChange(otherKeys[Math.floor(Math.random() * otherKeys.length)]);
  };

  // 랜덤 결과물 배정
  const getRandomResult = (mode: YNMode) => {
    const pool = RESULT_SETS[mode].pool;
    const random = pool[Math.floor(Math.random() * pool.length)];
    const map: Record<string, string> = {};
    map["y"] = random; // 천사 선택 시 결과
    map["n"] = random === pool[0] ? pool[1] : pool[0]; // 악마 선택 시 반대 결과

    // console.log("Generated Result Map:", map); // 디버깅용 로그
    setResultMap(map);
  };

  useEffect(() => {
    getRandomResult(DEFAULT_MODE); // 초기 결과 생성
  }, []); // 빈 배열 = 마운트 시 딱 한 번만 실행

  return (
    <>
      <div className="mx-auto w-full min-w-0 space-y-[24px] px-[12px] pt-[20px] pb-[calc(24px+env(safe-area-inset-bottom))] text-slate-800">
        <div className="space-y-[6px]">
          <p className="text-[12px] font-semibold tracking-wide text-indigo-600">
            OX 결정
          </p>
          <h1 className="text-[24px] font-bold tracking-tight">
            누구 말을 들을까?
          </h1>
          <p className="text-[14px] leading-relaxed text-slate-500">
            할지말지 살지말지 고민될 때 골라보자.
          </p>
        </div>

        <div
          role="group"
          aria-label="고민 종류"
          className="flex gap-[6px] rounded-[16px] border border-indigo-100 bg-indigo-50 p-[6px]"
        >
          <button
            type="button"
            aria-pressed={ynMode === "do"}
            onClick={() => handleModeChange("do")}
            className={cn(
              "min-h-[48px] min-w-0 flex-1 rounded-[12px] px-[12px] text-[16px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500",
              ynMode === "do"
                ? "bg-white font-bold text-indigo-700 shadow-sm"
                : "font-medium text-slate-500 hover:bg-white/60",
            )}
          >
            할까?
          </button>
          <button
            type="button"
            aria-pressed={ynMode === "buy"}
            onClick={() => handleModeChange("buy")}
            className={cn(
              "min-h-[48px] min-w-0 flex-1 rounded-[12px] px-[12px] text-[16px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500",
              ynMode === "buy"
                ? "bg-white font-bold text-indigo-700 shadow-sm"
                : "font-medium text-slate-500 hover:bg-white/60",
            )}
          >
            살까?
          </button>
        </div>

        <section aria-label="조언해줄 캐릭터" className="space-y-[12px]">
          <div className="flex flex-wrap items-center justify-between gap-[8px]">
            <h2 className="text-[16px] font-bold">조합 고르기</h2>
          </div>
          <div className="flex items-center gap-[8px]">
            <label htmlFor="yes-no-preset" className="sr-only">
              캐릭터 세트
            </label>
            <select
              id="yes-no-preset"
              value={presetKey}
              onChange={(e) => handlePresetChange(e.target.value)}
              aria-describedby="yes-no-preset-help"
              className="h-[48px] min-w-0 flex-1 rounded-[12px] border border-indigo-200 bg-white px-[12px] text-[16px] font-semibold text-indigo-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              {presetKeys.map((key) => (
                <option key={key} value={key}>
                  {CARD_PRESETS[key].label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleRandomPreset}
              aria-label="다른 캐릭터 조합 보기"
              title="다른 캐릭터 조합 보기"
              className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[12px] border border-indigo-200 bg-indigo-50 text-[24px] text-indigo-600 hover:bg-indigo-100 active:bg-indigo-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
            >
              <span aria-hidden="true">↻</span>
            </button>
          </div>
          <p
            id="yes-no-preset-help"
            className="text-[12px] leading-relaxed text-slate-500"
          >
            다른 조합을 고르면 새로운 의견을 들을 수 있어요.
          </p>
          <ManualCards>
            {currentPreset.cards.map((d) => (
              <ManualCard
                key={d.value}
                emoji={d.emoji}
                value={d.value}
                onClick={handleSelect}
              >
                {`${d.label} 말을 듣기`}
              </ManualCard>
            ))}
          </ManualCards>
        </section>
        <p className="text-center text-[13px] leading-relaxed text-slate-500">
          정답보다는 재미로, 마지막 결정은 내 마음대로.
        </p>
      </div>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <SendModalContent
          emoji={selectedItem?.emoji ?? "❓"}
          label={selectedItem?.label ?? "😔"}
          result={pick ? resultMap[pick] : undefined}
          onClose={handleClose}
        />
      </Modal>
    </>
  );
}
