"use client";

import { fetchFolders } from "@/actions/folder";
import { VideoLibrary } from "@/components/global/video-library";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";

const SpaceFolderPage = () => {
  const params = useParams<{ spaceId: string, folderId: string }>();
  const searchParams = useSearchParams();
  console.log(params.spaceId, params.folderId)

  return (
    <>
      <VideoLibrary
        spaceId={params.spaceId}
        title={searchParams.get("title") || "My-Folder"}
        fetchFolders={fetchFolders}
        folderId={params.folderId}
      />
    </>
  );
};

export default SpaceFolderPage;
