// components/Testimonials.tsx
import React from 'react';
import { Star } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    quote: 'I\'ve used Collabstr from both the Creator side and the Brand side! It is extremely user-friendly and has lead to some great relationships with creators/brands I wouldn\'t have been connected to otherwise. Love the platform!',
    author: 'Layla',
    role: 'Influencer & Founder',
    rating: 5
  },
  {
    quote: 'Best platform to connect with influencers and content creators. I\'ve signed up to many platforms, collabstr is the easiest to use and gives the best results for my brand.',
    author: 'Myriam',
    role: 'Founder of BBeyond',
    rating: 5
  },
  {
    quote: 'Been using Collabstr to generate content for our seasonal clothing lines. Super easy for us to search for relevant influencers and pay them. We save at least 10-20 hours a month on this.',
    author: 'Courtney',
    role: 'Marketer',
    rating: 5
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">310,000+ Brands Work With Influencers on Collabstr</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-xl">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} className="text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
              <div>
                <p className="font-bold">{testimonial.author}</p>
                <p className="text-gray-600 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;