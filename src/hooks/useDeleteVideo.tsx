import { useMutationData } from "./useMutationData";
import { deleteVideo } from "@/actions/video";

export const useDeleteVideo = (videoId: string) => {
  const { mutate } = useMutationData(
    ["delete-video"],
    () => deleteVideo(videoId),
    "workspace-videos"
  );

  const onDeleteVideo = () =>
    mutate({});
  return { onDeleteVideo };
};
