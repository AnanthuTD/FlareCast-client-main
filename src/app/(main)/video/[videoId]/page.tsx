import { getPreviewVideoServer } from "@/actions/video";
import VideoPreview from "@/components/global/videos/preview";
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import React from "react";
import Head from "next/head";

type Props = {
	params: Promise<{ videoId: string }>;
};

const VideoPage = async ({ params }: Props) => {
	const { videoId } = await params;
	
	const query = new QueryClient();

	// const videoDetails = await getPreviewVideoServer(videoId);

	// console.log(videoDetails)

	/* await query.prefetchQuery({
		queryKey: ["preview-video"],
		queryFn: () => getPreviewVideo(videoId),
	});
	*/

	return (
		<>
			{/* 	<Head>
				<title>{videoDetails.title}</title>
				<meta property="og:title" content={videoDetails.title} />
				<meta property="og:description" content={videoDetails.description} />
				<meta property="og:image" content={videoDetails.thumbnailUrl} />
				<meta property="og:video" content={videoDetails.videoUrl} />
				<meta property="og:type" content="video.webm" />
			</Head> */}
			<HydrationBoundary state={dehydrate(query)}>
				<VideoPreview videoId={videoId} />
			</HydrationBoundary>
		</>
	);
};

export default VideoPage;
