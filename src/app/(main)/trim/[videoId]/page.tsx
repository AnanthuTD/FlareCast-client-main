import React from "react";
import VideoEditor from "../videoEditor";

type Props = {
	params: Promise<{ videoId: string }>;
};

const page = async ({ params }: Props) => {
	const { videoId } = await params;

	return (
			<VideoEditor videoId={videoId} />
	);
};

export default page;
