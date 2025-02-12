import { createSpace } from "@/actions/space";
import { searchMembers } from "@/actions/workspace";
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
import { Plus, X } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { debounce } from "lodash";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";

interface Member {
	id: string;
	name: string;
	image: string;
	email: string;
}

export function CreateSpace() {
	const nameRef = useRef<HTMLInputElement | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [members, setMembers] = useState<Member[]>([]);
	const [searchResults, setSearchResults] = useState<Member[]>([]);
	const [query, setQuery] = useState("");
	const activeWorkspaceId = useWorkspaceStore(
		(state) => state.selectedWorkspace.id
	);

	// Throttled API call for fetching members
	const fetchMembers = useCallback(
		debounce(async (query: string) => {
			if (query.length < 2) return;
			try {
				const results = await searchMembers(activeWorkspaceId, query);
				setSearchResults(results);
			} catch (error) {
				console.error("Error fetching members", error);
			}
		}, 300),
		[]
	);

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		setQuery(e.target.value);
		fetchMembers(e.target.value);
	}

	function addMember(member: Member) {
		if (!members.some((m) => m.id === member.id)) {
			setMembers((prev) => [...prev, member]);
		}
		setQuery("");
		setSearchResults([]);
	}

	function removeMember(memberId: string) {
		setMembers((prev) => prev.filter((m) => m.id !== memberId));
	}

	async function handleSpaceCreation() {
		if (!nameRef.current || members.length === 0) {
			toast.error("Please provide a space name and add at least one member.");
			return;
		}

		try {
			const res = await createSpace(
				activeWorkspaceId,
				nameRef.current.value,
				members.map((member) => member.id)
			);

			toast.success(`Space "${res.data.name}" created successfully`, {
				description: `Space "${res.data.space.name}" created`,
			});

			nameRef.current.value = "";
			setMembers([]);
		} catch (e) {
			toast.error("Failed to create space", {
				description: (e as Error).message,
			});
			console.error("Failed to create space", e.message);
		}
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					type="button"
					size="icon"
					variant="outline"
					className="bg-indigo-500 text-white"
				>
					<Plus />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px] bg-white">
				<DialogHeader>
					<DialogTitle className="text-indigo-500">
						Create a new space
					</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="flex flex-col gap-2">
						<Label htmlFor="name" className="text-indigo-500">
							Name
						</Label>
						<Input id="name" ref={nameRef} className="border-indigo-500" />
					</div>
					<div className="flex flex-col gap-2 relative">
						<Label htmlFor="members" className="text-indigo-500">
							Members
						</Label>
						<Input
							id="members"
							ref={inputRef}
							value={query}
							onChange={handleInputChange}
							placeholder="Type to search..."
							className="border-indigo-500"
						/>
						{searchResults.length > 0 && (
							<div className="absolute top-full left-0 w-full bg-white border border-indigo-500 shadow-md max-h-40 overflow-y-auto z-10">
								{searchResults.map((member) => (
									<div
										key={member.id}
										className="p-2 cursor-pointer hover:bg-indigo-100"
										onClick={() => addMember(member)}
									>
										{member.name} {member.email}
									</div>
								))}
							</div>
						)}
					</div>
					<div className="flex flex-wrap gap-2">
						{members.map((member) => (
							<div
								key={member.id}
								className="flex items-center gap-2 bg-indigo-500 text-white px-2 py-1 rounded"
							>
								{member.name}
								<button
									onClick={() => removeMember(member.id)}
									className="text-white"
								>
									<X size={14} />
								</button>
							</div>
						))}
					</div>
				</div>
				<DialogFooter>
					<Button
						type="button"
						onClick={() => setMembers([])}
						variant="outline"
						className="bg-white text-indigo-500 border-indigo-500"
					>
						Cancel
					</Button>
					<Button
						type="submit"
						onClick={handleSpaceCreation}
						className="bg-indigo-500 text-white"
					>
						Create
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
