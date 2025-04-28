import React, { useEffect, useState, DragEvent } from "react";
import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchParentFolders } from "@/actions/folder";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";
import { Folder } from "@/types";
import Link from "next/link";

interface FolderPredecessorsProps {
	folderId: string;
	selectedFolder: Folder | null;
	onMoveFolder: (
		sourceId: string,
		destination: { type: "folder" | "workspace"; id: string }
	) => void;
	setDragOverFolderId: (folderId: string | null) => void;
}

function FolderPredecessors({
	folderId,
	selectedFolder,
	onMoveFolder,
	setDragOverFolderId,
}: FolderPredecessorsProps) {
	const [parentFolders, setParentFolders] = useState<Folder[]>([]);
	const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
	const activeWorkspaceId = useWorkspaceStore(
		(state) => state.selectedWorkspace.id
	);

	// Fetch parent folders
	useEffect(() => {
		if (activeWorkspaceId && folderId && typeof folderId === "string") {
			fetchParentFolders(activeWorkspaceId, folderId)
				.then((folders) => {
					const { parentFolders, ...curr } = folders;
					setParentFolders(parentFolders);
					setCurrentFolder(curr);
				})
				.catch((error) => {
					console.error("Error fetching parent folders:", error);
				});
		}
	}, [folderId, activeWorkspaceId]);

	// Drag Handlers
	function handleDragEnter(ev: DragEvent<HTMLDivElement>) {
		ev.preventDefault();
		ev.dataTransfer.dropEffect = "move";
		const targetFolderId = ev.currentTarget.id;

		if (
			!targetFolderId ||
			targetFolderId === selectedFolder?.id ||
			!ev.currentTarget.classList.contains("folder")
		) {
			setDragOverFolderId(null);
			ev.dataTransfer.dropEffect = "none";
			return;
		}

		ev.dataTransfer.dropEffect = "move";
		setDragOverFolderId(ev.currentTarget.id);
	}

	function handleDrop(ev: DragEvent<HTMLDivElement>) {
		ev.preventDefault();
		if (selectedFolder && selectedFolder.id !== ev.currentTarget.id) {
			onMoveFolder(selectedFolder.id, {
				type: "folder",
				id: ev.currentTarget.id,
			});
		}
		setDragOverFolderId(null);
	}

	function handleDragLeave() {
		setDragOverFolderId(null);
	}

	// Constants for overflow management
	const MAX_VISIBLE_FOLDERS = 3;
	const overflowFolders =
		parentFolders.length > MAX_VISIBLE_FOLDERS
			? parentFolders.slice(0, -MAX_VISIBLE_FOLDERS)
			: [];
	const visibleFolders =
		parentFolders.length > MAX_VISIBLE_FOLDERS
			? parentFolders.slice(-MAX_VISIBLE_FOLDERS)
			: parentFolders;

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{/* Home */}
				<BreadcrumbItem>
					<Link href="/library">Home</Link>
				</BreadcrumbItem>
				<BreadcrumbSeparator />

				{/* Overflow Folders */}
				{overflowFolders.length > 0 && (
					<BreadcrumbItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<BreadcrumbEllipsis>...</BreadcrumbEllipsis>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								{overflowFolders.map((folder) => (
									<DropdownMenuItem
										key={folder.id}
										id={folder.id}
										onDragEnter={handleDragEnter}
										onDrop={handleDrop}
										onDragLeave={handleDragLeave}
										className="folder"
									>
										<Link href={`/library/folder/${folder.id}`}>
											{folder.name}
										</Link>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
						<BreadcrumbSeparator />
					</BreadcrumbItem>
				)}

				{/* Visible Parent Folders */}
				{visibleFolders.map((folder, index) => (
					<React.Fragment key={folder.id}>
						<BreadcrumbItem
							id={folder.id}
							className="folder"
							onDragEnter={handleDragEnter}
							onDrop={handleDrop}
							onDragLeave={handleDragLeave}
						>
							<Link href={`/library/folder/${folder.id}`}>{folder.name}</Link>
						</BreadcrumbItem>
						{index < visibleFolders.length - 1 && <BreadcrumbSeparator />}
					</React.Fragment>
				))}

				{/* Current Folder */}
				{currentFolder && (
					<>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>{currentFolder.name}</BreadcrumbPage>
						</BreadcrumbItem>
					</>
				)}
			</BreadcrumbList>
		</Breadcrumb>
	);
}

export default FolderPredecessors;
