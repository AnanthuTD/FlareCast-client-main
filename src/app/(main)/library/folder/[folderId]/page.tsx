"use client";

import { VideoLibrary } from "@/components/global/video-library";
import { useParams } from "next/navigation";

export default function Page() {
	const { folderId }: { folderId: string } = useParams();

	return <VideoLibrary title={"Folder"} folderId={folderId} />;
}
