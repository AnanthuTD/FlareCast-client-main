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
import Divider from "../divider";
import AddMembers from "../add-member";

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
		"/api/folders" as string,
		"/folders/ws"
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

			<div className="flex my-4 mt-10 justify-between text-sm">
				<div>{spaceId && <AddMembers spaceId={spaceId} />}</div>
				<div>
					<p className="text-slate-500">{"2"} video</p>
				</div>
			</div>

			<Divider />

			{/* Optional FolderPredecessors if needed */}
			<FolderPredecessors folderId={folderId} />

			<div className="flex flex-col mt-8 w-full tracking-normal max-md:max-w-full">
				{/* Folder List */}

				<h2 className="text-xl font-bold">Folders</h2>

				<FolderList folders={folders as Folder[]} />
			</div>

			<Separator />

			{/* Tabs Section */}
			<VideoLibraryTabs folderId={folderId} />
		</div>
	);
};
