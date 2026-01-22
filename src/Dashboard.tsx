// App.tsx
import React from 'react';
import Navbar from './pages/Navbar';
import Hero from './pages/Hero';
import Featured from './pages/Featured';
import SearchSection from './pages/SearchSection';
import HowItWorks from './pages/HowItWorks';
import Campaigns from './pages/Campaign';
import Testimonials from './pages/Testimonials';
import ResourcesTools from './pages/ResourceTools';
import Footer from './pages/Footer';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <Featured />
      <SearchSection />
      <HowItWorks />
      <Campaigns />
      <Testimonials />
      <ResourcesTools />
      <Footer />
    </div>
  );
};

export default Dashboard;