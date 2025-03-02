"use client";

import { TabsContent } from "@/components/ui/tabs";
import React, { useEffect, useState, useRef } from "react";
import { useUserStore } from "@/providers/UserStoreProvider";
import { IChatFlat } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { fetchChats, sendToAiAgent } from "@/actions/aiTool";
import Loader from "../loader";
import ChatFlat from "../chat-box/ChatFlat";

interface Props {
	videoId: string;
}

const ChatBox = ({ videoId }: Props) => {
	const userId = useUserStore((state) => state.id);
	const [chats, setChats] = useState<IChatFlat[]>([]);
	const [message, setMessage] = useState("");
	const [replyTo, setReplyTo] = useState<IChatFlat | null>(null);
	const [isAtBottom, setIsAtBottom] = useState(true);
	const sessionId = `${userId}-${videoId}`; // Unique session per user and video

	const queryClient = useQueryClient();
	const chatContainerRef = useRef<HTMLDivElement>(null);
	const lastScrollHeight = useRef<number>(0);
	const isProgrammaticScroll = useRef(false);
	const isFetching = useRef(false);

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useInfiniteQuery({
			queryKey: ["ai-chats", videoId],
			queryFn: async ({ pageParam = null }) => {
				return fetchChats(videoId, pageParam);
			},
			getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
			initialPageParam: null,
			select: (data) => ({
				...data,
				pages: [...data.pages].reverse(), // Reverse to show oldest first
			}),
		});

	useEffect(() => {
		const chats = data?.pages.flatMap((page) => page.chats) ?? [];
		setChats(chats);
	}, [data]);

	const handleSendMessage = async () => {
		if (!message.trim()) return;

		const tempId = crypto.randomUUID();
		const tempMessage: IChatFlat = {
			id: tempId,
			user: { id: userId, name: "Me" },
			message,
			repliedTo: replyTo ? { ...replyTo } : null,
			videoId,
			createdAt: new Date(),
			tempId,
		};

		// Optimistic update
		queryClient.setQueryData(["ai-chats", videoId], (old: any) => {
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

		try {
			const aiResponse = await sendToAiAgent(videoId, sessionId, message);
			const aiMessage: IChatFlat = {
				id: crypto.randomUUID(),
				user: { id: "ai", name: "AI Agent" },
				message: aiResponse,
				repliedTo: tempMessage,
				videoId,
				createdAt: new Date(),
			};

			queryClient.setQueryData(["ai-chats", videoId], (old: any) => {
				if (!old) return old;
				const updatedChats = old.pages[0].chats.filter(
					(chat: IChatFlat) => chat.tempId !== tempId
				);
				return {
					...old,
					pages: [
						{
							chats: [...updatedChats, tempMessage, aiMessage],
							nextCursor: old.pages[0].nextCursor,
						},
						...old.pages.slice(1),
					],
				};
			});
		} catch (error) {
			console.error("Failed to send message to AI:", error);
			// Roll back optimistic update on failure
			queryClient.setQueryData(["ai-chats", videoId], (old: any) => {
				if (!old) return old;
				return {
					...old,
					pages: [
						{
							chats: old.pages[0].chats.filter(
								(chat: IChatFlat) => chat.tempId !== tempId
							),
							nextCursor: old.pages[0].nextCursor,
						},
						...old.pages.slice(1),
					],
				};
			});
		}

		setMessage("");
		setReplyTo(null);
		setIsAtBottom(true);
	};

	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const target = e.currentTarget;

		if (target.scrollTop <= 10 && hasNextPage && !isFetching.current) {
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
			if (scrollDifference > 0 && container.scrollTop < 50) {
				isProgrammaticScroll.current = true;
				container.scrollTop += scrollDifference;
			}
		}

		if (isAtBottom) {
			isProgrammaticScroll.current = true;
			requestAnimationFrame(() => {
				container.scrollTop = newScrollHeight;
			});
		}

		lastScrollHeight.current = newScrollHeight;
	}, [chats, isAtBottom]);

	return (
		<div className="rounded-xl flex flex-col gap-y-2 p-3 bg-gray-100 h-[65vh] justify-between">
			<div
				ref={chatContainerRef}
				onScroll={handleScroll}
				className="flex flex-col gap-y-2 px-1 scrollbar-w-1 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-indigo-300 scrollbar-track-indigo-100 overflow-y-scroll"
			>
				{isFetchingNextPage && <Loader state={true} />}
				{chats.map((chat) => (
					<ChatFlat
						chat={chat}
						key={chat.id}
						own={chat.user.id === userId || chat.user.id === "ai"}
					/>
				))}
			</div>
			<div className="flex gap-1">
				<div className="w-full">
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
		</div>
	);
};

export default ChatBox;
