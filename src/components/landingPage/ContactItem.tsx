import { ContactItemProps } from "@/types";
import * as React from "react";

export const ContactItem: React.FC<ContactItemProps> = ({ icon, title, content, isLink = false }) => {
  const ContentWrapper = isLink ? 'a' : 'div';
  const contentProps = isLink ? { href: content } : {};

  return (
    <div className="flex flex-wrap gap-4 items-start w-full max-md:max-w-full">
      <img
        loading="lazy"
        src={icon}
        alt=""
        className="object-contain shrink-0 w-6 aspect-square"
      />
      <div className="flex flex-col flex-1 shrink basis-0 min-w-[240px] max-md:max-w-full">
        <div className="text-xl font-bold leading-snug text-black max-md:max-w-full">
          {title}
        </div>
        <ContentWrapper
          className={`mt-2 text-base text-black ${isLink ? 'underline decoration-auto decoration-solid underline-offset-auto' : ''} max-md:max-w-full`}
          {...contentProps}
        >
          {content}
        </ContentWrapper>
      </div>
    </div>
  );
};