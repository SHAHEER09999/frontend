import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// --- Types ---
type CampaignApplication = {
  id: number;
  profile: {
    id: number;
    name: string;
  };
};

type Campaign = {
  id: number;
  name: string;
  platform: string;
  budget: string;
  description: string;
  profile?: {
    id: number;
    name: string;
  };
  campaign_applications?: CampaignApplication[];
};

const API_URL = 'http://localhost:3000';

const Campaigns: React.FC = () => {
  // --- Auth & Role State ---
  const { user, token } = useAuth();
  const role = user?.role?.toLowerCase();
  const authHeaders = { Authorization: token };

  // --- Shared State ---
  const [profileId, setProfileId] = useState<number | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Brand Form State ---
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (role === 'brand') {
      fetchProfile();
    } else if (role === 'influencer') {
      fetchInfluencerCampaigns();
    } else {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    if (role === 'brand' && profileId) {
      fetchBrandCampaigns(profileId);
    }
  }, [profileId, role]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/profile`, { headers: authHeaders });
      setProfileId(res.data.id);
    } catch (error) {
      console.error('Failed to load profile', error);
      setLoading(false);
    }
  };

  const fetchBrandCampaigns = async (id: number) => {
    try {
      const res = await axios.get(`${API_URL}/profiles/${id}/campaigns`, { headers: authHeaders });
      setCampaigns(res.data);
    } catch (error) {
      console.error('Failed to load brand campaigns', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to randomize array elements (Fisher-Yates shuffle)
  const shuffleArray = (array: any[]) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const fetchInfluencerCampaigns = async () => {
    try {
      const res = await axios.get(`${API_URL}/campaigns`, { headers: authHeaders });
      let fetchedCampaigns = res.data;

      // Check if campaigns are more than 10, if so, randomize and pick 10
      if (fetchedCampaigns.length > 10) {
        fetchedCampaigns = shuffleArray(fetchedCampaigns).slice(0, 10);
      }

      setCampaigns(fetchedCampaigns);
    } catch (error) {
      console.error('Failed to load influencer campaigns', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Actions ---
  const createCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileId) return;

    try {
      await axios.post(
        `${API_URL}/profiles/${profileId}/campaigns`,
        {
          campaign: { name, platform, budget, description },
        },
        { headers: authHeaders }
      );
      
      fetchBrandCampaigns(profileId);
      setName('');
      setPlatform('instagram');
      setBudget('');
      setDescription('');
    } catch (error) {
      console.error('Failed to create campaign', error);
      alert('Error creating campaign. Please check your inputs.');
    }
  };

  const deleteCampaign = async (campaignId: number) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;

    try {
      await axios.delete(`${API_URL}/campaigns/${campaignId}`, { headers: authHeaders });
      // Update UI immediately without needing to refetch
      setCampaigns(prevCampaigns => prevCampaigns.filter(c => c.id !== campaignId));
    } catch (error) {
      console.error('Failed to delete campaign', error);
      alert('Error deleting campaign. Please try again.');
    }
  };

  const applyToCampaign = async (campaignId: number) => {
    try {
      await axios.post(
        `${API_URL}/campaigns/${campaignId}/campaign_applications`,
        {},
        { headers: authHeaders }
      );
      alert('Applied successfully! 🎉');
    } catch (error: any) {
      alert(error.response?.data?.errors || 'Already applied to this campaign');
    }
  };

  // --- Rendering ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 font-medium">
        Loading campaigns...
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* ========================================= */}
        {/* BRAND VIEW                                */}
        {/* ========================================= */}
        {role === 'brand' && (
          <>
            <div className="flex items-center justify-between pb-2">
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f172a] tracking-tight">
                Manage Your Campaigns
              </h1>
            </div>
            
            {/* Create Campaign Card */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h2 className="font-bold text-[#0f172a] mb-4 text-lg">Create New Campaign</h2>
              <form onSubmit={createCampaign} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600 uppercase">Campaign Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Summer Product Launch" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      required 
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600 uppercase">Budget ($)</label>
                    <input 
                      type="number" 
                      placeholder="e.g., 500" 
                      value={budget} 
                      onChange={(e) => setBudget(e.target.value)} 
                      required 
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-semibold text-gray-600 uppercase">Platform</label>
                    <select 
                      value={platform} 
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                    >
                      <option value="instagram">Instagram</option>
                      <option value="youtube">YouTube</option>
                      <option value="tiktok">TikTok</option>
                    </select>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-semibold text-gray-600 uppercase">Description</label>
                    <textarea 
                      placeholder="Describe what you are looking for..." 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)} 
                      required 
                      rows={4} 
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 resize-none"
                    />
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <button 
                    type="submit" 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition duration-200"
                  >
                    Publish Campaign
                  </button>
                </div>
              </form>
            </div>

            {/* Active Campaigns List */}
            <div className="space-y-4">
              <h2 className="font-bold text-[#0f172a] text-xl">Your Active Campaigns</h2>
              
              {campaigns.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 border border-dashed border-gray-300 rounded-3xl">
                  <p className="text-gray-500 font-medium">You haven't created any campaigns yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="bg-white border border-gray-200 flex flex-col justify-between rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-200">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-lg text-[#0f172a] line-clamp-1">{campaign.name}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                              PKR {campaign.budget}
                            </span>
                            <button 
                              onClick={() => deleteCampaign(campaign.id)}
                              className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full transition-colors"
                              title="Delete Campaign"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="inline-block bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold px-3 py-1 rounded-full mb-4 capitalize">
                          {campaign.platform}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                          {campaign.description}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                          Applicants ({campaign.campaign_applications?.length || 0})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {campaign.campaign_applications?.length ? (
                            campaign.campaign_applications.map(app => (
                              <span key={app.id} className="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                                {app.profile.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-400 italic">No applicants yet</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ========================================= */}
        {/* INFLUENCER VIEW                           */}
        {/* ========================================= */}
        {role === 'influencer' && (
          <>
            <div className="flex items-center justify-between pb-2">
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f172a] tracking-tight">
                Available Campaigns
              </h1>
            </div>

            {campaigns.length === 0 ? (
              <div className="text-center py-12 bg-white border border-gray-200 rounded-3xl shadow-sm">
                <p className="text-gray-500 font-medium">No campaigns available at the moment. Check back later!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="bg-white border border-gray-200 flex flex-col justify-between rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-200">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          {campaign.profile?.name || 'Unknown Brand'}
                        </span>
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                          PKR {campaign.budget}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-lg text-[#0f172a] mb-3 line-clamp-2">
                        {campaign.name}
                      </h3>
                      
                      <div className="inline-block bg-[#edf2ff] text-[#4f46e5] border border-[#dbe4ff] text-xs font-bold px-3 py-1 rounded-full mb-4 capitalize">
                        {campaign.platform}
                      </div>
                      
                      <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                        {campaign.description}
                      </p>
                    </div>

                    <button 
                      onClick={() => applyToCampaign(campaign.id)} 
                      className="w-full bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-sm px-5 py-3 rounded-xl transition duration-200"
                    >
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Fallback if role is missing or invalid */}
        {!['brand', 'influencer'].includes(role || '') && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
            <h3 className="font-bold mb-2">Authentication Error</h3>
            <p className="text-sm">Invalid or missing user role. Please log out and log in again.</p>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default Campaigns;