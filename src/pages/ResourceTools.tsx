// components/ResourcesTools.tsx
import React from 'react';
import { FileText, Search, Calculator, Download, BarChart, Mail } from 'lucide-react';

const ResourcesTools: React.FC = () => {
  const resources = {
    resources: [
      { name: 'Blog', icon: <FileText size={18} /> },
      { name: 'Resource Hub', icon: <FileText size={18} /> },
      { name: 'TikTok Ebook For Brands', icon: <FileText size={18} /> },
      { name: '2026 Influencer Marketing Report', icon: <BarChart size={18} /> }
    ],
    tools: [
      { name: 'Influencer Price Calculator', icon: <Calculator size={18} /> },
      { name: 'TikTok Engagement Rate Calculator', icon: <Calculator size={18} /> },
      { name: 'Influencer Campaign Brief Template', icon: <FileText size={18} /> },
      { name: 'Influencer Analytics & Tracking', icon: <BarChart size={18} /> },
    ],
    discover: [
      { name: 'Find Influencers' },
      { name: 'Top Influencers' },
      { name: 'Search Influencers' },
      { name: 'Buy Shoutouts' }
    ],
    support: [
      { name: 'Contact Us', icon: <Mail size={18} /> },
      { name: 'How It Works' },
      { name: 'Frequently Asked Questions' }
    ]
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              {resources.resources.map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-600 hover:text-indigo-600 flex items-center gap-2">
                    {item.icon}
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Tools</h3>
            <ul className="space-y-2">
              {resources.tools.map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-600 hover:text-indigo-600 flex items-center gap-2">
                    {item.icon}
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Discover</h3>
            <ul className="space-y-2">
              {resources.discover.map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-600 hover:text-indigo-600">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              {resources.support.map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-600 hover:text-indigo-600 flex items-center gap-2">
                    {item.icon}
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourcesTools;