import type { HTMLAttributes } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  type: 'income' | 'expense';
}

export function Badge({ type, className, children, ...props }: BadgeProps) {
  const baseStyle = "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium tracking-wide";
  const typeStyle = type === 'income' 
    ? "bg-emerald-500/10 text-emerald-400" 
    : "bg-rose-500/10 text-rose-400";

  return (
    <span className={twMerge(clsx(baseStyle, typeStyle, className))} {...props}>
      {children}
    </span>
  );
}
