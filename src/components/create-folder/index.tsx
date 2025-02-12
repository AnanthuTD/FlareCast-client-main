"use client";
import { useCreateFolders } from "@/hooks/useCreateFolder";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";
import React from "react";

type Props = {
	folderId?: string;
	spaceId?: string;
};

const CreateFolders = ({ folderId, spaceId }: Props) => {
	const workspaceId = useWorkspaceStore((state) => state.selectedWorkspace.id);
	const { onCreateNewFolder } = useCreateFolders(
		workspaceId,
		folderId,
		spaceId
	);
	return (
		<button
			onClick={onCreateNewFolder}
			className="self-stretch pt-1.5 pr-5 pb-2 pl-5 my-auto border border-solid border-gray-500 border-opacity-30 rounded-[7992px] text-neutral-800"
		>
			{/* <FolderPlusDuotine /> */}
			Create A folder
		</button>
	);
};

export default CreateFolders;
