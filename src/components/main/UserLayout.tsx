import * as React from "react";
import { ModeToggle } from "../ModeToggle";
import Sidebar from "./Sidebar";
import ProfilePicture from "./ProfilePicture";

const sidebarItems = [
	{
		icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/afd841629896993aa1ef8ad8803a88d7a1e863dbe16892a5f7b3904597b429b0?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
		label: "Home",
		isActive: true,
		link: "/home",
		notificationCount: 0,
	},
	{
		icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/9571762a9bf7ac5d07bffe1ec0f742b65b00cd802d319c665d6fcf30d3f0ad17?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
		label: "My Library",
		link: "/library",
		notificationCount: 0,
	},
	{
		icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/6a4b73dde04536c390a8f798bd293bf0c76f17bc316967fb62a729cc18b8414c?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
		label: "Notifications",
		notificationCount: 3,
		link: "/notifications",
	},
	{
		icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/5e9ea07e10407ca4d3dd6371d08103f0a5435f68a33a6729d537cb860bfd0c88?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
		label: "Watch Later",
		notificationCount: 1,
		link: "/watchLater",
	},
	{
		icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/41aa75833ea1cbffbd2053da7335f5072c88bd22109fe785e1cb09c3ce30fc83?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
		label: "History",
		link: "/history",
		notificationCount: 0,
	},
	{
		icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/d84310295ce5bed93aba9404f10bdc0e22ab172e690cc11a67fb153b1913f336?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
		label: "Settings",
		link: "/settings",
		notificationCount: 0,
	},
];

const workspaces = [
	{
		name: "All Moksh's Workspace",
		memberCount: 1,
		avatarLabel: "A",
		id: "workspace_id",
	},
];

export const UserLayout: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	return (
		<div className="flex overflow-hidden flex-col bg-white">
			<div className="flex flex-wrap items-start w-full max-md:max-w-full">
				{/* sidebar */}
				<Sidebar
					workspaces={workspaces}
					sidebarItems={sidebarItems}
					activeWorkspaceId=""
				/>

				<main className="flex flex-col flex-1 shrink bg-white basis-0 min-w-[240px] max-md:max-w-full">
					<header className="flex overflow-hidden gap-10 justify-between items-center px-4 py-3.5 w-full max-md:max-w-full">
						<form className="flex flex-wrap gap-5 self-stretch px-11 py-4 my-auto tracking-normal min-w-[240px] w-[1120px] max-md:px-5 max-md:max-w-full">
							<div className="flex overflow-hidden flex-auto gap-2 px-3 py-1.5 text-sm leading-relaxed bg-white rounded-2xl text-neutral-800">
								<img
									loading="lazy"
									src="https://cdn.builder.io/api/v1/image/assets/TEMP/f2d9385bb5df7f5aadb776322cbe0dde2f790cab694baf7fe9fdf4cc49364436?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec"
									className="object-contain shrink-0 w-6 aspect-square"
									alt="Search icon"
								/>
								<label htmlFor="search" className="sr-only">
									Search
								</label>
								<input
									id="search"
									type="search"
									className="flex-auto my-auto max-md:max-w-full border-none bg-transparent focus:outline-none"
									placeholder="Search for people, tags, folders, Spaces, and Looms"
								/>
							</div>
							<div className="flex gap-2.5 text-sm text-center">
								<div className="grow my-auto leading-loose text-gray-500">
									1/25 videos
								</div>
								<button className="flex gap-2 items-start py-1.5 pr-5 pl-4 font-medium leading-6 text-white whitespace-nowrap bg-indigo-500 rounded-[7992px]">
									<img
										loading="lazy"
										src="https://cdn.builder.io/api/v1/image/assets/TEMP/0e98f57b5983542cc4f8759477d375d09833e89f4ddd93c2f875b6abb97f1583?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec"
										className="object-contain shrink-0 w-4 aspect-[0.67]"
										alt=""
									/>
									<div>Upgrade</div>
								</button>
							</div>
						</form>

						{/* Toggle theme */}
						<ModeToggle />

						<div className="flex overflow-hidden gap-2.5 items-center self-stretch my-auto w-9 h-9 bg-white rounded-[7992px]">
							<ProfilePicture />
						</div>
					</header>

					<div className="flex overflow-hidden flex-col items-center pt-24 w-full min-h-[952px] max-md:max-w-full">
						{children}
					</div>
				</main>
			</div>
		</div>
	);
};
