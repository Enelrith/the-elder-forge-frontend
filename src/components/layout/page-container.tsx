import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({
  children,
  className = '',
}: PageContainerProps) {
  return (
    <main className={`page-frame flex-1 py-6 sm:py-8 ${className}`}>
      <div className="page-shell">{children}</div>
    </main>
  );
}
