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
    <div className="mx-auto w-full min-w-0 space-y-[24px] px-[12px] pt-[20px] pb-[calc(112px+env(safe-area-inset-bottom))] text-slate-800">
      <div className="space-y-[6px]">
        <p className="text-[12px] font-semibold tracking-wide text-indigo-600">
          제비 넣기
        </p>
        <h1 className="text-[24px] font-bold tracking-tight">
          무엇을 뽑아볼까요?
        </h1>
        <p className="text-[14px] leading-relaxed text-slate-500">
          선택지를 적고, 당첨으로 표시할 항목을 골라주세요.
        </p>
      </div>

      {/* 저장된 세트: 불러오기와 삭제를 각각 독립된 버튼으로 제공 */}
      {savedSlots.length > 0 && (
        <section
          aria-labelledby="jebi-saved-heading"
          className="space-y-[12px]"
        >
          <div className="flex flex-wrap items-center justify-between gap-[8px]">
            <h2 id="jebi-saved-heading" className="text-[16px] font-bold">
              저장된 세트{" "}
              <span className="text-[13px] font-medium text-slate-500">
                {savedSlots.length}/{MAX_SLOTS}
              </span>
            </h2>
            <button
              type="button"
              onClick={handleResetToBlank}
              className="min-h-[44px] rounded-[12px] px-[12px] text-[14px] font-semibold text-indigo-600 hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
            >
              + 새 리스트
            </button>
          </div>
          <div className="flex gap-[10px] overflow-x-auto pb-[8px]">
            {savedSlots.map((slot) => {
              const isCurrentEditing = slot.id === editingSlotId;
              return (
                <div
                  key={slot.id}
                  className={`flex w-[200px] shrink-0 items-center rounded-[16px] border shadow-sm ${
                    isCurrentEditing
                      ? "border-indigo-400 bg-indigo-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleLoadSlot(slot)}
                    aria-pressed={isCurrentEditing}
                    className="min-h-[80px] min-w-0 flex-1 rounded-[16px] p-[14px] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
                  >
                    <span className="block truncate text-[15px] font-bold text-indigo-900">
                      {slot.title}
                    </span>
                    <span className="mt-[6px] block text-[12px] text-slate-500">
                      {isCurrentEditing ? "편집 중 · " : ""}선택지{" "}
                      {slot.items.length}개
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteSlot(slot.id, e)}
                    aria-label={`${slot.title} 세트 삭제`}
                    className="mr-[6px] flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[12px] text-[20px] text-slate-400 hover:bg-rose-50 hover:text-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-500"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 중첩 스크롤 없이 페이지 전체로 선택지 목록 스크롤 */}
      <section
        aria-labelledby="jebi-options-heading"
        className="space-y-[12px]"
      >
        <div className="flex items-center justify-between gap-[12px]">
          <h2 id="jebi-options-heading" className="text-[16px] font-bold">
            선택지
          </h2>
          <span className="rounded-full bg-violet-100 px-[10px] py-[5px] text-[12px] font-semibold text-violet-700">
            {options.length} / {MAX_OPTIONS}
          </span>
        </div>
        <div className="space-y-[12px]">
          {options.map((opt, index) => (
            <div
              key={opt.id}
              className="space-y-[10px] rounded-[18px] border border-slate-200 bg-white p-[12px] shadow-sm"
            >
              <label
                htmlFor={`jebi-option-${opt.id}`}
                className="block text-[12px] font-semibold text-slate-500"
              >
                선택지 {index + 1}
              </label>
              <input
                id={`jebi-option-${opt.id}`}
                type="text"
                value={opt.text}
                onChange={(e) => handleTextChange(opt.id, e.target.value)}
                placeholder="예: 커피 사기, 오늘의 행운"
                className="h-[52px] w-full min-w-0 rounded-[12px] border border-slate-200 bg-slate-50 px-[14px] text-[16px] text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
              <div className="flex items-center justify-between gap-[12px]">
                <button
                  type="button"
                  onClick={() => handleToggleWinner(opt.id)}
                  aria-label={`선택지 ${index + 1} 당첨 여부`}
                  aria-pressed={opt.isWinner}
                  className={`flex min-h-[44px] items-center gap-[8px] rounded-[12px] border px-[14px] text-[14px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 ${
                    opt.isWinner
                      ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 bg-white text-slate-500"
                  }`}
                >
                  <span aria-hidden="true">{opt.isWinner ? "★" : "☆"}</span>
                  {opt.isWinner ? "당첨용" : "일반"}
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveOption(opt.id)}
                  aria-label={`선택지 ${index + 1} 삭제`}
                  className="min-h-[44px] min-w-[64px] rounded-[12px] px-[12px] text-[14px] font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-500"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleAddOption}
          disabled={options.length >= MAX_OPTIONS}
          className="min-h-[48px] w-full rounded-[14px] border border-dashed border-indigo-300 bg-indigo-50/50 px-[16px] text-[14px] font-semibold text-indigo-600 hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
        >
          {options.length >= MAX_OPTIONS
            ? "선택지는 최대 30개까지 만들 수 있어요"
            : "+ 선택지 추가"}
        </button>
      </section>

      <section
        aria-labelledby="jebi-save-heading"
        className="space-y-[12px] rounded-[18px] border border-violet-100 bg-violet-50/70 p-[16px]"
      >
        <div className="space-y-[4px]">
          <h2
            id="jebi-save-heading"
            className="text-[16px] font-bold text-indigo-900"
          >
            {editingSlotId ? "저장된 세트 수정" : "다음에도 이 조합으로"}
          </h2>
          <p className="text-[13px] leading-relaxed text-slate-500">
            {editingSlotId
              ? "변경한 이름과 선택지를 기존 세트에 저장해요."
              : "이름을 붙여 저장하면 다시 불러올 수 있어요."}
          </p>
        </div>
        <label
          htmlFor="jebi-slot-title"
          className="block text-[13px] font-semibold text-slate-600"
        >
          세트 이름
        </label>
        <input
          id="jebi-slot-title"
          type="text"
          value={slotTitle}
          onChange={(e) => setSlotTitle(e.target.value)}
          placeholder="예: 점심 메뉴, 주말 내기"
          className="h-[52px] w-full min-w-0 rounded-[12px] border border-violet-200 bg-white px-[14px] text-[16px] placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
        <button
          type="button"
          onClick={handleSaveToSlot}
          className="min-h-[48px] w-full rounded-[12px] border border-indigo-200 bg-white px-[16px] text-[14px] font-semibold text-indigo-700 hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
        >
          {editingSlotId ? "세트 수정 저장" : "세트 저장하기"}
        </button>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[430px] border-t border-indigo-100 bg-white/95 px-[16px] pt-[12px] pb-[calc(12px+env(safe-area-inset-bottom))] backdrop-blur">
        <button
          type="button"
          onClick={handleSubmit}
          className="min-h-[56px] w-full rounded-[16px] bg-indigo-600 px-[16px] text-[16px] font-bold text-white shadow-md shadow-indigo-200 transition-colors hover:bg-indigo-700 active:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          이 리스트로 뽑기 시작하기
        </button>
      </div>
    </div>
  );
}
