import * as React from 'react';
import { SocialButtonProps } from '@/types';

export const SocialButton: React.FC<SocialButtonProps> = ({
  icon,
  text,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col justify-center items-center px-16 py-3 w-full text-lg font-medium tracking-tight leading-loose text-center border border-solid border-gray-500 border-opacity-30 rounded-[7992px] text-neutral-800 max-md:px-5"
      tabIndex={0}
    >
      <div className="flex gap-3 max-w-full">
        <img
          loading="lazy"
          src={icon}
          alt=""
          className="object-contain shrink-0 aspect-[0.72] w-[23px]"
        />
        <span className="grow shrink my-auto">{text}</span>
      </div>
    </button>
  );
}