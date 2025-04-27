"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/providers/UserStoreProvider";
import { HomeIcon, MenuIcon, VideoIcon, XIcon } from "lucide-react";

const Navigation: React.FC = () => {
	const userId = useUserStore((state) => state.id);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const navRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 50) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<nav
			ref={navRef}
			className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
				isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
			}`}
		>
			<div className="container mx-auto px-6 flex items-center justify-between">
				<div className="flex items-center">
					<Link
						href="/"
						className="text-2xl font-bold text-[#6366F1] flex items-center"
					>
						<VideoIcon className="mr-2" />
						Flarecast
					</Link>
				</div>
				<div className="hidden md:flex items-center space-x-8">
					<Link
						href="#features"
						className="text-indigo-900 hover:text-[#6366F1] transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer"
					>
						Features
					</Link>
					<Link
						href="#how-it-works"
						className="text-indigo-900 hover:text-[#6366F1] transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer"
					>
						How It Works
					</Link>
					<Link
						href="#pricing"
						className="text-indigo-900 hover:text-[#6366F1] transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer"
					>
						Pricing
					</Link>
				</div>
				<div className="hidden md:flex items-center space-x-4">
					{userId ? (
						<Link href={"/home"}>
							<Button
								variant="outline"
								className="border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white transition-colors duration-300 w-full !rounded-button whitespace-nowrap cursor-pointer"
							>
								<HomeIcon /> Home
							</Button>
						</Link>
					) : (
						<>
							<Button
								variant="outline"
								className="border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer"
							>
								Sign In
							</Button>
							<Button className="bg-[#6366F1] text-white hover:bg-[#5254cc] transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer">
								Get Started
							</Button>
						</>
					)}
				</div>
				<div className="md:hidden">
					<button
						onClick={toggleMenu}
						className="text-indigo-900 focus:outline-none !rounded-button whitespace-nowrap cursor-pointer"
					>
						{isMenuOpen ? (
							<XIcon className="text-2xl" />
						) : (
							<MenuIcon className="text-2xl" />
						)}
					</button>
				</div>
			</div>
			<div
				className={`md:hidden bg-white ${
					isMenuOpen ? "block" : "hidden"
				} transition-all duration-300 shadow-lg`}
			>
				<div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
					<Link
						href="#features"
						className="text-indigo-900 hover:text-[#6366F1] transition-colors duration-300 py-2 !rounded-button whitespace-nowrap cursor-pointer"
					>
						Features
					</Link>
					<Link
						href="#how-it-works"
						className="text-indigo-900 hover:text-[#6366F1] transition-colors duration-300 py-2 !rounded-button whitespace-nowrap cursor-pointer"
					>
						How It Works
					</Link>
					<Link
						href="#pricing"
						className="text-indigo-900 hover:text-[#6366F1] transition-colors duration-300 py-2 !rounded-button whitespace-nowrap cursor-pointer"
					>
						Pricing
					</Link>
					<div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
						{userId ? (
							<Link href={"/home"}>
								<Button
									variant="outline"
									className="border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white transition-colors duration-300 w-full !rounded-button whitespace-nowrap cursor-pointer"
								>
									<HomeIcon /> Home
								</Button>
							</Link>
						) : (
							<>
								{userId}
								<Link href={"/signin"}>
									<Button
										variant="outline"
										className="border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white transition-colors duration-300 w-full !rounded-button whitespace-nowrap cursor-pointer"
									>
										Sign In
									</Button>
								</Link>
								<Link href={"/signup"}>
									<Button className="bg-[#6366F1] text-white hover:bg-[#5254cc] transition-colors duration-300 w-full !rounded-button whitespace-nowrap cursor-pointer">
										Get Started
									</Button>
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navigation;
