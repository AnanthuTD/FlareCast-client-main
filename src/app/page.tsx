import Navigation from "@/components/global/landing-page/Navigation";
import HeroSection from "@/components/global/landing-page/HeroSection";
import FeaturesSection from "@/components/global/landing-page/FeaturesSection";
import HowItWorks from "@/components/global/landing-page/HowItWorks";
import PricingSection from "@/components/global/landing-page/PricingSection";
import CTASection from "@/components/global/landing-page/CTASection";
import Footer from "@/components/global/landing-page/Footer";
import DownloadSection from "@/components/global/landing-page/DownloadSection";

const Home: React.FC = () => {
	return (
		<div className="min-h-screen bg-white text-indigo-900 overflow-x-hidden">
			<Navigation />
			<HeroSection />
			<FeaturesSection />
			<HowItWorks />
			<PricingSection />
			<DownloadSection />
			<CTASection />
			<Footer />
		</div>
	);
};

export default Home;
