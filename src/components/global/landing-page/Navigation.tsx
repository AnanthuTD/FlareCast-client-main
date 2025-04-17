'use client'

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Navigation: React.FC = () => {
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
						<i className="fas fa-video mr-2"></i>
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
						href="#testimonials"
						className="text-indigo-900 hover:text-[#6366F1] transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer"
					>
						Testimonials
					</Link>
					<Link
						href="#pricing"
						className="text-indigo-900 hover:text-[#6366F1] transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer"
					>
						Pricing
					</Link>
				</div>
				<div className="hidden md:flex items-center space-x-4">
					<Button
						variant="outline"
						className="border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer"
					>
						Sign In
					</Button>
					<Button className="bg-[#6366F1] text-white hover:bg-[#5254cc] transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer">
						Get Started
					</Button>
				</div>
				<div className="md:hidden">
					<button
						onClick={toggleMenu}
						className="text-indigo-900 focus:outline-none !rounded-button whitespace-nowrap cursor-pointer"
					>
						<i
							className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"} text-2xl`}
						></i>
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
						href="#testimonials"
						className="text-indigo-900 hover:text-[#6366F1] transition-colors duration-300 py-2 !rounded-button whitespace-nowrap cursor-pointer"
					>
						Testimonials
					</Link>
					<Link
						href="#pricing"
						className="text-indigo-900 hover:text-[#6366F1] transition-colors duration-300 py-2 !rounded-button whitespace-nowrap cursor-pointer"
					>
						Pricing
					</Link>
					<div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
						<Button
							variant="outline"
							className="border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white transition-colors duration-300 w-full !rounded-button whitespace-nowrap cursor-pointer"
						>
							Sign In
						</Button>
						<Button className="bg-[#6366F1] text-white hover:bg-[#5254cc] transition-colors duration-300 w-full !rounded-button whitespace-nowrap cursor-pointer">
							Get Started
						</Button>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navigation;
