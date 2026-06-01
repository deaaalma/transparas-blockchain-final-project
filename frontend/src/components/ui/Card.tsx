import type { HTMLAttributes } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(clsx(
        'rounded-2xl border overflow-hidden transition-colors',
        'bg-[var(--color-bg-card)] border-[var(--color-border)]',
        className
      ))}
      {...props}
    >
      {children}
    </div>
  );
}
