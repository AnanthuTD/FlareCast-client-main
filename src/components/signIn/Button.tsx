import { ButtonProps } from "@/types";
import * as React from "react";

export function Button({
	children,
	className = "",
	disabled,
	type = "button",
	onClick,
}: ButtonProps) {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`px-16 py-5 mt-4 max-w-full text-lg font-medium tracking-tight leading-loose text-center whitespace-nowrap rounded-[7992px] w-[448px] max-md:px-5 ${
				disabled ? "bg-gray-100 text-zinc-400" : "bg-indigo-500 text-white"
			} ${className}`}
		>
			{children}
		</button>
	);
}
