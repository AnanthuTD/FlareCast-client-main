import React from "react";
import VideoTab from "@/components/global/video-tab";

export const VideoSection: React.FC = () => {
	return (
		<div className="flex flex-col gap-4">
			<div className="text-lg font-medium tracking-tight leading-loose text-neutral-800">
				Videos
			</div>
			<VideoTab />
		</div>
	);
};
