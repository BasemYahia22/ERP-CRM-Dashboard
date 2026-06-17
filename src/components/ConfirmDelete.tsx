import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { useAppStore } from "../stores/store";
import { translations } from "../i18n/translations";

interface ConfirmDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}) => {
  const { language } = useAppStore();
  const t = translations[language];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || t.delete_confirm_title}
      size="sm"
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-3.5">
          <div className="p-3.5 bg-red-50 dark:bg-red-950/20 rounded-xl text-red-650 shrink-0 flex items-center justify-center">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {title || t.delete_confirm_title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {description || t.delete_confirm_desc}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 mt-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            {t.cancel}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {t.delete}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
