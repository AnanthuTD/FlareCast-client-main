"use client";

import { fetchFolders } from "@/actions/folder";
import { VideoLibrary } from "@/components/global/video-library";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";

const VideoPage = () => {
	const params = useParams<{ spaceId: string }>();
	const searchParams = useSearchParams();

	return (
		<>
			<VideoLibrary
				spaceId={params.spaceId}
				title={searchParams.get("title") || "My-Space"}
				fetchFolders={fetchFolders}
			/>
		</>
	);
};

export default VideoPage;
