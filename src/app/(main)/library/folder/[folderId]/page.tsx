"use client";
import { fetchFolders } from "@/actions/folder";
import { FolderList } from "@/components/global/video-library/FolderList";
import { VideoSection } from "@/components/global/video-library/VideoSection";
import FolderPredecessors from "@/components/library/bread-crumb";
import { LibraryHeader } from "@/components/library/folder/new/LibraryHeader";
import { Button } from "@/components/ui/button";
import { getQueryClient } from "@/lib/get-query-client";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";
import { Folder } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export default function Page() {
	const { folderId } = useParams();
	const activeWorkspaceId = useWorkspaceStore(
		(state) => state.selectedWorkspace.id
	);
	const spaceId = useWorkspaceStore((state) => state.selectedSpace);
	const queryClient = getQueryClient();

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		error,
	} = useInfiniteQuery({
		queryKey: ["workspace-folders", activeWorkspaceId, folderId],
		queryFn: async ({ pageParam = {} }) => {
			const { createdAt, lastFolderId, skip = 0 } = pageParam;
			console.log("hellow: ")
			const response = await fetchFolders({
				workspaceId: activeWorkspaceId,
				folderId: folderId as string,
				createdAt,
				lastFolderId,
				limit: 10,
				skip,
			});
			console.log("response", response);
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
		enabled: !!activeWorkspaceId && !!folderId,
	});

	console.log("💾 data: ", data)

	const folders = useMemo(() => {
		console.debug("♾️ folders: ", data);
		return data?.pages.flatMap((page) => page.folders) ?? [];
	}, [data]);

	if (error) {
		return (
			<div className="text-red-500 flex flex-col items-center">
				<p>Failed to load folders: {error.message}</p>
				<Button
					className="mt-2 bg-indigo-500"
					onClick={() =>
						queryClient.invalidateQueries([
							"workspace-folders",
							activeWorkspaceId,
							folderId,
						])
					}
				>
					Retry
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col px-10 py-6 max-md:px-5 w-full">
			<LibraryHeader
				folderId={folderId as string}
				workspaceId={activeWorkspaceId}
				spaceId={spaceId}
			/>
			<FolderPredecessors folderId={folderId as string} />
			<div className="flex flex-col mt-8 w-full tracking-normal text-gray-500 max-md:max-w-full">
				<FolderList
					folders={folders as Folder[]}
					fetchNextPage={fetchNextPage}
					hasNextPage={hasNextPage}
					isFetchingNextPage={isFetchingNextPage}
				/>
				<VideoSection folderId={folderId} spaceId={spaceId} />
			</div>
		</div>
	);
}
