import { useState, useEffect } from "react";
import { DrawItem, JebiOptionInput, SavedSlot } from "../../types/app";

interface Props {
  // 💡 시작 시 게임 풀(createdItems) 외에도 현재 셋업 정보(rawConfig)를 함께 전달하면 편리합니다!
  onStart: (
    createdItems: DrawItem[],
    rawConfig: {
      options: JebiOptionInput[];
      slotTitle: string;
      editingSlotId: string | null;
    },
  ) => void;

  initialConfig?: {
    options: JebiOptionInput[];
    slotTitle: string;
    editingSlotId: string | null;
  };
}

const LOCAL_STORAGE_KEY = "JEBI_SAVED_SLOTS";
const MAX_OPTIONS = 30;
const MAX_SLOTS = 10;

// 기본 빈 인풋 상태 정의 (재사용용)
const DEFAULT_BLANK_OPTIONS = [
  { id: "init-1", text: "", isWinner: false },
  { id: "init-2", text: "", isWinner: false },
];

export default function JebiSetupView({ onStart, initialConfig }: Props) {
  console.log("initialConfig:", initialConfig);
  // 1. 현재 입력 중인 리스트 상태 (기본 2개 생성 제공)
  // 💡 initialConfig가 존재하면 전달받은 값으로, 없으면 기본값으로 초기화!
  const [options, setOptions] = useState<JebiOptionInput[]>(
    initialConfig?.options && initialConfig.options.length > 0
      ? initialConfig.options
      : DEFAULT_BLANK_OPTIONS,
  );
  const [slotTitle, setSlotTitle] = useState<string>(
    initialConfig?.slotTitle ?? "",
  );

  // 2. 로컬스토리지에 저장된 슬롯 목록 상태
  const [savedSlots, setSavedSlots] = useState<SavedSlot[]>([]);
  // 💡 [추가] 현재 어떤 슬롯을 불러와서 수정 중인지 id를 기억하는 상태 (null이면 신규 작성 중)
  const [editingSlotId, setEditingSlotId] = useState<string | null>(
    initialConfig?.editingSlotId ?? null,
  );

  // 첫 렌더링 시 로컬스토리지 데이터 로드
  useEffect(() => {
    const rawData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (rawData) {
      setSavedSlots(JSON.parse(rawData));
    }
  }, []);

  // 💡 [추가] 슬롯 불러오기 핸들러
  const handleLoadSlot = (slot: SavedSlot) => {
    setOptions(slot.items);
    setSlotTitle(slot.title);
    setEditingSlotId(slot.id); // 현재 이 슬롯을 '수정 중'이라고 상태 등록!
  };

  // 💡 [추가] 완전 새로운 빈 슬롯으로 초기화 (리셋) 핸들러
  const handleResetToBlank = () => {
    if (editingSlotId || options.some((opt) => opt.text.trim() !== "")) {
      if (
        window.confirm(
          "현재 작성 중이거나 수정 중인 내용이 초기화됩니다. 새로 작성하시겠습니까?",
        )
      ) {
        setOptions(DEFAULT_BLANK_OPTIONS);
        setSlotTitle("");
        setEditingSlotId(null); // 신규 모드로 변경
      }
    }
  };

  // ➕ 새로운 옵션 행 추가
  const handleAddOption = () => {
    if (options.length >= MAX_OPTIONS) return;
    setOptions([
      ...options,
      { id: `opt-${Date.now()}`, text: "", isWinner: false },
    ]);
  };

  // ❌ 특정 옵션 행 삭제
  const handleRemoveOption = (id: string) => {
    if (options.length <= 2) {
      alert("최소 2개 이상의 옵션이 필요합니다.");
      return;
    }
    setOptions(options.filter((opt) => opt.id !== id));
  };

  // ✍️ 텍스트 입력 핸들러
  const handleTextChange = (id: string, text: string) => {
    setOptions(options.map((opt) => (opt.id === id ? { ...opt, text } : opt)));
  };

  // 🎯 당첨 여부 토글 핸들러
  const handleToggleWinner = (id: string) => {
    setOptions(
      options.map((opt) =>
        opt.id === id ? { ...opt, isWinner: !opt.isWinner } : opt,
      ),
    );
  };

  // 💾 [수정] 슬롯 저장 및 업데이트(수정) 핸들러
  const handleSaveToSlot = () => {
    const trimmedTitle = slotTitle.trim();
    // 유효성 체크 ===========================
    if (!trimmedTitle) {
      alert("저장할 세트 이름을 입력해주세요.");
      return;
    }

    if (options.some((opt) => !opt.text.trim())) {
      alert("빈 옵션이 있습니다. 내용을 채워주세요.");
      return;
    }

    // 저장 ===========================
    let updatedSlots: SavedSlot[] = [];

    if (editingSlotId) {
      // 💡 Case A: 기존 슬롯 수정 (Update)
      updatedSlots = savedSlots.map((slot) =>
        slot.id === editingSlotId
          ? { ...slot, title: trimmedTitle, items: options } // 아이디가 일치하면 덮어쓰기
          : slot,
      );
      alert("세트가 성공적으로 수정되었습니다! 📝");
    } else {
      // 💡 Case B: 신규 슬롯 생성 (Create)
      if (savedSlots.length >= MAX_SLOTS) {
        alert(
          "슬롯은 최대 10개까지만 저장 가능합니다. 기존 슬롯을 지워주세요.",
        );
        return;
      }
      const newSlot: SavedSlot = {
        id: `slot-${Date.now()}`,
        title: trimmedTitle,
        items: options,
        createdAt: Date.now(),
      };
      updatedSlots = [newSlot, ...savedSlots];
      setEditingSlotId(newSlot.id); // 저장한 후에는 자동으로 해당 슬롯 수정 상태로 전환
      alert("세트가 슬롯에 저장되었습니다!💾");
    }

    setSavedSlots(updatedSlots);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedSlots));
  };

  // 🗑️ 슬롯 삭제하기 (삭제 시 수정 중이던 id와 겹치면 리셋 처리 추가)
  const handleDeleteSlot = (
    slotId: string,
    e: React.MouseEvent | React.TouchEvent,
  ) => {
    e.stopPropagation(); // 카드 터치 이벤트 전파 차단
    if (!window.confirm("이 세트를 영구 삭제하시겠습니까?")) return;

    const updatedSlots = savedSlots.filter((slot) => slot.id !== slotId);
    setSavedSlots(updatedSlots);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedSlots));

    // 💡 내가 지금 수정 중이던 슬롯을 삭제했다면 상태를 신규 작성 모드로 리셋
    if (editingSlotId === slotId) {
      setOptions(DEFAULT_BLANK_OPTIONS);
      setSlotTitle("");
      setEditingSlotId(null);
    }
  };

  // 🚀 게임 시작을 전송할 때 DrawItem[] 규격으로 가공 후 부모로 슛
  const handleSubmit = () => {
    const validOptions = options.filter((opt) => opt.text.trim() !== "");
    if (validOptions.length < 2) {
      alert("텍스트가 입력된 유효한 옵션이 최소 2개 이상 필요합니다.");
      return;
    }

    // 부모인 PlayView가 기대하는 DrawItem[] 형태로 최종 정제 및 변환
    const finalPool: DrawItem[] = validOptions.map((opt) => ({
      id: opt.id,
      text: opt.text,
      isWinner: opt.isWinner,
    }));

    // 💡 부모에게 DrawItem[]과 함께 현재 셋업 상태를 몽땅 같이 던져서 기억하게 만듭니다.
    onStart(finalPool, {
      options,
      slotTitle,
      editingSlotId,
    });
  };

  return (
    <div className="space-y-6 p-4 pb-24">
      {/* 💾 파트 A: 저장된 슬롯 세트 목록 (저장 히스토리가 있을 때만 표시) */}
      {savedSlots.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-bold text-indigo-600">
            {editingSlotId ? "⚡ 세트 편집 중" : "저장된 세트 불러오기"}
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {/* 💡 [추가된 프리셋 킬러 UX]: 언제든 새 리스트를 짤 수 있게 해주는 고정 리셋 버튼 */}
            <button
              type="button"
              onClick={handleResetToBlank}
              className="flex-shrink-0 px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 active:scale-95 transition-transform"
            >
              ➕ 새 리스트 작성
            </button>
            {savedSlots.map((slot) => {
              const isCurrentEditing = slot.id === editingSlotId;
              return (
                <div
                  key={slot.id}
                  onClick={() => handleLoadSlot(slot)}
                  // 💡 수정 중인 칩은 테두리를 다르게 주어 시각적으로 강조
                  className={`flex items-center gap-2 flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium active:scale-95 transition-transform border ${
                    isCurrentEditing
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "bg-indigo-50 border-indigo-100 text-indigo-700"
                  }`}
                >
                  <span>{slot.title}</span>
                  <button
                    onClick={(e) => handleDeleteSlot(slot.id, e)}
                    className="text-indigo-300 hover:text-indigo-600 font-bold ml-1"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ✍️ 파트 B: 동적 리스트 입력 폼 */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-md font-bold text-gray-800">
            옵션 리스트 작성 ({options.length}/{MAX_OPTIONS})
          </label>
          <button
            type="button"
            onClick={handleAddOption}
            disabled={options.length >= MAX_OPTIONS}
            className="px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-lg disabled:opacity-30"
          >
            + 행 추가
          </button>
        </div>

        <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
          {options.map((opt, index) => (
            <div
              key={opt.id}
              className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100"
            >
              <span className="text-xs font-bold text-gray-400 w-4 text-center">
                {index + 1}
              </span>

              <input
                type="text"
                value={opt.text}
                onChange={(e) => handleTextChange(opt.id, e.target.value)}
                placeholder="옵션 내용을 입력하세요"
                className="flex-1 bg-transparent py-1 text-sm font-semibold focus:outline-none"
              />

              {/* 당첨 / 일반 토글 뱃지 버튼 */}
              <button
                type="button"
                onClick={() => handleToggleWinner(opt.id)}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                  opt.isWinner
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {opt.isWinner ? "당첨용" : "일반"}
              </button>

              <button
                type="button"
                onClick={() => handleRemoveOption(opt.id)}
                className="text-gray-400 hover:text-red-500 font-bold px-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 📥 파트 C: 현재 리스트 슬롯으로 저장/수정하기 폼 */}
      <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 space-y-2">
        <p className="text-xs font-medium text-gray-500">
          {editingSlotId
            ? "💡 세트 이름 및 옵션을 수정합니다"
            : "현재 입력된 조합을 슬롯에 기억해두기"}
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={slotTitle}
            onChange={(e) => setSlotTitle(e.target.value)}
            placeholder="예: 트럼프 문양, 내기 메뉴"
            className="flex-1 px-3 py-2 bg-white rounded-xl text-xs border border-gray-200 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="button"
            onClick={handleSaveToSlot}
            className="px-3 bg-white text-indigo-600 border border-indigo-200 text-xs font-bold rounded-xl active:bg-indigo-50"
          >
            슬롯 저장
          </button>
        </div>
      </div>

      {/* 하단 고정 시작 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg active:bg-indigo-700 active:scale-[0.99] transition-all text-center text-sm"
        >
          이 리스트로 뽑기 시작하기 🚀
        </button>
      </div>
    </div>
  );
}
