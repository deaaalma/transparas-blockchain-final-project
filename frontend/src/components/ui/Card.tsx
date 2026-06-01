import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge(clsx("bg-white rounded-xl shadow-md border border-[var(--color-bali-gold)]/20 overflow-hidden", className))} {...props}>
      {children}
    </div>
  );
}
