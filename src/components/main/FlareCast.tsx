import * as React from "react";
import { VideoSection } from "./VideoSection";
import { SidebarItem } from "./SidebarItem";
import { Workspace } from "./Workspace";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { ModeToggle } from "../ModeToggle";

const sidebarItems = [
	{
		icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/afd841629896993aa1ef8ad8803a88d7a1e863dbe16892a5f7b3904597b429b0?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
		label: "Home",
		isActive: true,
		link: "/home",
	},
	{
		icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/9571762a9bf7ac5d07bffe1ec0f742b65b00cd802d319c665d6fcf30d3f0ad17?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
		label: "My Library",
		link: "/library",
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
	},
	{
		icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/d84310295ce5bed93aba9404f10bdc0e22ab172e690cc11a67fb153b1913f336?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
		label: "Settings",
		link: "/settings",
	},
];

const workspaces = [
	{ name: "All Moksh's Workspace", memberCount: 1, avatarLabel: "A" },
];

const videoData = {
	gettingStarted: {
		title: "Getting Started",
		videos: Array(5).fill({
			duration: "4 min",
			userName: "Moksh Garg",
			timeAgo: "2mo",
			title: "Loom Message - 31 January 2023",
			views: 3,
			comments: 0,
			shares: 0,
			thumbnailUrl:
				"https://cdn.builder.io/api/v1/image/assets/TEMP/0e211fdd8d570385198dc92c489ea1887e302f2bbfa3e20c297c5972bccac9da?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
			userAvatarUrl:
				"https://cdn.builder.io/api/v1/image/assets/TEMP/d22a00db697691c85c7d72a4be44f017a90f980bdec24fba5b431c8ea84e9eb2?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
		}),
	},
	newFeatures: {
		title: "New Features",
		videos: Array(5).fill({
			duration: "4 min",
			userName: "Moksh Garg",
			timeAgo: "2mo",
			title: "Loom Message - 31 January 2023",
			views: 3,
			comments: 0,
			shares: 0,
			thumbnailUrl:
				"https://cdn.builder.io/api/v1/image/assets/TEMP/d04b6940fee6059d569beca58082ec42acf8abaed7058502329468748a11dece?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
			userAvatarUrl:
				"https://cdn.builder.io/api/v1/image/assets/TEMP/dbea0e913516a48f4cd6c3f7eb302b5283deee6a8dbe579de8d8268fb080a9d3?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
		}),
	},
};

