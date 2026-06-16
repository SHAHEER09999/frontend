import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = "http://localhost:3000";

interface SocialAccount {
  id: number;
  platform: string;
  username: string;
  price: string | number | null;
  followers?: string | number;
}

interface Category {
  id: number;
  categories: string;
}

interface InfluencerProfile {
  id: number;
  user_id: number;
  name: string;
  age: number;
  gender: string;
  language: string;
  location_website: string;
  delivery_time: string;
  description?: string;
  image_url: string | null;
  social_accounts: SocialAccount[];
  categories: Category[];
  reviews?: {
    id: number;
    user_name: string;
    comment: string;
    created_at: string;
  }[];
}

const ShowProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<InfluencerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [feedbackText, setFeedbackText] = useState("");

  // --- REPORT FEATURE STATE ---
  const [reportText, setReportText] = useState("");
  const [reportFiles, setReportFiles] = useState<File[]>([]);
  const [showReportBox, setShowReportBox] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/public_influencers/${id}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProfile();
  }, [id]);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to perform this action. Please log in or sign up.");
      return false;
    }
    return true;
  };

  // --- REPORT SUBMISSION LOGIC ---
  const handleReportClick = () => {
    if (!checkAuth()) return;
    setShowReportBox(true); // Open the modal
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setReportFiles((prevFiles) => [...prevFiles, ...newFiles]);
    e.target.value = ""; 
  };

  const removeFile = (indexToRemove: number) => {
    setReportFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleChat = async () => {
    if (!checkAuth()) return;
    if (!profile) {
      alert("Profile not loaded yet.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formattedToken = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;

      const response = await axios.post(
        `${API_URL}/conversations`,
        {
          influencer_id: profile.user_id // ✅ Changed from profile.id to profile.user_id
        },
        {
          headers: {
            Authorization: formattedToken,
            Accept: "application/json"
          }
        }
      );

      if (response.data && response.data.id) {
        navigate(`/User-Dashboard/chats/${response.data.id}`);
      } else {
        console.error("Backend returned an empty conversation ID:", response.data);
        alert("Failed to initialize chat session properly.");
      }
    } catch (error: any) {
      console.error("Chat initiation failed:", error);
      if (error.response?.data?.errors) {
        alert(`Unable to start chat: ${error.response.data.errors.join(", ")}`);
      } else {
        alert("Unable to start chat. Please try again.");
      }
    }
  };

  const submitReport = async () => {
    if (!checkAuth()) return;

    if (!reportText.trim()) {
      alert("Please write a reason for the report.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      // ✅ Handle Bearer formatting cleanly
      const formattedToken = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;
      
      const formData = new FormData();
      formData.append("description", reportText);

      reportFiles.forEach(file => {
        formData.append("images[]", file);
      });

      await axios.post(
        `${API_URL}/profiles/${id}/reports`,
        formData,
        {
          headers: {
            Authorization: formattedToken,
            "Content-Type": "multipart/form-data",
            Accept: "application/json" // 👈 Added: Ensures Devise treats it as an API call
          }
        }
      );

      alert("Report submitted successfully. Our team will review it.");
      setReportText("");
      setReportFiles([]);
      setShowReportBox(false);

    } catch (err) {
      console.error(err);
      alert("Failed to submit report. Please try again.");
    }
  };

  // --- FEEDBACK SUBMISSION LOGIC ---
  const handleSubmitFeedback = async () => {
    if (!checkAuth()) return;

    if (!feedbackText.trim()) {
      alert("Please write some feedback before submitting.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      // ✅ Handle Bearer formatting cleanly
      const formattedToken = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;

      await axios.post(
        `${API_URL}/profiles/${id}/feedbacks`,
        {
          feedback: {
            comment: feedbackText,
            rating: 5
          }
        },
        {
          headers: {
            Authorization: formattedToken,
            Accept: "application/json" // 👈 CRITICAL FIX: Stops Rails from processing "as HTML"
          }
        }
      );

      alert("Thank you for your feedback!");
      setFeedbackText("");
      window.location.reload();

    } catch (err) {
      console.error(err);
      alert("Failed to submit feedback");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Profile not found.</div>;
  }

  const prices = profile.social_accounts
    ?.map(acc => Number(acc.price))
    .filter(p => !isNaN(p) && p > 0) || [];
  const startingPrice = prices.length > 0 ? Math.min(...prices) : null;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Influencers
        </button>

        {/* MAIN PROFILE TOP SECTION */}
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* LEFT COLUMN: Photo & Description */}
          <div className="w-full md:w-5/12 space-y-6">
            <div className="flex justify-between items-center pr-2">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                {profile.name}
              </h1>
              <button 
                onClick={handleReportClick}
                className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-semibold"
                title="Report this user"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
                <span className="hidden sm:inline">Report</span>
              </button>
            </div>

            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
              <img 
                src={profile.image_url || "https://via.placeholder.com/600x800?text=No+Image"} 
                alt={profile.name}
                className="w-full aspect-[4/5] object-cover rounded-xl"
              />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-lg mb-3">About Me</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {profile.description || "No description provided."}
              </p>
              
              {profile.categories && profile.categories.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-slate-800 mb-2">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.categories.map((cat, index) => (
                      <span key={index} className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">
                        {cat.categories || "Category"}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Details & Social Accounts */}
          <div className="w-full md:w-7/12 space-y-6 md:mt-[3.25rem]">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">
                Profile Details
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Gender</p>
                  <p className="font-semibold text-slate-800">{profile.gender || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Age</p>
                  <p className="font-semibold text-slate-800">{profile.age ? `${profile.age} years old` : "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Location</p>
                  <div className="flex items-center font-semibold text-slate-800">
                    <svg className="w-4 h-4 mr-1.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {profile.location_website || "N/A"}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Languages</p>
                  <p className="font-semibold text-slate-800">{profile.language || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Delivery Time</p>
                  <p className="font-semibold text-slate-800">{profile.delivery_time || "N/A"} Days</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <div className="text-center mb-6">
                <p className="text-slate-500 font-medium mb-2">Starting Price</p>
                <p className="text-4xl font-extrabold text-indigo-600">
                  {startingPrice ? `Rs. ${startingPrice}` : "N/A"}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="font-bold text-lg mb-4">Social Accounts</h3>
                {profile.social_accounts && profile.social_accounts.length > 0 ? (
                  <div className="space-y-3">
                    {profile.social_accounts.map((account) => (
                      <div key={account.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div>
                          <p className="font-bold text-slate-800 capitalize">{account.platform}</p>
                          <p className="text-sm text-slate-500">@{account.username}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-indigo-600">
                            {account.price ? `Rs. ${account.price}` : "N/A"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">No social accounts connected yet.</p>
                )}
              </div>

              <button
                onClick={handleChat}
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >            
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Chat with {profile.name}
              </button>
            </div>
          </div>
        </div>

        {/* FEEDBACK SECTION */}
        <div className="mt-10 flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-5/12">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-lg mb-3">Leave Feedback</h3>
              <textarea 
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4} 
                className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none mb-3"
                placeholder="Write your review here..."
              ></textarea>
              <button 
                onClick={handleSubmitFeedback}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm px-4 py-3 rounded-lg transition-colors"
              >
                Submit Feedback
              </button>
            </div>
          </div>

          <div className="w-full md:w-7/12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 h-full">
              <h3 className="font-bold text-xl text-slate-900 border-b border-slate-100 pb-4 mb-6">
                Past Feedback
              </h3>
              
              {profile.reviews && profile.reviews.length > 0 ? (
                <div className="space-y-6">
                  {profile.reviews.map((review) => (
                    <div key={review.id} className="border-b border-slate-50 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-800">{review.user_name}</span>
                        <span className="text-xs text-slate-400">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        "{review.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <p className="text-slate-400 italic">No feedback has been left yet.</p>
                  <p className="text-sm text-slate-500 mt-1">Be the first to share your experience!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- REPORT MODAL OVERLAY --- */}
        {showReportBox && (
          <div className="fixed inset-0 bg-slate-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl border border-slate-200">
              
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Report Influencer
              </h2>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Why are you reporting this profile?
              </label>
              <textarea
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Please provide specific details..."
                className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none resize-none mb-4"
                rows={4}
              />

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Attach Evidence (Images/Screenshots)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 transition-colors cursor-pointer"
                />

                {reportFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-semibold text-slate-500">Attached Files:</p>
                    <ul className="max-h-32 overflow-y-auto space-y-1">
                      {reportFiles.map((file, index) => (
                        <li key={index} className="flex items-center justify-between bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md">
                          <span className="text-xs text-slate-600 truncate mr-2">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 font-bold text-lg leading-none"
                            title="Remove file"
                          >
                            &times;
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  onClick={() => setShowReportBox(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReport}
                  className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  Submit Report
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ShowProfile;