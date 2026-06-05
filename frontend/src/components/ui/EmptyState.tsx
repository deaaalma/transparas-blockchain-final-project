import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px] border border-dashed border-[var(--color-border-strong)] rounded-2xl bg-[var(--color-bg-card)]">
      <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)] shadow-sm">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[var(--color-text-secondary)] mb-6 max-w-sm">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
