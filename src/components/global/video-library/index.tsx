import React, { useState, useEffect } from "react";
import { VideoLibraryTabs } from "./videoLibraryTabs";
import { Separator } from "@/components/ui/separator";
import { LibraryHeader } from "./LibraryHeader";
import { FolderList } from "./FolderList";
import { Folder } from "@/types";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";
import { useQueryData } from "@/hooks/useQueryData";

interface VideoLibraryProps {
	spaceId: string;
	title: string;
	fetchFolders: (
		workspaceId: string,
		folderId?: string,
		spaceId?: string
	) => Promise<Folder[]>;
}

export const VideoLibrary: React.FC<VideoLibraryProps> = ({
	spaceId,
	title,
	fetchFolders,
}) => {
	const activeWorkspaceId = useWorkspaceStore(
		(state) => state.selectedWorkspace.id
	);

	const { data: folders = [] } = useQueryData(["workspace-folders"], () =>
		fetchFolders(activeWorkspaceId, "", spaceId)
	);

	return (
		<div className="flex flex-col px-10 py-6 max-md:px-5 w-full">
			<LibraryHeader title={title} spaceId={spaceId} />

			{/* Optional FolderPredecessors if needed */}
			{/* <FolderPredecessors /> */}

			<div className="flex flex-col mt-8 w-full tracking-normal text-gray-500 max-md:max-w-full">
				{/* Folder List */}

				<FolderList folders={folders} />
			</div>

			<Separator />

			{/* Tabs Section */}
			<VideoLibraryTabs />
		</div>
	);
};
