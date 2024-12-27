import * as React from 'react';
import { PricingPlanProps } from '../../types';

export const PricingPlan: React.FC<PricingPlanProps> = ({
  name,
  price,
  features,
  icon
}) => {
  return (
    <div className="flex flex-col flex-1 shrink justify-between p-8 border border-black border-solid basis-0 min-w-[240px] max-md:px-5">
      <div className="flex flex-col w-full text-black">
        <div className="flex flex-col items-end w-full font-bold">
          <img
            loading="lazy"
            src={icon}
            alt={`${name} plan icon`}
            className="object-contain w-12 aspect-square"
          />
          <div className="flex flex-col mt-4 max-w-full w-[352px]">
            <div className="text-xl leading-snug">{name}</div>
            <div className="mt-2 text-6xl leading-tight max-md:text-4xl">
              {price}
            </div>
          </div>
        </div>
        <div className="mt-8 w-full border border-black border-solid min-h-[1px]" />
        <div className="flex flex-col mt-8 w-full text-base">
          <div>Includes:</div>
          <div className="flex flex-col py-2 mt-4 w-full">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-4 items-start mt-4 first:mt-0 w-full">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/201470adac0e69cd5685bdcdebfd8125374c196f3e7c85aefdf7acf955c4ad47?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec"
                  alt=""
                  className="object-contain shrink-0 w-6 aspect-square"
                />
                <div>{feature}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-10 w-full text-base text-white">
        <button className="gap-2 self-stretch px-6 py-3 w-full bg-black border border-black border-solid max-md:px-5">
          Get started
        </button>
      </div>
    </div>
  );
};