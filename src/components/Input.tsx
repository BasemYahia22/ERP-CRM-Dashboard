import React, { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-700 dark:text-slate-350 tracking-wide">
          {label}
        </label>
      )}
      
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute inset-s-3 text-slate-400 dark:text-slate-500 pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        
        <input
          id={id}
          className={`w-full text-xs rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-550 transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 hover:border-slate-300 dark:hover:border-slate-700 outline-none
            ${leftIcon ? 'ps-10' : 'ps-3.5'}
            ${rightIcon ? 'pe-10' : 'pe-3.5'}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            py-2.5 ${className}`}
          {...props}
        />

        {rightIcon && (
          <div className="absolute inset-e-3 text-slate-400 dark:text-slate-500 flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <span className="text-xs text-red-500 font-medium">{error}</span>
      )}
    </div>
  );
};
