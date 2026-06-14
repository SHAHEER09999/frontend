import React from 'react';

const InfluencersPage = () => {
  // Simulating the 12+ grid items
  const influencers = Array.from({ length: 15 });

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-[1400px] mx-auto">
        
        {/* --- Top Filter Bar --- */}
        <div className="bg-white rounded-xl border border-gray-200 p-3 mb-8 shadow-sm flex flex-wrap items-center gap-3">
          <div className="flex gap-2">
            <input type="text" placeholder="Platform: Instagram" className="bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 text-[11px] font-medium" />
            <input type="text" placeholder="Category: Fashion" className="bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 text-[11px] font-medium" />
          </div>
          <div className="w-[1px] h-6 bg-gray-200 mx-1" />
          <div className="flex flex-wrap gap-1.5">
            {['Content Type', 'Followers', 'Location', 'Price', 'Gender', 'Age', 'Delivery', 'Language'].map(f => (
              <button key={f} className="text-[11px] text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-md hover:bg-white transition">
                {f} ▾
              </button>
            ))}
            <button className="text-[11px] font-bold text-red-500 px-3 py-1.5">Clear All</button>
          </div>
        </div>

        {/* --- Title --- */}
        <h1 className="text-lg font-bold text-[#0f172a] mb-6">Instagram Fashion Influencers</h1>

        {/* --- Responsive Grid --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {influencers.map((_, i) => (
            <div key={i} className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <img 
                  src={`https://picsum.photos/seed/${i}/400/600`} 
                  alt="Influencer" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Badge */}
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-[9px] font-bold text-white px-2 py-0.5 rounded-md">
                  ★ TOP CREATOR
                </div>
              </div>
              
              {/* Info Section */}
              <div className="p-3">
                <h3 className="font-bold text-[12px] text-gray-900 truncate">Sarah Jenkins</h3>
                <p className="text-[10px] text-gray-500 truncate mt-0.5">Fashion, Lifestyle, Beauty</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-[10px] text-gray-400 font-medium">London, UK</span>
                  <span className="bg-gray-100 text-[10px] font-bold px-2 py-0.5 rounded text-gray-700">$500</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfluencersPage;