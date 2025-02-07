"use client";

import { useEffect, useRef, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";
import { getMembers, removeMember, renameWorkspace, updateRole } from "@/actions/workspace";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Label } from "@/components/ui/label";
import { inviteMembers } from "@/actions/invitation";

const roles = ["MEMBER", "ADMIN", "EDITOR"];

const WorkspaceSettings = () => {
	const workspace = useWorkspaceStore((state) => state.selectedWorkspace);
	const [workspaceName, setWorkspaceName] = useState(workspace?.name || "");
	const [userRole, setUserRole] = useState("owner"); // Assume current user role
	const [membersList, setMembersList] = useState([]);
	const membersRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		console.log("Workspace", workspace);

		async function fetchWorkspaceMembers(workspaceId) {
			try {
				if (workspaceId) {
					const { data } = await getMembers(workspaceId);
					setMembersList(data);
				}
			} catch (err) {
				if (isAxiosError(err)) toast.error(err.response?.data?.message);
				else toast.error(err?.message || "Failed to fetch members!");
			}
		}

		if (workspace?.id) {
			fetchWorkspaceMembers(workspace.id);
		}
	}, [workspace?.id]);

	const handleRoleUpdate = async (memberId: string, role: string) => {
		try {
			await updateRole(workspace.id, memberId, role);
			toast.success("Role updated successfully!");
			setMembersList((prev) =>
				prev.map((member) =>
					member.id === memberId ? { ...member, role } : member
				)
			);
		} catch (err) {
			if (isAxiosError(err)) toast.error(err.response?.data?.message);
			else toast.error(err?.message || "Failed to update role!");
		}
	};

	const handleRemoveMember = async (memberId: string) => {
		try {
			await removeMember(workspace.id, memberId);
			toast.success("Member removed successfully!");
			setMembersList((prev) => prev.filter((member) => member.id !== memberId));
		} catch (err) {
			if (isAxiosError(err)) toast.error(err.response?.data?.message);
			else toast.error(err?.message || "Failed to remove member!");
		}
	};

	const handleInvitation = async () => {
		const emails = membersRef?.current?.value;
		if (!emails) return toast.error("Please enter an email address.");

		try {
			const { data } = await inviteMembers(workspace.id, emails);
			toast.success(data.message);
		} catch (err) {
			if (isAxiosError(err)) toast.error(err.response?.data?.message);
			else toast.error(err?.message || "Failed to invite members!");
		}
	};

	const handleWorkspaceRename = async () => {
		try {
      await renameWorkspace(workspace.id, workspaceName);
      toast.success("Workspace name updated successfully!");
    } catch (err) {
      if (isAxiosError(err)) toast.error(err.response?.data?.message);
      else toast.error(err?.message || "Failed to update workspace name!");
    }
	};

	const isAdminOrOwner = userRole === "admin" || userRole === "owner";

	return (
		<TabsContent
			value="Workspace"
			className="rounded-xl flex flex-col gap-y-6 p-4"
		>
			{/* Workspace Name Editor */}
			<Card>
				<CardContent className="p-4 space-y-2">
					<label className="text-sm font-medium">Workspace Name</label>
					<Input
						value={workspaceName}
						onChange={(e) => setWorkspaceName(e.target.value)}
						className="w-full"
					/>
					<Button className="mt-2 bg-indigo-500" onClick={handleWorkspaceRename}>Save</Button>
				</CardContent>
			</Card>

			{/* Members List */}
			<Card>
				<CardContent className="p-4 space-y-2">
					<h2 className="text-lg font-semibold">Members</h2>
					<div className="space-y-3">
						{membersList.map((member) => (
							<div
								key={member.id}
								className="flex items-center justify-between border p-2 rounded-md"
							>
								<span className="text-sm">{member.User.name}</span>
								{isAdminOrOwner ? (
									<>
										<Select
											defaultValue={member.role}
											onValueChange={(role) =>
												handleRoleUpdate(member.id, role)
											}
										>
											<SelectTrigger className="w-[120px]">
												<SelectValue placeholder="Select Role" />
											</SelectTrigger>
											<SelectContent>
												{roles.map((role) => (
													<SelectItem key={role} value={role}>
														{role}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<Button
											className="ml-2 bg-red-500"
											onClick={() => handleRemoveMember(member.id)}
										>
											Delete
										</Button>
									</>
								) : (
									<span className="text-sm text-gray-500">{member.role}</span>
								)}
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Invite New Members */}
			<Card>
				<CardContent className="p-4 space-y-2">
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
				</CardContent>
			</Card>
		</TabsContent>
	);
};

export default WorkspaceSettings;
