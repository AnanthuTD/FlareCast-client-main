import React, { useEffect } from "react";
import { SpaceProps } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter, usePathname } from "next/navigation";

export const SpaceCard: React.FC<SpaceProps> = ({ name, id, avatar }) => {
	const router = useRouter();
	const pathName = usePathname();

	function handleOnclick() {
		router.push(`/space/${id}`);
	}

	return (
		<div
			className={`flex gap-2 items-center pr-5 mt-6 hover:cursor-pointer hover:bg-slate-200 rounded ${
				pathName.includes(id) ? "bg-slate-200" : ""
			}`}
			onClick={handleOnclick}
		>
			<Avatar className=" w-8 h-8">
				<AvatarImage src={avatar as string} />
				<AvatarFallback>
					<div className="flex justify-center items-center w-[36px] aspect-square text-sm leading-relaxed text-orange-800 whitespace-nowrap bg-red-200 rounded-full cursor-pointer">
						{name?.[0]}
					</div>
				</AvatarFallback>
			</Avatar>
			<div className="overflow-hidden self-stretch py-1.5 my-auto text-sm leading-loose text-gray-500 ">
				{name}
			</div>
		</div>
	);
};
