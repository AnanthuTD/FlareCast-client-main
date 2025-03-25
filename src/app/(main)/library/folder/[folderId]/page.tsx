"use client";
import { fetchFolders } from "@/actions/folder";
import { VideoSection } from "@/components/global/video-library/VideoSection";
import FolderPredecessors from "@/components/library/bread-crumb";
import { FolderList } from "@/components/library/folder/new/FolderList";
import { LibraryHeader } from "@/components/library/folder/new/LibraryHeader";
import { useQueryData } from "@/hooks/useQueryData";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";
import { Folder } from "@/types";
import { useParams } from "next/navigation";

export default function Page() {
	const { folderId } = useParams();

	const activeWorkspaceId = useWorkspaceStore(
		(state) => state.selectedWorkspace.id
	);
	const spaceId = useWorkspaceStore((state) => state.selectedSpace);

	const { data: folders = [], isFetched } = useQueryData(
		["workspace-folders"],
		() => fetchFolders(activeWorkspaceId, folderId as string)
	);

	return (
		<div className="flex flex-col px-10 py-6 max-md:px-5 w-full">
			<LibraryHeader
				folderId={folderId as string}
				workspaceId={activeWorkspaceId}
				spaceId={spaceId}
			/>
			<FolderPredecessors folderId={folderId as string} />
			<div className="flex flex-col mt-8 w-full tracking-normal text-gray-500 max-md:max-w-full">
				<FolderList folders={folders as Folder[]} />
				<VideoSection  folderId={folderId} spaceId={spaceId} />
			</div>
		</div>
	);
}
