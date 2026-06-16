import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

interface Influencer {
  id: number;
  name: string;
  age: number;
  gender: string;
  language: string;
  location: string;
  delivery_time: string;
  description?: string;
  image_url: string | null;
  social_accounts: any[];
  categories: any[];
}

const API_URL = "http://localhost:3000";

const InfluencersPage = () => {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [filterOptions, setFilterOptions] = useState<any>({});
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    language: "",
    location: "",
    delivery_time: "",
    min_price: "",
    max_price: "",
    min_age: "",
    max_age: "",
  });

  useEffect(() => {
    loadFilters();
  }, []);

  useEffect(() => {
    loadInfluencers();
  }, [filters]);

  const loadFilters = async () => {
    try {
      const res = await axios.get(`${API_URL}/public_influencers/filters`);
      setFilterOptions(res.data);
    } catch (err) {
      console.error("Failed to load filters:", err);
    }
  };

  const loadInfluencers = async () => {
    try {
      const res = await axios.get(`${API_URL}/public_influencers`, {
        params: filters,
      });
      setInfluencers(res.data);
    } catch (err) {
      console.error("Failed to load influencers:", err);
    }
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      gender: "",
      language: "",
      location: "",
      delivery_time: "",
      min_price: "",
      max_price: "",
      min_age: "",
      max_age: "",
    });
  };

  const getPriceDropdownValue = () => {
    if (filters.min_price === "0" && filters.max_price === "5000") return "0-5000";
    if (filters.min_price === "5000" && filters.max_price === "10000") return "5000-10000";
    if (filters.min_price === "10000" && filters.max_price === "") return "10000+";
    return "";
  };

  const isProfileComplete = (profile: Influencer) => {
    return Boolean(
      profile.image_url &&
      profile.description &&
      profile.categories &&
      profile.categories.length > 0 &&
      profile.location
    );
  };

  const completeInfluencers = influencers.filter(isProfileComplete);

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans text-slate-800">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* --- Minimalist Filter Toolbar --- */}
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </div>

          {/* Scrollable container on small screens, flex-wrap on large */}
          <div className="flex flex-row overflow-x-auto md:flex-wrap items-center gap-2 pb-2 md:pb-0 scrollbar-hide flex-grow">
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="border border-slate-200 py-1.5 px-3 rounded-lg bg-slate-50 text-xs text-slate-600 focus:ring-1 focus:ring-slate-400 focus:outline-none transition-all cursor-pointer min-w-[120px]"
            >
              <option value="">Category</option>
              {filterOptions.categories?.map((c: string) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={filters.gender}
              onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
              className="border border-slate-200 py-1.5 px-3 rounded-lg bg-slate-50 text-xs text-slate-600 focus:ring-1 focus:ring-slate-400 focus:outline-none transition-all cursor-pointer min-w-[100px]"
            >
              <option value="">Gender</option>
              {filterOptions.genders?.map((g: string) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            <select
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="border border-slate-200 py-1.5 px-3 rounded-lg bg-slate-50 text-xs text-slate-600 focus:ring-1 focus:ring-slate-400 focus:outline-none transition-all cursor-pointer min-w-[110px]"
            >
              <option value="">Location</option>
              {filterOptions.locations?.map((l: string) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>

            <select
              value={filters.language}
              onChange={(e) => setFilters({ ...filters, language: e.target.value })}
              className="border border-slate-200 py-1.5 px-3 rounded-lg bg-slate-50 text-xs text-slate-600 focus:ring-1 focus:ring-slate-400 focus:outline-none transition-all cursor-pointer min-w-[110px]"
            >
              <option value="">Language</option>
              {filterOptions.languages?.map((l: string) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>

            <select
              value={filters.delivery_time}
              onChange={(e) => setFilters({ ...filters, delivery_time: e.target.value })}
              className="border border-slate-200 py-1.5 px-3 rounded-lg bg-slate-50 text-xs text-slate-600 focus:ring-1 focus:ring-slate-400 focus:outline-none transition-all cursor-pointer min-w-[120px]"
            >
              <option value="">Delivery</option>
              {filterOptions.delivery_times?.map((d: string) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              value={getPriceDropdownValue()}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "0-5000") {
                  setFilters({ ...filters, min_price: "0", max_price: "5000" });
                } else if (val === "5000-10000") {
                  setFilters({ ...filters, min_price: "5000", max_price: "10000" });
                } else if (val === "10000+") {
                  setFilters({ ...filters, min_price: "10000", max_price: "" });
                } else {
                  setFilters({ ...filters, min_price: "", max_price: "" });
                }
              }}
              className="border border-slate-200 py-1.5 px-3 rounded-lg bg-slate-50 text-xs text-slate-600 focus:ring-1 focus:ring-slate-400 focus:outline-none transition-all cursor-pointer min-w-[110px]"
            >
              <option value="">Price Range</option>
              <option value="0-5000">0 - 5k</option>
              <option value="5000-10000">5k - 10k</option>
              <option value="10000+">10k+</option>
            </select>

            <div className="flex items-center gap-1 min-w-[160px]">
              <input
                type="number"
                placeholder="Min Age"
                value={filters.min_age}
                onChange={(e) => setFilters({ ...filters, min_age: e.target.value })}
                className="w-full border border-slate-200 py-1.5 px-2 rounded-lg bg-slate-50 text-xs focus:ring-1 focus:ring-slate-400 focus:outline-none transition-all"
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                placeholder="Max Age"
                value={filters.max_age}
                onChange={(e) => setFilters({ ...filters, max_age: e.target.value })}
                className="w-full border border-slate-200 py-1.5 px-2 rounded-lg bg-slate-50 text-xs focus:ring-1 focus:ring-slate-400 focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            onClick={clearFilters}
            className="md:ml-auto bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors duration-200 shrink-0"
          >
            Clear All
          </button>
        </div>

        {/* --- Tighter, Smaller Influencers Grid --- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {completeInfluencers.map((influencer) => {
            const account = influencer.social_accounts?.[0];

            return (
              <div
                key={influencer.id}
                onClick={() => navigate(`/ShowProfile/${influencer.id}`)}
                className="group bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Compact Image Container */}
                <div className="relative overflow-hidden bg-slate-100 aspect-[4/5]">
                  <img
                    src={influencer.image_url || "https://via.placeholder.com/300x400"}
                    alt={influencer.name || "Influencer"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-white/95 backdrop-blur px-2 py-1 rounded-md border border-slate-100/50 shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">
                      Verified
                    </span>
                  </div>
                </div>

                {/* Compact Content */}
                <div className="p-3 flex flex-col flex-grow">
                  <h3 className="font-bold text-sm text-slate-900 truncate">
                    {influencer.name || "Anonymous"}
                  </h3>
                  
                  <div className="flex items-center text-slate-500 text-[11px] mb-2 mt-0.5">
                    <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{influencer.location || "Remote"}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-1 text-[11px] text-slate-600 mb-3">
                    <p><span className="font-medium text-slate-800">Age:</span> {influencer.age || "N/A"}</p>
                    {/* 👇 CRASH FIXED HERE 👇 */}
                    <p><span className="font-medium text-slate-800">Gender:</span> {influencer.gender?.charAt(0) || "-"}</p>
                    <p className="col-span-2 truncate"><span className="font-medium text-slate-800">Lang:</span> {influencer.language || "N/A"}</p>
                  </div>

                  <div className="mt-auto pt-2 border-t border-slate-50 flex items-end justify-between">
                    {account ? (
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase font-semibold">Starts at</p>
                        <p className="font-bold text-slate-900 text-sm">
                          Rs. {account.price}
                        </p>
                      </div>
                    ) : (
                      <p className="text-[10px] italic text-slate-400">N/A</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {completeInfluencers.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-400 bg-white border border-slate-100 rounded-xl shadow-sm">
              <svg className="w-10 h-10 mb-3 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-sm font-medium text-slate-600">No complete profiles found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfluencersPage;