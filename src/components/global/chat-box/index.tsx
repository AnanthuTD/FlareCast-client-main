"use client";

import { TabsContent } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import { useUserStore } from "@/providers/UserStoreProvider";
import { IChatFlat } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/axios";
import Chat from "./ChatFlat";
import { useSocket } from "@/hooks/useSocket";
import Loader from "../loader";

interface Props {
	videoId: string;
}

const ChatBox = ({ videoId }: Props) => {
	const userId = useUserStore((state) => state.id);
	const [chats, setChats] = useState<IChatFlat[]>([]);
	const [message, setMessage] = React.useState("");
	const [replyTo, setReplyTo] = React.useState<IChatFlat | null>(null);
	const { emitEvent, onEvent } = useSocket(
		`${process.env.NEXT_PUBLIC_BACKEND_URL}/chats`,
		`/collaboration/socket.io`
	);
	const [scrolling, setScrolling] = useState(false);
	const [isAtBottom, setIsAtBottom] = React.useState(true);

	const queryClient = useQueryClient();

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useInfiniteQuery({
			queryKey: ["chats", videoId],
			queryFn: async ({ pageParam = null }: { pageParam: Date | null }) => {
				console.log("pageParam", pageParam);
				const res = await axiosInstance.get(
					`/api/collaboration/chats/${videoId}`,
					{
						params: { cursor: pageParam, limit: 10 },
					}
				);
				return res.data as {
					chats: IChatFlat[];
					nextCursor: Date | null;
				};
			},
			getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
			initialPageParam: null,
			// This part makes sure older data goes to the front
			select: (data) => ({
				...data,
				pages: [...data.pages].reverse(), // Reverse pages so newer ones stay at the end
			}),
		});

	console.log(data);

	useEffect(() => {
		const chats = data?.pages.flatMap((page) => page.chats) ?? [];
		setChats(chats);
		console.log("chats", chats);
	}, [data]);

	console.log(chats);

	React.useEffect(() => {
		emitEvent("joinSpace", { videoId });
	}, [emitEvent, videoId]);

	const chatContainerRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		const unsubscribe = onEvent("newMessage", (newMessage: IChatFlat) => {
			queryClient.setQueryData(["chats", videoId], (old: any) => {
				if (!old || !old.pages?.length) return old;

				const firstPage = old.pages[0];
				const chats = firstPage.chats || [];

				// If the message is an update of an existing temp message
				if (newMessage.user.id === userId && newMessage.tempId) {
					const findIndex = chats.findIndex((p) => p.id === newMessage.tempId);
					if (findIndex !== -1) {
						const updatedChats = [...chats];
						updatedChats[findIndex] = newMessage;

						return {
							...old,
							pages: [
								{
									...firstPage,
									chats: updatedChats,
								},
								...old.pages.slice(1),
							],
						};
					}
				}

				setTimeout(() => {
					if (chatContainerRef.current) {
						chatContainerRef.current.scrollTop =
							chatContainerRef.current.scrollHeight;
					}
				}, 100);

				// Otherwise, add new message to the top (or however your order is)
				return {
					...old,
					pages: [
						{
							...firstPage,
							chats: [newMessage, ...chats], // Assuming newest messages should come first
						},
						...old.pages.slice(1),
					],
				};
			});
		});

		return () => unsubscribe();
	}, [onEvent, queryClient, userId, videoId]);

	const handleSendMessage = () => {
		if (!message.trim()) return;

		const tempId = crypto.randomUUID();
		const tempMessage: IChatFlat = {
			id: tempId,
			user: {
				id: userId,
				name: "Me",
			},
			message,
			image: "",
			repliedTo: replyTo ? { ...replyTo } : null,
			videoId,
			tempId,
		};

		console.log(tempMessage);

		queryClient.setQueryData(["chats", videoId], (old: any) => {
			if (!old) return old;
			return {
				...old,
				pages: [
					{
						chats: [...old.pages[0].chats, tempMessage],
						nextCursor: old.pages[0].nextCursor,
					},
					...old.pages.slice(1),
				],
			};
		});

		emitEvent("createChat", tempMessage);
		setMessage("");
		setReplyTo(null);
	};

	const handleReplyTo = (chat: IChatFlat) => {
		setReplyTo(chat);
	};

	// Track scroll position
	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const target = e.currentTarget;

		// Check if user scrolled to the top -> Fetch older messages
		if (target.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}

		// Check if user is near the bottom
		const nearBottom =
			target.scrollHeight - target.scrollTop <= target.clientHeight + 5;
		setIsAtBottom(nearBottom);

		// Track if user is actively scrolling
		setScrolling(!nearBottom);
	};

	const lastScrollHeight = React.useRef<number>(0);

	useEffect(() => {
		if (chatContainerRef.current) {
			const container = chatContainerRef.current;

			// If we're fetching older messages and the user is near the top
			if (lastScrollHeight.current && chats.length > 0) {
				const newScrollHeight = container.scrollHeight;
				const scrollDifference = newScrollHeight - lastScrollHeight.current;

				// Adjust only if user was near the top when older messages loaded
				if (scrollDifference > 0 && container.scrollTop < 50) {
					container.scrollTop += scrollDifference;
				}
			}

			// Always store the current scroll height after updates
			lastScrollHeight.current = container.scrollHeight;
		}
	}, [chats]);

	// Auto-scroll only if the user is already at the bottom and not scrolling
	React.useEffect(() => {
		if (chatContainerRef.current && isAtBottom) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
	}, [chats, isAtBottom]);

	// Auto-scroll on initial load or when the user sends a message
	React.useEffect(() => {
		if (chatContainerRef.current && !scrolling) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
	}, [chats]);

	return (
		<TabsContent
			value="Activity"
			className="rounded-xl flex flex-col gap-y-2 p-3 bg-gray-100 h-[65vh] justify-between"
		>
			<div
				ref={chatContainerRef}
				onScroll={handleScroll}
				className="flex flex-col gap-y-2 px-1 scrollbar-w-1 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-indigo-300 scrollbar-track-indigo-100 overflow-y-scroll"
			>
				{isFetchingNextPage && <Loader state={true} />}
				{chats.map((chat) => {
					console.log("chat in map", chat);
					if (!chat.id || !chat.user.name) return;

					return (
						<Chat
							chat={chat}
							key={chat.id}
							own={chat.user.id === userId}
							onReply={handleReplyTo}
						/>
					);
				})}
			</div>

			<div className="flex gap-1">
				<div className="w-full">
					{replyTo?.message && (
						<div>
							<div className="bg-gray-200 rounded-b-none rounded-md flex overflow-hidden">
								<div className="bg-indigo-400 w-[3px] rounded-s-md rounded-b-none mr-1"></div>
								<p className="text-xs p-1">{replyTo?.message}</p>
							</div>
						</div>
					)}
					<Textarea
						value={message}
						rows={1}
						className={`bg-white focus-visible:ring-indigo-300 ${
							replyTo ? "rounded-t-none" : ""
						}`}
						onChange={(e) => setMessage(e.target.value)}
					/>
				</div>
				<Button
					onClick={handleSendMessage}
					variant="default"
					size="icon"
					className="bg-indigo-400 place-self-end"
				>
					<SendHorizontal />
				</Button>
			</div>
		</TabsContent>
	);
};

export default ChatBox;
