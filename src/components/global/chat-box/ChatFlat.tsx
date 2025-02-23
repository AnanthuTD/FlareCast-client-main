import Image from "next/image";
import ChatContextMenu from "./ChatContextMenu";
import AvatarPlaceHolder from "../avatar-placeholder";
import { Badge } from "@/components/ui/badge";
import { IChatFlat } from "@/types";
import { SendHorizontal } from "lucide-react";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ChatFlat = ({
	chat,
	own = false,
	onReply,
	onDelete,
	onEdit,
}: {
	chat: IChatFlat;
	own?: boolean;
	onReply: (chat: IChatFlat) => void;
	onDelete: (id: string) => void;
	onEdit: (id: string, message: string) => void;
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const toggleEditing = () => setIsEditing(true);

	/* TODO: onclick navigate to the replied message */
	// const navigateToChat = () => {};

	const handleUpdateMessage = () => {
		if (!inputRef.current) return;
		if (inputRef.current.value === chat.message) {
			setIsEditing(false);
			return;
		}
		if (!inputRef.current.value) {
			setIsEditing(false);
			return;
		}

		onEdit(chat.id, inputRef.current.value);
		setIsEditing(false);
	};

	return (
		<div className="flex gap-2 w-full">
			{/* Profile Picture */}
			{!own && (
				<div>
					{chat.image ? (
						<Image
							src={chat.image}
							alt={chat.user.name}
							className="rounded-full object-cover"
							width={24}
							height={24}
						/>
					) : (
						<>
							{/* {chat.User.name} */}
							<AvatarPlaceHolder value={chat.user.name[0]} width={30} />
						</>
					)}
				</div>
			)}

			<div
				className={`p-1 rounded-lg w-full ${
					chat.repliedTo ? "bg-white shadow-sm" : ""
				}`}
			>
				<ChatContextMenu
					chat={chat}
					canDelete={own}
					canEdit={own}
					handleEditing={toggleEditing}
					handleReply={() => onReply(chat)}
					handleDelete={() => onDelete(chat.id)}
				>
					<div className="flex flex-col gap-1">
						<p
							className={`text-xs text-muted-foreground text-orange-800 ${
								own ? "place-self-end" : ""
							}`}
						>
							{chat.user.name}
						</p>

						{/* Replied to */}
						{chat.repliedTo && (
							<div className="bg-gray-200 rounded-md overflow-hidden flex">
								<div className="bg-indigo-400 w-[3.5px] rounded-s-md mr-1"></div>
								<div className="p-1">
									<p className="text-xs text-muted-foreground text-orange-800">
										{chat.repliedTo.user.name}
									</p>
									<p className="text-xs p-1">{chat.repliedTo?.message}</p>
								</div>
							</div>
						)}

						<div
							className={`flex ${
								own ? "flex-row-reverse" : ""
							} items-center gap-4 w-full`}
						>
							<div className="w-full">
								{isEditing ? (
									<div className="flex w-full gap-1">
										<Input ref={inputRef} defaultValue={chat.message} />
										<Button
											onClick={handleUpdateMessage}
											variant="default"
											size={"icon"}
											className="bg-indigo-400 place-self-end"
										>
											<SendHorizontal />
										</Button>
									</div>
								) : (
									<div className={`${own ? "place-self-end" : ""}`}>
										<Badge
											variant="outline"
											className={`text-gray-700 bg-gray-50 border-gray-300 `}
										>
											{chat.message}
										</Badge>
									</div>
								)}
							</div>
						</div>
					</div>
				</ChatContextMenu>
			</div>
		</div>
	);
};

export default ChatFlat;
