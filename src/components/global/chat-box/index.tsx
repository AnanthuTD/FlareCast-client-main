"use client";

import { TabsContent } from "@/components/ui/tabs";
import React from "react";
import { useUserStore } from "@/providers/UserStoreProvider";
import Chat from "./Chat";
import { IChat } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/axios";

type Props = {};

const chats: IChat[] = [
	{
		id: "1",
		name: "John Doe",
		message: "Hello, how are you?",
		image: "",
		replies: [
			{
				id: "11",
				name: "John Doe",
				message: "I'm glad to hear that!",
				image: "",
				replies: [],
			},
			{
				id: "12",
				name: "Me",
				message: "You're welcome!",
				image: "",
				replies: [],
			},
		],
	},
	{
		id: "67a372a0be2e27143ea646b6",
		name: "Me",
		message: "I am fine.",
		image: "",
		replies: [],
	},
	{
		id: "3",
		name: "John Doe",
		message: "I am fine.",
		image: "",
		replies: [],
	},
];

const ChatBox = ({}: Props) => {
	const userId = useUserStore((state) => state.id);
	const [message, setMessage] = React.useState("");

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (newMessage: IChat) => {
			// Simulate API call
			const res = await axiosInstance.post(
				"/api/collaboration/chats",
				newMessage
			);
			return res.data;
		},

		// Optimistic update
		onMutate: async (newMessage) => {
			await queryClient.cancelQueries({ queryKey: ["chats"] });

			const previousChats = queryClient.getQueryData<IChat[]>(["chats"]);

			queryClient.setQueryData(["chats"], (old: IChat[] = []) => [
				...old,
				newMessage,
			]);

			return { previousChats };
		},
		onError: (_err, _newMessage, context) => {
			if (context?.previousChats) {
				queryClient.setQueryData(["chats"], context.previousChats);
			}
		},
		/* onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["chats"] });
		}, */
	});

	const handleSendMessage = () => {
		const tempMessage: IChat = {
			id: crypto.randomUUID(),
			name: "Me",
			message,
			image: "",
			replies: [],
		};

		mutation.mutate(tempMessage);
		setMessage("");
	};

	return (
		<TabsContent
			value="Activity"
			className="rounded-xl flex flex-col gap-y-2 p-3 bg-gray-100 h-[65vh] justify-between"
		>
			<div className="flex flex-col gap-y-2">
				{chats.map((chat) =>
					chat.id === userId ? (
						<Chat chat={chat} key={chat.id} own />
					) : (
						<Chat chat={chat} key={chat.id} />
					)
				)}
				{mutation.isPending && <Chat chat={mutation.variables!} own />}
			</div>

			<div className="flex gap-1">
				<Textarea
					value={message}
					rows={1}
					className="bg-white"
					onChange={(e) => {
						setMessage(e.target.value);
					}}
				/>
				<Button
					onClick={handleSendMessage}
					variant="default"
					size={"icon"}
					className="bg-indigo-400 place-self-end"
					disabled={mutation.isPending}
				>
					<SendHorizontal />
				</Button>
			</div>
		</TabsContent>
	);
};

export default ChatBox;
