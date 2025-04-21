import AuthNavigateButton from "@/components/auth/AuthNavigateButton";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Image from "next/image";
import React from "react";

function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col items-center h-screen tracking-normal bg-white">
			<header className="flex items-start self-stretch max-md:max-w-full">
				<div className="w-full flex relative justify-between items-start px-10 pt-5 pb-4 bg-white border-b border-gray-500 border-opacity-20 min-w-[240px] max-md:px-5 max-md:max-w-full">
					<div className="flex overflow-hidden z-0 gap-1 items-center py-px text-2xl font-black leading-none whitespace-nowrap bottom-[19px] h-[34px] left-[15px] min-h-[34px] text-neutral-800">
						<Image
							loading="lazy"
							src="/flare-cast-logo.svg"
							alt="FlareCast Logo"
							className="object-contain"
							width={150}
							height={50}
						/>
					</div>
					<AuthNavigateButton />
				</div>
			</header>
			<GoogleOAuthProvider
				clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
			>
				{children}
			</GoogleOAuthProvider>
		</div>
	);
}

export default AuthLayout;
