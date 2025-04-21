"use client";

import { inviteMembers } from "@/actions/invitation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isAxiosError } from "axios";
import { useRef } from "react";
import { toast } from "sonner";

export const InviteMembers = ({ workspaceId }: { workspaceId: string }) => {
	const membersRef = useRef<HTMLInputElement | null>(null);

	const handleInvitation = async () => {
		const emails = membersRef?.current?.value;
		if (!emails) return toast.error("Please enter an email address.");

		try {
			const { data } = await inviteMembers(workspaceId, emails);
			toast.success(data.message);
		} catch (err) {
			if (isAxiosError(err)) toast.error(err.response?.data?.message);
			else toast.error("Failed to invite members!");
		}
	};

	return (
		<>
			<div className="p-4 space-y-2">
				<h2 className="text-lg font-semibold">Invite Members</h2>
				<div className="flex flex-col gap-4">
					<Label htmlFor="members">Members</Label>
					<Input
						id="members"
						placeholder="separate emails with a space"
						className="col-span-3"
						ref={membersRef}
					/>
				</div>
				<Button className="bg-indigo-500" onClick={handleInvitation}>
					Invite New Member
				</Button>
			</div>
		</>
	);
};
