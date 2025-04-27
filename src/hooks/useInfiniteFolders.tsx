import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchFolders } from "@/actions/folder";
import { Folder } from "@/types";

interface UseInfiniteFoldersOptions {
	workspaceId: string;
	folderId?: string;
	limit?: number;
}

interface FetchFoldersResponse {
	folders: Folder[];
	nextCursor: {
		createdAt?: string;
		lastFolderId?: string;
	} | null;
}

export const useInfiniteFolders = ({
	workspaceId,
	folderId,
	limit = 10,
}: UseInfiniteFoldersOptions) => {
	const query = useInfiniteQuery<FetchFoldersResponse, Error>({
		queryKey: ["workspace-folders", workspaceId, folderId],
		queryFn: async ({ pageParam = {} }) => {
			const {
				createdAt,
				lastFolderId,
				skip = 0,
			} = pageParam as {
				createdAt?: string;
				lastFolderId?: string;
				skip?: number;
			};
			return await fetchFolders({
				workspaceId,
				folderId,
				createdAt,
				lastFolderId,
				limit,
				skip,
			});
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
			lastFolderId: undefined,
			skip: 0,
		},
		enabled: !!workspaceId && (folderId !== undefined || folderId === ""),
	});

	const folders = query.data?.pages.flatMap((page) => page.folders) ?? [];

	return {
		folders,
		fetchNextPage: query.fetchNextPage,
		hasNextPage: query.hasNextPage,
		isFetchingNextPage: query.isFetchingNextPage,
		isLoading: query.isLoading,
		error: query.error,
	};
};
