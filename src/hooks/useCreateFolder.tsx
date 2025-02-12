import { createFolder } from "@/actions/folder";
import { useMutationData } from "./useMutationData";

export const useCreateFolders = (
	workspaceId: string,
	folderId?: string,
	spaceId?: string
) => {
	const { mutate } = useMutationData(
		["create-folder"],
		() => createFolder(workspaceId, folderId, spaceId),
		"workspace-folders"
	);

	const onCreateNewFolder = () =>
		mutate({ name: "Untitled Folder", id: "optimitsitc--id" });
	return { onCreateNewFolder };
};
