'use client'

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoTab from "@/components/global/video-tab";
import ArchiveTab from "@/components/library/ArchiveTab";
import ScreenshotTab from "@/components/library/ScreenshotTab";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";

export const VideoLibraryTabs: React.FC<{
	folderId?: string;
	movingVideos: Set<string>
}> = ({ folderId, movingVideos }) => {
	const selectedSpaceId = useWorkspaceStore((state) => state.selectedSpace);

	return (
		<Tabs defaultValue="video" className="w-full">
			<TabsList>
				<TabsTrigger value="video">Video</TabsTrigger>
				{/* <TabsTrigger value="archive">Archive</TabsTrigger>
				<TabsTrigger value="screenshot">Screenshot</TabsTrigger> */}
			</TabsList>

			<TabsContent value="video">
				<div className="flex flex-col gap-4">
					<div className="text-xl font-bold tracking-tight leading-loose text-neutral-800">
						Videos
					</div>
					<VideoTab movingVideos={movingVideos} key={folderId ?? selectedSpaceId ?? ''} folderId={folderId} spaceId={selectedSpaceId} />
				</div>
			</TabsContent>

			{/* <TabsContent value="archive">
				<div className="text-xl font-bold tracking-tight leading-loose text-neutral-800">
					Archive
				</div>
				<ArchiveTab />
			</TabsContent>

			<TabsContent value="screenshot">
				<div className="text-xl font-bold tracking-tight leading-loose text-neutral-800">
					Screenshots
				</div>
				<ScreenshotTab />
			</TabsContent> */}
		</Tabs>
	);
};
