import React from "react";
import CreateFolders from "@/components/create-folder";

type LibraryHeaderProps = {
	folderId?: string;
	title?: string;
	showCreateFolderButton?: boolean;
	showCreateVideoButton?: boolean;
	spaceId?: string;
};

export const LibraryHeader: React.FC<LibraryHeaderProps> = ({
	folderId,
	title = "Videos",
	showCreateFolderButton = true,
	showCreateVideoButton = true,
	spaceId,
}) => {
	return (
		<div className="flex flex-wrap gap-10 justify-between items-center w-full font-medium max-md:max-w-full">
			<div className="flex flex-col self-stretch my-auto w-[95px]">
				<div className="text-sm tracking-normal leading-loose text-gray-500">
					{folderId ? "Folder" : "My Library"} {/* Adjust based on folderId */}
				</div>
				<div className="mt-1 text-3xl tracking-tighter leading-none text-neutral-800">
					{folderId ? `Folder: ${title}` : title} {/* Dynamic title */}
				</div>
			</div>

			<div className="flex gap-2 items-center self-stretch my-auto text-sm tracking-normal leading-6 text-center">
				{showCreateFolderButton && <CreateFolders folderId={folderId} spaceId={spaceId} />}
				{showCreateVideoButton && (
					<button className="self-stretch px-5 pt-1.5 pb-2 my-auto text-white bg-indigo-500 rounded-[7992px]">
						New video
					</button>
				)}
			</div>
		</div>
	);
};
