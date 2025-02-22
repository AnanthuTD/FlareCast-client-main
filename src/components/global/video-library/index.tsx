import React, { useEffect } from "react";
import { VideoLibraryTabs } from "./videoLibraryTabs";
import { Separator } from "@/components/ui/separator";
import { LibraryHeader } from "./LibraryHeader";
import { FolderList } from "./FolderList";
import { Folder } from "@/types";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";
import { useQueryData } from "@/hooks/useQueryData";
import FolderPredecessors from "@/components/library/bread-crumb";
import { useSocket } from "@/hooks/useSocket";
import { SocketEvents } from "@/lib/socket/socketEvents";

interface VideoLibraryProps {
	spaceId: string;
	title: string;
	fetchFolders: (
		workspaceId: string,
		folderId?: string,
		spaceId?: string
	) => Promise<Folder[]>;
	folderId?: string;
}

export const VideoLibrary: React.FC<VideoLibraryProps> = ({
	spaceId,
	title,
	fetchFolders,
	folderId,
}) => {
	const activeWorkspaceId = useWorkspaceStore(
		(state) => state.selectedWorkspace.id
	);
	const { onEvent, emitEvent } = useSocket(
		"/api/collaboration/folder" as string,
		"/collaboration/socket.io"
	);

	const { data: folders = [], refetch } = useQueryData(
		["workspace-folders"],
		() => fetchFolders(activeWorkspaceId, folderId, spaceId)
	);

	useEffect(() => {
		onEvent(SocketEvents.FOLDER_CREATED, () => {
			refetch();
		});
		onEvent(SocketEvents.FOLDER_RENAMED, () => {
			refetch();
		});
		onEvent(SocketEvents.FOLDER_DELETED, () => {
			refetch();
		});
		emitEvent(SocketEvents.FOLDER_UPDATES, {
			folderId,
			activeWorkspaceId,
			spaceId,
		});
	}, [refetch, onEvent, emitEvent, folderId, activeWorkspaceId, spaceId]);

	return (
		<div className="flex flex-col px-10 py-6 max-md:px-5 w-full">
			<LibraryHeader title={title} spaceId={spaceId} folderId={folderId} />

			{/* Optional FolderPredecessors if needed */}
			<FolderPredecessors folderId={folderId} />

			<div className="flex flex-col mt-8 w-full tracking-normal text-gray-500 max-md:max-w-full">
				{/* Folder List */}

				<FolderList folders={folders as Folder[]} />
			</div>

			<Separator />

			{/* Tabs Section */}
			<VideoLibraryTabs folderId={folderId} />
		</div>
	);
};
