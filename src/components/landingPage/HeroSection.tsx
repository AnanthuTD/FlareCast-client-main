'use client'
import React from "react";
import { Button } from "./Button";

export const HeroSection: React.FC = () => {
	const handleGetStarted = () => {
		// Implement get started logic
	};

	const handleSchedule = () => {
		// Implement schedule logic
	};

	return (
		<section className="flex overflow-hidden items-center px-16 w-full bg-black min-h-[900px] max-md:px-5 max-md:max-w-full">
			<div className="flex flex-col self-stretch my-auto min-w-[240px] w-[560px]">
				<div className="flex flex-col w-full text-white max-md:max-w-full">
					<h1 className="text-6xl font-bold leading-[67px] max-md:max-w-full max-md:text-4xl max-md:leading-[54px]">
						Experience Effortless Video Communication with FlareCast
					</h1>
					<p className="mt-6 text-lg leading-7 max-md:max-w-full">
						FlareCast empowers your team with seamless real-time video recording
						and sharing. Collaborate effortlessly and enhance productivity with
						our intuitive platform.
					</p>
				</div>
				<div className="flex gap-4 items-start self-start mt-8 text-base">
					<Button variant="secondary" onClick={handleGetStarted}>
						Get Started
					</Button>
					<Button variant="secondary" onClick={handleSchedule}>
						Schedule
					</Button>
				</div>
			</div>
		</section>
	);
};
