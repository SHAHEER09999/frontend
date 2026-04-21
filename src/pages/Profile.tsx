import React from 'react';
import { 
  Instagram, 
  Youtube, 
  Facebook, 
  Globe, 
  MapPin, 
  Edit3, 
  Users 
} from 'lucide-react';

const Profile: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Blue Header Background */}
      <div className="h-48 bg-gradient-to-r from-teal-500 to-pink-500 w-full" />
      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto -mt-24 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
            <div className="w-32 h-32 bg-gray-100 rounded-full border-4 border-white shadow-sm flex items-center justify-center text-gray-400 text-sm overflow-hidden">
              No Image
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800">Abdullah Ashfaq</h1>
              <p className="text-gray-500 mb-4">shaheerahmed09999@gmail.com</p>
              <button className="inline-flex items-center gap-2 bg-[#1a2332] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors">
                <Edit3 size={16} />
                Edit Profile
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Column: About & Socials */}
            <div>
              <section className="mb-8">
                <h3 className="font-bold text-gray-800 mb-3">About Me</h3>
                <div className="h-10 bg-gray-50 rounded-lg border border-gray-200 mb-4"></div>
                
                <div className="space-y-3 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Globe size={16} />
                    <span>WEBSITE: <span className="text-blue-500 ml-1">No website added</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>LOCATION: <span className="ml-1">Location not specified</span></span>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Users size={18} className="text-gray-400" />
                  <h3 className="font-bold text-gray-800">Social Accounts</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <SocialStatsCard icon={<Instagram className="text-pink-500" />} platform="Instagram" count="15.2k" />
                  <SocialStatsCard icon={<Youtube className="text-red-500" />} platform="YouTube" count="50k" />
                  <SocialStatsCard icon={<span className="font-bold">Tk</span>} platform="TikTok" count="120k" />
                  <SocialStatsCard icon={<Facebook className="text-blue-600" />} platform="Facebook" count="8.5k" />
                </div>
              </section>
            </div>

            {/* Right Column: Categories */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Categories</h3>
              <div className="min-h-[150px] p-4 bg-white border border-gray-200 rounded-xl">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full border border-blue-100">
                  Nature
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Section: Services & Pricing */}
          <section className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800 text-lg">Services & Pricing</h3>
              <div className="text-[10px] font-bold text-gray-400 border px-2 py-0.5 rounded bg-gray-50">
                CURRENCY: <span className="text-black">USD</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PricingCard platform="Instagram" items={['Story', 'Photo Post', 'Reel']} icon={<Instagram size={16} className="text-pink-500" />} />
              <PricingCard platform="Facebook" items={['Story', 'Photo Post', 'Video / Reel']} icon={<Facebook size={16} className="text-blue-600" />} />
              <PricingCard platform="YouTube" items={['YouTube Short', 'Dedicated Video']} icon={<Youtube size={16} className="text-red-500" />} />
              <PricingCard platform="TikTok" items={['Video']} icon={<span className="font-bold text-xs">Tk</span>} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components ---

const SocialStatsCard = ({ icon, platform, count }: { icon: React.ReactNode, platform: string, count: string }) => (
  <div className="p-4 border border-gray-200 rounded-xl flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-lg">{icon}</div>
      <div>
        <p className="text-sm font-bold text-gray-800">{platform}</p>
        <p className="text-xs text-gray-500">{count} Followers</p>
      </div>
    </div>
    <span className="text-[10px] italic text-gray-400">Not connected</span>
  </div>
);

const PricingCard = ({ platform, items, icon }: { platform: string, items: string[], icon: React.ReactNode }) => (
  <div className="border border-gray-200 rounded-xl p-5">
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <span className="font-bold text-sm text-gray-800">{platform}</span>
    </div>
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item} className="flex justify-between items-center text-xs">
          <span className="text-gray-600">{item}</span>
          <div className="w-12 h-6 bg-gray-50 border border-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

export default Profile;