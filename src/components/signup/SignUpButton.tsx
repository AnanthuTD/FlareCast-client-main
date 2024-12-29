import * as React from 'react';
import { SignInButtonProps } from '@/types';

export const SignInButton: React.FC<SignInButtonProps> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="pt-1.5 pr-5 pb-2 pl-4 text-sm font-bold leading-6 text-white bg-indigo-500 rounded-[7992px]"
    >
      {children}
    </button>
  );
};