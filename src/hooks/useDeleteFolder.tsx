import { deleteFolder } from "@/actions/folder";
import { useMutationData } from "./useMutationData";

export const useDeleteFolder = (workspaceId: string, folderId: string) => {
  const { mutate } = useMutationData(
    ["delete-folder"],
    () => deleteFolder(workspaceId, folderId),
    "workspace-folders"
  );

  const onDeleteFolder = () =>
    mutate({});
  return { onDeleteFolder };
};
