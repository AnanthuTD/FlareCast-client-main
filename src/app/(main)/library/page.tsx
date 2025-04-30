"use client";

import { VideoLibrary } from "@/components/global/video-library";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";

const LibraryPage = () => {
	const setSelectedSpace = useWorkspaceStore((state) => state.setSelectedSpace);
	setSelectedSpace("");

	return (
		<>
			<VideoLibrary title={"My Library"} key={"my-lib"} />
		</>
	);
};

export default LibraryPage;
