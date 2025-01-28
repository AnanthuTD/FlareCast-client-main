"use client";
import * as React from "react";

interface NotificationBannerProps {
	title: string;
	description: string;
}

export function NotificationBanner({
	title,
	description,
}: NotificationBannerProps) {
	return (
		<div className="overflow-hidden px-14 py-12 rounded-3xl bg-indigo-500 bg-opacity-10 max-md:px-5">
			<div className="flex gap-5 max-md:flex-col">
				<div className="flex flex-col w-[76%] max-md:ml-0 max-md:w-full">
					<div className="flex flex-col grow tracking-normal text-black max-md:mt-10 max-md:max-w-full">
						<h2 className="text-xl font-bold leading-none max-md:max-w-full">
							{title}
						</h2>
						<p className="self-start mt-5 text-sm leading-loose max-md:max-w-full">
							{description}
						</p>
					</div>
				</div>
				<div className="flex flex-col ml-5 w-[24%] max-md:ml-0 max-md:w-full">
					<NotificationButton />
				</div>
			</div>
		</div>
	);
}

function NotificationButton() {
	const handleClick = async () => {
		if (typeof Notification !== "undefined") {
			return await Notification.requestPermission();
		}
	};

	return (
		<button
			onClick={handleClick}
			className="overflow-hidden self-stretch px-3.5 py-4 my-auto w-full text-lg font-medium tracking-normal leading-none text-white bg-indigo-500 rounded-2xl max-md:pr-5 max-md:mt-10"
			aria-label="Allow Push Notifications"
		>
			Allow Push Notification
		</button>
	);
}
