import * as React from 'react';
import { ButtonProps } from '@/types';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  disabled = false,
  onClick,
  className = ''
}) => {
  const baseStyles = "px-16 py-6 text-lg font-medium tracking-tight leading-loose text-center whitespace-nowrap rounded-[7992px] max-md:px-5 w-full";
  const variantStyles = variant === 'primary' 
    ? "bg-indigo-500 text-white"
    : "bg-gray-100 text-zinc-400";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${className}`}
      tabIndex={0}
    >
      {children}
    </button>
  );
}