export const FlareCast: React.FC = () => {
	return (
		<div className="flex overflow-hidden flex-col bg-white">
			<div className="flex flex-wrap items-start w-full max-md:max-w-full">
				<div className="flex gap-2.5 items-center w-60 bg-white">
					<div className="flex flex-col flex-1 shrink self-stretch px-2.5 py-5 my-auto w-full basis-0">
						<div className="flex overflow-hidden gap-1 items-center self-start py-px text-2xl font-black tracking-normal leading-none whitespace-nowrap min-h-[34px] text-neutral-800">
							<img
								loading="lazy"
								src="https://cdn.builder.io/api/v1/image/assets/TEMP/11faecbfd9e5ec8566cc42bb5c1f25f71fd5fe8e58efc684e0867cdaa6d74a70?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec"
								className="object-contain shrink-0 self-stretch my-auto w-8 aspect-square"
								alt="FlareCast logo"
							/>
							<div className="overflow-hidden self-stretch pb-1.5 my-auto w-[134px]">
								FlareCast
							</div>
						</div>

						<Select
						// defaultValue={activeWorkspaceId}
						// onValueChange={onChangeActiveWorkspace}
						>
							<SelectTrigger className="mt-16 text-neutral-400 bg-transparent">
								<SelectValue placeholder="Select a workspace"></SelectValue>
							</SelectTrigger>
							<SelectContent className="backdrop-blur-xl">
								<SelectGroup>
									<SelectLabel>Workspaces</SelectLabel>
									<SelectSeparator />
									{[{ id: "workspace_id", name: "workspace_name" }].map(
										(workspace) => (
											<SelectItem value={workspace.id} key={workspace.id}>
												{workspace.name}
											</SelectItem>
										)
									)}
									{[{}].length > 0 &&
										[{ WorkSpace: { id: "id", name: "workspace_name" } }].map(
											(workspace) =>
												workspace.WorkSpace && (
													<SelectItem
														value={workspace.WorkSpace.id}
														key={workspace.WorkSpace.id}
													>
														{workspace.WorkSpace.name}
													</SelectItem>
												)
										)}
								</SelectGroup>
							</SelectContent>
						</Select>

						<div className="flex flex-col mt-3 w-full bg-white">
							<div className="flex overflow-hidden items-start py-2.5 pr-3.5 pl-4 w-full bg-white rounded-t-2xl border border-solid border-gray-500 border-opacity-20">
								<div className="flex items-center justify-between w-full">
									<div className="flex flex-col self-stretch my-auto">
										<div className="overflow-hidden text-sm font-bold tracking-normal leading-6 text-neutral-800 max-md:pr-5">
											Moksh's Workspace
										</div>
										<div className="text-xs tracking-normal leading-loose text-gray-500">
											1 member
										</div>
									</div>
									<button
										onClick={() => {
											alert("Workspace switching not implemented!");
										}}
									>
										<img
											loading="lazy"
											src="https://cdn.builder.io/api/v1/image/assets/TEMP/6a890baf86af21a42fa276173cbbe3a07795183e749bfcd839f8b1c804f4c487?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec"
											className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
											alt=""
										/>
									</button>
								</div>
							</div>

							<button
								onClick={() => {
									alert("Invite Teammates not defined!");
								}}
								className="flex rounded-b-2xl overflow-hidden items-start py-2.5 pl-3.5 w-full text-xs font-medium tracking-normal leading-loose text-center border border-solid bg-teal-400 bg-opacity-20 border-teal-400 border-opacity-20 text-neutral-800 max-md:pr-5"
							>
								<div className="flex gap-3 items-start py-1 pr-0.5 pl-1">
									<img
										loading="lazy"
										src="https://cdn.builder.io/api/v1/image/assets/TEMP/c50b51837989b4b9298d5227a91a051b72b0ef995129f99a0317e92377b6bd29?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec"
										className="object-contain shrink-0 aspect-square w-[18px]"
										alt=""
									/>
									<div>Invite Teammates</div>
								</div>
							</button>
						</div>

						<nav className="flex overflow-hidden items-start py-6 mt-3 w-full font-medium tracking-normal">
							<div className="flex flex-col flex-1 shrink w-full basis-0">
								<div className="flex flex-col items-start w-full">
									{sidebarItems.map((item, index) => (
										<SidebarItem key={index} {...item} />
									))}
								</div>

								<div className="flex mt-6 w-full border-b border-gray-500 border-opacity-20 min-h-[1px]" />

								<div className="flex gap-5 justify-between py-px pr-2 mt-6 w-full text-sm leading-6 text-gray-500 whitespace-nowrap">
									<div>Workspaces</div>
									<img
										loading="lazy"
										src="https://cdn.builder.io/api/v1/image/assets/TEMP/8a628cca0b149520d7c43e0a0fedd89fd3d0b983ec19b33d421b9bccb9feefc4?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec"
										className="object-contain shrink-0 my-auto aspect-square w-[18px]"
										alt=""
									/>
								</div>

								{workspaces.map((workspace, index) => (
									<Workspace key={index} {...workspace} />
								))}

								<div className="flex mt-6 w-full border-b border-gray-500 border-opacity-20 min-h-[1px]" />
							</div>
						</nav>
					</div>
				</div>

				<main className="flex flex-col flex-1 shrink bg-white basis-0 min-w-[240px] max-md:max-w-full">
					<header className="flex overflow-hidden flex-wrap gap-10 justify-between items-center px-4 py-3.5 w-full max-md:max-w-full">
						<form className="flex flex-wrap gap-5 self-stretch px-11 py-4 my-auto tracking-normal min-w-[240px] w-[1120px] max-md:px-5 max-md:max-w-full">
							<div className="flex overflow-hidden flex-wrap flex-auto gap-2 px-3 py-1.5 text-sm leading-relaxed bg-white rounded-2xl text-neutral-800">
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
						<ModeToggle />
						<div className="flex overflow-hidden gap-2.5 items-center self-stretch my-auto w-9 h-9 bg-white rounded-[7992px]">
							<img
								loading="lazy"
								src="https://cdn.builder.io/api/v1/image/assets/TEMP/0c3c1a163464946d2787a0706951b5eec85e145c4b048b3fcee71604145e7e6a?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec"
								className="object-contain flex-1 shrink self-stretch my-auto w-9 aspect-square basis-0"
								alt="User avatar"
							/>
						</div>
					</header>

					<div className="flex overflow-hidden flex-col items-center pt-24 w-full min-h-[952px] max-md:max-w-full">
						<VideoSection {...videoData.gettingStarted} />
						<VideoSection {...videoData.newFeatures} />
					</div>
				</main>
			</div>
		</div>
	);
};
