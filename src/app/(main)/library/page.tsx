'use client'

import { fetchFolders } from "@/actions/folder";
import { VideoLibrary } from "@/components/global/video-library";

const LibraryPage = () => {
	return (
		<>
			<VideoLibrary
				title={"My Library"}
				fetchFolders={fetchFolders}
			/>
		</>
	);
};

export default LibraryPage;
