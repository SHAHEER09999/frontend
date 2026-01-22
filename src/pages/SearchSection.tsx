// components/SearchSection.tsx
import React from 'react';
import { Search, MessageSquare, Shield, Image } from 'lucide-react';

const SearchSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Find and Hire Influencers in Seconds on the Marketplace</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Search thousands of vetted Instagram, TikTok, and YouTube influencers.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <Search className="text-indigo-600" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-4">Search Influencers</h3>
            <p className="text-gray-600">Search thousands of vetted Instagram, TikTok, and YouTube influencers.</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <Shield className="text-green-600" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-4">Purchase & Chat Securely</h3>
            <p className="text-gray-600">Safely purchase and communicate through Collabstr. We hold your payment until the work is completed.</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <Image className="text-purple-600" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-4">Receive Quality Content</h3>
            <p className="text-gray-600">Receive your high-quality content from influencers directly through the platform.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;