import React from 'react';
import { ButtonProps } from '../../types';

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  onClick,
  className = ''
}) => {
  const baseStyles = 'gap-2 self-stretch px-6 py-3 border border-black border-solid max-md:px-5';
  const variantStyles = variant === 'primary' 
    ? 'text-white bg-black'
    : 'text-black bg-white';

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${className}`}
      type="button"
    >
      {children}
    </button>
  );
};