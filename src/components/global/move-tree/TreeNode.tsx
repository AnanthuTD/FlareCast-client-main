import { ChevronDown, ChevronRight,  Folder } from "lucide-react";
import { useState } from "react";

const TreeNode = ({
	node,
	selectedNode,
	setSelectedNode,
}: {
	node: any;
	selectedNode: {
		id: string;
		type: "folder" | "workspace" | "space";
	} | null;
	setSelectedNode: ({}) => void;
}) => {
	const [expanded, setExpanded] = useState(false);
	const hasChildren = node.children && node.children.length > 0;
	const isSelected = selectedNode?.id === node.id; // Check if this node is selected

	return (
		<div className="pl-4">
			<div
				className={`flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-1 rounded-md ${
					isSelected ? "bg-indigo-300" : ""
				}`}
				onClick={(e) => {
					e.stopPropagation();
					setExpanded(!expanded);
					setSelectedNode(node);
				}}
			>
				{hasChildren ? (
					expanded ? (
						<ChevronDown size={16} />
					) : (
						<ChevronRight size={16} />
					)
				) : null}
				{/* {hasChildren ? <Folder size={16} /> : <File size={16} />} */}
				<Folder size={16} />
				<span>{node.name}</span>
			</div>

			{expanded && hasChildren && (
				<div className="pl-4">
					{node.children.map((child: any, index: number) => (
						<TreeNode
							key={index}
							node={child}
							selectedNode={selectedNode}
							setSelectedNode={setSelectedNode}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default TreeNode;
