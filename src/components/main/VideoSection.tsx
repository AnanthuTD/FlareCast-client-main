import * as React from "react";
import { VideoCard } from "./VideoCard";
import { SectionProps } from "@/types";

export const VideoSection: React.FC<SectionProps> = ({ title, videos }) => {
  return (
    <div className="flex flex-col py-px max-w-full w-[1288px]">
      <div className="text-lg font-medium tracking-tight leading-7 text-neutral-800 max-md:max-w-full">
        {title}
      </div>
      <div className="flex overflow-hidden flex-wrap gap-3 items-center mt-5 w-full max-md:max-w-full">
        {videos.map((video, index) => (
          <VideoCard key={index} {...video} />
        ))}
      </div>
    </div>
  );
};