"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import {
	Command,
	CommandInput,
	CommandList,
	CommandItem,
	CommandEmpty,
} from "@/components/ui/command";
import MemberItem from "./MemberItem";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AvatarPlaceHolder from "../avatar-placeholder";
import {
	fetchExistingMembers,
	addMemberToSpace,
	removeMemberFromSpace,
} from "@/actions/space";
import { searchMembers } from "@/actions/workspace";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";
import { Button } from "@/components/ui/button";

interface Member {
	id: string;
	name: string;
}

interface AddMembersProps {
	spaceId: string;
}

export default function AddMembers({ spaceId }: AddMembersProps) {
	const [inputValue, setInputValue] = useState("");
	const queryClient = useQueryClient();
	const activeWorkspaceId = useWorkspaceStore(
		(state) => state.selectedWorkspace.id
	);

	const { data: members = [], isLoading: isSearching } = useQuery({
		queryKey: ["members", activeWorkspaceId, spaceId, inputValue],
		queryFn: () =>
			searchMembers({
				query: inputValue,
				workspaceId: activeWorkspaceId,
				spaceId,
			}),
		enabled: inputValue.length >= 2,
		staleTime: 5 * 60 * 1000,
		select: (data) => data,
	});

	const { data: existingMembersData = [], isLoading: isLoadingExisting } =
		useQuery({
			queryKey: ["existingMembers", spaceId],
			queryFn: () => fetchExistingMembers({ spaceId }),
			staleTime: 5 * 60 * 1000,
			select: (data) => data.members,
		});

	const addMemberMutation = useMutation({
		mutationFn: ({ memberId }: { memberId: string }) =>
			addMemberToSpace({ spaceId, memberId }),
		onMutate: async ({ memberId }) => {
			await queryClient.cancelQueries({
				queryKey: ["existingMembers", spaceId],
			});
			const previousMembers =
				queryClient.getQueryData<{members: Member[]}>(["existingMembers", spaceId]) || [];
			const memberToAdd = members.find((m) => m.id === memberId);
			if (memberToAdd) {
				queryClient.setQueryData(
					["existingMembers", spaceId],
					(old: Member[] = []) => {
						if (old.members.some((m) => m.id === memberId)) return old;
						return [...old.members, memberToAdd];
					}
				);
			} else {
				console.warn(`Member with ID ${memberId} not found in search results`);
			}
			return { previousMembers };
		},
		onError: (err, { memberId }, context) => {
			queryClient.setQueryData(
				["existingMembers", spaceId],
				context?.previousMembers
			);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["existingMembers", spaceId] });
		},
	});

	// Remove member mutation
	const removeMemberMutation = useMutation({
		mutationFn: ({ memberId }: { memberId: string }) =>
			removeMemberFromSpace({ memberId, spaceId }),
		onMutate: async ({ memberId }) => {
			await queryClient.cancelQueries(["existingMembers", spaceId]);
			const previousMembers = queryClient.getQueryData<{ members: Member[] }>([
				"existingMembers",
				spaceId,
			]);
			queryClient.setQueryData(
				["existingMembers", spaceId],
				(old: Member[] = []) => {
					const newData = old.members.filter((m) => m.id !== memberId);
					return newData;
				}
			);
			return { previousMembers };
		},
		onError: (err, { memberId }, context) => {
			console.error("Error removing member:", err);
			queryClient.setQueryData(
				["existingMembers", spaceId],
				context?.previousMembers
			);
		},
		onSettled: () => {
			queryClient.invalidateQueries(["existingMembers", spaceId]);
		},
	});

	const handleSearch = (value: string) => {
		setInputValue(value);
	};

	return (
		<Dialog>
			<DialogTrigger>
				<p className="font-semibold">{existingMembersData.length} member(s)</p>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Members</DialogTitle>
					<DialogDescription>Select a member to add</DialogDescription>
				</DialogHeader>

				<div className="relative w-full px-3 py-1.5 text-sm bg-white text-neutral-800">
					<Command className="rounded-lg border shadow-md z-50 h-fit">
						<CommandInput
							placeholder="Search members..."
							value={inputValue}
							onValueChange={handleSearch}
							className="w-full"
						/>
						<CommandList
							className={`left-0 right-0 top-full overflow-y-auto rounded-lg border bg-white shadow-md ${
								members.length > 0 ? "" : "hidden"
							}`}
						>
							{isSearching && (
								<CommandItem
									disabled
									className="flex items-center gap-2 py-2 px-2"
								>
									<svg
										className="animate-spin h-4 w-4 text-gray-500"
										viewBox="0 0 24 24"
									>
										<circle
											cx="12"
											cy="12"
											r="10"
											className="opacity-25"
											fill="none"
											stroke="currentColor"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
										/>
									</svg>
									Searching...
								</CommandItem>
							)}
							{members.map((member) => (
								<MemberItem
									key={member.id}
									member={member}
									onAdd={() => {
										addMemberMutation.mutate({ memberId: member.id });
									}}
								/>
							))}
							{!isSearching &&
								inputValue.length >= 2 &&
								members.length === 0 && (
									<CommandEmpty className="px-2">
										No members found.
									</CommandEmpty>
								)}
							{addMemberMutation.isError && (
								<CommandEmpty className="py-2 text-red-500 px-2">
									Failed to add member:{" "}
									{(addMemberMutation.error as Error).message}
								</CommandEmpty>
							)}
							{removeMemberMutation.isError && (
								<CommandEmpty className="py-2 text-red-500 px-2">
									Failed to remove member:{" "}
									{(removeMemberMutation.error as Error).message}
								</CommandEmpty>
							)}
						</CommandList>
					</Command>
				</div>

				<div className="mt-4">
					{Array.isArray(existingMembersData) &&
						existingMembersData.length > 0 && (
							<>
								<h3 className="text-sm font-semibold mb-2">Current Members</h3>
								{existingMembersData.map((member) => (
									<div
										className="flex justify-between w-full items-center gap-3 space-y-3"
										key={member.id}
									>
										<div className="flex gap-2">
											<Avatar className="w-8 h-8">
												<AvatarImage src={""} />
												<AvatarFallback>
													<AvatarPlaceHolder value={member.name[0] || "A"} />
												</AvatarFallback>
											</Avatar>
											<p>{member.name}</p>
										</div>
										<Button
											onClick={() =>
												removeMemberMutation.mutate({ memberId: member.id })
											}
											variant="destructive"
											size="sm"
										>
											Remove
										</Button>
									</div>
								))}
							</>
						)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
