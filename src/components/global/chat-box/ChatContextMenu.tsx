import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Trash2 } from "lucide-react";

const ChatContextMenu = ({
	children,
	handleEditing,
	canDelete = false,
	canEdit = false,
	handleReply,
	handleDelete,
}: {
	children: React.ReactNode;
	chat: { id: string };
	handleEditing?: () => void;
	handleReply?: () => void;
	handleDelete?: () => void;
	canDelete: boolean;
	canEdit: boolean;
}) => {
	return (
		<ContextMenu>
			<ContextMenuTrigger>{children}</ContextMenuTrigger>
			<ContextMenuContent>
				{handleReply && (
					<ContextMenuItem onClick={handleReply}>reply</ContextMenuItem>
				)}
				{canEdit && handleEditing && (
					<ContextMenuItem onClick={handleEditing}>edit</ContextMenuItem>
				)}
				{canDelete && handleDelete && (
					<ContextMenuItem onClick={handleDelete} className="">
						<div className="flex justify-between w-full">
							delete
							<Trash2 color="#b11010" size={18} />
						</div>
					</ContextMenuItem>
				)}
			</ContextMenuContent>
		</ContextMenu>
	);
};

export default ChatContextMenu;
