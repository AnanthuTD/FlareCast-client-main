import Image from 'next/image';
import { Button } from "@/components/ui/button";

const CTASection: React.FC = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1] to-[#8b5cf6] opacity-90"></div>
      <div className="absolute inset-0">
        <Image
          src="https://readdy.ai/api/search-image?query=Abstract%20technology%20background%20with%20flowing%20digital%20elements%2C%20purple%20and%20blue%20gradient%2C%20modern%20tech%20pattern%20with%20soft%20glowing%20elements%2C%20futuristic%20digital%20landscape%2C%20professional%20quality%20background%2C%20clean%20minimalist%20design&width=1440&height=400&seq=cta-bg-1&orientation=landscape"
          alt="CTA Background"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          className="opacity-20"
        />
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Team Communication?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of teams already using Flarecast to collaborate more effectively.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button className="bg-white text-[#6366F1] hover:bg-gray-100 transition-colors duration-300 text-lg px-8 py-6 !rounded-button whitespace-nowrap cursor-pointer">
              Get Started Free
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10 transition-colors duration-300 text-lg px-8 py-6 !rounded-button whitespace-nowrap cursor-pointer">
              Schedule a Demo
            </Button>
          </div>
          <p className="text-white/80 mt-6">
            No credit card required. Free 14-day trial.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;