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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Dialog from "@radix-ui/react-dialog";

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
	const [dialogOpen, setDialogOpen] = useState(false);
	const [memberToRemove, setMemberToRemove] = useState<MemberData | null>(null);
	const queryClient = useQueryClient();

	const {
		data: workspaceMembers,
		error: memberFetchError,
		isLoading,
	} = useQuery<MemberData[]>({
		placeholderData: [],
		queryKey: ["workspace-members", activeWorkspace?.id],
		queryFn: async () => {
			if (!activeWorkspace) throw new Error("No active workspace");
			return await getMembers(activeWorkspace.id);
		},
		enabled: !!activeWorkspace,
	});

	const isAdminOrOwner = useMemo(() => {
		if (!workspaceMembers) return false;
		const user = workspaceMembers.find((m) => m.userId === userId);
		return user ? user.role === "ADMIN" || user.role === "OWNER" : false;
	}, [userId, workspaceMembers]);

	// Mutation for renaming workspace
	const renameWorkspaceMutation = useMutation({
		mutationFn: () => renameWorkspace(activeWorkspace.id, workspaceName),
		onSuccess: () => {
			toast.success("Workspace name updated successfully!");
			queryClient.invalidateQueries({
				queryKey: ["workspace-members", activeWorkspace.id],
			});
		},
		onError: (err) => {
			if (isAxiosError(err)) toast.error(err.response?.data?.message);
			else toast.error(err?.message || "Failed to update workspace name!");
		},
	});

	// Mutation for updating role
	const updateRoleMutation = useMutation({
		mutationFn: ({ memberId, role }: { memberId: string; role: string }) =>
			updateRole(activeWorkspace.id, memberId, role),
		onSuccess: () => {
			toast.success("Role updated successfully!");
			queryClient.invalidateQueries({
				queryKey: ["workspace-members", activeWorkspace.id],
			});
		},
		onError: (err) => {
			if (isAxiosError(err)) toast.error(err.response?.data?.message);
			else toast.error(err?.message || "Failed to update role!");
		},
	});

	// Mutation for removing member
	const removeMemberMutation = useMutation({
		mutationFn: (memberId: string) =>
			removeMember(activeWorkspace.id, memberId),
		onSuccess: () => {
			toast.success("Member removed successfully!");
			queryClient.invalidateQueries({
				queryKey: ["workspace-members", activeWorkspace.id],
			});
		},
		onError: (err) => {
			if (isAxiosError(err)) toast.error(err.response?.data?.message);
			else toast.error(err?.message || "Failed to remove member!");
		},
	});

	const handleWorkspaceRename = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!workspaceName.trim()) {
			toast.error("Workspace name cannot be empty!");
			return;
		}
		renameWorkspaceMutation.mutate();
	};

	const handleRoleUpdate = useCallback(
		(memberId: string, role: string) => {
			updateRoleMutation.mutate({ memberId, role });
		},
		[updateRoleMutation]
	);

	const openRemoveDialog = (member: MemberData) => {
		setMemberToRemove(member);
		setDialogOpen(true);
	};

	const confirmRemoveMember = () => {
		if (memberToRemove) {
			removeMemberMutation.mutate(memberToRemove.id);
		}
		setDialogOpen(false);
		setMemberToRemove(null);
	};

	const memberList = useMemo(() => {
		if (!workspaceMembers || workspaceMembers.length === 0) return null;
		return workspaceMembers.map((member) => (
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
							disabled={
								updateRoleMutation.isPending &&
								updateRoleMutation.variables?.memberId === member.id
							}
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
							onClick={() => openRemoveDialog(member)}
							disabled={
								removeMemberMutation.isPending &&
								removeMemberMutation.variables === member.id
							}
							aria-label={`Remove ${member.User.name} from workspace`}
						>
							{removeMemberMutation.isPending &&
							removeMemberMutation.variables === member.id
								? "Deleting..."
								: "Delete"}
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
		handleRoleUpdate,
		updateRoleMutation,
		removeMemberMutation,
	]);

	if (!activeWorkspace) {
		return <div>No workspace selected</div>;
	}

	if (isLoading) {
		return <div>Loading members...</div>;
	}

	if (memberFetchError) {
		return (
			<div className="text-red-500 flex flex-col items-center">
				<p>Failed to load members: {memberFetchError.message}</p>
				<Button
					className="mt-2 bg-indigo-500"
					onClick={() =>
						queryClient.invalidateQueries({
							queryKey: ["workspace-members", activeWorkspace.id],
						})
					}
				>
					Retry
				</Button>
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
					<form onSubmit={handleWorkspaceRename}>
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
							disabled={renameWorkspaceMutation.isPending}
						>
							{renameWorkspaceMutation.isPending ? "Saving..." : "Save"}
						</Button>
					</form>
				</CardContent>
			</Card>

			{/* Members List */}
			<Card>
				<CardContent className="p-4 space-y-2">
					<h2 className="text-lg font-semibold">Members</h2>
					{!memberList ? (
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

			{/* Confirmation Dialog */}
			<Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
				<Dialog.Portal>
					<Dialog.Overlay className="fixed inset-0 bg-black/50" />
					<Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
						<Dialog.Title className="text-lg font-semibold">
							Confirm Member Removal
						</Dialog.Title>
						<Dialog.Description className="mt-2 text-sm text-gray-500">
							Are you sure you want to remove{" "}
							<span className="font-medium">
								{memberToRemove?.User.name ?? "this member"}
							</span>{" "}
							from the workspace? This action cannot be undone.
						</Dialog.Description>
						<div className="mt-6 flex justify-end gap-2">
							<Dialog.Close asChild>
								<Button
									className="bg-gray-200 text-gray-800"
									onClick={() => setMemberToRemove(null)}
								>
									Cancel
								</Button>
							</Dialog.Close>
							<Button
								className="bg-red-500"
								onClick={confirmRemoveMember}
								disabled={removeMemberMutation.isPending}
							>
								{removeMemberMutation.isPending ? "Deleting..." : "Confirm"}
							</Button>
						</div>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</TabsContent>
	);
};

export default WorkspaceSettings;
