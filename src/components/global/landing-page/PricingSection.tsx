import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-indigo-900/70 max-w-2xl mx-auto">
            Choose the plan that fits your team&apos;s needs
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8 border border-gray-200 hover:border-[#6366F1]/30 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
            <h3 className="text-xl font-bold mb-2">Free</h3>
            <p className="text-gray-600 mb-6">Perfect for individuals</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-gray-600">/month</span>
            </div>
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-start">
                <i className="fas fa-check text-[#6366F1] mt-1 mr-3"></i>
                <span>5 videos per month</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check text-[#6366F1] mt-1 mr-3"></i>
                <span>720p video quality</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check text-[#6366F1] mt-1 mr-3"></i>
                <span>Basic editing tools</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check text-[#6366F1] mt-1 mr-3"></i>
                <span>7-day video history</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer">
              Get Started
            </Button>
          </Card>
          <Card className="p-8 border-2 border-[#6366F1] shadow-lg relative flex flex-col h-full">
            <div className="absolute top-0 right-0 bg-[#6366F1] text-white px-4 py-1 text-sm font-medium">
              Most Popular
            </div>
            <h3 className="text-xl font-bold mb-2">Pro</h3>
            <p className="text-gray-600 mb-6">For small teams</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">$12</span>
              <span className="text-gray-600">/month per user</span>
            </div>
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-start">
                <i className="fas fa-check text-[#6366F1] mt-1 mr-3"></i>
                <span>Unlimited videos</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check text-[#6366F1] mt-1 mr-3"></i>
                <span>1080p video quality</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check text-[#6366F1] mt-1 mr-3"></i>
                <span>Advanced editing tools</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check text-[#6366F1] mt-1 mr-3"></i>
                <span>Team workspaces</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check text-[#6366F1] mt-1 mr-3"></i>
                <span>Basic AI features</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check text-[#6366F1] mt-1 mr-3"></i>
                <span>30-day video history</span>
              </li>
            </ul>
            <Button className="w-full bg-[#6366F1] text-white hover:bg-[#5254cc] transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer">
              Get Started
            </Button>
          </Card>
          <Card className="p-8 border border-gray-200 hover:border-[#6366F1]/30 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
            <h3 className="text-xl font-bold mb-2">Enterprise</h3>
            <p className="text-gray-600 mb-6">For organizations</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">$29</span>
              <span className="text-gray-600">/month per user</span>
            </div>
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-start">
                <i className="fas fa-check text-[#6366F1] mt-1 mr-3"></i>
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check text-[#6366F1] mt-1 mr-3"></i>
                <span>4K video quality</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check text-[#6366F1] mt-1 mr-3"></i>
                <span>Advanced AI features</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check text-[#6366F1] mt-1 mr-3"></i>
                <span>SSO & advanced security</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check text-[#6366F1] mt-1 mr-3"></i>
                <span>Dedicated support</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check text-[#6366F1] mt-1 mr-3"></i>
                <span>Unlimited video history</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer">
              Contact Sales
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;