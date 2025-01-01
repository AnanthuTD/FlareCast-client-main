import React from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import DeleteFolderPop from "./DeleteFolderPop";

interface Props {
	handleDelete: () => void;
}

function Dropdown({ handleDelete }: Props) {
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
				<DropdownMenuItem>Rename</DropdownMenuItem>
				<DropdownMenuItem>
					<DeleteFolderPop onClick={handleDelete} />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default Dropdown;
