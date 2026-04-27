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
    <div className="space-y-2">
      <label htmlFor={label} className="text-sm font-medium text-stone-200">
        {labelValue}
      </label>
      <input
        id={label}
        type={type}
        name={label}
        required={required}
        minLength={min}
        maxLength={max}
        className="field-input"
      />
    </div>
  );
}
