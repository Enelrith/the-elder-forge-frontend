interface StatusPillProps {
  children: string;
}

export default function StatusPill({ children }: StatusPillProps) {
  return (
    <span className="inline-flex rounded-xs border border-stone-600 px-2 py-1 text-xs font-semibold tracking-wide text-stone-300 uppercase">
      {children}
    </span>
  );
}
