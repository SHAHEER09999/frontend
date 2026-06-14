import React, { useEffect, useState } from "react";
import { Trash2, ExternalLink } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:3000";

const PLATFORMS = [
  { key: "instagram", label: "Instagram", icon: "📸", baseUrl: "https://instagram.com/" },
  { key: "tiktok", label: "TikTok", icon: "🎵", baseUrl: "https://tiktok.com/@" },
];

const Profile = () => {
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  // YouTube verification state
  const [youtubeUsername, setYoutubeUsername] = useState("");
  const [youtubeLoading, setYoutubeLoading] = useState(false);
  const [youtubeError, setYoutubeError] = useState("");

  // Instagram/TikTok state
  const [socialInputs, setSocialInputs] = useState<Record<string, string>>({
    instagram: "",
    tiktok: "",
  });
  const [socialLoading, setSocialLoading] = useState<Record<string, boolean>>({
    instagram: false,
    tiktok: false,
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location_website: "",
    language: "",
    age: "",
    delivery_time: "",
    gender: "",
    price: "", // Unified global price
  });

  const token = localStorage.getItem("token");

  const authHeaders = {
    Authorization: token,
  };

  const fetchCategories = async () => {
    const res = await axios.get(`${API_URL}/categories/options`);
    setAllCategories(res.data);
  };

  const fetchProfile = async () => {
    const res = await axios.get(`${API_URL}/profile`, {
      headers: authHeaders,
    });

    const data = res.data;
    setProfile(data);

    // Find the price from ANY existing social account to use globally
    const existingPrice = data.social_accounts?.find((a: any) => a.price)?.price || "";

    setFormData({
      name: data.name || "",
      description: data.description || "",
      location_website: data.location_website || "",
      language: data.language || "",
      age: data.age || "",
      delivery_time: data.delivery_time || "",
      gender: data.gender || "",
      price: existingPrice, 
    });

    setSelectedCategories(
      data.categories?.map((c: any) => c.categories) || []
    );

    const youtube = data.social_accounts?.find(
      (a: any) => a.platform?.toLowerCase() === "youtube"
    );
    if (youtube) {
      setYoutubeUsername(`@${youtube.username}`);
    }

    const instagram = data.social_accounts?.find(
      (a: any) => a.platform?.toLowerCase() === "instagram"
    );
    const tiktok = data.social_accounts?.find(
      (a: any) => a.platform?.toLowerCase() === "tiktok"
    );

    setSocialInputs({
      instagram: instagram ? `@${instagram.username}` : "",
      tiktok: tiktok ? `@${tiktok.username}` : "",
    });
  };

  useEffect(() => {
    fetchProfile();
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const payload = new FormData();

      payload.append("profile[name]", formData.name);
      payload.append("profile[description]", formData.description);
      payload.append("profile[location_website]", formData.location_website);
      payload.append("profile[language]", formData.language);
      payload.append("profile[age]", formData.age);
      payload.append("profile[delivery_time]", formData.delivery_time);
      payload.append("profile[gender]", formData.gender);

      if (imageFile) {
        payload.append("profile[image]", imageFile);
      }

      selectedCategories.forEach((cat, index) => {
        payload.append(`categories[${index}]`, cat);
      });

      // 1. Update the main profile
      await axios.put(`${API_URL}/profile`, payload, {
        headers: {
          ...authHeaders,
          "Content-Type": "multipart/form-data",
        },
      });

      // 2. Sync the global price to ALL connected social accounts
      if (profile.social_accounts && profile.social_accounts.length > 0) {
        await Promise.all(
          profile.social_accounts.map((acc: any) =>
            axios.put(
              `${API_URL}/profiles/${profile.id}/social_accounts/${acc.id}`,
              { social_account: { price: formData.price || null } },
              { headers: { ...authHeaders, "Content-Type": "application/json" } }
            )
          )
        );
      }

      setIsEditing(false);
      setYoutubeError("");
      await fetchProfile();
      alert("Profile updated successfully ✅");
    } catch (error) {
      console.error(error);
      alert("Update failed ❌");
    }
  };

  const handleDeleteRequest = async () => {
    if (!window.confirm("Are you sure you want to request account deletion? An email confirmation link will be sent to you.")) {
      return;
    }
    try {
      await axios.post(
        `${API_URL}/users/request_delete`,
        {},
        { headers: authHeaders }
      );
      alert("Confirmation email sent 📧");
    } catch {
      alert("Failed ❌");
    }
  };

  const handleVerifyYouTube = async () => {
    if (!youtubeUsername.trim()) {
      setYoutubeError("Please enter your YouTube handle");
      return;
    }

    const normalizedUsername = youtubeUsername.replace(/^@/, "");

    try {
      setYoutubeLoading(true);
      setYoutubeError("");

      await axios.post(
        `${API_URL}/social_accounts/verify_and_create`,
        {
          platform: "youtube",
          username: normalizedUsername,
          price: formData.price || null // Send global price
        },
        {
          headers: {
            ...authHeaders,
            "Content-Type": "application/json",
          },
        }
      );

      await fetchProfile();
      alert("YouTube account verified successfully ✅");
    } catch (error: any) {
      setYoutubeError(
        error.response?.data?.error || "YouTube verification failed"
      );
    } finally {
      setYoutubeLoading(false);
    }
  };

  const saveSocialAccount = async (platform: string) => {
    let rawUsername = socialInputs[platform]?.trim();

    if (!rawUsername) {
      alert(`Please enter ${platform} username`);
      return;
    }

    const cleanUsername = rawUsername.replace(/^@/, "");
    const existingAccount = getSocialAccount(platform);

    try {
      setSocialLoading((prev) => ({ ...prev, [platform]: true }));

      if (existingAccount) {
        await axios.put(
          `${API_URL}/profiles/${profile.id}/social_accounts/${existingAccount.id}`,
          {
            social_account: {
              username: cleanUsername,
              price: formData.price || null // Send global price
            },
          },
          {
            headers: {
              ...authHeaders,
              "Content-Type": "application/json",
            },
          }
        );
        alert(`${platform} account updated successfully ✅`);
      } else {
        await axios.post(
          `${API_URL}/profiles/${profile.id}/social_accounts`,
          {
            social_account: {
              platform,
              username: cleanUsername,
              followers: "0",
              price: formData.price || null // Send global price
            },
          },
          {
            headers: {
              ...authHeaders,
              "Content-Type": "application/json",
            },
          }
        );
        alert(`${platform} account added successfully ✅`);
      }

      await fetchProfile();
    } catch (error: any) {
      alert(
        error.response?.data?.errors?.join(", ") ||
          `Failed to save ${platform}`
      );
    } finally {
      setSocialLoading((prev) => ({ ...prev, [platform]: false }));
    }
  };

  const deleteSocialAccount = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this social account?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/profiles/${profile.id}/social_accounts/${id}`, {
        headers: authHeaders,
      });

      await fetchProfile();
      alert("Social account deleted successfully 🗑️");
    } catch {
      alert("Failed to delete social account ❌");
    }
  };

  const getSocialAccount = (platform: string) => {
    return profile?.social_accounts?.find(
      (account: any) => account.platform?.toLowerCase() === platform
    );
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 font-medium">
        Loading...
      </div>
    );
  }

  const youtubeAccount = getSocialAccount("youtube");

  const isProfileComplete =
    profile.image_url &&
    profile.description &&
    selectedCategories.length > 0 &&
    profile.location_website;

  return (
    <div className="h-full w-full overflow-y-auto space-y-6 pr-1 custom-scrollbar">
      {/* Header View */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-2xl bg-white border border-gray-200 overflow-hidden flex items-center justify-center text-xs font-semibold text-gray-400 text-center px-2 shadow-sm">
            {profile.image_url ? (
              <img
                src={profile.image_url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              "No Photo"
            )}

            {isEditing && (
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setImageFile(e.target.files[0]);
                  }
                }}
              />
            )}
          </div>

          <div>
            {isEditing ? (
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="text-2xl font-bold text-[#0f172a] border border-gray-300 rounded-xl px-3 py-1"
              />
            ) : (
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#0f172a] tracking-tight">
                {profile.name || "Unnamed User"}
              </h2>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 sm:flex-initial bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition duration-200"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleUpdate}
                className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition duration-200"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setYoutubeError("");
                  fetchProfile();
                }}
                className="flex-1 sm:flex-initial bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-sm px-5 py-2.5 rounded-xl transition duration-200"
              >
                Cancel
              </button>
            </>
          )}

          <button
            onClick={handleDeleteRequest}
            className="bg-red-500 hover:bg-red-600 text-white font-bold text-sm px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition duration-200"
          >
            <Trash2 size={16} />
            <span className="hidden md:inline">Delete Account</span>
          </button>
        </div>
      </div>

      {/* Grid Dashboard Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* About Card */}
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col">
          <h3 className="font-bold text-[#0f172a] mb-3 text-base shrink-0">About</h3>
          {isEditing ? (
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="flex-grow w-full border border-gray-300 rounded-xl p-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          ) : (
            <p className="flex-grow text-gray-500 text-sm leading-relaxed font-medium">
              {profile.description || "Add your bio in profile settings."}
            </p>
          )}
        </div>

        {/* Stacked Categories and Details Container */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Categories Card */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex-1">
            <h3 className="font-bold text-[#0f172a] mb-3 text-base">Categories</h3>
            {isEditing ? (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {allCategories.map((cat) => {
                  const isChecked = selectedCategories.includes(cat);
                  const isDisabled =
                    !isChecked && selectedCategories.length >= 3;

                  return (
                    <label
                      key={cat}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                        isChecked
                          ? "bg-indigo-50 border-indigo-300 text-indigo-600"
                          : "bg-gray-50 border-gray-200 text-gray-600"
                      } ${isDisabled ? "opacity-40 cursor-not-allowed" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={isDisabled}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                        onChange={() => {
                          if (isChecked) {
                            setSelectedCategories(
                              selectedCategories.filter((c) => c !== cat)
                            );
                          } else {
                            setSelectedCategories([
                              ...selectedCategories,
                              cat,
                            ]);
                          }
                        }}
                      />
                      {cat}
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedCategories.length > 0 ? (
                  selectedCategories.map((cat) => (
                    <span
                      key={cat}
                      className="text-xs font-semibold text-[#4f46e5] bg-[#edf2ff] border border-[#dbe4ff] px-3 py-1.5 rounded-full"
                    >
                      {cat}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">Not set</span>
                )}
              </div>
            )}
          </div>

          {/* Demographics & Details Card */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex-1">
            <h3 className="font-bold text-[#0f172a] mb-3 text-base">Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-500">Age:</span>
                {isEditing ? (
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. 25"
                  />
                ) : (
                  <span className="font-semibold text-gray-800">{profile.age || "-"}</span>
                )}
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-500">Gender:</span>
                {isEditing ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-24 border border-gray-300 rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <span className="font-semibold text-gray-800 capitalize">{profile.gender || "-"}</span>
                )}
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-500">Language:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-24 border border-gray-300 rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. English"
                  />
                ) : (
                  <span className="font-semibold text-gray-800">{profile.language || "-"}</span>
                )}
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-500">Delivery:</span>
                {isEditing ? (
                  <input
                    type="number"
                    name="delivery_time"
                    value={formData.delivery_time}
                    onChange={handleChange}
                    className="w-24 border border-gray-300 rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. 2 Days"
                  />
                ) : (
                  <span className="font-semibold text-gray-800">{profile.delivery_time  || "-"} days</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Social Accounts Card */}
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
          
          {/* Header with Unified Price Display/Input */}
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <h3 className="font-bold text-[#0f172a] text-base">Social Accounts</h3>
            {isEditing ? (
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-gray-500">$</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Price"
                  className="w-20 text-xs font-semibold border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            ) : (
              formData.price && (
                <span className="text-sm font-extrabold text-[#4f46e5] bg-[#edf2ff] border border-[#dbe4ff] px-2.5 py-1 rounded-xl shadow-sm">
                  ${Number(formData.price).toFixed(2)}
                </span>
              )
            )}
          </div>

          {/* YouTube Box Element */}
          <div className="border border-gray-100 rounded-xl p-3 space-y-2 bg-white">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-gray-700">YouTube</span>
              <span className="text-xs text-gray-400">
                {youtubeAccount ? (
                  <a
                    href={`https://youtube.com/${youtubeAccount.username.startsWith('@') ? '' : '@'}${youtubeAccount.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    @{youtubeAccount.username.replace(/^@/, "")}
                    <ExternalLink size={12} />
                  </a>
                ) : (
                  "Not set"
                )}
              </span>
            </div>

            {youtubeAccount && (
              <div className="flex justify-between items-center mt-1">
                <span className="text-[11px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-1 rounded-md inline-block">
                  Subscribers: {Number(youtubeAccount.followers || 0).toLocaleString()}
                </span>
              </div>
            )}

            {isEditing && (
              <div className="space-y-2 pt-2 border-t border-dashed border-gray-100">
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={youtubeUsername}
                    onChange={(e) => setYoutubeUsername(e.target.value)}
                    placeholder="@Handle"
                    className="flex-1 text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <button
                    onClick={handleVerifyYouTube}
                    disabled={youtubeLoading}
                    className="bg-red-600 text-white font-bold text-xs px-4 py-1.5 rounded-lg hover:bg-red-700 transition"
                  >
                    {youtubeLoading ? "..." : "Verify & Save"}
                  </button>
                </div>
                {youtubeError && (
                  <p className="text-[11px] text-red-500 font-medium">{youtubeError}</p>
                )}
                {youtubeAccount && (
                  <button
                    onClick={() => deleteSocialAccount(youtubeAccount.id)}
                    className="text-red-500 hover:text-red-600 text-xs font-semibold block mt-1"
                  >
                    Disconnect Channel
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Instagram and TikTok Box Elements */}
          {PLATFORMS.map((platform) => {
            const account = getSocialAccount(platform.key);

            return (
              <div
                key={platform.key}
                className="border border-gray-100 rounded-xl p-3 space-y-2 bg-white"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm flex items-center gap-2 text-gray-700">
                    <span>{platform.icon}</span>
                    {platform.label}
                  </span>
                  <span className="text-xs text-gray-400">
                    {account ? (
                      <a
                        href={`${platform.baseUrl}${account.username.replace(/^@/, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1 font-medium"
                      >
                        @{account.username.replace(/^@/, "")}
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      "Not set"
                    )}
                  </span>
                </div>

                {isEditing && (
                  <div className="space-y-2 pt-2 border-t border-dashed border-gray-100">
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={socialInputs[platform.key]}
                        onChange={(e) =>
                          setSocialInputs((prev) => ({
                            ...prev,
                            [platform.key]: e.target.value,
                          }))
                        }
                        placeholder="@username"
                        className="flex-1 text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button
                        onClick={() => saveSocialAccount(platform.key)}
                        disabled={socialLoading[platform.key]}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-1.5 rounded-lg transition"
                      >
                        {socialLoading[platform.key] ? "..." : account ? "Update" : "Add"}
                      </button>
                    </div>

                    {account && (
                      <button
                        onClick={() => deleteSocialAccount(account.id)}
                        className="text-red-500 hover:text-red-600 text-xs font-semibold block mt-1"
                      >
                        Disconnect Account
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Metrics Cards Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Categories
          </h4>
          <p className="text-3xl font-extrabold text-[#0f172a]">
            {selectedCategories.length || 0}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Location
          </h4>
          {isEditing ? (
            <input
              name="location_website"
              value={formData.location_website}
              onChange={handleChange}
              className="text-base font-bold text-[#0f172a] border border-gray-300 rounded-lg px-2 py-0.5 w-full focus:outline-none"
            />
          ) : (
            <p className="text-2xl font-extrabold text-[#0f172a] truncate">
              {profile.location_website || "Not set"}
            </p>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Profile Status
          </h4>
          <p
            className={`text-2xl font-extrabold ${
              isProfileComplete ? "text-emerald-600" : "text-[#0f172a]"
            }`}
          >
            {isProfileComplete ? "Complete" : "Incomplete"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;