import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  type: 'income' | 'expense';
}

export function Badge({ type, className, children, ...props }: BadgeProps) {
  const baseStyle = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider";
  const typeStyle = type === 'income' 
    ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
    : "bg-rose-100 text-rose-800 border border-rose-200";

  return (
    <span className={twMerge(clsx(baseStyle, typeStyle, className))} {...props}>
      {children}
    </span>
  );
}
