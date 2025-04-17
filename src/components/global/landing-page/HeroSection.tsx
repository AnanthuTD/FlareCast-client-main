import Image from 'next/image';
import { Button } from "@/components/ui/button";

const HeroSection: React.FC = () => {
  return (
    <section className="pt-28 md:pt-32 pb-16 md:pb-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full">
        <Image
          src="https://readdy.ai/api/search-image?query=Modern%20abstract%20technology%20workspace%20with%20futuristic%20interface%20elements%2C%20gradient%20purple%20and%20blue%20lighting%2C%20clean%20minimalist%20design%2C%20high-tech%20environment%20with%20soft%20glowing%20elements%2C%20elegant%20workspace%20with%20holographic%20elements%2C%20professional%20quality%2C%20photorealistic%2C%208k%20resolution&width=800&height=600&seq=hero-bg-1&orientation=landscape"
          alt="Hero Background"
          layout="fill"
          objectFit="cover"
          objectPosition="top"
          className="opacity-80"
        />
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#6366F1] to-[#8b5cf6] bg-clip-text text-transparent">Record, Share, Collaborate</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-indigo-900 max-w-lg">
              Transform your team communication with instant video recording and real-time collaboration. Flarecast makes sharing ideas as simple as clicking a button.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button className="bg-[#6366F1] text-white hover:bg-[#5254cc] transition-colors duration-300 text-lg px-8 py-6 !rounded-button whitespace-nowrap cursor-pointer">
                Get Started Free
              </Button>
              <Button variant="outline" className="border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white transition-colors duration-300 text-lg px-8 py-6 !rounded-button whitespace-nowrap cursor-pointer">
                <i className="fas fa-play-circle mr-2"></i> Watch Demo
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative transform hover:-translate-y-2 transition-transform duration-300">
              <Image
                src="https://readdy.ai/api/search-image?query=Professional%20video%20recording%20software%20interface%20on%20laptop%20screen%2C%20modern%20UI%20design%20with%20video%20controls%20and%20collaboration%20features%2C%20sleek%20dark%20theme%20with%20purple%20accents%2C%20high-quality%20screen%20capture%20interface%2C%20professional%20video%20editing%20workspace%2C%20clean%20minimalist%20design&width=600&height=400&seq=app-mockup-1&orientation=landscape"
                alt="Flarecast App Interface"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl max-w-full"
              />
              <div className="absolute -bottom-5 -right-5 bg-[#6366F1] text-white px-4 py-2 rounded-lg shadow-lg">
                <p className="text-sm font-medium">Electron App for Windows</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;