import React from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import DeleteFolderPop from "./DeleteFolderPop";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";
import { useDeleteFolder } from "@/hooks/useDeleteFolder";
import MovePopover from "../move-tree";
import { usePathname } from "next/navigation";

interface Props {
	sourceId: string;
	type: "folder" | "video" | "screenshot";
	canShare?: boolean;
	canDelete?: boolean;
	canMove?: boolean;
}

function Dropdown({
	sourceId,
	type,
	canShare = true,
	canDelete = true,
	canMove = true,
}: Props) {
	const activeWorkspace = useWorkspaceStore((state) => state.selectedWorkspace);

	const { onDeleteFolder } = useDeleteFolder(activeWorkspace.id, sourceId);
	const pathname = usePathname();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="p-2 select-none">
				<Image
					src={"/three-dot-menu.svg"}
					width={15}
					height={15}
					alt="three-dot-menu"
					className="mr-2"
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent onClick={(e) => e.stopPropagation()}>
				{canShare && (
					<DropdownMenuItem>
						<MovePopover
							type={type}
							sourceId={sourceId}
							label="share"
							showWorkspace={false}
						/>
					</DropdownMenuItem>
				)}
				{canMove && (
					<DropdownMenuItem>
						<MovePopover
							type={type}
							sourceId={sourceId}
							label="move"
							showSpaces={pathname.includes("space")}
							showWorkspace={!pathname.includes("space")}
						/>
					</DropdownMenuItem>
				)}
				{canDelete && (
					<DropdownMenuItem>
						<DeleteFolderPop
							onClick={onDeleteFolder}
						/>
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default Dropdown;
