import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';


// --- Types ---
type Campaign = {
  id: number;
  name: string;
};

type MeetingResponse = {
  id: number;
  status: string;
  reason?: string;
  profile?: { id: number; name: string };
};

type Meeting = {
  id: number;
  meeting_type: string;
  date_time: string;
  location_link: string;
  notes: string;
  campaign: Campaign;
  meeting_responses?: MeetingResponse[]; // Seen by brands
  my_response?: MeetingResponse; // Seen by influencers
};

const API_URL = 'http://localhost:3000';

const Meetings: React.FC = () => {
  const { user, token } = useAuth();
  const role = user?.role?.toLowerCase();
  const authHeaders = { Authorization: token };

  const [profileId, setProfileId] = useState<number | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [brandCampaigns, setBrandCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Brand Form State ---
  const [campaignId, setCampaignId] = useState('');
  const [meetingType, setMeetingType] = useState('online');
  const [dateTime, setDateTime] = useState('');
  const [locationLink, setLocationLink] = useState('');
  const [notes, setNotes] = useState('');

  // --- Influencer Response State ---
  const [denyingMeetingId, setDenyingMeetingId] = useState<number | null>(null);
  const [denyReason, setDenyReason] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchMeetings();
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
    }
  };

  const fetchBrandCampaigns = async (id: number) => {
    try {
      const res = await axios.get(`${API_URL}/profiles/${id}/campaigns`, { headers: authHeaders });
      setBrandCampaigns(res.data);
      if (res.data.length > 0) setCampaignId(res.data[0].id.toString());
    } catch (error) {
      console.error('Failed to load campaigns for dropdown', error);
    }
  };

  const fetchMeetings = async () => {
    try {
      const res = await axios.get(`${API_URL}/meetings`, { headers: authHeaders });
      setMeetings(res.data);
    } catch (error) {
      console.error('Failed to load meetings', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Brand Actions ---
  const createMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_URL}/meetings`,
        {
          meeting: {
            campaign_id: parseInt(campaignId),
            meeting_type: meetingType,
            date_time: dateTime,
            location_link: locationLink,
            notes: notes,
          },
        },
        { headers: authHeaders }
      );
      fetchMeetings();
      setDateTime('');
      setLocationLink('');
      setNotes('');
      alert('Meeting created successfully! 🎉');
    } catch (error) {
      console.error('Failed to create meeting', error);
      alert('Error creating meeting. Please check inputs.');
    }
  };

  const deleteMeeting = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this meeting?')) return;
    try {
      await axios.delete(`${API_URL}/meetings/${id}`, { headers: authHeaders });
      setMeetings(meetings.filter((m) => m.id !== id));
    } catch (error) {
      console.error('Failed to delete meeting', error);
    }
  };

  // --- Influencer Actions ---
  const submitResponse = async (meetingId: number, status: 'accepted' | 'denied') => {
    if (status === 'denied' && !denyReason.trim()) {
      alert('Please provide a reason for denying.');
      return;
    }
    try {
      await axios.post(
        `${API_URL}/meetings/${meetingId}/respond`,
        { status, reason: denyReason },
        { headers: authHeaders }
      );
      fetchMeetings(); // Refresh to update response state
      setDenyingMeetingId(null);
      setDenyReason('');
    } catch (error) {
      console.error('Failed to respond to meeting', error);
      alert('Failed to submit response.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-gray-500 font-medium">Loading meetings...</div>;
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
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f172a] tracking-tight">Manage Meetings</h1>
            </div>

            {/* Create Meeting Form */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h2 className="font-bold text-[#0f172a] mb-4 text-lg">Schedule a Meeting</h2>
              <form onSubmit={createMeeting} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600 uppercase">Select Campaign</label>
                    <select
                      value={campaignId}
                      onChange={(e) => setCampaignId(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                    >
                      <option value="" disabled>Select a campaign...</option>
                      {brandCampaigns.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600 uppercase">Meeting Type</label>
                    <select
                      value={meetingType}
                      onChange={(e) => setMeetingType(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                    >
                      <option value="online">Online</option>
                      <option value="physical">Physical</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600 uppercase">Date & Time</label>
                    <input
                      type="datetime-local"
                      value={dateTime}
                      onChange={(e) => setDateTime(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600 uppercase">Link or Location Address</label>
                    <input
                      type="text"
                      placeholder="Zoom link or Cafe Name"
                      value={locationLink}
                      onChange={(e) => setLocationLink(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-semibold text-gray-600 uppercase">Notes / Purpose</label>
                    <textarea
                      placeholder="What is this meeting about?"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      required
                      rows={3}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 resize-none"
                    />
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition duration-200">
                    Schedule Meeting
                  </button>
                </div>
              </form>
            </div>

            {/* Brand Meetings List */}
            <div className="space-y-4">
              <h2 className="font-bold text-[#0f172a] text-xl">Scheduled Meetings</h2>
              {meetings.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 border border-dashed border-gray-300 rounded-3xl">
                  <p className="text-gray-500 font-medium">No meetings scheduled yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {meetings.map((meeting) => (
                    <div key={meeting.id} className="bg-white border border-gray-200 flex flex-col justify-between rounded-3xl p-6 shadow-sm">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold px-3 py-1 rounded-full capitalize">
                            {meeting.meeting_type}
                          </span>
                          <button onClick={() => deleteMeeting(meeting.id)} className="text-gray-400 hover:text-red-600 p-1">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                          </button>
                        </div>
                        <h3 className="font-bold text-lg text-[#0f172a] mb-1">Campaign: {meeting.campaign.name}</h3>
                        <p className="text-gray-500 text-sm font-medium mb-3">
                          {new Date(meeting.date_time).toLocaleString()} • {meeting.location_link}
                        </p>
                        <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-xl border border-gray-100 mb-4">{meeting.notes}</p>
                      </div>

                      {/* Brand views Influencer Responses at the bottom */}
                      <div className="border-t border-gray-100 pt-4 mt-2">
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Influencer Responses</h4>
                        {meeting.meeting_responses?.length === 0 ? (
                           <p className="text-xs text-gray-400 italic">No responses yet</p>
                        ) : (
                          <div className="space-y-2">
                            {meeting.meeting_responses?.map((res) => (
                              <div key={res.id} className="bg-gray-50 p-2 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-gray-100">
                                <span className="text-sm font-semibold text-gray-700">{res.profile?.name}</span>
                                <div className="flex flex-col sm:items-end">
                                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${res.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                    {res.status.toUpperCase()}
                                  </span>
                                  {res.status === 'denied' && (
                                    <span className="text-xs text-red-500 mt-1 italic">Reason: {res.reason}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
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
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f172a] tracking-tight">Campaign Meetings</h1>
            </div>
            
            {meetings.length === 0 ? (
              <div className="text-center py-12 bg-white border border-gray-200 rounded-3xl shadow-sm">
                <p className="text-gray-500 font-medium">No meetings scheduled for the campaigns you've applied to.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {meetings.map((meeting) => (
                  <div key={meeting.id} className="bg-white border border-gray-200 flex flex-col justify-between rounded-3xl p-6 shadow-sm">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                         <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold px-3 py-1 rounded-full capitalize">
                            {meeting.meeting_type}
                          </span>
                          {meeting.my_response && (
                             <span className={`text-xs font-bold px-3 py-1 rounded-full ${meeting.my_response.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                              {meeting.my_response.status.toUpperCase()}
                            </span>
                          )}
                      </div>
                      <h3 className="font-bold text-lg text-[#0f172a] mb-1">Campaign: {meeting.campaign.name}</h3>
                      <p className="text-gray-500 text-sm font-medium mb-3">
                        {new Date(meeting.date_time).toLocaleString()} • {meeting.location_link}
                      </p>
                      <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-xl border border-gray-100 mb-6">{meeting.notes}</p>
                    </div>

                    {/* Influencer Actions */}
                    {!meeting.my_response ? (
                      denyingMeetingId === meeting.id ? (
                        <div className="bg-red-50 p-3 rounded-xl border border-red-100 space-y-2">
                          <input 
                            type="text" 
                            placeholder="Why are you denying this meeting?" 
                            className="w-full text-sm p-2 border border-red-200 rounded-lg focus:outline-none"
                            value={denyReason}
                            onChange={(e) => setDenyReason(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <button onClick={() => submitResponse(meeting.id, 'denied')} className="flex-1 bg-red-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-red-700">Submit Denial</button>
                            <button onClick={() => setDenyingMeetingId(null)} className="flex-1 bg-gray-200 text-gray-700 text-xs font-bold py-2 rounded-lg hover:bg-gray-300">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <button onClick={() => submitResponse(meeting.id, 'accepted')} className="flex-1 bg-emerald-600 text-white font-bold text-sm py-3 rounded-xl hover:bg-emerald-700 transition">Accept</button>
                          <button onClick={() => setDenyingMeetingId(meeting.id)} className="flex-1 bg-white border-2 border-red-200 text-red-600 font-bold text-sm py-3 rounded-xl hover:bg-red-50 transition">Deny</button>
                        </div>
                      )
                    ) : (
                      <div className="text-center py-3 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-sm font-medium text-gray-500">You have {meeting.my_response.status} this meeting.</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Meetings;