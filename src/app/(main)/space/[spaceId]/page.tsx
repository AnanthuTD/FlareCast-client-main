"use client";

import { fetchFolders } from "@/actions/folder";
import { VideoLibrary } from "@/components/global/video-library";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const VideoPage = () => {
	const params = useParams<{ spaceId: string }>();
	const searchParams = useSearchParams();
	const setSelectedSpace = useWorkspaceStore((state) => state.setSelectedSpace);

	useEffect(() => {
		setSelectedSpace(params.spaceId);
	}, [params.spaceId, setSelectedSpace]);

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
