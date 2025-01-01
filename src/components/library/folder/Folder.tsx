import React, { useRef, useState } from "react";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Dropdown from "../Dropdown";
import { Folder as Props } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { useMutationData } from "@/hooks/useMutationData";
import { renameFolder } from "@/actions/workspace";
import { Input } from "../../ui/input";

interface FolderProps extends Props {
	optimistic?: boolean;
	handleDelete: (folderId: string) => void;
}

function Folder({ id, name, videoCount = 0, optimistic = false, handleDelete  }: FolderProps) {
	const pathName = usePathname();
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement | null>(null);
	const folderCardRef = useRef<HTMLDivElement | null>(null);
	const [onRename, setOnRename] = useState(false);

	const Rename = () => setOnRename(true);
	const Renamed = () => setOnRename(false);

	const { mutate, isPending } = useMutationData(
		["rename-folders"],
		renameFolder,
		"workspace-folders",
		Renamed
	);

	const onDoubleClick = (e: React.MouseEvent) => {
		e.stopPropagation(); // prevent
		Rename();
	};

	const updateFolderName = (e: React.FocusEvent<HTMLInputElement, Element>) => {
		if (inputRef.current && folderCardRef.current) {
			if (inputRef.current.value) {
				mutate({ workspaceId: pathName, folderName: inputRef.current.value });
			} else {
				Renamed();
			}
		}
	};

	function handleFolderClick(e: React.MouseEvent<HTMLDivElement>) {
		router.push(`${pathName}/${id}`);
	}

	return (
		<Card
			ref={folderCardRef}
			className={`w-[227px] h-fit hover:cursor-pointer ${
				optimistic ? "pointer-events-none opacity-50" : ""
			}`}
			onClick={!optimistic ? handleFolderClick : undefined}
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
								onClick={(e) => !optimistic && e.stopPropagation()}
								className={`hover:cursor-text select-none font-medium ${
									optimistic ? "pointer-events-none" : ""
								}`}
							>
								{onRename ? (
									<Input
										autoFocus
										placeholder={name}
										className="border-none underline text-base outline-none bg-transparent p-0"
										onBlur={!optimistic ? updateFolderName : undefined}
										ref={inputRef}
										disabled={optimistic} // Disable input if optimistic
									/>
								) : (
									<p onClick={(e) => !optimistic && e.stopPropagation()}>
										{name}
									</p>
								)}
							</CardTitle>
							<CardDescription>0 videos</CardDescription>
						</div>

						{/* Dropdown */}
						<Dropdown handleDelete={handleDelete}/>
					</div>
				</div>
			</CardHeader>
		</Card>
	);
}

export default Folder;
