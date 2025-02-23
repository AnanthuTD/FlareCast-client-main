import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoTab from "@/components/library/VideoTab";
import ArchiveTab from "@/components/library/ArchiveTab";
import ScreenshotTab from "@/components/library/ScreenshotTab";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";

export const VideoLibraryTabs: React.FC<{
	folderId?: string;
}> = ({ folderId }) => {
	const selectedSpaceId = useWorkspaceStore((state) => state.selectedSpace);

	return (
		<Tabs defaultValue="video" className="w-full">
			<TabsList>
				<TabsTrigger value="video">Video</TabsTrigger>
				<TabsTrigger value="archive">Archive</TabsTrigger>
				<TabsTrigger value="screenshot">Screenshot</TabsTrigger>
			</TabsList>

			<TabsContent value="video">
				<div className="flex flex-col gap-4">
					<div className="text-lg font-medium tracking-tight leading-loose text-neutral-800">
						Videos
					</div>
					<VideoTab folderId={folderId} spaceId={selectedSpaceId} />
				</div>
			</TabsContent>

			<TabsContent value="archive">
				<div className="text-lg font-medium tracking-tight leading-loose text-neutral-800">
					Archive
				</div>
				<ArchiveTab />
			</TabsContent>

			<TabsContent value="screenshot">
				<div className="text-lg font-medium tracking-tight leading-loose text-neutral-800">
					Screenshots
				</div>
				<ScreenshotTab />
			</TabsContent>
		</Tabs>
	);
};
