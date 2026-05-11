import React, { useEffect, useState } from "react";
import { Trash2, Youtube } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:3000";

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

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location_website: "",
  });

  const token = localStorage.getItem("token");

  // Fetch categories
  const fetchCategories = async () => {
    const res = await axios.get(`${API_URL}/categories/options`);
    setAllCategories(res.data);
  };

  // Fetch profile
  const fetchProfile = async () => {
    const res = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: token },
    });

    setProfile(res.data);

    setFormData({
      name: res.data.name || "",
      description: res.data.description || "",
      location_website: res.data.location_website || "",
    });

    setSelectedCategories(
      res.data.categories?.map((c: any) => c.categories) || []
    );

    // Pre-fill YouTube username if already connected
    const youtubeAccount = res.data.social_accounts?.find(
      (account: any) => account.platform?.toLowerCase() === "youtube"
    );

    if (youtubeAccount) {
      setYoutubeUsername(`@${youtubeAccount.username}`);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchCategories();
  }, []);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Update profile
  const handleUpdate = async () => {
    try {
      const formDataToSend = new FormData();

      formDataToSend.append("profile[name]", formData.name);
      formDataToSend.append("profile[description]", formData.description);
      formDataToSend.append(
        "profile[location_website]",
        formData.location_website
      );

      if (imageFile) {
        formDataToSend.append("profile[image]", imageFile);
      }

      selectedCategories.forEach((cat, index) => {
        formDataToSend.append(`categories[${index}]`, cat);
      });

      await axios.put(`${API_URL}/profile`, formDataToSend, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
      alert("Update failed ❌");
    }
  };

  // Request account deletion
  const handleDeleteRequest = async () => {
    try {
      await axios.post(
        `${API_URL}/users/request_delete`,
        {},
        {
          headers: { Authorization: token },
        }
      );
      alert("Confirmation email sent 📧");
    } catch {
      alert("Failed ❌");
    }
  };

  // Verify YouTube account and save to backend
  const handleVerifyYouTube = async () => {
    if (!youtubeUsername.trim()) {
      setYoutubeError("Please enter your YouTube handle");
      return;
    }

    try {
      setYoutubeLoading(true);
      setYoutubeError("");

      await axios.post(
        `${API_URL}/social_accounts/verify_and_create`,
        {
          platform: "youtube",
          username: youtubeUsername,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      await fetchProfile(); // Refresh profile to show updated followers
      alert("YouTube account verified successfully ✅");
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.message ||
        "YouTube verification failed";
      setYoutubeError(message);
    } finally {
      setYoutubeLoading(false);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  const youtubeAccount = profile.social_accounts?.find(
    (account: any) => account.platform?.toLowerCase() === "youtube"
  );

  return (
    <div className="space-y-4">
      {/* Top Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Profile Image */}
          <div className="relative w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-sm text-gray-500">
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                className="text-2xl font-bold text-gray-800 border rounded px-2"
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-800">
                {profile.name || "Unnamed User"}
              </h2>
            )}
          </div>
        </div>

        <div className="md:ml-auto flex flex-wrap gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-2.5 rounded-2xl bg-slate-900 mb-2 text-white hover:bg-slate-800 transition font-semibold"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleUpdate}
                className="px-5 py-2.5 rounded-2xl bg-green-600 text-white"
              >
                Save
              </button>

              <button
                onClick={() => {
                  setIsEditing(false);
                  setYoutubeError("");
                  fetchProfile(); // Reset unsaved changes
                }}
                className="px-5 py-2.5 rounded-2xl bg-gray-400 text-white"
              >
                Cancel
              </button>
            </>
          )}

          <button
            onClick={handleDeleteRequest}
            className="flex items-center justify-center gap-2 w-40 mb-2 bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-lg"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* About */}
      <div className="bg-white p-4 rounded-2xl border shadow-sm">
        <h3 className="font-semibold text-gray-700 mb-2">About</h3>

        {isEditing ? (
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded p-2 text-sm"
          />
        ) : (
          <p className="text-gray-500 text-sm">
            {profile.description || "No bio"}
          </p>
        )}
      </div>

      {/* Categories */}
      <div className="bg-white p-4 rounded-2xl border shadow-sm">
        <h3 className="text-gray-500 text-sm mb-2">Categories</h3>

        {isEditing ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {allCategories.length === 0 && (
              <p className="text-sm text-gray-400">Loading categories...</p>
            )}

            {allCategories.map((cat) => {
              const isChecked = selectedCategories.includes(cat);
              const isDisabled =
                !isChecked && selectedCategories.length >= 3;

              return (
                <label
                  key={cat}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm ${
                    isChecked
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100"
                  } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    disabled={isDisabled}
                    onChange={() => {
                      if (isChecked) {
                        setSelectedCategories(
                          selectedCategories.filter((c) => c !== cat)
                        );
                      } else if (selectedCategories.length < 3) {
                        setSelectedCategories([...selectedCategories, cat]);
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
                  className="text-sm bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full"
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

      {/* Social Accounts */}
      <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-4">
        <h3 className="font-semibold text-gray-700">Social Accounts</h3>

        {/* YouTube Card */}
        <div className="border rounded-xl p-4 bg-red-50">
          <div className="flex items-center gap-2 mb-3">
            <Youtube className="text-red-600" size={22} />
            <span className="font-semibold text-gray-800">YouTube</span>
          </div>

          {/* Show connected account info if it exists */}
          {youtubeAccount ? (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-3">
              <p className="text-sm text-gray-700 mt-1">
                Username: <strong>@{youtubeAccount.username}</strong>
              </p>
              <p className="text-sm text-gray-700">
                Subscribers: <strong>
                  {Number(youtubeAccount.followers || 0).toLocaleString()}
                </strong>
              </p>
            </div>
          ) : (
            !isEditing && (
              <div className="bg-gray-100 px-3 py-2 rounded-lg text-gray-500 text-sm">
                Not connected
              </div>
            )
          )}

          {/* Show verify form only in edit mode */}
          {isEditing && (
            <>
              <div className="flex flex-col sm:flex-row gap-2 mt-3">
                <input
                  type="text"
                  value={youtubeUsername}
                  onChange={(e) => setYoutubeUsername(e.target.value)}
                  placeholder="@YourChannelHandle"
                  className="flex-1 border rounded-lg px-3 py-2"
                />

                <button
                  onClick={handleVerifyYouTube}
                  disabled={youtubeLoading}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  {youtubeLoading ? "Verifying..." : "Verify"}
                </button>
              </div>

              {youtubeError && (
                <p className="text-red-500 text-sm mt-2">{youtubeError}</p>
              )}
            </>
          )}
        </div>

        {/* Other Platforms */}
        {[
          { name: "Instagram" },
          { name: "TikTok" },
          { name: "Facebook" },
        ].map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-lg"
          >
            <span>{item.name}</span>
            <span className="text-gray-500 text-sm">Not set</span>
          </div>
        ))}
      </div>

      {/* Location */}
      <div className="bg-white p-4 rounded-2xl border shadow-sm">
        <h3 className="text-gray-500 text-sm">Location</h3>

        {isEditing ? (
          <input
            name="location_website"
            value={formData.location_website}
            onChange={handleChange}
            className="text-xl font-semibold border rounded px-2"
          />
        ) : (
          <p className="text-xl font-semibold">
            {profile.location_website || "Not set"}
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
