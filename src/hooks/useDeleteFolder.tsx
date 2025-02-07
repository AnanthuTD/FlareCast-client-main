import { deleteFolder } from "@/actions/folder";
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
