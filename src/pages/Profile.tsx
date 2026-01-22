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

  /* ================= FETCH ================= */
  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/profile`, {
        headers: { Authorization: `${getToken()}` },
      });

      if (res.status === 401) {
        logout();
        navigate("/login");
        return;
      }

      const data = await res.json();
      setProfile(data);
      setName(data.name || "");
      setDescription(data.description || "");
      setLocationWebsite(data.location_website || "");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("profile[name]", name);
    formData.append("profile[description]", description);
    formData.append("profile[location_website]", locationWebsite);
    if (image) formData.append("profile[image]", image);

    const res = await fetch(`${API_URL}/profile`, {
      method: "PATCH",
      headers: { Authorization: `${getToken()}` },
      body: formData,
    });

    const data = await res.json();
    setProfile(data);
    setEdit(false);
  };

  /* ================= DELETE ACCOUNT ================= */
  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure? This will permanently delete your account."
    );
    if (!confirm) return;

    await fetch(`${API_URL}/users`, {
      method: "DELETE",
      headers: { Authorization: `${getToken()}` },
    });

    logout();
    navigate("/login");
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!profile) return <div className="p-10 text-center">Profile not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="h-16 bg-white shadow flex items-center justify-between px-6">
           <h2 className="text-xl font-bold text-gray-800">
                BrandFluencer
            </h2>
      
            <button
                onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="h-10 px-6 rounded-full font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:opacity-95 transition"
                >
                  Logout   
             </button>
        </header>

      {/* PROFILE */}
          <div className="flex justify-center pt-16">
            <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-3xl">

              {/* TOP SECTION */}
              <div className="flex gap-8 items-start">

                {/* LEFT: AVATAR + LOCATION */}
                <div className="flex flex-col items-center w-40">
                  <img
                    src={profile.image_url || "https://via.placeholder.com/150"}
                    className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg"
                  />

                  {/* Location Field */}


                  {edit && (
                    <input
                      type="file"
                      className="mt-4 text-sm"
                      onChange={(e) =>
                        setImage(e.target.files ? e.target.files[0] : null)
                      }
                    />
                  )}
                </div>

                {/* RIGHT: NAME */}
                <div className="flex-1">
                  {!edit ? (
                    <>
                      <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        {profile.name}
                      </h2>
                      <div className="mt-4 px-4 py-1 rounded-full bg-gray-100 text-sm text-gray-600 shadow-inner">
                        📍 {profile.location_website || "No location"}
                      </div>
                    </>
                  ) : (
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border rounded-xl px-4 py-3 text-xl font-semibold"
                      placeholder="Name"
                    />
                  )}
                </div>
              </div>

              {/* ABOUT SECTION */}
              <div className="mt-10">
                {!edit ? (
                  <div className="bg-gray-50 rounded-2xl p-6 shadow-inner">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      About
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {profile.description || "No bio added"}
                    </p>
                  </div>
                ) : (
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border rounded-2xl px-5 py-4 text-lg"
                    rows={5}
                    placeholder="Write something about yourself..."
                  />
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex justify-between items-center mt-10 border-t pt-6">

                {/* DELETE */}
                <button
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Delete Account
                </button>

                {/* EDIT / SAVE */}
                {!edit ? (
                  <button
                    onClick={() => setEdit(true)}
                    className="bg-slate-900 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-slate-800 transition"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-indigo-500 transition"
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
