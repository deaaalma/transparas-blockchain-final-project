import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
}

export function Button({ className, variant = 'primary', children, ...props }: ButtonProps) {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
  
  const variants = {
    primary: "bg-[var(--color-bali-maroon)] text-white hover:bg-[var(--color-bali-maroon-dark)] focus:ring-[var(--color-bali-maroon)] shadow-sm",
    secondary: "bg-[var(--color-bali-gold)] text-white hover:bg-[var(--color-bali-gold-dark)] focus:ring-[var(--color-bali-gold)] shadow-sm",
    outline: "border-2 border-[var(--color-bali-gold)] text-[var(--color-bali-gold-dark)] hover:bg-[var(--color-bali-gold)]/10 focus:ring-[var(--color-bali-gold)]",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm",
  };

  return (
    <button className={twMerge(clsx(baseStyle, variants[variant], className))} {...props}>
      {children}
    </button>
  );
}
