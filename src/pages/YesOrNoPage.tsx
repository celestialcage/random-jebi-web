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

  // url 공유 시 pick 없이 결과창 뜨지 않게 해시 지우고 리다이렉트
  useEffect(() => {
    if (location.hash === "#result" && !pick) {
      navigate(location.pathname, { replace: true });
    }
  }, []);

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
    getRandomResult(newMode); // 모드 변경 시 새로운 결과 생성
    setYnMode(newMode);
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
      <div className="flex flex-col w-full h-full p-10 pt-5">
        <div className="max-h-50 min-h-50 flex w-full h-full items-center gap-x-5 pb-7">
          <button
            onClick={() => handleModeChange("do")}
            className={cn(
              "w-full h-full flex items-center justify-center",
              "bg-white rounded-10 shadow-sm",
              "font-normal",
              {
                "font-bold": ynMode === "do",
              },
            )}
          >
            <span
              className={cn({
                "font-bold border-b-2 border-gray500": ynMode === "do",
              })}
            >
              할까?
            </span>
          </button>
          <button
            onClick={() => handleModeChange("buy")}
            className={cn(
              "w-full h-full flex items-center justify-center",
              "bg-white rounded-10 shadow-sm",
              "font-normal",
              {
                "font-bold": ynMode === "buy",
              },
            )}
          >
            <span
              className={cn({
                "font-bold border-b-2 border-gray500": ynMode === "buy",
              })}
            >
              살까?
            </span>
          </button>
        </div>
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
