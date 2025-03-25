import CreateFolders from "@/components/create-folder";
import NewVideoButton from "@/components/global/new-video";
import React from "react";

type LibraryHeaderProps = {
	folderId?: string;
	workspaceId: string;
	spaceId?: string;
};

export const LibraryHeader: React.FC<LibraryHeaderProps> = ({
	folderId,
	workspaceId,
	spaceId,
}) => {
	return (
		<div className="flex flex-wrap gap-10 justify-between items-center w-full font-medium max-md:max-w-full">
			<div className="flex flex-col self-stretch my-auto w-[95px]">
				<div className="text-sm tracking-normal leading-loose text-gray-500">
					My Library
				</div>
				<div className="mt-1 text-3xl tracking-tighter leading-none text-neutral-800">
					Videos
				</div>
			</div>
			<div className="flex gap-2 items-center self-stretch my-auto text-sm tracking-normal leading-6 text-center">
				<CreateFolders folderId={folderId} />
				<NewVideoButton
					folderId={folderId ?? ''}
					spaceId={spaceId ?? ''}
					workspaceId={workspaceId}
				/>
			</div>
		</div>
	);
};
