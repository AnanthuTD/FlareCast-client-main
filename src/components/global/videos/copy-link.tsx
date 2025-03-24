import { Button } from "@/components/ui/button";
import { Link2Icon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updateVideoVisibility } from "@/actions/video";

type Props = {
	videoId: string;
	className?: string;
	variant?:
		| "default"
		| "destructive"
		| "outline"
		| "secondary"
		| "ghost"
		| "link"
		| null;
	isPublic?: boolean;
};

const CopyLink = ({
	videoId,
	className,
	variant,
	isPublic: videoVisibility = false,
}: Props) => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isPublic, setIsPublic] = useState(videoVisibility);

	const onCopyClipboard = () => {
		navigator.clipboard.writeText(
			`${process.env.NEXT_PUBLIC_HOST_URL}/video/${videoId}`
		);
		toast("Copied", {
			description: "Link successfully copied",
		});
	};

	const handleVisibilitySave = async () => {
		try {
			await updateVideoVisibility({ videoId, isPublic });
			toast.success(`Video is now ${isPublic ? "public" : "private"}`);
			setIsDialogOpen(false); // Close dialog after saving
		} catch {
			toast.error("Failed to update video visibility");
		}
	};

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="rounded-full bg-transparent px-10"
					onClick={() => setIsDialogOpen(true)}
				>
					<Link2Icon /* className='text-white' */ />
					Share Link
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Share Video</DialogTitle>
					<DialogDescription>
						Choose whether this video should be public before sharing the link.
					</DialogDescription>
				</DialogHeader>
				<div className="flex items-center space-x-2 py-4">
					<Switch
						id="public-toggle"
						checked={isPublic}
						onCheckedChange={setIsPublic}
					/>
					<Label htmlFor="public-toggle">Make this video public</Label>
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => {
							onCopyClipboard()
							setIsDialogOpen(false);
						}}
					>
						Cancel
					</Button>
					<Button onClick={handleVisibilitySave}>Save & Share</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default CopyLink;
