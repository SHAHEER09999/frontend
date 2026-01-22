import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

/* ================= API ================= */
const API_URL = "http://localhost:3000";
const getToken = () => localStorage.getItem("jwt");

/* ================= TYPES ================= */
interface Profile {
  name: string;
  description: string;
  location_website: string;
  image_url?: string;
}

/* ================= COMPONENT ================= */
const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [locationWebsite, setLocationWebsite] = useState("");
  const [image, setImage] = useState<File | null>(null);

  /* ================= FETCH PROFILE ================= */
  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/profile`, {
        headers: { Authorization: `${getToken()}` },
      });

      if (res.status === 401 || res.status === 403) {
        logout();
        navigate("/login");
        return;
      }

      const data = await res.json();

      setProfile(data);
      setName(data.name || "");
      setDescription(data.description || "");
      setLocationWebsite(data.location_website || "");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE PROFILE ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("profile[name]", name);
    formData.append("profile[description]", description);
    formData.append("profile[location_website]", locationWebsite);

    if (image) formData.append("profile[image]", image);

    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: "PATCH",
        headers: { Authorization: `${getToken()}` },
        body: formData,
      });

      const data = await res.json();
      setProfile(data);
      setEdit(false);
      setImage(null);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= DELETE ACCOUNT ================= */
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure? This will permanently delete your account."
    );

    if (!confirmDelete) return;

    try {
      await fetch(`${API_URL}/users`, {
        method: "DELETE",
        headers: { Authorization: `${getToken()}` },
      });

      logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!profile) return <div className="p-10 text-center">Profile not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= HEADER ================= */}
      <header className="h-16 bg-white shadow flex items-center justify-between px-8">
        <button onClick={() => navigate("/")} className="text-xl font-extrabold text-gray-800 tracking-wide">
          BrandFluencer
        </button>

        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="h-10 px-6 rounded-full font-semibold
          bg-gradient-to-r from-pink-500 to-rose-500
          text-white hover:opacity-95 transition"
        >
          Logout
        </button>
      </header>

      {/* ================= PROFILE CARD ================= */}
      <div className="flex justify-center pt-16 pb-20">
        <div className="bg-white rounded-3xl shadow-xl p-12 w-full max-w-4xl">

          {/* TOP */}
          <div className="flex gap-10 items-start">

            {/* LEFT */}
            <div className="flex flex-col items-center w-44">

              <img
                src={profile.image_url || "https://via.placeholder.com/150"}
                className="w-40 h-40 rounded-full object-cover
                border-4 border-white shadow-lg"
              />
              {edit && (
                <input
                  type="file"
                  className="mt-4 text-sm"
                  onChange={(e) =>
                    setImage(e.target.files ? e.target.files[0] : null)
                  }
                />
              )}

              {/* LOCATION */}
              {!edit ? (
                <div className="mt-4 px-5 py-1 rounded-full bg-gray-100
                text-sm text-gray-600 shadow-inner">
                  📍 {profile.location_website || "No location"}
                </div>
              ) : (
                <input
                  value={locationWebsite}
                  onChange={(e) => setLocationWebsite(e.target.value)}
                  className="mt-4 w-full border rounded-full
                  px-4 py-2 text-sm text-center"
                  placeholder="Location / Website"
                />
              )}

              
            </div>

            {/* RIGHT */}
            <div className="flex-1">
              {!edit ? (
                <h2 className="text-4xl font-extrabold text-gray-900">
                  {profile.name}
                </h2>
              ) : (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded-xl px-5 py-3
                  text-2xl font-semibold"
                  placeholder="Your name"
                />
              )}
            </div>
          </div>

          {/* ABOUT */}
          <div className="mt-12">
            {!edit ? (
              <div className="bg-gray-50 rounded-2xl p-8 shadow-inner">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  About
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {profile.description || "No bio added"}
                </p>
              </div>
            ) : (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full border rounded-2xl px-6 py-5
                text-lg"
                placeholder="Write something about yourself..."
              />
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-between items-center mt-12 border-t pt-6">

            {/* DELETE */}
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700
              text-sm font-semibold"
            >
              Delete Account
            </button>

            {/* EDIT / SAVE */}
            {!edit ? (
              <button
                onClick={() => setEdit(true)}
                className="bg-slate-900 text-white
                px-8 py-3 rounded-full font-semibold shadow
                hover:bg-slate-800 transition"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-indigo-600 text-white
                px-8 py-3 rounded-full font-semibold shadow
                hover:bg-indigo-500 transition"
              >
                Save Changes
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
