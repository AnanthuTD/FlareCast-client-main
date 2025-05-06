"use client";

import { useState } from "react";
import { useMutationData } from "./useMutationData";
import { moveFolder } from "@/actions/folder";
import { moveVideo } from "@/actions/video";
import { getQueryClient } from "@/lib/get-query-client";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";

function useMoveFolder() {
	const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);
	const [movingFolders, setMovingFolders] = useState<Set<string>>(new Set());
	const [movingVideos, setMovingVideos] = useState<Set<string>>(new Set());

	const queryClient = getQueryClient();

	const { mutate: moveFolderMutate } = useMutationData(
		["move-folder"],
		moveFolder,
		"workspace-folders",
		handleMoveFolderSuccess,
		handleFolderMoveError
	);

	const { mutate: moveVideoMutate } = useMutationData(
		["move-video"],
		moveVideo,
		"workspace-video",
		handleMoveVideoSuccess,
		handleVideoMoveError
	);

	function handleFolderMoveError(error: unknown) {
		console.error(error);
		if (
			error instanceof Object &&
			"videoId" in error &&
			typeof error.videoId === "string"
		)
			movingVideos.delete(error.videoId);
	}

	function handleVideoMoveError(error: unknown) {
		console.error(error);
	}

	function handleMoveFolderSuccess(data: { id: string }) {
		setTimeout(
			() =>
				setMovingFolders((prev) => {
					const next = new Set(prev);
					next.delete(data.id);
					return next;
				}),
			3000
		);
	}

	function handleMoveVideoSuccess(data: {
		videoId: string;
		folderId: string;
	}) {
		console.log(data);
		queryClient.invalidateQueries({
			queryKey: [`videos`],
		});
		queryClient.invalidateQueries({
			queryKey: ["folder-video-count", data.folderId],
		});
		setTimeout(
			() =>
				setMovingVideos((prev) => {
					const next = new Set(prev);
					next.delete(data.videoId);
					return next;
				}),

			3000
		);
	}

	function handleFolderMove(
		sourceId: string,
		destination: { type: "folder" | "workspace"; id: string }
	) {
		if (!sourceId || !destination.id || sourceId === destination.id) return;
		setMovingFolders((prev) => new Set([...prev, sourceId]));
		moveFolderMutate({
			folderId: sourceId,
			destination,
		});
	}

	function handleVideoMove(
		sourceId: string,
		destination: { type: "folder" | "workspace"; id: string }
	) {
		console.log(sourceId);
		if (!sourceId || !destination.id || sourceId === destination.id) return;
		setMovingVideos((prev) => new Set([...prev, sourceId]));
		moveVideoMutate({
			videoId: sourceId,
			destination,
		});
	}

	return {
		movingVideos,
		dragOverFolderId,
		movingFolders,
		setDragOverFolderId,
		setMovingFolders,
		handleFolderMove,
		handleVideoMove,
	};
}

export default useMoveFolder;
