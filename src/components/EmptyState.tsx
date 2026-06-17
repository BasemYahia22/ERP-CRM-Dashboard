import React, { ReactNode } from "react";
import { translations } from "../i18n/translations";
import { useAppStore } from "../stores/store";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
}) => {
  const { language } = useAppStore();
  const t = translations[language];

  return (
    <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30">
      <div className="p-4 bg-slate-100 dark:bg-slate-800/80 rounded-full text-slate-450 dark:text-slate-400 mb-4 flex items-center justify-center">
        {icon || (
          <svg
            className="w-10 h-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        )}
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
        {title || t.no_notifications}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
        {description ||
          "Add parameters or try adjusting filters to see results."}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};
