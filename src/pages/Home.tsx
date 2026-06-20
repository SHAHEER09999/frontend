import React, { useRef, useState, useEffect } from 'react';
import { 
  ArrowRight,
  TrendingUp,
  MessageCircle,
  Calendar,
  Users,
  Rocket,
  Sparkles,
  Wallet,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Create refs for each section
  const aboutRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  // Auth State to conditionally show CTA elements
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Smooth scroll function
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Empowering Brands with{' '}
            <span className="bg-gradient-to-r from-teal-600 to-pink-500 bg-clip-text text-transparent">
              Real Influencers
            </span>
          </h1>
          <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto font-medium">
            Build meaningful collaborations with genuine creators who share your brand's values and audience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/influencers" className="bg-teal-600 text-white px-8 py-3 rounded-xl hover:bg-teal-700 transition shadow-md flex items-center justify-center gap-2 text-lg font-bold">
              Find Influencers <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <div ref={aboutRef} id="about" className="scroll-mt-20">
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="bg-gradient-to-r from-teal-50/50 to-pink-50/50 rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6">
                About Our Platform
              </h2>
              <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto leading-relaxed font-medium">
                BrandFluencer bridges the gap between brands and influencers by providing a smart, intuitive, 
                and transparent platform that fosters genuine collaborations.
              </p>
              <p className="text-gray-500 text-center mt-6 max-w-2xl mx-auto text-sm">
                Whether you're an influencer seeking growth opportunities or a brand aiming to reach the right audience, 
                our system ensures effortless partnerships, secure payments, and measurable campaign success — all in one place.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* How It Works Section */}
      <div ref={howItWorksRef} id="how-it-works" className="scroll-mt-20">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
              <p className="text-gray-500 text-base font-medium">A simple flow: join &rarr; match &rarr; collaborate &rarr; measure results.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center">
                <div className="w-12 h-12 bg-pink-50 border border-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-pink-600 font-extrabold text-lg">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Sign Up</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Create your account as a brand or creator and set up your profile in minutes.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center">
                <div className="w-12 h-12 bg-pink-50 border border-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-pink-600 font-extrabold text-lg">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Connect</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Find the perfect match based on niche, audience fit, and campaign goals.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center">
                <div className="w-12 h-12 bg-pink-50 border border-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-pink-600 font-extrabold text-lg">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Collaborate</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Launch campaigns, communicate smoothly, and track performance in one place.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Features Section */}
      <div ref={featuresRef} id="features" className="scroll-mt-20">
        <section className="py-16 bg-gray-50/50 border-y border-gray-100">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Platform Features</h2>
              <p className="text-gray-500 text-base max-w-2xl mx-auto font-medium">
                Everything you need to discover creators, run campaigns, and track results — in one place.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition border border-gray-100">
                <div className="w-10 h-10 bg-teal-50 border border-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Smart Matching</h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Our engine instantly connects brands with the most relevant influencers based on audience metrics, reach, and niche categories.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition border border-gray-100">
                <div className="w-10 h-10 bg-teal-50 border border-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Wallet className="w-5 h-5 text-teal-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Secure Payments</h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Enjoy safe and transparent transactions with built-in payment verification rules for both brand agencies and individual creators.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition border border-gray-100">
                <div className="w-10 h-10 bg-teal-50 border border-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-5 h-5 text-teal-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Performance Insights</h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Track live engagement metrics, converted lead actions, and aggregate ROI updates through a central system workspace.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition border border-gray-100">
                <div className="w-10 h-10 bg-teal-50 border border-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Verified Influencers</h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Every marketplace member account undergoes validation checkpoints to assure audience legitimacy and high organic interaction.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition border border-gray-100">
                <div className="w-10 h-10 bg-teal-50 border border-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-teal-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Easy Collaboration</h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Chat inside custom messenger layouts, negotiate directly, and confirm transaction milestones without dealing with standard middle agencies.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition border border-gray-100">
                <div className="w-10 h-10 bg-teal-50 border border-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Rocket className="w-5 h-5 text-teal-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Instant Campaign Launch</h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Deploy structured brief structures within minutes, shifting fast from the search directory straight into data tracking views.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* CTA Section - Hidden completely when user is logged in */}
      {!isLoggedIn && (
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="bg-gradient-to-r from-teal-600 to-pink-500 rounded-3xl p-10 text-white shadow-xl">
              <h3 className="text-3xl font-bold mb-4">Ready to start collaborating?</h3>
              <p className="text-teal-50 mb-8 text-lg font-medium">
                Join thousands of brands and creators already using BrandFluencer.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup" className="bg-white text-teal-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition shadow-sm">
                  Find Influencers
                </Link>
                <Link to="/login" className="border border-white/80 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition">
                  Join as Creator
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 pt-16 pb-8 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-white text-xl font-bold mb-4">BrandFluencer</h4>
              <p className="text-sm leading-relaxed text-gray-400">
                Bridging the gap between brands and influencers with smart, transparent, and genuine collaborations.
              </p>
            </div>
            <div>
              <h5 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Platform</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="/influencers" className="hover:text-white transition">Smart Matching</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Resources</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="/influencers" className="hover:text-white transition">Influencers Directory</a></li>
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Company</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="hover:text-white transition">About Us</a></li>
                <li><a href="/terms-and-privacy" className="hover:text-white transition">Contact</a></li>
                <li><a href="/terms-and-privacy" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="/terms-and-privacy" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
            <p>&copy; 2026 BrandFluencer. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-gray-500">
              <span>Made for genuine brand-influencer partnerships</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;