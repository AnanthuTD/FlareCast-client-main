import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoTab from "@/components/library/VideoTab";
import ArchiveTab from "@/components/library/ArchiveTab";
import ScreenshotTab from "@/components/library/ScreenshotTab";

export const VideoLibraryTabs: React.FC = () => {
  return (
    <Tabs defaultValue="video" className="w-full">
      <TabsList>
        <TabsTrigger value="video">Video</TabsTrigger>
        <TabsTrigger value="archive">Archive</TabsTrigger>
        <TabsTrigger value="screenshot">Screenshot</TabsTrigger>
      </TabsList>

      <TabsContent value="video">
        <div className="flex flex-col gap-4">
          <div className="text-lg font-medium tracking-tight leading-loose text-neutral-800">Videos</div>
          <VideoTab />
        </div>
      </TabsContent>

      <TabsContent value="archive">
        <div className="text-lg font-medium tracking-tight leading-loose text-neutral-800">Archive</div>
        <ArchiveTab />
      </TabsContent>

      <TabsContent value="screenshot">
        <div className="text-lg font-medium tracking-tight leading-loose text-neutral-800">Screenshots</div>
        <ScreenshotTab />
      </TabsContent>
    </Tabs>
  );
};
