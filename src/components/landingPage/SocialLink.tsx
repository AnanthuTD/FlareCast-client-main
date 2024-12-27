import * as React from 'react';
import { SocialLinkProps } from '../../types';

export const SocialLink: React.FC<SocialLinkProps> = ({
  icon,
  platform
}) => {
  return (
    <div className="flex gap-3 items-center py-2 w-full">
      <img
        loading="lazy"
        src={icon}
        alt={`${platform} icon`}
        className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
      />
      <div className="self-stretch my-auto">{platform}</div>
    </div>
  );
};