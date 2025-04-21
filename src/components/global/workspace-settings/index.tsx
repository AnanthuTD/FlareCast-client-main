"use client";

import { useCallback, useMemo, useState } from "react";
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
import {
	getMembers,
	removeMember,
	renameWorkspace,
	updateRole,
} from "@/actions/workspace";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { InviteMembers } from "../invite-members";
import { useUserStore } from "@/providers/UserStoreProvider";
import { useQuery } from "@tanstack/react-query";

interface User {
	id: string;
	name: string;
}

interface MemberData {
	id: string;
	userId: string;
	createdAt: Date;
	role: string;
	workspaceId: string;
	spaceIds: string[];
	User: User;
}

const roles = ["MEMBER", "ADMIN", "EDITOR", "OWNER"];

const WorkspaceSettings = () => {
	const activeWorkspace = useWorkspaceStore((state) => state.selectedWorkspace);
	const [workspaceName, setWorkspaceName] = useState(
		activeWorkspace?.name || ""
	);
	const userId = useUserStore((s) => s.id);
	const [isRenaming, setIsRenaming] = useState(false);
	const [isUpdatingRole, setIsUpdatingRole] = useState<string | null>(null);
	const [isRemovingMember, setIsRemovingMember] = useState<string | null>(null);

	const {
		data: workspaceMembers,
		error: memberFetchError,
		isLoading,
		refetch,
	} = useQuery<MemberData[]>({
		placeholderData: [],
		queryKey: ["workspace-members", activeWorkspace?.id],
		queryFn: async () => await getMembers(activeWorkspace!.id),
	});

	const isAdminOrOwner = useMemo(() => {
		const user = workspaceMembers?.find((m) => m.userId === userId);
		return user ? user.role === "ADMIN" || user.role === "OWNER" : false;
	}, [userId, workspaceMembers]);

	const handleRoleUpdate = useCallback(
		async (memberId: string, role: string) => {
			setIsUpdatingRole(memberId);
			try {
				await updateRole(activeWorkspace.id, memberId, role);
				toast.success("Role updated successfully!");
				refetch();
			} catch (err) {
				if (isAxiosError(err)) toast.error(err.response?.data?.message);
				else toast.error(err?.message || "Failed to update role!");
			} finally {
				setIsUpdatingRole(null);
			}
		},
		[activeWorkspace.id, refetch]
	);

	const handleRemoveMember = useCallback(
		async (memberId: string) => {
			const member = workspaceMembers?.find((m) => m.id === memberId);
			if (
				!confirm(
					`Are you sure you want to remove ${member?.User.name} from the workspace?`
				)
			) {
				return;
			}
			setIsRemovingMember(memberId);
			try {
				await removeMember(activeWorkspace.id, memberId);
				toast.success("Member removed successfully!");
				refetch();
			} catch (err) {
				if (isAxiosError(err)) toast.error(err.response?.data?.message);
				else toast.error(err?.message || "Failed to remove member!");
			} finally {
				setIsRemovingMember(null);
			}
		},
		[activeWorkspace.id, refetch, workspaceMembers]
	);

	const handleWorkspaceRename = async () => {
		if (!workspaceName.trim()) {
			toast.error("Workspace name cannot be empty!");
			return;
		}
		setIsRenaming(true);
		try {
			await renameWorkspace(activeWorkspace.id, workspaceName);
			toast.success("Workspace name updated successfully!");
		} catch (err) {
			if (isAxiosError(err)) toast.error(err.response?.data?.message);
			else toast.error(err?.message || "Failed to update workspace name!");
		} finally {
			setIsRenaming(false);
		}
	};

	const memberList = useMemo(() => {
		return workspaceMembers?.map((member) => (
			<div
				key={member.id}
				className="flex items-center justify-between border p-2 rounded-md"
			>
				<span className="text-sm">{member.User.name}</span>
				{isAdminOrOwner ? (
					<>
						<Select
							defaultValue={member.role}
							onValueChange={(role) => handleRoleUpdate(member.id, role)}
							disabled={isUpdatingRole === member.id}
						>
							<SelectTrigger
								className="w-[120px]"
								aria-label={`Select role for ${member.User.name}`}
							>
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
							disabled={isRemovingMember === member.id}
						>
							{isRemovingMember === member.id ? "Deleting..." : "Delete"}
						</Button>
					</>
				) : (
					<span className="text-sm text-gray-500">{member.role}</span>
				)}
			</div>
		));
	}, [
		workspaceMembers,
		isAdminOrOwner,
		isUpdatingRole,
		isRemovingMember,
		handleRoleUpdate,
		handleRemoveMember,
	]);

	if (!activeWorkspace) {
		return <div>No workspace selected</div>;
	}

	if (isLoading) {
		return <div>Loading members...</div>;
	}

	if (memberFetchError) {
		return (
			<div className="text-red-500">
				Failed to load members: {memberFetchError.message}
			</div>
		);
	}

	return (
		<TabsContent
			value="Workspace"
			className="rounded-xl flex flex-col gap-y-6 p-4"
		>
			{/* Workspace Name Editor */}
			<Card>
				<CardContent className="p-4 space-y-2">
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleWorkspaceRename();
						}}
					>
						<label htmlFor="workspace-name" className="text-sm font-medium">
							Workspace Name
						</label>
						<Input
							id="workspace-name"
							value={workspaceName}
							onChange={(e) => setWorkspaceName(e.target.value)}
							className="w-full"
							aria-describedby="workspace-name-help"
						/>
						<p id="workspace-name-help" className="text-sm text-gray-500">
							Enter a new name for your workspace.
						</p>
						<Button
							type="submit"
							className="mt-2 bg-indigo-500"
							disabled={isRenaming}
						>
							{isRenaming ? "Saving..." : "Save"}
						</Button>
					</form>
				</CardContent>
			</Card>

			{/* Members List */}
			<Card>
				<CardContent className="p-4 space-y-2">
					<h2 className="text-lg font-semibold">Members</h2>
					{workspaceMembers?.length === 0 ? (
						<div className="text-gray-500 text-center">
							No members found. Invite members to get started!
						</div>
					) : (
						<div className="space-y-3">{memberList}</div>
					)}
				</CardContent>
			</Card>

			{/* Invite New Members */}
			<Card>
				<CardContent>
					<InviteMembers workspaceId={activeWorkspace.id} />
				</CardContent>
			</Card>
		</TabsContent>
	);
};

export default WorkspaceSettings;
