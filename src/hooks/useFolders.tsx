import { useMutationDataState } from "@/hooks/useMutationData";
import { useQueryData } from "@/hooks/useQueryData";
import { fetchFolders } from "@/actions/workspace";
import { Folder } from "@/types";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";

export const useFolders = (folderId: string) => {


	const { latestVariables } = useMutationDataState(["create-folder"]);

	return {
		folders: (folders ?? []) as Folder[],
		latestFolder: latestVariables,
		isFetched,
	};
};
