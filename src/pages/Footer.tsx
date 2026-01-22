// components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-200  py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold">BrandFluencer</h2>
            <p className="text-gray-700 mt-2">Influencer Marketing Platform</p>
          </div>
          
          <div className="flex flex-wrap gap-6">
            <a href="#" className="text-gray-600 hover:text-white">Terms</a>
            <a href="#" className="text-gray-600 hover:text-white">Privacy</a>
            <a href="#" className="text-gray-600 hover:text-white">Cookie Policy</a>
            <a href="#" className="text-gray-600 hover:text-white">Sitemap</a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Collabstr. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;