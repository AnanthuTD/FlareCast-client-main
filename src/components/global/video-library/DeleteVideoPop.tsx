import React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";


interface Props {
	onClick: () => void;
}

function DeleteVideoPop({ onClick }: Props) {
	return (
		<Dialog>
			<DialogTrigger
				onClick={(e) => e.stopPropagation()}
				className="w-full flex justify-start"
			>
				Delete
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle> Are you sure you want to delete?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently delete this video.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<div className="flex justify-between gap-3">
						<Button
							onClick={onClick}
							className="bg-red-500 hover:bg-red-600 text-white"
						>
							Delete
						</Button>
						<Button
							variant="outline"
							className="border-gray-300 text-gray-600 hover:border-gray-400"
						>
							Cancel
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default DeleteVideoPop;
