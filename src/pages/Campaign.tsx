// components/Campaigns.tsx
import React from 'react';
import { Target, FileText, Users } from 'lucide-react';

const Campaigns: React.FC = () => {
  const steps = [
    {
      icon: <Target size={24} />,
      title: 'Set Targeting',
      description: 'Specify demographics including niche, location and following size of the influencers you want to target.'
    },
    {
      icon: <FileText size={24} />,
      title: 'Post Campaign',
      description: 'Centralize your images, requirements, and more in a campaign brief sent to 450,000 influencers.'
    },
    {
      icon: <Users size={24} />,
      title: 'Influencers Apply',
      description: 'Targeted influencers submit their pricing, and you choose who to collaborate with.'
    }
  ];

  return (
    <section className="py-16 bg-indigo-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Campaigns</h2>
          <p className="text-xl text-gray-700">Post Campaigns and Have 450,000+ Influencers Come to You</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
              <div className="bg-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <div className="text-white">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Campaigns;