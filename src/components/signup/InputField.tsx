import * as React from "react";
import { InputFieldProps } from "@/types";

export const InputField: React.FC<InputFieldProps> = ({
	label,
	type = "text",
	id,
	defaultValue = "",
	...props
}) => {
	return (
		<div className="flex z-0 flex-col grow shrink self-stretch my-auto text-neutral-800 w-[173px]">
			<label htmlFor={id} className="text-sm tracking-normal leading-loose">
				{label}
			</label>
			<input
				type={type}
				id={id}
				className="flex mt-1.5 w-full bg-white rounded-2xl min-h-[36px] px-3 outline outline-gray-400 outline-[0.5]"
				aria-label={label}
				defaultValue={defaultValue}
				name={id}
				{...props}
			/>
		</div>
	);
};
