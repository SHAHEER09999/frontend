// components/HowItWorks.tsx
import React from 'react';
import { DollarSign, Check, MessageCircle, Lock } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const features = [
    {
      icon: <DollarSign size={24} />,
      title: 'No Upfront Cost',
      description: 'Search influencers for free. No subscriptions, contracts, or hidden fees.'
    },
    {
      icon: <Check size={24} />,
      title: 'Vetted Influencers',
      description: 'Every influencer is vetted by us. Always receive high-quality, professional content.'
    },
    {
      icon: <MessageCircle size={24} />,
      title: 'Instant Chat',
      description: 'Instantly chat with influencers and stay in touch throughout the whole transaction.'
    },
    {
      icon: <Lock size={24} />,
      title: 'Secure Purchases',
      description: 'Your money is held safely until you approve the influencer\'s work.'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-indigo-600">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;