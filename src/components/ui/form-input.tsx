interface FormInputProps {
  label: string;
  labelValue: string;
  type: string;
  required?: boolean;
  min?: number;
  max?: number;
}

export default function FormInput({
  label,
  labelValue,
  type,
  required,
  min,
  max,
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-y-2">
      <label htmlFor={label}>{labelValue}</label>
      <input
        id={label}
        type={type}
        name={label}
        required={required}
        min={min}
        max={max}
        className="rounded-xs border border-(--line) bg-gray-800 p-2 text-sm transition outline-none focus:border-gray-500 focus:bg-gray-700"
      />
    </div>
  );
}
