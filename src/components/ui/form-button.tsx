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
      className="m-auto mt-5 w-fit rounded-sm bg-blue-600 p-2 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
    >
      {buttonValue}
    </button>
  );
}
