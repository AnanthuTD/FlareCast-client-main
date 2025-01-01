"use client";
import { fetchFolders } from "@/actions/workspace";
import FolderPredecessors from "@/components/library/bread-crumb";
import { FolderList } from "@/components/library/folder/new/FolderList";
import { LibraryHeader } from "@/components/library/folder/new/LibraryHeader";
import { VideoSection } from "@/components/main/VideoSection";
import { useQueryData } from "@/hooks/useQueryData";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";
import { Folder } from "@/types";
import { useParams } from "next/navigation";

export default function Page() {
	const { folderId } = useParams();

	const activeWorkspaceId = useWorkspaceStore(
		(state) => state.selectedWorkspace.id
	);

	const { data: folders = [], isFetched } = useQueryData(["workspace-folders"], () =>
		fetchFolders(activeWorkspaceId, folderId as string)
	);

	return (
		<div className="flex flex-col px-10 py-6 max-md:px-5 w-full">
			<LibraryHeader folderId={folderId as string} />
			<FolderPredecessors folderId={folderId as string} />
			<div className="flex flex-col mt-8 w-full tracking-normal text-gray-500 max-md:max-w-full">
				<FolderList folders={folders as Folder[]} />
				<VideoSection title="" videos={[]} key={"adsf"} />
			</div>
		</div>
	);
}
