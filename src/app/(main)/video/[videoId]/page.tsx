import { Metadata, ResolvingMetadata } from "next";
import { getPreviewVideoServer } from "@/actions/video";
import VideoPreview from "@/components/global/videos/preview";
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Shadcn Alert component
import { AlertCircle } from "lucide-react"; // Icon for the alert

type Props = {
	params: Promise<{ videoId: string }>;
};

// Generate metadata for the video preview page
export async function generateMetadata(
	{ params }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const { videoId } = await params;
	const { video, message } = await getPreviewVideoServer(videoId);

	if (!video) {
		return {
			title: "Video Not Found",
			description: "This video could not be found.",
		};
	}

	const pageUrl = `${process.env.NEXT_PUBLIC_HOST_URL}/preview/${videoId}`;
	const thumbnailUrl = `${process.env.NEXT_PUBLIC_GCS_URL}/${videoId}/thumbnails/thumb00001.jpg`;
	const videoHlsUrl = `${process.env.NEXT_PUBLIC_GCS_URL}/${videoId}/master.m3u8`;

	return {
		title: video.title || "Untitled Video",
		description: video.description || "No description available",
		openGraph: {
			title: video.title || "Untitled Video",
			description: video.description || "No description available",
			url: pageUrl,
			siteName: "FlareCast",
			images: [
				{
					url: thumbnailUrl,
					width: 800,
					height: 600,
					alt: `${video.title} Thumbnail`,
				},
			],
			videos: [
				{
					url: videoHlsUrl,
					type: "application/x-mpegURL",
					width: 1280,
					height: 720,
				},
			],
			locale: "en_US",
			type: "video.other",
		},
		twitter: {
			card: "summary_large_image",
			title: video.title || "Untitled Video",
			description: video.description || "No description available",
			images: [thumbnailUrl],
		},
	};
}

const VideoPage = async ({ params }: Props) => {
	const { videoId } = await params;
	const { video, message } = await getPreviewVideoServer(videoId); // Fetch video data on the server

	const query = new QueryClient();

	// If you still want to prefetch for client-side hydration (optional)
	/* await query.prefetchQuery({
    queryKey: ["previewVideo", videoId],
    queryFn: () => getPreviewVideoServer(videoId),
  }); */

	return (
		<HydrationBoundary state={dehydrate(query)}>
			{video ? (
				<VideoPreview videoId={videoId} />
			) : (
				<div className="max-w-2xl mx-auto mt-8">
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Video Not Found</AlertTitle>
						<AlertDescription>
							{message || "The requested video could not be found."}
						</AlertDescription>
					</Alert>
				</div>
			)}
		</HydrationBoundary>
	);
};

export default VideoPage;
