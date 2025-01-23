"use client";

import * as React from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PasswordInput = ({
	label = "Password",
	id = "password",
	...props
}) => {
	const [showPassword, setShowPassword] = React.useState(false);

	return (
		<div className="relative flex flex-col text-neutral-800 w-[173px]">
			{/* Label */}
			<label
				htmlFor={id}
				className="text-sm font-medium tracking-wide leading-loose"
			>
				{label}
			</label>

			{/* Input Field */}
			<div className="relative mt-1">
				<Input
					id={id}
					type={showPassword ? "text" : "password"}
					className={cn(
						"w-full bg-white rounded-2xl px-3 py-2 pr-10 text-sm",
					)}
					name={id}
					{...props}
				/>

				{/* Toggle Button */}
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 focus:ring-0"
					onClick={() => setShowPassword((prev) => !prev)}
					aria-label={showPassword ? "Hide password" : "Show password"}
				>
					{showPassword ? (
						<EyeIcon className="h-4 w-4" aria-hidden="true" />
					) : (
						<EyeOffIcon className="h-4 w-4" aria-hidden="true" />
					)}
				</Button>
			</div>
		</div>
	);
};

export { PasswordInput };
