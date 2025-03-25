"use client";

import { Button } from "@/components/ui/button";
import React from "react";

const callbackUrl = "flarecast://app/preset";

function NewVideoButton({
	workspaceId,
	spaceId,
	folderId,
}: {
	workspaceId: string;
	spaceId: string;
	folderId: string;
}) {
	const handleNewVideo = () => {
		window.location.href = `${callbackUrl}?workspaceId=${workspaceId}&spaceId=${spaceId}&folderId=${folderId}`;
	};

	return (
		<Button
			onClick={() => {handleNewVideo()}}
			className="self-stretch px-5 pt-1.5 pb-2 my-auto rounded-[7992px]"
		>
			New Video
		</Button>
	);
}

export default NewVideoButton;
