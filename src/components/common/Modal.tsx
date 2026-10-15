import { PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import cn from "classnames";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal({
  children,
  isOpen,
  onClose,
}: PropsWithChildren<Props>) {
  return isOpen
    ? createPortal(
        <div
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-[16px] backdrop-blur-sm",
          )}
          onClick={onClose}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="선택 결과"
            className="my-auto max-h-[calc(100dvh-32px)] w-full max-w-[398px] overflow-y-auto rounded-[24px] bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>,
        document.body,
      )
    : null;
}
