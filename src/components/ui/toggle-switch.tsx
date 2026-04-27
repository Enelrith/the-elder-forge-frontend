interface ToggleSwitchProps {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: () => void;
}

export default function ToggleSwitch({
  checked,
  disabled = false,
  label,
  onChange,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-sm border border-stone-600 transition-colors focus:ring-2 focus:ring-amber-300/40 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? 'bg-amber-500' : 'bg-stone-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-xs bg-stone-950 transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
