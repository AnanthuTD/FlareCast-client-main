import React from "react";
import { Separator } from "@/components/ui/separator";
import { useMutationDataState } from "@/hooks/useMutationData";
import { Folder as FolderType } from "@/types";
import Folder from "./Folder";

type FolderListProps = {
	folders: FolderType[];
};

export const FolderList: React.FC<FolderListProps> = ({ folders }) => {
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
					folders.map((folder) => (
						<Folder {...folder} key={folder.id} />
					))
				) : (
					<p className="text-secondary">No Folders Found</p>
				)}
			</div>
			<Separator />
		</div>
	);
};
