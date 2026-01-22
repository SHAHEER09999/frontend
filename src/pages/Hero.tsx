// components/Hero.tsx
import React from 'react';
import { Search } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl text-gray-700 font-bold mb-6">
          Influencer Marketing Made Easy
        </h1>
        <p className="text-xl text-gray-700      mb-8 max-w-2xl mx-auto">
          Find and hire top Instagram, TikTok, YouTube, and UGC influencers to create unique content for your brand
        </p>
        
        <div className="max-w-4xl mx-auto bg-white rounded-lg p-2 shadow-lg">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1 text-left">Platform</label>
              <select className="w-full p-3 border rounded-md text-gray-800">
                <option>Choose a platform</option>
                <option>Instagram</option>
                <option>TikTok</option>
                <option>YouTube</option>
                <option>All Platforms</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1 text-left">Category</label>
              <input 
                type="text" 
                placeholder="Enter keywords, niches or categories"
                className="w-full p-3 border rounded-md text-gray-800"
              />
            </div>
            <button className="bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 flex items-center justify-center gap-2">
              <Search size={20} />
              <span>Search</span>
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-gray-700 flex  flex-wrap justify-center gap-3">
          {['Rising Instagram Stars', 'Rising TikTok Stars', 'Most Viewed', 'Under $250', 'UGC', 'Fashion', 'Beauty', 'Health & Fitness'].map((tag) => (
            <span key={tag} className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm hover:bg-white/30 cursor-pointer">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;