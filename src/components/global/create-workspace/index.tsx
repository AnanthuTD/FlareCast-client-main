import { createWorkspace } from "@/actions/workspace";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

export function CreateWorkspace() {
	const nameRef = useRef<HTMLInputElement | null>(null);
	const membersRef = useRef<HTMLInputElement | null>(null);

	async function handleWorkspaceCreation() {
		if (!nameRef || !nameRef.current || !membersRef.current || !membersRef) {
			console.error("Missing references");
			return;
		}

		try {
			const res = await createWorkspace({
				name: nameRef.current.value,
				members: membersRef.current.value,
			});

			toast.success(`Workspace "${res.data.name}" created successfully`, {
				description: `Workspace "${
					res.data.name
				}" created with members ${res.data.members?.join(", ")}`,
			});

			nameRef.current.value = "";
			membersRef.current.value = "";
		} catch (e) {
			toast.error("Failed to create workspace", {
				description: (e as Error).message,
			});
			console.error("Failed to create workspace", e.message);
		}
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button type="button" size={"icon"} variant={"outline"}>
					<Plus />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create a new workspace</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="flex flex-col gap-4">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							placeholder=""
							className="col-span-3"
							ref={nameRef}
						/>
					</div>
					<div className="flex flex-col gap-4">
						<Label htmlFor="members">Members</Label>
						<Input
							id="members"
							placeholder="separate emails with a space"
							className="col-span-3"
							ref={membersRef}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button type="submit">Cancel</Button>
					<Button type="submit" onClick={handleWorkspaceCreation}>
						Create
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
