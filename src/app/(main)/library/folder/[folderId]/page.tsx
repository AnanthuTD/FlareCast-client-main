"use client";

import { VideoLibrary } from "@/components/global/video-library";
import { useParams, useSearchParams } from "next/navigation";

export default function Page() {
	const params = useParams<{ folderId: string }>();
	const searchParams = useSearchParams();

	return (
		<VideoLibrary
			title={searchParams.get("title") ?? ""}
			folderId={params.folderId}
			key={params.folderId}
		/>
	);
}
