import React from "react";
import VideoTab from "@/components/library/VideoTab";

export const VideoSection: React.FC = ({ folderId, spaceId }) => {
	return (
		<div className="flex flex-col gap-4">
			<div className="text-lg font-medium tracking-tight leading-loose text-neutral-800">
				Videos
			</div>
			<VideoTab folderId={folderId} spaceId={spaceId} />
		</div>
	);
};
