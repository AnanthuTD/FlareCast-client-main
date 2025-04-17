import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-indigo-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="text-2xl font-bold flex items-center mb-4">
              <i className="fas fa-video mr-2"></i>
              Flarecast
            </Link>
            <p className="text-white/70 mb-6 max-w-md">
              Transform your team communication with instant video recording and real-time collaboration.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-white hover:text-[#6366F1] transition-colors duration-300 cursor-pointer">
                <i className="fab fa-twitter text-xl"></i>
              </Link>
              <Link href="#" className="text-white hover:text-[#6366F1] transition-colors duration-300 cursor-pointer">
                <i className="fab fa-facebook text-xl"></i>
              </Link>
              <Link href="#" className="text-white hover:text-[#6366F1] transition-colors duration-300 cursor-pointer">
                <i className="fab fa-linkedin text-xl"></i>
              </Link>
              <Link href="#" className="text-white hover:text-[#6366F1] transition-colors duration-300 cursor-pointer">
                <i className="fab fa-instagram text-xl"></i>
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-white/70 hover:text-white transition-colors duration-300 cursor-pointer">Features</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white transition-colors duration-300 cursor-pointer">Pricing</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white transition-colors duration-300 cursor-pointer">Download</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white transition-colors duration-300 cursor-pointer">Integrations</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white transition-colors duration-300 cursor-pointer">Roadmap</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-white/70 hover:text-white transition-colors duration-300 cursor-pointer">About</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white transition-colors duration-300 cursor-pointer">Blog</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white transition-colors duration-300 cursor-pointer">Careers</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white transition-colors duration-300 cursor-pointer">Press</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white transition-colors duration-300 cursor-pointer">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-white/70 hover:text-white transition-colors duration-300 cursor-pointer">Help Center</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white transition-colors duration-300 cursor-pointer">Documentation</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white transition-colors duration-300 cursor-pointer">Tutorials</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white transition-colors duration-300 cursor-pointer">Community</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white transition-colors duration-300 cursor-pointer">API</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/70 mb-4 md:mb-0">
              © 2025 Flarecast. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="#" className="text-white/70 hover:text-white transition-colors duration-300 cursor-pointer">Terms</Link>
              <Link href="#" className="text-white/70 hover:text-white transition-colors duration-300 cursor-pointer">Privacy</Link>
              <Link href="#" className="text-white/70 hover:text-white transition-colors duration-300 cursor-pointer">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;