// components/Featured.tsx
import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

interface Creator {
  name: string;
  rating: number;
  verified?: boolean;
  description: string;
  location: string;
  price: number;
  imageUrl: string;
}

const creators: Creator[] = [
  {
    name: 'Isalah Lamb',
    rating: 5.0,
    verified: true,
    description: 'Verified Fitness Content Creator',
    location: 'Baltimore, MD, US',
    price: 300,
    imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face'
  },
  {
    name: 'Tessa Johnston',
    rating: 4.9,
    description: 'Fashion, Fitness, Lifestyle Creator',
    location: 'Miami, FL, US',
    price: 150,
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face'
  },
  {
    name: 'Dalena',
    rating: 5.0,
    description: 'Healthcare Student, Fashion Influencer',
    location: 'Hillsboro, OR, US',
    price: 375,
    imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w-400&h=400&fit=crop&crop=face'
  },
  {
    name: 'Madelline Geronimo',
    rating: 5.0,
    description: 'Beauty, Motherhood, Lifestyle Creator',
    location: 'Cherry Hill, NJ, US',
    price: 56,
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w-400&h=400&fit=crop&crop=face'
  }
];

const Featured: React.FC = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Featured</h2>
        <p className="text-gray-600 text-center mb-8">Hire top influencers across all platforms</p>
        <div className="border-b mb-8"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {creators.map((creator, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              {/* Profile Image Container */}
              <div className="flex flex-col items-center mb-4">
                <div className="relative mb-4">
                  <img 
                    src={creator.imageUrl} 
                    alt={creator.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  {creator.verified && (
                    <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full">
                      <CheckCircle size={16} />
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                    Top Creator
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    <h3 className="text-lg font-bold">{creator.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{creator.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Creator Info */}
              <div className="text-center mb-6">
                <p className="text-gray-600 mb-1">{creator.description}</p>
                <div className="flex items-center justify-center gap-1 text-gray-500 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{creator.location}</span>
                </div>
              </div>
              
              {/* Price and CTA */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm">Starting at</p>
                    <span className="text-2xl font-bold">${creator.price}</span>
                  </div>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    Hire Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800">
            View All Influencers
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Featured;