'use client'

import React from "react";
import { Separator } from "@/components/ui/separator";
import { useMutationDataState } from "@/hooks/useMutationData";
import { Folder as FolderType } from "@/types";
import Folder from "./Folder";

type FolderListProps = {
	folders: FolderType[];
	fetchNextPage: () => void;
	hasNextPage?: boolean;
	isFetchingNextPage: boolean;
};

export const FolderList: React.FC<FolderListProps> = ({
	folders,
	fetchNextPage,
	hasNextPage,
	isFetchingNextPage,
}) => {
	const { latestVariables: latestFolder } = useMutationDataState([
		"create-folder",
	]);

	return (
		<div className="flex flex-col mt-8 w-full max-md:max-w-full gap-10">
			<div className="flex flex-wrap gap-4">
				{latestFolder && latestFolder.status === "pending" && (
					<Folder {...latestFolder.variables} optimistic />
				)}
				{folders.length > 0 ? (
					folders.map((folder) => <Folder {...folder} key={folder.id} />)
				) : (
					<p className="text-secondary">No Folders Found</p>
				)}
			</div>
			{hasNextPage && (
				<div className="flex justify-end mt-4">
					<button
						onClick={fetchNextPage}
						disabled={isFetchingNextPage}
						className="text-sm text-muted-foreground hover:underline disabled:opacity-50 transition"
					>
						{isFetchingNextPage ? "Loading..." : "Show more"}
					</button>
				</div>
			)}
			<Separator />
		</div>
	);
};
