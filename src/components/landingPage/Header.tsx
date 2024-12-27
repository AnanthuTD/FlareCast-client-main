'use client'
import React, { useState } from 'react';
import { HeaderProps } from '../../types';
import { Button } from './Button';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignUp = () => {
    // Implement sign up logic
  };

  return (
    <header className="flex flex-col justify-center px-16 w-full text-base bg-white h-[72px] max-md:px-5 max-md:max-w-full">
      <nav className="flex flex-wrap gap-8 justify-center items-center w-full max-md:max-w-full">
        <div className="flex flex-1 shrink items-start self-stretch my-auto text-2xl font-black tracking-normal leading-none whitespace-nowrap basis-0 min-w-[240px] text-neutral-800 max-md:max-w-full">
          <div className="flex overflow-hidden gap-1 items-center min-h-[34px] w-[186px]">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/102e91c424db778ef7955a167a383a73ca5d811d487b5eb714b86e26ec08257f?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec"
              alt="FlareCast logo"
              className="object-contain shrink-0 self-stretch my-auto aspect-square w-[34px]"
            />
            <div className="overflow-hidden self-stretch pb-1.5 my-auto w-[134px]">
              FlareCast
            </div>
          </div>
        </div>

        <div className="flex gap-8 items-center self-stretch my-auto text-black whitespace-nowrap min-w-[240px]">
          <a href="/" className="gap-1 self-stretch my-auto hover:text-gray-600">Home</a>
          <a href="/features" className="gap-1 self-stretch my-auto hover:text-gray-600">Features</a>
          <a href="/pricing" className="gap-1 self-stretch my-auto hover:text-gray-600">Pricing</a>
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="gap-1 self-stretch my-auto hover:text-gray-600"
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
            >
              Support
            </button>
            {isMenuOpen && (
              <div className="absolute top-full left-0 flex overflow-hidden flex-col p-6 max-w-full bg-white border border-black border-solid w-[140px] max-md:px-5">
                <a href="/support" className="hover:text-gray-600">Support</a>
                <a href="/testimonials" className="mt-4 hover:text-gray-600">Testimonials</a>
                <a href="/blog" className="mt-4 hover:text-gray-600">Blog</a>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-row-reverse shrink gap-4 items-center self-stretch my-auto basis-0 min-w-[240px] max-md:max-w-full">
          <Button onClick={handleSignUp}>Sign Up</Button>
        </div>
      </nav>
    </header>
  );
};