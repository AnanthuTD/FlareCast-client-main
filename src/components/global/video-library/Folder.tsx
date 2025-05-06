import React, { DragEvent, useEffect, useRef, useState } from "react";
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
import Dropdown from "./DropdownFolder";
import { getVideoCount } from "@/actions/video";
import { useQuery } from "@tanstack/react-query";
import { useQueryData } from "@/hooks/useQueryData";
import { getQueryClient } from "@/lib/get-query-client";

interface FolderProps extends Props {
	optimistic?: boolean;
	hide: boolean;
	draggable: boolean;
	onDragStart: (ev: DragEvent<HTMLDivElement>) => void;
	onDragEnter: (ev: DragEvent<HTMLDivElement>) => void;
	onDrop: (ev: DragEvent<HTMLDivElement>) => void;
	onDragLeave: (ev: DragEvent<HTMLDivElement>) => void;
}

function Folder({
	id,
	name,
	optimistic = false,
	hide = false,
	draggable = false,
	onDrop,
	onDragEnter,
	onDragStart,
	onDragLeave,
}: FolderProps) {
	const pathName = usePathname();
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement | null>(null);
	const folderCardRef = useRef<HTMLDivElement | null>(null);
	const [onRename, setOnRename] = useState(false);

	const startRename = () => setOnRename(true);

	const completeRename = () => {
		setOnRename(false);
	};

	const { mutate, isPending } = useMutationData(
		["rename-folders"],
		(data: { folderName: string; folderId: string }) => renameFolder(data),
		"workspace-folders",
		completeRename
	);

	const onDoubleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!optimistic) startRename();
	};

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

	const handleFolderClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
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

	const { data: videoCountData } = useQueryData(
		["folder-video-count", id],
		() => getVideoCount({ folderId: id }),
		true
	);

	console.log(videoCountData);

	const videoCount = videoCountData?.data?.count ?? 0;

	useEffect(() => {
		const queryClient = getQueryClient();
		if (id) {
			queryClient.invalidateQueries({ queryKey: ["folder-video-count"] });
		}
	}, [id]);

	return (
		<div
			draggable={draggable}
			onDragStart={onDragStart}
			onDragEnter={onDragEnter}
			onDragEnd={onDrop}
			onDragLeave={onDragLeave}
			id={id}
			className="folder"
			onDrop={onDrop}
			onDragOver={(e) => e.preventDefault()}
		>
			<Card
				ref={folderCardRef}
				className={`w-[227px] h-fit hover:cursor-pointer ${
					optimistic ? "pointer-events-none opacity-50" : ""
				} ${hide ? "hidden" : ""}`}
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
										<span
											onClick={(e) => {
												e.stopPropagation();
												e.preventDefault();
											}}
										>
											{name}
										</span>
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
		</div>
	);
}

export default Folder;
