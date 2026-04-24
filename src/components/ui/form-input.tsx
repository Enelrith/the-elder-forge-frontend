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
    <div className="flex flex-col gap-y-1">
      <label htmlFor={label}>{labelValue}</label>
      <input
        type={type}
        name={label}
        required={required}
        min={min}
        max={max}
        className="bg-gray-50 p-0.5 text-gray-900"
      ></input>
    </div>
  );
}
