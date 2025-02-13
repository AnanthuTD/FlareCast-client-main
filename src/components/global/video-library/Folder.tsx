import React, { useRef, useState } from "react";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Folder as Props } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { useMutationData } from "@/hooks/useMutationData";
import { renameFolder } from "@/actions/folder";
import { Input } from "../../ui/input";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";
import Dropdown from "./Dropdown";

interface FolderProps extends Props {
	optimistic?: boolean;
}

function Folder({ id, name, videoCount = 0, optimistic = false }: FolderProps) {
	const pathName = usePathname();
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement | null>(null);
	const folderCardRef = useRef<HTMLDivElement | null>(null);
	const [onRename, setOnRename] = useState(false);
	const activeWorkspaceId = useWorkspaceStore(
		(state) => state.selectedWorkspace.id
	);

	// Function to start renaming
	const startRename = () => setOnRename(true);

	// Function to complete renaming and trigger refetch
	const completeRename = () => {
		setOnRename(false);
	};

	const { mutate, isPending } = useMutationData(
		["rename-folders"],
		(data: { folderName: string; folderId: string }) => renameFolder(data),
		"workspace-folders",
		completeRename
	);

	// Handle double-click to rename
	const onDoubleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!optimistic) startRename();
	};

	// Handle renaming logic
	const updateFolderName = (e: React.FocusEvent<HTMLInputElement>) => {
		if (inputRef.current) {
			const newName = inputRef.current.value.trim();

			if (newName && newName !== name) {
				mutate({
					folderName: newName,
					folderId: id,
				});
			} else {
				completeRename();
			}
		}
	};

	// Handle folder click for navigation
	const handleFolderClick = (e: React.MouseEvent<HTMLDivElement>) => {
		/* 
			if the folder is created, then check if its already inside a folder. 
			if it is, then only replace the folderId in the path with the new folderId.
			else, just go to the folder page.
		*/
		if (!optimistic) {
			if (pathName.includes("folder")) {
				const paths = pathName.split("/");
				const folderIndex = paths.indexOf("folder") + 1;
				const newPath = paths.slice(0, folderIndex).join("/");

				router.push(`${newPath}/${id}?title=${name}`);
			} else router.push(`${pathName}/folder/${id}?title=${name}`);
		}
	};

	return (
		<Card
			ref={folderCardRef}
			className={`w-[227px] h-fit hover:cursor-pointer ${
				optimistic ? "pointer-events-none opacity-50" : ""
			}`}
			onClick={handleFolderClick}
		>
			<CardHeader className="p-4">
				<div
					className={`flex gap-3 w-full items-center ${
						optimistic ? "pointer-events-none" : ""
					}`}
				>
					<Image
						src={"/folder-icon.svg"}
						width={24}
						height={24}
						alt="folder-icon"
					/>
					<div className="flex justify-between items-center w-full">
						<div>
							<CardTitle
								onDoubleClick={!optimistic ? onDoubleClick : undefined}
								className="hover:cursor-text select-none font-medium"
							>
								{onRename ? (
									<Input
										autoFocus
										placeholder={name}
										className="border-none underline text-base outline-none bg-transparent p-0"
										onBlur={updateFolderName}
										ref={inputRef}
										disabled={optimistic || isPending}
									/>
								) : (
									<span onClick={(e) => e.stopPropagation()}>{name}</span>
								)}
							</CardTitle>
							<CardDescription>{videoCount} videos</CardDescription>
						</div>

						{/* Dropdown */}
						<Dropdown sourceId={id} type={"folder"} />
					</div>
				</div>
			</CardHeader>
		</Card>
	);
}

export default Folder;
