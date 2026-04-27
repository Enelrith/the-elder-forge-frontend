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
      className="btn-primary mt-2 w-full disabled:cursor-not-allowed disabled:opacity-60"
    >
      {buttonValue}
    </button>
  );
}
