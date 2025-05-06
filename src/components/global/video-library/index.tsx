"use client";

import React, { useEffect, useMemo, useState } from "react";
import { VideoLibraryTabs } from "./videoLibraryTabs";
import { Separator } from "@/components/ui/separator";
import { LibraryHeader } from "./LibraryHeader";
import { FolderList } from "./FolderList";
import { Folder } from "@/types";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";
import FolderPredecessors from "@/components/library/bread-crumb";
import { useSocket } from "@/hooks/useSocket";
import { SocketEvents } from "@/lib/socket/socketEvents";
import Divider from "../divider";
import AddMembers from "../add-member";
import { fetchFolders } from "@/actions/folder";
import { useInfiniteQuery } from "@tanstack/react-query";
import useMoveFolder from "@/hooks/useMoveFolder";
import { getVideoCount } from "@/actions/video";

interface VideoLibraryProps {
	spaceId?: string;
	title: string;
	folderId?: string;
}

export const VideoLibrary: React.FC<VideoLibraryProps> = ({
	spaceId,
	title,
	folderId,
}) => {
	const activeWorkspaceId = useWorkspaceStore(
		(state) => state.selectedWorkspace.id
	);
	const { onEvent, emitEvent } = useSocket(
		`${process.env.NEXT_PUBLIC_BACKEND_URL}/folders`,
		"/folders/socket.io"
	);
	const [videoCount, setVideoCount] = useState(0);

	const {
		dragOverFolderId,
		handleFolderMove,
		movingFolders,
		setDragOverFolderId,
		handleVideoMove,
		movingVideos,
	} = useMoveFolder();

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
		useInfiniteQuery({
			queryKey: ["workspace-folders", activeWorkspaceId, folderId, spaceId],
			queryFn: async ({ pageParam = {} }) => {
				const { createdAt, lastFolderId, skip = 0 } = pageParam;
				const response = await fetchFolders({
					workspaceId: activeWorkspaceId,
					folderId: folderId as string,
					spaceId,
					createdAt,
					lastFolderId,
					limit: 10,
					skip,
				});
				return response;
			},
			getNextPageParam: (lastPage, allPages) => {
				if (!lastPage.nextCursor) return undefined;
				return {
					createdAt: lastPage.nextCursor.createdAt,
					lastFolderId: lastPage.nextCursor.lastFolderId,
					skip: allPages.reduce((acc, page) => acc + page.folders.length, 0),
				};
			},
			initialPageParam: {
				createdAt: undefined,
				lastFolderId: folderId,
				skip: 0,
			},
			enabled: !!activeWorkspaceId,
		});

	const folders = useMemo(() => {
		return data?.pages.flatMap((page) => page.folders) ?? [];
	}, [data]);

	useEffect(() => {
		getVideoCount({ folderId, spaceId, workspaceId: activeWorkspaceId }).then(
			({ data, error }) => {
				if (error) {
					console.error(error);
					return;
				}
				setVideoCount(data.count);
			}
		);
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
	}, [refetch, folderId, activeWorkspaceId, spaceId]);

	return (
		<div className="flex flex-col px-10 py-6 max-md:px-5 w-full">
			<LibraryHeader title={title} spaceId={spaceId} folderId={folderId} />

			<div className="flex my-4 mt-10 justify-between text-sm">
				<div>{spaceId && <AddMembers spaceId={spaceId} />}</div>
				<div>
					<p className="text-slate-500">{videoCount} video</p>
				</div>
			</div>

			<Divider />

			{/* Optional FolderPredecessors if needed */}
			<FolderPredecessors
				folderId={folderId || ""}
				onMoveFolder={handleFolderMove}
				setDragOverFolderId={setDragOverFolderId}
				onMoveVideo={handleVideoMove}
			/>

			<div className="flex flex-col mt-8 w-full tracking-normal max-md:max-w-full">
				{/* Folder List */}

				<h2 className="text-xl font-bold">Folders</h2>

				<FolderList
					folders={folders as Folder[]}
					fetchNextPage={fetchNextPage}
					isFetchingNextPage={isFetchingNextPage}
					hasNextPage={hasNextPage}
					dragOverFolderId={dragOverFolderId}
					setDragOverFolderId={setDragOverFolderId}
					onMoveFolder={handleFolderMove}
					movingFolders={movingFolders}
					onMoveVideo={handleVideoMove}
				/>
			</div>

			<Separator />

			{/* Tabs Section */}
			<VideoLibraryTabs
				key={folderId ?? spaceId ?? activeWorkspaceId}
				folderId={folderId}
				movingVideos={movingVideos}
			/>
		</div>
	);
};
