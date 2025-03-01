import * as React from "react";
import PricingPlan from "@/components/landingPage/PricingPlan";
import { FeatureCard } from "@/components/landingPage/FeatureCard";
import { HeroSection } from "@/components/landingPage/HeroSection";
import { Header } from "@/components/landingPage/Header";
import { Footer } from "@/components/landingPage/Footer";
import { Contact } from "@/components/landingPage/Contact";
import Testimonial from "@/components/landingPage/testimonial";

const features = [
	{
		image:
			"https://cdn.builder.io/api/v1/image/assets/TEMP/8996904145a4662a5785aff6b678a7c1fb74cfdae8eef4619413452e72c65542?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
		title: "Share Videos Instantly and Collaborate Effortlessly with Your Team",
		description:
			"Capture and share your ideas in real-time with our intuitive platform.",
	},
	{
		image:
			"https://cdn.builder.io/api/v1/image/assets/TEMP/6dd824f9711d1cc25227494953668b166547215e932bef29cd8fa5dfef890f8a?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
		title:
			"Transform Your Videos with AI-Powered Transcription and Summarization",
		description:
			"Let our AI summarize your videos and generate titles effortlessly.",
	},
	{
		image:
			"https://cdn.builder.io/api/v1/image/assets/TEMP/d133ab38af167b99a415f9d0a5ef6353d1b95666c3009d294ac8ecd9b99f9c5d?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
		title: "Store Your Videos Securely in the Cloud with Customizable Settings",
		description:
			"Enjoy flexible cloud storage options and adjust video settings to your needs.",
	},
];

function page() {
	return (
		<div className="flex flex-col overflow-auto h-full">
			<Header />
			<HeroSection />
			<main>
				{/* Features Section */}
				<section className="flex overflow-hidden flex-col px-16 py-28 w-full bg-white max-md:px-5 max-md:py-24 max-md:max-w-full">
					<h2 className="text-4xl font-bold leading-10 text-black max-md:max-w-full">
						Experience Seamless Real-Time Video Recording and Streaming for Your
						Team
					</h2>
					<div className="flex flex-col mt-20 w-full max-md:mt-10 max-md:max-w-full">
						<div className="flex flex-wrap gap-10 justify-center items-start w-full max-md:max-w-full">
							{features.map((feature, index) => (
								<FeatureCard key={index} {...feature} />
							))}
						</div>
					</div>
				</section>

				{/* Testimonials Section */}
				<section className="flex overflow-hidden flex-col px-16 py-28 w-full bg-white max-md:px-5 max-md:py-24 max-md:max-w-full">
					<div className="flex flex-wrap gap-10 justify-center items-start w-full max-md:max-w-full">
						<Testimonial />
					</div>
				</section>

				{/* Pricing Section */}
				<section className="flex overflow-hidden flex-col px-16 py-28 w-full bg-white max-md:px-5 max-md:py-24 max-md:max-w-full">
					<div className="flex flex-wrap gap-8 mt-12 w-full min-h-[583px] max-md:mt-10 max-md:max-w-full">
						<PricingPlan />
					</div>
				</section>

				{/* Contact Section */}
				<section className="flex overflow-hidden flex-col px-16 py-28 w-full bg-white max-md:px-5 max-md:py-24 max-md:max-w-full">
					<div className="flex flex-wrap gap-10 items-start w-full max-md:max-w-full">
						<Contact />
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}

export default page;
