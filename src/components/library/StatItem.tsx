import * as React from "react";

interface StatItemProps {
  icon: string;
  count: number;
  alt: string;
}

export function StatItem({ icon, count, alt }: StatItemProps) {
  return (
    <div className="flex flex-1 gap-1 items-center">
      <img
        loading="lazy"
        src={icon}
        alt={alt}
        className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
      />
      <div className="self-stretch my-auto">{count}</div>
    </div>
  );
}