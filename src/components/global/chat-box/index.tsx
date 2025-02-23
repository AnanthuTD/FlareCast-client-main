"use client";

import { TabsContent } from "@/components/ui/tabs";
import React, { useEffect, useState, useRef, useCallback } from "react";
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
	const [message, setMessage] = useState("");
	const [replyTo, setReplyTo] = useState<IChatFlat | null>(null);
	const { emitEvent, onEvent } = useSocket(
		`${process.env.NEXT_PUBLIC_BACKEND_URL}/chats`,
		`/collaboration/socket.io`
	);
	const [isAtBottom, setIsAtBottom] = useState(true);

	const queryClient = useQueryClient();
	const chatContainerRef = useRef<HTMLDivElement>(null);
	const lastScrollHeight = useRef<number>(0);
	const isProgrammaticScroll = useRef(false);
	const isFetching = useRef(false);

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useInfiniteQuery({
			queryKey: ["chats", videoId],
			queryFn: async ({ pageParam = null }: { pageParam: Date | null }) => {
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
			select: (data) => ({
				...data,
				pages: [...data.pages].reverse(), // Reverse pages so newer ones stay at the end
			}),
		});

	useEffect(() => {
		const chats = data?.pages.flatMap((page) => page.chats) ?? [];
		setChats(chats);
	}, [data]);

	useEffect(() => {
		emitEvent("joinSpace", { videoId });
	}, [emitEvent, videoId]);

	useEffect(() => {
		const unsubscribe = onEvent("newMessage", (newMessage: IChatFlat) => {
			queryClient.setQueryData(["chats", videoId], (old: any) => {
				if (!old || !old.pages?.length) return old;

				const firstPage = old.pages[0];
				const chats = firstPage.chats || [];

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

				return {
					...old,
					pages: [
						{
							...firstPage,
							chats: [newMessage, ...chats],
						},
						...old.pages.slice(1),
					],
				};
			});

			// Auto-scroll to bottom only if the user is near the bottom
			if (isAtBottom && chatContainerRef.current) {
				requestAnimationFrame(() => {
					chatContainerRef.current!.scrollTop =
						chatContainerRef.current!.scrollHeight;
				});
			}
		});

		return () => unsubscribe();
	}, [onEvent, queryClient, userId, videoId, isAtBottom]);

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

	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const target = e.currentTarget;

		if (target.scrollTop === 0 && hasNextPage && !isFetching.current) {
			isFetching.current = true;
			fetchNextPage().finally(() => {
				isFetching.current = false;
			});
		}

		const nearBottom =
			target.scrollHeight - target.scrollTop <= target.clientHeight + 5;
		setIsAtBottom(nearBottom);
	};

	useEffect(() => {
		if (!chatContainerRef.current) return;

		const container = chatContainerRef.current;
		const newScrollHeight = container.scrollHeight;

		if (isProgrammaticScroll.current) {
			isProgrammaticScroll.current = false;
			return;
		}

		if (lastScrollHeight.current && chats.length > 0) {
			const scrollDifference = newScrollHeight - lastScrollHeight.current;

			// Adjust scroll position only if new messages are added at the top
			if (scrollDifference > 0 && container.scrollTop < 50) {
				isProgrammaticScroll.current = true;
				container.scrollTop += scrollDifference;
			}
		}

		// Scroll to bottom if the user is already at the bottom
		if (isAtBottom) {
			isProgrammaticScroll.current = true;
			requestAnimationFrame(() => {
				container.scrollTop = newScrollHeight;
			});
		}

		lastScrollHeight.current = newScrollHeight;
	}, [chats, isAtBottom]);

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
				{chats.map((chat) => (
					<Chat
						chat={chat}
						key={chat.id}
						own={chat.user.id === userId}
						onReply={handleReplyTo}
					/>
				))}
			</div>
			<div className="flex gap-1">
				<div className="w-full">
					{replyTo?.message && (
						<div className="bg-gray-200 rounded-b-none rounded-md flex overflow-hidden max-h-[50px]">
							<div className="bg-indigo-400 w-[3px] rounded-s-md rounded-b-none mr-1"></div>
							<p className="text-xs p-1 overflow-hidden text-ellipsis whitespace-nowrap">
								{replyTo?.message}
							</p>
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
