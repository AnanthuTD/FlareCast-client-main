import * as React from "react";
import { VideoCardProps } from "@/types";
import {
	Card,
	CardContent,
	CardHeader,
} from "../ui/card";

export const VideoCard: React.FC<VideoCardProps> = ({
	duration,
	userName,
	timeAgo,
	title,
	views,
	comments,
	shares,
	thumbnailUrl,
	userAvatarUrl,
}) => {
	return (
		<>
			<Card className="w-[350px]">
				<CardHeader>
					<div className="flex overflow-hidden flex-col w-full rounded-2xl">
						<div className="flex flex-row-reverse gap-2.5 items-start p-2.5 rounded-2xl bg-neutral-800">
							<div className="flex flex-col items-end">
								<div className="flex flex-col w-6">
									<img
										loading="lazy"
										src={thumbnailUrl}
										className="object-contain w-6 aspect-square rounded-[7992px]"
										alt=""
									/>
									<img
										loading="lazy"
										src={thumbnailUrl}
										className="object-contain mt-2 w-6 aspect-square rounded-[7992px]"
										alt=""
									/>
									<div className="flex items-center p-1 mt-2 w-6 h-6 bg-white rounded-[7992px]">
										<img
											loading="lazy"
											src={thumbnailUrl}
											className="object-contain flex-1 shrink aspect-square basis-0 w-[18px]"
											alt=""
										/>
									</div>
								</div>
								<div className="py-1 pr-3.5 pl-3 text-xs font-medium tracking-normal leading-loose text-white bg-neutral-800 rounded-[7992px]">
									{duration}
								</div>
							</div>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col w-full tracking-normal">
						<div className="flex gap-2 items-start w-full">
							<img
								loading="lazy"
								src={userAvatarUrl}
								className="object-contain shrink-0 w-8 aspect-square rounded-[7992px]"
								alt={`${userName}'s avatar`}
							/>
							<div className="flex overflow-hidden flex-col w-full">
								<div className="flex w-full">
									<div className="flex overflow-hidden items-start text-xs font-medium leading-loose text-neutral-800">
										<div className="overflow-hidden pr-1">{userName}</div>
									</div>
									<div className="my-auto text-xs text-gray-500">
										・{timeAgo}
									</div>
								</div>
								<div className="flex gap-1 items-center self-start text-xs leading-loose text-center text-gray-500">
									<div className="overflow-hidden self-stretch pr-px my-auto">
										Not shared
									</div>
									<img
										loading="lazy"
										src="https://cdn.builder.io/api/v1/image/assets/TEMP/1ed193512394a0109c8b790a224ab8b1610c818d7318b350a2430757e88d1cc4?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec"
										className="object-contain shrink-0 self-stretch my-auto w-3 aspect-square"
										alt=""
									/>
								</div>
							</div>
						</div>
						<div className="overflow-hidden gap-2.5 self-stretch py-0.5 mt-5 w-full text-sm font-medium tracking-normal leading-loose text-neutral-800">
							{title}
						</div>
						<div className="flex gap-4 items-center self-start mt-5 text-xs text-gray-500 whitespace-nowrap">
							<div className="flex gap-1 items-center self-stretch my-auto">
								<img
									loading="lazy"
									src="https://cdn.builder.io/api/v1/image/assets/TEMP/73c306ec77ad507cd9766dd10253a746416e38a1abea1a00717c41ce3bb10909?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec"
									className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
									alt=""
								/>
								<div className="self-stretch my-auto">{views}</div>
							</div>
							<div className="flex gap-1 items-center self-stretch my-auto">
								<img
									loading="lazy"
									src="https://cdn.builder.io/api/v1/image/assets/TEMP/51bc53865accec9cdd5d7806eb83557e22b4f2b40691c190530f106bab2050f7?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec"
									className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
									alt=""
								/>
								<div className="self-stretch my-auto">{comments}</div>
							</div>
							<div className="flex gap-1 items-center self-stretch my-auto">
								<img
									loading="lazy"
									src="https://cdn.builder.io/api/v1/image/assets/TEMP/66faaf5e6f2ed6af507204f5b4d9907fee27f69f79324f86916132880cac0cfc?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec"
									className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
									alt=""
								/>
								<div className="self-stretch my-auto">{shares}</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</>
	);
};
