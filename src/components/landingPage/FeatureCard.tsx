import * as React from 'react';
import { FeatureCardProps } from '../../types';

export const FeatureCard: React.FC<FeatureCardProps> = ({
  image,
  title,
  description
}) => {
  return (
    <div className="flex overflow-hidden flex-col flex-1 shrink basis-0 min-w-[240px]">
      <img
        loading="lazy"
        src={image}
        alt=""
        className="object-contain w-full aspect-[1.69]"
      />
      <div className="flex flex-col mt-8 w-full">
        <div className="flex flex-col w-full text-black">
          <div className="text-2xl font-bold leading-9">{title}</div>
          <div className="mt-4 text-base leading-6">{description}</div>
        </div>
        <div className="flex flex-col items-start mt-8 w-full text-base text-black">
          <div className="flex overflow-hidden gap-2 justify-center items-center">
            <div className="self-stretch my-auto">Learn More</div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/ee5bdbc32bbc53684deecb2f9d63712884517174ee790d5d45a4eae8116d726d?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec"
              alt=""
              className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
            />
          </div>
        </div>
      </div>
    </div>
  );
};