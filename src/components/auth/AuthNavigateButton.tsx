'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

function AuthNavigateButton() {
	const pathName = usePathname();

	return (
		<Link href={pathName === "/signup" ? "/signin" : "/signup"}>
			<button className="pt-1.5 pr-5 pb-2 pl-4 text-sm font-bold leading-6 text-white bg-indigo-500 rounded-[7992px]">
				{pathName === "/signup" ? "Sign In" : "Sign up for free"}
			</button>
		</Link>
	);
}

export default AuthNavigateButton;
