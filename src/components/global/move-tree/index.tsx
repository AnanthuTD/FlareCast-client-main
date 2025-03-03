import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from "@/components/ui/dialog";
import TreeNode from "./TreeNode";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchFolders, moveFolder } from "@/actions/folder";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";
import { getSpaces } from "@/actions/space";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { shareVideo } from "@/actions/video";

export interface TreeData {
	id: string;
	name: string;
	children: TreeData[];
	type: "folder" | "space" | "workspace";
}

export default function MovePopover({
	type,
	sourceId,
	label = "move",
	showWorkspace = true,
	showSpaces = true,
}: {
	type: "folder" | "video" | "screenshot";
	sourceId: string;
	label: string;
	showWorkspace?: boolean;
	showSpaces?: boolean;
}) {
	const [selectedNode, setSelectedNode] = useState<{
		id: string;
		type: TreeData["type"];
	} | null>(null);
	const [treeData, setTreeData] = useState<TreeData[]>([]);
	const activeWorkspace = useWorkspaceStore((state) => state.selectedWorkspace);

	useEffect(() => {
		async function createTreeData() {
			let workspaceFolders = [];
			if (showWorkspace) {
				workspaceFolders = await fetchFolders(activeWorkspace.id);
			}

			let spaces = [];
			if (showSpaces) {
				spaces = await getSpaces(activeWorkspace.id);
			}

			const data = [
				{
					id: activeWorkspace.id,
					name: activeWorkspace.name,
					children: workspaceFolders.map((folder) => ({
						id: folder.id,
						name: folder.name,
						children: [],
						type: "folder",
					})),
					type: "workspace",
				},
				...spaces.map((space) => ({
					id: space.id,
					name: space.name,
					children: [],
					type: "space",
				})),
			];

			setTreeData(data);
		}

		createTreeData();
	}, [activeWorkspace]);

	useEffect(() => {
		async function updateTreeData() {
			if (!selectedNode || selectedNode.type === "workspace") return;

			let children: TreeData[] = [];

			if (selectedNode.type === "folder") {
				const folders = await fetchFolders(activeWorkspace.id, selectedNode.id);
				children = folders.map((folder) => ({
					id: folder.id,
					name: folder.name,
					children: [],
					type: "folder",
				}));
			} else if (selectedNode.type === "space") {
				const folders = await fetchFolders(
					activeWorkspace.id,
					"",
					selectedNode.id
				);
				children = folders.map((folder) => ({
					id: folder.id,
					name: folder.name,
					children: [],
					type: "folder",
				}));
			}

			// Recursive function to update the correct folder in treeData
			const updateNode = (nodes: TreeData[]): TreeData[] => {
				return nodes.map((node) => {
					if (node.id === selectedNode.id) {
						return { ...node, children };
					}
					if (node.children.length > 0) {
						return { ...node, children: updateNode(node.children) };
					}
					return node;
				});
			};

			setTreeData((prevTree) => updateNode(prevTree));
		}

		if (selectedNode && selectedNode.type) {
			console.log("Fetching children for:", selectedNode);
			updateTreeData();
		}
	}, [selectedNode, setTreeData]);

	async function handleMove() {
		if (!selectedNode || !selectedNode.type || !selectedNode.id) return;

		if (type === "folder") {
			try {
				await moveFolder({
					folderId: sourceId,
					destination: selectedNode,
				});
			} catch (e) {
				if (isAxiosError(e)) {
					toast.error(e.response.data.message);
				} else {
					toast.error("Failed to move folder!");
				}
			}
		} else if (type === "video") {
			try {
				await shareVideo({
					videoId: sourceId,
					destination: selectedNode,
				});
			} catch (e) {
				if (isAxiosError(e)) {
					toast.error(e.response.data.message);
				} else {
					toast.error("Failed to move video!");
				}
			}
		}
	}

	return (
		<Dialog>
			<DialogTrigger
				onClick={(e) => e.stopPropagation()}
				className="w-full flex justify-start"
			>
				{label}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Select a Location</DialogTitle>
					<DialogDescription>
						Choose where you want to move the item.
					</DialogDescription>
				</DialogHeader>
				<div className="p-4 bg-white rounded-lg shadow-md max-h-[300px] overflow-y-auto">
					{treeData.map((node, index) => (
						<TreeNode
							key={index}
							node={node}
							selectedNode={selectedNode}
							setSelectedNode={setSelectedNode}
						/>
					))}
				</div>
				<DialogFooter>
					<Button
						className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md"
						onClick={handleMove}
					>
						Move Here
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
