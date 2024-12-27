import * as React from "react";
import { ContactItem } from "./ContactItem";
import { ContactSectionProps } from "@/types";

export const ContactSection: React.FC<ContactSectionProps> = ({
  title,
  subtitle,
  description,
  contactItems
}) => {
  return (
    <div className="flex flex-wrap gap-10 items-start">
      <div className="flex flex-col flex-1 shrink text-black basis-0 min-w-[240px] max-md:max-w-full">
        <div className="self-start text-base font-semibold whitespace-nowrap">
          {title}
        </div>
        <div className="flex flex-col mt-4 w-full max-md:max-w-full">
          <div className="text-5xl font-bold leading-tight max-md:max-w-full max-md:text-4xl">
            {subtitle}
          </div>
          <div className="mt-6 text-lg max-md:max-w-full">
            {description}
          </div>
        </div>
      </div>
      <div className="flex flex-col py-2 min-w-[240px] w-[500px] max-md:max-w-full">
        {contactItems.map((item, index) => (
          <div key={index} className={index > 0 ? "mt-6" : ""}>
            <ContactItem {...item} />
          </div>
        ))}
      </div>
    </div>
  );
};