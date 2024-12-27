'use client'
import React from "react";
import { SocialLink } from "./SocialLink";
import { NewsletterForm } from "./NewsLetterForm";

export const Footer: React.FC = () => {
	const socialLinks = [
		{
			icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/c4c32b5061bd732de499e5cf0054424caf76621176d2825ca111e8de63c3480e?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
			platform: "Facebook",
		},
		{
			icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/1e626e0fd3cae3140e46d4b29cd57e3b29344f00c7f63a6034b5429e98c1249b?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
			platform: "Instagram",
		},
		{
			icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/eba8e138283481a8b5b59724b4542060fb6605ef1b925b24532dd57acf3176b8?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
			platform: "X",
		},
		{
			icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/6c316070105acb05acc21b75dba67d5542942e2fec44fd5f73a8cdb31cb8fd1d?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
			platform: "LinkedIn",
		},
		{
			icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/d7082393400e9fa8292b54970ad1c285281205369e3a0a62328c640ccfa0a3fb?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
			platform: "YouTube",
		},
	];

	const handleNewsletterSubmit = (email: string) => {
		// Implement newsletter submission logic
	};

	const handlePrivacyClick = () => {
		// Implement privacy policy navigation
	};
	
	const handleTermsClick = () => {
		// Implement terms navigation
	};
	
	const handleCookieSettingsClick = () => {
		// Implement cookie settings logic
	};

	return (
		<footer className="flex overflow-hidden flex-col px-16 py-20 w-full bg-white max-md:px-5 max-md:max-w-full">
			<div className="flex flex-wrap gap-10 items-start w-full min-h-[248px] max-md:max-w-full">
				<div className="flex flex-col min-w-[240px] w-[500px] max-md:max-w-full">
					<div className="flex overflow-hidden gap-1 items-center max-w-full text-2xl font-black tracking-normal leading-none whitespace-nowrap h-[34px] min-h-[34px] text-neutral-800 w-[186px]">
						<img
							loading="lazy"
							src="https://cdn.builder.io/api/v1/image/assets/TEMP/102e91c424db778ef7955a167a383a73ca5d811d487b5eb714b86e26ec08257f?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec"
							alt="FlareCast logo"
							className="object-contain shrink-0 self-stretch my-auto aspect-square w-[34px]"
						/>
						<div className="overflow-hidden self-stretch pb-1.5 my-auto w-[134px]">
							FlareCast
						</div>
					</div>

					{/* Newsletter Section */}
					<section className="flex overflow-hidden flex-col  py-5 w-full bg-white max-md:px-5 max-md:py-24 max-md:max-w-full">
						<NewsletterForm onSubmit={handleNewsletterSubmit} />
					</section>
				</div>

				<div className="flex flex-wrap flex-1 shrink gap-10 items-start basis-0 min-w-[240px] max-md:max-w-full">
					<div className="flex flex-col flex-1 shrink basis-0">
						<h3 className="text-base font-semibold text-black">Resources</h3>
						<nav className="flex flex-col mt-4 w-full text-sm text-black">
							<a href="/help" className="py-2 hover:text-gray-600">
								Help Center
							</a>
							<a href="/contact" className="py-2 hover:text-gray-600">
								Contact Us
							</a>
							<a href="/blog" className="py-2 hover:text-gray-600">
								Blog
							</a>
							<a href="/careers" className="py-2 hover:text-gray-600">
								Careers
							</a>
							<a href="/support" className="py-2 hover:text-gray-600">
								Support
							</a>
						</nav>
					</div>

					<div className="flex flex-col flex-1 shrink basis-0">
						<h3 className="text-base font-semibold text-black">Company</h3>
						<nav className="flex flex-col mt-4 w-full text-sm text-black">
							<a href="/about" className="py-2 hover:text-gray-600">
								About Us
							</a>
							<a href="/team" className="py-2 hover:text-gray-600">
								Our Team
							</a>
							<a href="/press" className="py-2 hover:text-gray-600">
								Press Kit
							</a>
							<a href="/testimonials" className="py-2 hover:text-gray-600">
								Testimonials
							</a>
							<a href="/partners" className="py-2 hover:text-gray-600">
								Partners
							</a>
						</nav>
					</div>

					<div className="flex flex-col flex-1 shrink basis-0">
						<h3 className="text-base font-semibold text-black">
							Connect With Us
						</h3>
						<nav className="flex flex-col mt-4 w-full text-sm text-black whitespace-nowrap">
							{socialLinks.map((link) => (
								<SocialLink key={link.platform} {...link} />
							))}
						</nav>
					</div>
				</div>
			</div>

			<div className="flex flex-col mt-20 w-full text-sm max-md:mt-10 max-md:max-w-full">
				<div className="w-full bg-black border border-black border-solid min-h-[1px] max-md:max-w-full" />
				<div className="flex flex-wrap gap-10 justify-between items-start mt-8 w-full max-md:max-w-full">
					<div className="text-black">
						© {new Date().getFullYear()} FlareCast. All rights reserved.
					</div>
					<div className="flex gap-6 items-start text-black min-w-[240px]">
						<button
							onClick={handlePrivacyClick}
							className="underline hover:text-gray-600"
						>
							Privacy Policy
						</button>
						<button
							onClick={handleTermsClick}
							className="underline hover:text-gray-600"
						>
							Terms of Service
						</button>
						<button
							onClick={handleCookieSettingsClick}
							className="underline hover:text-gray-600"
						>
							Cookie Settings
						</button>
					</div>
				</div>
			</div>
		</footer>
	);
};
