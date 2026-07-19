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
            "fixed top-0 bottom-0 left-0 right-0 w-full h-full bg-black/30 flex justify-center items-center",
            "hover:cursor-pointer",
          )}
          onClick={onClose}
          role="presentation"
        >
          <div
            className="z-10 bg-white rounded-10 max-w-[400px] max-h-[320px] h-full w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>,
        document.body,
      )
    : null;
}
