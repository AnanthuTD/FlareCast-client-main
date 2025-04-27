"use client";

import { TabsContent } from "@/components/ui/tabs";
import React, { useEffect, useState, useRef } from "react";
import { useUserStore } from "@/providers/UserStoreProvider";
import { IChatFlat } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CircleXIcon, SendHorizontal } from "lucide-react";
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
		`/chats/socket.io`
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
			select: (data) => {
				return {
					...data,
					pages: [...data.pages].reverse(),
				};
			},
		});

	useEffect(() => {
		const chats = data?.pages.flatMap((page) => page.chats) ?? [];
		setChats(chats);
	}, [data]);

	useEffect(() => {
		emitEvent("joinSpace", { videoId });
		const handleCreateChatFailure = (tempId: string) => {
			queryClient.setQueryData(["chats", videoId], (old: any) => {
				if (!old || !old.pages?.length) return old;

				const updatedPages = old.pages.map((page: any) => {
					if (!page.chats) return page;

					const updatedChats = page.chats.map((chat: IChatFlat) =>
						chat.id === tempId ? { ...chat, error: true } : chat
					);

					return { ...page, chats: updatedChats };
				});

				return { ...old, pages: updatedPages };
			});
		};

		onEvent("createChatFailure", handleCreateChatFailure);

		return () => {
			emitEvent("leaveSpace", { videoId });
		};
	}, [emitEvent, onEvent, queryClient, videoId]);

	useEffect(() => {
		const unsubscribe = onEvent("newMessage", (newMessage: IChatFlat) => {

			queryClient.setQueryData(["chats", videoId], (old: any) => {
				if (!old || !old.pages?.length) return old;

				const firstPage = old.pages[0];
				const chats = firstPage.chats || [];

				if (newMessage.user.id === userId && newMessage.tempId) {
					const findIndex = chats.findIndex((p) => {
						if (p.id === newMessage.tempId) {
							return true;
						}
					});
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
							chats: [...chats, newMessage],
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

		onEvent("removedChat", (data) => {
			queryClient.setQueryData(["chats", videoId], (old: any) => {
				if (!old || !old.pages?.length) return old;

				const updatedPages = old.pages.map((page: any) => {
					if (!page.chats) return page;

					const updatedChats = page.chats.filter(
						(chat: IChatFlat) => chat.id !== data.id
					);

					return { ...page, chats: updatedChats };
				});

				return { ...old, pages: updatedPages };
			});
		});

		onEvent("updatedChat", (data) => {
			queryClient.setQueryData(["chats", videoId], (old: any) => {
				if (!old || !old.pages?.length) return old;

				const updatedPages = old.pages.map((page: any) => {
					if (!page.chats) return page;

					const updatedChats = page.chats.map((chat: IChatFlat) =>
						chat.id === data.id ? data : chat
					);

					return { ...page, chats: updatedChats };
				});

				return { ...old, pages: updatedPages };
			});
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
		setIsAtBottom(true);
	};

	const handleReplyTo = (chat: IChatFlat) => {
		setReplyTo(chat);
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

	const handleDelete = (chatId: string) => {
		emitEvent("removeChat", chatId);

		queryClient.setQueryData(["chats", videoId], (old: any) => {
			if (!old || !old.pages) return old;

			return {
				...old,
				pages: old.pages.map((page: any) => ({
					...page,
					chats: page.chats.filter((chat: IChatFlat) => chat.id !== chatId),
				})),
			};
		});
	};

	const handleEditMessage = (id: string, message: string) => {
		emitEvent("updateChat", { id, message });

		queryClient.setQueryData(["chats", videoId], (old: any) => {
			if (!old || !old.pages) return old;

			return {
				...old,
				pages: old.pages.map((page: any) => ({
					...page,
					chats: page.chats.map((chat: IChatFlat) =>
						chat.id === id ? { ...chat, message } : chat
					),
				})),
			};
		});
	};

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
					return (
						<Chat
							chat={chat}
							key={chat.id}
							own={chat.user.id === userId}
							onReply={handleReplyTo}
							onDelete={handleDelete}
							onEdit={handleEditMessage}
						/>
					);
				})}
			</div>
			<div className="flex gap-1">
				<div className="w-full">
					{replyTo?.message && (
						<div className="items-center bg-gray-200 rounded-b-none rounded-md flex overflow-hidden max-h-[50px] w-full">
							<div className="bg-indigo-400 w-[3px] rounded-s-md rounded-b-none mr-1"></div>
							<p className="text-xs p-1 overflow-hidden text-ellipsis whitespace-nowrap">
								{replyTo?.message}
							</p>
							<CircleXIcon
								color="#ba2121"
								size={16}
								className="ml-auto mr-1"
								onClick={() => setReplyTo(null)}
							/>
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
