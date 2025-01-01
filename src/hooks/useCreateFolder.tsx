import { createFolder } from "@/actions/workspace";
import { useMutationData } from "./useMutationData";

export const useCreateFolders = (workspaceId: string, folderId?: string) => {
	const { mutate } = useMutationData(
		["create-folder"],
		() => createFolder(workspaceId, folderId),
		"workspace-folders"
	);

	const onCreateNewFolder = () =>
		mutate({ name: "Untitled Folder", id: "optimitsitc--id" });
	return { onCreateNewFolder };
};
