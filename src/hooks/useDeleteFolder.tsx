import { deleteFolder } from "@/actions/workspace";
import { useMutationData } from "./useMutationData";

export const useCreateFolders = (workspaceId: string, folderId: string) => {
  const { mutate } = useMutationData(
    ["delete-folder"],
    () => deleteFolder(workspaceId, folderId),
    "workspace-folders"
  );

  const onCreateNewFolder = () =>
    mutate({});
  return { onCreateNewFolder };
};
