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
	onMoveFolder: (
		sourceId: string,
		destination: { type: "folder" | "workspace"; id: string }
	) => void;
	onMoveVideo: (
		sourceId: string,
		destination: { type: "folder" | "workspace"; id: string }
	) => void;
	setDragOverFolderId: (folderId: string | null) => void;
}

function FolderPredecessors({
	folderId,
	onMoveFolder,
	onMoveVideo,
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

	function handleDragEnter(ev: DragEvent<HTMLElement>) {
		ev.preventDefault();
		const folderId = ev.currentTarget.id;
		const componentType = ev.dataTransfer.getData("type");

		if (componentType === "video" || !folderId) {
			setDragOverFolderId(null);
			return;
		}

		const selectedFolderId = ev.dataTransfer.getData("folderId");

		if (
			componentType !== "folder" ||
			!folderId ||
			folderId === selectedFolderId ||
			!ev.currentTarget.classList.contains("folder")
		) {
			setDragOverFolderId(null);
			return;
		}

		setDragOverFolderId(folderId);
	}

	function handleDrop(
		ev: DragEvent<HTMLElement>,
		destinationType: "workspace" | "folder"
	) {
		console.log('dropped!')
		ev.preventDefault();
		const targetFolderId = ev.currentTarget.id;

		if (!targetFolderId) {
			setDragOverFolderId(null);
			return;
		}

		const componentType = ev.dataTransfer.getData("type");

		if (componentType === "video") {
			const videoId = ev.dataTransfer.getData("videoId");

			if (!videoId) {
				console.warn(
					"🔴 'videoId' is missing in dataTransfer for type 'video'"
				);
			} else {
				onMoveVideo(videoId, {
					type: destinationType,
					id: targetFolderId,
				});
			}
		} else if (componentType === "folder") {
			const selectedFolderId = ev.dataTransfer.getData("folderId");
			if (selectedFolderId !== targetFolderId) {
				onMoveFolder(selectedFolderId, {
					type: destinationType,
					id: targetFolderId,
				});
			}
		} else {
			console.warn(`⚠️ Unknown component type dropped: ${componentType}`);
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
				<BreadcrumbItem
					onDrop={(e) => handleDrop(e, "workspace")}
					onDragOver={(ev) => ev.preventDefault()}
					id={activeWorkspaceId}
				>
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
										onDrop={(e) => handleDrop(e, "folder")}
										onDragLeave={handleDragLeave}
										onDragOver={(ev) => ev.preventDefault()}
									>
										<Link
											href={`/library/folder/${folder.id}?title=${folder.name}`}
										>
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
							onDrop={(e) => handleDrop(e, "folder")}
							onDragLeave={handleDragLeave}
							onDragOver={(ev) => ev.preventDefault()}
						>
							<Link href={`/library/folder/${folder.id}?title=${folder.name}`}>
								{folder.name}
							</Link>
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
