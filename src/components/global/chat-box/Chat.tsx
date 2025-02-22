import Image from "next/image";
import ChatContextMenu from "./ChatContextMenu";
import AvatarPlaceHolder from "../avatar-placeholder";
import { Badge } from "@/components/ui/badge";
import { IChat } from "@/types";
import { Reply, SendHorizontal } from "lucide-react";
import Divider from "../divider";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Chat = ({ chat, own = false }: { chat: IChat; own?: boolean }) => {
	const [expandReplies, setExpandReplies] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	const toggleEditing = () => setIsEditing(true);

	const toggleExpandReplies = () => setExpandReplies(!expandReplies);

	const handleUpdateMessage = () => {
		setIsEditing(false);
	};

	return (
		<div className="p-1 bg-white rounded-lg shadow-sm w-full">
			<ChatContextMenu chat={chat} canDelete={own} canEdit={own} handleEditing={toggleEditing}>
				<div
					className={`flex ${
						own ? "flex-row-reverse" : ""
					} items-center gap-4 w-full`}
				>
					{chat.image ? (
						<Image
							src={chat.image}
							alt={chat.name}
							className="rounded-full object-cover"
							width={24}
							height={24}
						/>
					) : (
						<AvatarPlaceHolder value={chat.name[0]} width={30} />
					)}
					<div className="w-full">
						<p
							className={`text-xs text-muted-foreground ${
								own ? "place-self-end" : ""
							}`}
						>
							{chat.name}
						</p>

						{isEditing ? (
							<div className="flex w-full gap-1">
								<Input defaultValue={chat.message} />
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
			</ChatContextMenu>

			{chat.replies && chat.replies.length ? (
				<Divider onClick={toggleExpandReplies}>
					{expandReplies ? <>show less</> : <>see all {chat.replies.length}</>}
				</Divider>
			) : null}

			{/* replies */}

			<div className="ml-2">
				{expandReplies &&
					chat.replies &&
					chat.replies.map((reply) => (
						<div key={reply.id} className="flex items-center w-full">
							<Reply className="-rotate-180 text-muted-foreground" size={18} />
							<Chat chat={reply} key={reply.id} />
						</div>
					))}
			</div>
		</div>
	);
};

export default Chat;
