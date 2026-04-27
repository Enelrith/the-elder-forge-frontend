import type { ReactNode } from 'react';

interface PageHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export default function PageHeading({
  eyebrow,
  title,
  description,
  actions,
}: PageHeadingProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl space-y-2">
        {eyebrow && <p className="forge-kicker">{eyebrow}</p>}
        <h1 className="forge-title text-4xl font-semibold sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="text-muted max-w-2xl text-sm leading-6">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </header>
  );
}
