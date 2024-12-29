import * as React from 'react';
import { SignInInputFieldProps } from '@/types';

export const InputField: React.FC<SignInInputFieldProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange
}) => {
  const inputId = `${label.toLowerCase().replace(/\s+/g, '-')}-input`;

  return (
    <div className="w-full">
      <label htmlFor={inputId} className="text-sm leading-loose text-neutral-800">
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="overflow-hidden px-4 py-3 mt-2.5 w-full text-sm leading-relaxed bg-white rounded-2xl text-neutral-800"
        aria-label={label}
      />
    </div>
  );
}