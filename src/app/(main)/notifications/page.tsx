"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	deleteNotification,
	fetchNotifications,
	markAsRead,
} from "@/actions/notification";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import useFCM, { FCMRoles } from "@/hooks/useFCM";
import { acceptInvitation, rejectInvitation } from "@/actions/invitation";
import { Badge } from "@/components/ui/badge";

const NotificationPanel = () => {
	const [selected, setSelected] = useState(new Set());
	const [tab, setTab] = useState("all");
	const [page, setPage] = useState(1);
	const limit = 10;
	const [totalPages, setTotalPages] = useState(1);
	const [notifications, setNotifications] = useState([]);

	const { notification: newNotification } = useFCM(FCMRoles.USER);

	useEffect(() => {
		console.log("newNotification", newNotification);
		if (newNotification) {
			if (tab === "all" || tab.split(",").includes(newNotification?.type))
				setNotifications((prev) => [newNotification, ...prev]);
		}
	}, [newNotification, setNotifications]);

	useEffect(() => {
		async function getNotifications() {
			const response = await fetchNotifications(tab, page, limit);
			if (!response.error && response.data) {
				if (!Array.isArray(response.data.notifications)) {
					throw new Error("Received notification is not an array!");
				}
				setNotifications(response.data.notifications);
				setTotalPages(data.totalPages);
			} else toast.error(response.error || "Failed to fetch notification!");
		}

		(() => {
			try {
				markAsRead();
			} catch (err) {
				if (isAxiosError(err)) toast.error(err.response?.data?.message);
				else
					toast.error(err?.message || "Failed to mark notifications as read!");
			}
		})();

		getNotifications();
	}, [page, tab]);

	const toggleSelect = (id) => {
		setSelected((prev) => {
			const newSet = new Set(prev);
			newSet.has(id) ? newSet.delete(id) : newSet.add(id);
			return newSet;
		});
	};

	const deleteSelected = async () => {
		try {
			const { data } = await deleteNotification(Array.from(selected));
			setNotifications((prev) => prev.filter((n) => !selected.has(n.id)));
			setSelected(new Set());
		} catch (err) {
			if (isAxiosError(err)) toast.error(err.response?.data?.message);
			else toast.error(err?.message || "Failed to delete notification!");
		}
	};

	const deleteSingle = async (id) => {
		try {
			const { data } = await deleteNotification([id]);
			setNotifications((prev) => prev.filter((n) => !selected.has(n.id)));
			setSelected(new Set());
		} catch (err) {
			if (isAxiosError(err)) toast.error(err.response?.data?.message);
			else toast.error(err?.message || "Failed to delete notification!");
		}
	};

	const handleAcceptInvite = async (
		invitationId: string,
		notificationId: string
	) => {
		if (!invitationId) {
			toast.error("Invalid invitation ID!");
			return;
		}

		try {
			const { data } = await acceptInvitation(invitationId);

			// update the status of the notification
			const index = notifications.findIndex((n) => notificationId === n.id);
			console.log("index of notification = " + index);
			if (index !== -1) {
				notifications[index].data = {
					...notifications[index].data,
					invitationStatus: "ACCEPTED",
				};
				console.log(notifications[index].data);
				setNotifications([...notifications]);
			}

			toast.success(data.message || "Workspace invite accepted!");
		} catch (err) {
			if (isAxiosError(err)) toast.error(err.response?.data?.message);
			else toast.error(err?.message || "Failed to accept workspace invite!");
		}
	};

	const handleRejectInvite = async (
		invitationId: string,
		notificationId: string
	) => {
		if (!invitationId) {
			toast.error("Invalid invitation ID!");
			return;
		}

		try {
			const { data } = await rejectInvitation(invitationId);

			// update the status of the notification
			const index = notifications.findIndex((n) => notificationId === n.id);
			if (index !== -1) {
				notifications[index].data.invitationStatus = "REJECTED";
				setNotifications([...notifications]);
			}

			toast.success(data.message || "Workspace invite rejected!");
		} catch (err) {
			if (isAxiosError(err)) toast.error(err.response?.data?.message);
			else toast.error(err?.message || "Failed to reject workspace invite!");
		}
	};

	return (
		<div className="w-full mx-auto mt-6">
			<h2 className="text-xl font-semibold">Notifications</h2>
			<Tabs value={tab} onValueChange={setTab}>
				<TabsList className="flex gap-2 mb-4">
					<TabsTrigger value="all">Overview</TabsTrigger>
					<TabsTrigger value="COMMENT">Comments</TabsTrigger>
					<TabsTrigger value="WORKSPACE_REMOVE,WORKSPACE_DELETE">
						Workspace
					</TabsTrigger>
					<TabsTrigger value="VIDEO_SHARE,SHARE">Shared with Me</TabsTrigger>
					<TabsTrigger value="WORKSPACE_INVITATION">Invites</TabsTrigger>
					<TabsTrigger value="TRANSCRIPT_FAILURE,TRANSCRIPT_SUCCESS">
						Video
					</TabsTrigger>
				</TabsList>

				<div className="flex flex-row-reverse items-center mb-4">
					{selected.size > 0 && (
						<Button variant="destructive" onClick={deleteSelected}>
							<Trash2 className="h-5 w-5" />
						</Button>
					)}
				</div>
				<AnimatePresence>
					{notifications?.map((notif) => (
						<motion.div
							key={notif.id}
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, x: -10 }}
							transition={{ duration: 0.2 }}
						>
							<Card
								className={cn(
									"flex items-center justify-between p-3 mb-2 border rounded-lg",
									notif.status === "READ" ? "opacity-60" : "font-bold"
								)}
							>
								<div className="flex items-center gap-3">
									<Checkbox
										checked={selected.has(notif.id)}
										onCheckedChange={() => toggleSelect(notif.id)}
									/>
									<div>
										<p>{notif.title}</p>
										<span className="text-sm text-gray-500">
											{notif.content}
										</span>
									</div>
								</div>
								{console.log(notif) ?? null}
								{notif.type === "WORKSPACE_INVITATION" &&
								notif.data &&
								notif.data.invitationId &&
								notif.data.invitationStatus ? (
									notif.data.invitationStatus === "PENDING" ? (
										<div className="flex gap-2">
											<Button
												variant="success"
												onClick={() =>
													handleAcceptInvite(
														notif?.data?.invitationId,
														notif.id
													)
												}
											>
												Accept
											</Button>
											<Button
												variant="destructive"
												onClick={() =>
													handleRejectInvite(
														notif?.data?.invitationId,
														notif.id
													)
												}
											>
												Reject
											</Button>
										</div>
									) : (
										<Badge
											className={`${
												notif.data.invitationStatus === "ACCEPTED"
													? "bg-green-400"
													: "bg-gray-500"
											}`}
										>
											{notif.data.invitationStatus}
										</Badge>
									)
								) : (
									<Button
										variant="ghost"
										size="icon"
										onClick={() => deleteSingle(notif.id)}
									>
										<Trash2 className="h-5 w-5 text-red-500" />
									</Button>
								)}
							</Card>
						</motion.div>
					))}
				</AnimatePresence>
				<Pagination className="mt-4">
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								href="#"
								onClick={() => setPage(page - 1)}
								disabled={page === 1}
							/>
						</PaginationItem>
						{[...Array(totalPages)].map((_, index) => (
							<PaginationItem key={index}>
								<PaginationLink
									href="#"
									isActive={page === index + 1}
									onClick={() => setPage(index + 1)}
								>
									{index + 1}
								</PaginationLink>
							</PaginationItem>
						))}
						<PaginationItem>
							<PaginationNext
								href="#"
								onClick={() => setPage(page + 1)}
								disabled={page === totalPages}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</Tabs>
		</div>
	);
};

export default NotificationPanel;
