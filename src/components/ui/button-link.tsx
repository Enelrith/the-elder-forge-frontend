import Link from 'next/link';
import type { ComponentProps } from 'react';

type ButtonLinkVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: ButtonLinkVariant;
}

const variantClasses: Record<ButtonLinkVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
};

export default function ButtonLink({
  className = '',
  variant = 'secondary',
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={`${variantClasses[variant]} inline-flex items-center justify-center ${className}`}
      {...props}
    />
  );
}
