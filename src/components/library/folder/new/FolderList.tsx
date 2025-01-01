import React from "react";
import FolderNew from "@/components/library/folder/new/FolderNew";
import { Separator } from "@/components/ui/separator";
import { Folder } from "@/types";
import { useMutationDataState } from "@/hooks/useMutationData";

type FolderListProps = {
	folders: Folder[];
};

export const FolderList: React.FC<FolderListProps> = ({ folders }) => {
	const { latestVariables: latestFolder } = useMutationDataState([
		"create-folder",
	]);


	return (
		<div className="flex flex-col mt-8 w-full max-md:max-w-full gap-10">
			<div className="flex flex-wrap gap-4">
				{latestFolder && latestFolder.status === "pending" && (
					<FolderNew {...latestFolder.variables} optimistic />
				)}
				{folders.length > 0 ? (
					folders.map((folder) => <FolderNew key={folder.id} {...folder} />)
				) : (
					<p className="text-secondary">No Folders Found</p>
				)}
			</div>
			<Separator />
		</div>
	);
};
