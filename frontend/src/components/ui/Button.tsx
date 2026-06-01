import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ className, variant = 'primary', size = 'md', children, ...props }: ButtonProps) {
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base',
  };

  const variants = {
    primary: [
      'bg-[var(--color-brand-orange)] text-white font-semibold',
      'hover:bg-[var(--color-brand-orange-hover)] active:scale-95',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'shadow-md shadow-orange-900/30',
    ].join(' '),
    ghost: [
      'bg-transparent text-[var(--color-text-secondary)]',
      'hover:bg-[var(--color-bg-card-hover)] hover:text-[var(--color-text-primary)]',
    ].join(' '),
    outline: [
      'bg-transparent border border-[var(--color-border-strong)]',
      'text-[var(--color-text-secondary)]',
      'hover:border-[var(--color-brand-orange)] hover:text-[var(--color-text-primary)]',
    ].join(' '),
    danger: [
      'bg-[var(--color-expense-dim)] text-[var(--color-expense)] font-medium',
      'hover:bg-red-500/20',
    ].join(' '),
  };

  return (
    <button
      className={twMerge(clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150 cursor-pointer',
        sizes[size],
        variants[variant],
        className
      ))}
      {...props}
    >
      {children}
    </button>
  );
}
