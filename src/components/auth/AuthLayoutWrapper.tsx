import Link from "next/link";
import React from "react";

function AuthLayoutWrapper({
	children,
	page,
}: {
	children: React.ReactNode;
	page: "signup" | "signin";
}) {
	return (
		<div className="flex flex-col items-center h-screen tracking-normal bg-white">
			<header className="flex items-start self-stretch max-md:max-w-full">
				<div className="w-full flex relative justify-between items-start px-10 pt-5 pb-4 bg-white border-b border-gray-500 border-opacity-20 min-w-[240px] max-md:px-5 max-md:max-w-full">
					<div className="flex overflow-hidden z-0 gap-1 items-center py-px text-2xl font-black leading-none whitespace-nowrap bottom-[19px] h-[34px] left-[15px] min-h-[34px] text-neutral-800">
						<img
							loading="lazy"
							src="https://cdn.builder.io/api/v1/image/assets/TEMP/11faecbfd9e5ec8566cc42bb5c1f25f71fd5fe8e58efc684e0867cdaa6d74a70?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec"
							alt="FlareCast Logo"
							className="object-contain shrink-0 self-stretch my-auto w-8 aspect-square"
						/>
						<div className="overflow-hidden self-stretch pb-1.5 my-auto w-[134px]">
							FlareCast
						</div>
					</div>
					<Link href={page === "signup" ? "/signin" : "/signup"}>
						<button className="pt-1.5 pr-5 pb-2 pl-4 text-sm font-bold leading-6 text-white bg-indigo-500 rounded-[7992px]">
							{page === "signup" ? "Sign In" : "Sign up for free"}
						</button>
					</Link>
				</div>
			</header>
			{children}
		</div>
	);
}

export default AuthLayoutWrapper;
