import React, { useRef } from 'react';
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
import { Link } from 'react-router';

const Home = () => {
  // Create refs for each section
  const aboutRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  // Smooth scroll function
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Empowering Brands with{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Real Influencers
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Build meaningful collaborations with genuine creators who share your brand's values and audience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/influencers" className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition shadow-md flex items-center justify-center gap-2 text-lg">
              Find Influencers <ArrowRight className="w-5 h-5" />
            </Link  >
          </div>
        </div>
      </section>

      {/* About Section */}
      <div ref={aboutRef} id="about" className="scroll-mt-20">
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 md:p-12 shadow-sm">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-6">
                About Our Platform
              </h2>
              <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto leading-relaxed">
                BrandFluencer bridges the gap between brands and influencers by providing a smart, intuitive, 
                and transparent platform that fosters genuine collaborations.
              </p>
              <p className="text-gray-600 text-center mt-6 max-w-2xl mx-auto">
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-gray-600 text-lg">A simple flow: join → match → collaborate → measure results.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-indigo-600 font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Sign Up</h3>
                <p className="text-gray-600">
                  Create your account as a brand or creator and set up your profile in minutes.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-indigo-600 font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Connect</h3>
                <p className="text-gray-600">
                  Find the perfect match based on niche, audience fit, and campaign goals.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-indigo-600 font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Collaborate</h3>
                <p className="text-gray-600">
                  Launch campaigns, communicate smoothly, and track performance in one place.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Features Section */}
      <div ref={featuresRef} id="features" className="scroll-mt-20">
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Platform Features</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Everything you need to discover creators, run campaigns, and track results — in one place.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Matching</h3>
                <p className="text-gray-600 text-sm">
                  Our AI-powered engine instantly connects brands with the most relevant influencers based on audience, reach, and niche.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Wallet className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Payments</h3>
                <p className="text-gray-600 text-sm">
                  Enjoy safe and transparent transactions with built-in payment protection for both brands and influencers.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Insights</h3>
                <p className="text-gray-600 text-sm">
                  Track real-time engagement, conversions, and ROI through our powerful analytics dashboard.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Influencers</h3>
                <p className="text-gray-600 text-sm">
                  Every influencer profile is manually verified to ensure authenticity and genuine engagement.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Collaboration</h3>
                <p className="text-gray-600 text-sm">
                  Chat, negotiate, and finalize deals directly on our platform with no middlemen.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Rocket className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Campaign Launch</h3>
                <p className="text-gray-600 text-sm">
                  Create and launch campaigns in minutes from influencer search to results tracking.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-10 text-white shadow-xl">
            <h3 className="text-3xl font-bold mb-4">Ready to start collaborating?</h3>
            <p className="text-indigo-100 mb-8 text-lg">
              Join thousands of brands and creators already using BrandFluencer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition">
                Find Influencers
              </Link>
              <Link to="/login" className="border border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition">
                Join as Creator
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-white text-xl font-bold mb-4">BrandFluencer</h4>
              <p className="text-sm leading-relaxed">
                Bridging the gap between brands and influencers with smart, transparent, and genuine collaborations.
              </p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Platform</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Smart Matching</a></li>
                <li><a href="#" className="hover:text-white transition">Secure Payments</a></li>
                <li><a href="#" className="hover:text-white transition">Performance Insights</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Resources</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Brand Stories</a></li>
                <li><a href="/influencers" className="hover:text-white transition">Influencers Directory</a></li>
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; 2025 BrandFluencer. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span>Made for genuine brand-influencer partnerships</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;