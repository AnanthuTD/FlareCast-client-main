import Navigation from "@/components/global/landing-page/Navigation";
import HeroSection from "@/components/global/landing-page/HeroSection";
import FeaturesSection from "@/components/global/landing-page/FeaturesSection";
import HowItWorks from "@/components/global/landing-page/HowItWorks";
import PricingSection from "@/components/global/landing-page/PricingSection";
import CTASection from "@/components/global/landing-page/CTASection";
import Footer from "@/components/global/landing-page/Footer";
import DownloadSection from "@/components/global/landing-page/DownloadSection";
import { fetchLatestRelease, getSubscriptionPlans } from "@/actions";

export const revalidate = 86400; // 24 hr

export default async function Home() {
	const { plans } = (await getSubscriptionPlans()) ?? {};
	const release = await fetchLatestRelease();

	return (
		<div className="min-h-screen bg-white text-indigo-900 overflow-x-hidden">
			<Navigation />
			<HeroSection />
			<FeaturesSection />
			<HowItWorks />
			{plans && <PricingSection plans={plans} />}
			{release && <DownloadSection release={release} />}
			<CTASection />
			<Footer />
		</div>
	);
}
