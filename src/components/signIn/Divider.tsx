import * as React from "react";
import { DividerProps } from "@/types";

export function Divider({ text }: DividerProps) {
	return (
		<div className="flex gap-5 justify-between items-center mt-16 max-w-full text-sm font-bold tracking-wider leading-relaxed text-center text-gray-500 uppercase whitespace-nowrap w-[448px] max-md:mt-10">
			<div className="flex shrink-0 self-stretch my-auto h-0.5 bg-gray-500 bg-opacity-20 w-[179px]" />
			<div className="self-stretch">{text}</div>
			<div className="flex shrink-0 self-stretch my-auto h-0.5 bg-gray-500 bg-opacity-20 w-[179px]" />
		</div>
	);
}
