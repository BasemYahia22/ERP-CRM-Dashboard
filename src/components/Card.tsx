import React, { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  action,
  children,
  className = '',
  id,
}) => {
  return (
    <div
      id={id}
      className={`bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-md/50 transition-all duration-200 ${className}`}
    >
      {(title || subtitle || action) && (
        <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-4">
          <div>
            {title && (
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};
