"use client";

import { VideoLibrary } from "@/components/global/video-library";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";

const SpaceFolderPage = () => {
  const params = useParams<{ spaceId: string, folderId: string }>();
  const searchParams = useSearchParams();

  return (
    <>
      <VideoLibrary
        spaceId={params.spaceId}
        title={searchParams.get("title") || "My-Folder"}
        folderId={params.folderId}
      />
    </>
  );
};

export default SpaceFolderPage;
