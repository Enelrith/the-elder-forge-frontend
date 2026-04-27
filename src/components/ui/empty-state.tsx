import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="py-14 text-center">
      <p className="forge-title text-2xl font-semibold sm:text-3xl">{title}</p>
      {description && (
        <p className="text-muted mx-auto mt-3 max-w-xl text-sm leading-6">
          {description}
        </p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
