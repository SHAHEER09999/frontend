import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

type Campaign = { id: number; name: string };
type ChatBrand = { conversation_id: number; brand_id: number; brand_name: string };
type MeetingResponse = { id: number; status: string; reason?: string; profile?: { id: number; name: string } };

type Meeting = {
  id: number;
  meeting_type: string;
  date_time: string;
  location_link: string;
  notes: string;
  campaign_id?: number;
  conversation_id?: number;
  campaign?: Campaign;
  conversation?: {
    brand?: { profile?: { name: string } };
    influencer?: { profile?: { name: string } };
  };
  meeting_responses?: MeetingResponse[];
};

const API_URL = 'http://localhost:3000';

const Meetings: React.FC = () => {
  const { user, token } = useAuth();
  const role = user?.role?.toLowerCase();
  const authHeaders = { Authorization: token };

  const [profileId, setProfileId] = useState<number | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [brandCampaigns, setBrandCampaigns] = useState<Campaign[]>([]);
  const [chatBrands, setChatBrands] = useState<ChatBrand[]>([]);
  const [targetId, setTargetId] = useState('');
  const [meetingType, setMeetingType] = useState('online');
  const [dateTime, setDateTime] = useState('');
  const [locationLink, setLocationLink] = useState('');
  const [notes, setNotes] = useState('');

  // Response State
  const [denyingMeetingId, setDenyingMeetingId] = useState<number | null>(null);
  const [denyReason, setDenyReason] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchMeetings();
  }, [role]);

  useEffect(() => {
    if (role === 'brand' && profileId) {
      fetchBrandCampaigns(profileId);
    } else if (role === 'influencer' && profileId) {
      fetchChatBrands();
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
      if (res.data.length > 0) setTargetId(res.data[0].id.toString());
    } catch (error) {
      console.error('Failed to load campaigns', error);
    }
  };

  const fetchChatBrands = async () => {
    try {
      const res = await axios.get(`${API_URL}/meetings/chat_brands`, { headers: authHeaders });
      setChatBrands(res.data);
      if (res.data.length > 0) setTargetId(res.data[0].conversation_id.toString());
    } catch (error) {
      console.error('Failed to load chat brands', error);
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

  const createMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (role === 'brand') {
        await axios.post(
          `${API_URL}/meetings`,
          {
            meeting: {
              campaign_id: parseInt(targetId),
              meeting_type: meetingType,
              date_time: dateTime,
              location_link: locationLink,
              notes: notes,
            },
          },
          { headers: authHeaders }
        );
      } else {
        await axios.post(
          `${API_URL}/meetings/create_chat_meeting`,
          {
            conversation_id: parseInt(targetId),
            meeting_type: meetingType,
            date_time: dateTime,
            location_link: locationLink,
            notes: notes,
          },
          { headers: authHeaders }
        );
      }
      
      fetchMeetings();
      setDateTime('');
      setLocationLink('');
      setNotes('');
      setShowForm(false);
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
      fetchMeetings();
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

  // Split meetings into two arrays for the UI
  const myCreatedMeetings = meetings.filter((m) => (role === 'brand' && m.campaign_id) || (role === 'influencer' && m.conversation_id));
  const meetingRequests = meetings.filter((m) => !((role === 'brand' && m.campaign_id) || (role === 'influencer' && m.conversation_id)));

  return (
    <div className="h-full w-full overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar bg-white">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">Meeting Center</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`font-bold text-xs px-4 py-2 rounded-lg transition duration-200 shadow-sm ${
              showForm 
                ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                : 'bg-teal-600 hover:bg-teal-700 text-white'
            }`}
          >
            {showForm ? 'Cancel' : '+ New Meeting'}
          </button>
        </div>

        {/* Create Meeting Form */}
        {showForm && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm transition duration-300">
            <h2 className="font-bold text-gray-800 mb-4 text-base">Schedule a Meeting</h2>
            <form onSubmit={createMeeting} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    {role === 'brand' ? 'Select Campaign' : 'Select Brand Chat'}
                  </label>
                  <select
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="" disabled>Select an option...</option>
                    {role === 'brand' 
                      ? brandCampaigns.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)
                      : chatBrands.map((cb) => <option key={cb.conversation_id} value={cb.conversation_id}>{cb.brand_name}</option>)
                    }
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Meeting Type</label>
                  <select
                    value={meetingType}
                    onChange={(e) => setMeetingType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="online">Online</option>
                    <option value="physical">Physical</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Link or Location</label>
                  <input
                    type="text"
                    placeholder="Zoom link or Location Name"
                    value={locationLink}
                    onChange={(e) => setLocationLink(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Notes / Purpose</label>
                  <textarea
                    placeholder="What is this meeting about?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    required
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white resize-none"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition duration-200">
                  Schedule Meeting
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Dual Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Column 1: Meetings You Created */}
          <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              Meetings You Created
            </h2>
            <div className="space-y-3">
              {myCreatedMeetings.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-6">You haven't scheduled any meetings.</p>
              ) : (
                myCreatedMeetings.map((meeting) => (
                  <div key={meeting.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-teal-50 text-teal-700 border border-teal-100 text-[10px] font-bold px-2 py-0.5 rounded-md capitalize">
                        {meeting.meeting_type}
                      </span>
                      <button onClick={() => deleteMeeting(meeting.id)} className="text-gray-300 hover:text-red-500 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    
                    <h3 className="font-bold text-sm text-gray-800 truncate">
                      {meeting.campaign_id ? `Campaign: ${meeting.campaign?.name}` : 'Chat Direct Meeting'}
                    </h3>
                    
                    <p className="text-gray-500 text-xs font-medium mb-2 mt-1">
                      {new Date(meeting.date_time).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })} <br/> 
                      <span className="text-gray-400">{meeting.location_link}</span>
                    </p>
                    <p className="text-gray-600 text-xs bg-gray-50 p-2 rounded-lg border border-gray-100 mb-3 line-clamp-2">{meeting.notes}</p>

                    <div className="border-t border-gray-100 pt-3">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Partner Responses</h4>
                      {(!meeting.meeting_responses || meeting.meeting_responses.length === 0) ? (
                        <p className="text-[11px] text-gray-400 italic">No responses yet</p>
                      ) : (
                        <div className="space-y-1.5">
                          {meeting.meeting_responses.map((res) => (
                            <div key={res.id} className="bg-gray-50 px-2 py-1.5 rounded flex items-center justify-between gap-2 border border-gray-100">
                              <span className="text-[11px] font-semibold text-gray-600 truncate">{res.profile?.name}</span>
                              <div className="flex items-center gap-1">
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${res.status === 'accepted' ? 'bg-teal-100 text-teal-700' : 'bg-red-100 text-red-700'}`}>
                                  {res.status.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 2: Meeting Requests */}
          <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400"></span>
              Meeting Requests
            </h2>
            <div className="space-y-3">
              {meetingRequests.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-6">No incoming meeting requests.</p>
              ) : (
                meetingRequests.map((meeting) => {
                  const myResponse = meeting.meeting_responses?.find((res) => res.profile?.id === profileId);

                  return (
                    <div key={meeting.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-gray-100 text-gray-600 border border-gray-200 text-[10px] font-bold px-2 py-0.5 rounded-md capitalize">
                          {meeting.meeting_type}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-sm text-gray-800 truncate">
                        {meeting.campaign_id ? `Campaign: ${meeting.campaign?.name}` : 'Chat Direct Meeting'}
                      </h3>
                      
                      <p className="text-gray-500 text-xs font-medium mb-2 mt-1">
                        {new Date(meeting.date_time).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })} <br/> 
                        <span className="text-teal-600">{meeting.location_link}</span>
                      </p>
                      <p className="text-gray-600 text-xs bg-gray-50 p-2 rounded-lg border border-gray-100 mb-3">{meeting.notes}</p>

                      <div className="mt-1 border-t border-gray-100 pt-3">
                        {!myResponse ? (
                          denyingMeetingId === meeting.id ? (
                            <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 space-y-2">
                              <input 
                                type="text" 
                                placeholder="Reason for denial..." 
                                className="w-full text-xs p-1.5 border border-gray-300 rounded focus:outline-none focus:border-red-400 bg-white"
                                value={denyReason}
                                onChange={(e) => setDenyReason(e.target.value)}
                              />
                              <div className="flex gap-1.5">
                                <button onClick={() => submitResponse(meeting.id, 'denied')} className="flex-1 bg-red-500 text-white text-[10px] font-bold py-1.5 rounded hover:bg-red-600 transition">Submit Denial</button>
                                <button onClick={() => setDenyingMeetingId(null)} className="flex-1 bg-gray-200 text-gray-600 text-[10px] font-bold py-1.5 rounded hover:bg-gray-300 transition">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button onClick={() => submitResponse(meeting.id, 'accepted')} className="flex-1 bg-teal-600 text-white font-bold text-xs py-2 rounded-lg hover:bg-teal-700 transition">Accept</button>
                              <button onClick={() => setDenyingMeetingId(meeting.id)} className="flex-1 bg-white border border-gray-300 text-gray-600 font-bold text-xs py-2 rounded-lg hover:bg-gray-50 transition">Deny</button>
                            </div>
                          )
                        ) : (
                          <div className="text-center py-2 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-xs font-medium text-gray-500">
                              Status: <span className={`font-bold ${myResponse.status === 'accepted' ? 'text-teal-600' : 'text-red-500'}`}>{myResponse.status.toUpperCase()}</span>
                            </p>
                            {myResponse.status === 'denied' && <p className="text-[10px] text-gray-400 mt-0.5">Reason: {myResponse.reason}</p>}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Meetings;