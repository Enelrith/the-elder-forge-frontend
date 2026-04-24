interface FormButtonProps {
  buttonValue: string;
  disabled?: boolean;
}

export default function FormButton({
  buttonValue,
  disabled = false,
}: FormButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="mt-4 w-full rounded-xs border bg-gray-300 px-5 py-3 text-gray-900 hover:cursor-pointer"
    >
      {buttonValue}
    </button>
  );
}
