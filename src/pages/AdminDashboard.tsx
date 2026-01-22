import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

/* ======================
   JWT HELPERS (INLINE)
====================== */
const API_URL = "http://localhost:3000";

const getToken = () => localStorage.getItem("jwt");



/* ======================
   ADMIN DASHBOARD
====================== */
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ======================
     FETCH USERS
  ====================== */
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: {
          Authorization: `${getToken()}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        // logout();
        // navigate("/login");
        return;
      }

      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     DELETE USER
  ====================== */
  const deleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    await fetch(`${API_URL}/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `${getToken()}`,
      },
    });

    setUsers(users.filter((u) => u.id !== id));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ======================
     UI
  ====================== */
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ===== SIDEBAR ===== */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h1 className="text-2xl font-extrabold mb-10">
          Brand<span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-pink-500">Fluencer</span>
        </h1>

        <nav className="space-y-4">
          <button className="w-full text-left px-4 py-2 rounded-lg bg-gray-800">
            Users
          </button>
          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-800">
            Reports
          </button>
        </nav>
      </aside>

      {/* ===== MAIN ===== */}
      <div className="flex-1">
        {/* ===== TOP BAR ===== */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
          <h2 className="text-xl font-bold text-gray-800">
            Admin Dashboard
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

        {/* ===== CONTENT ===== */}
        <main className="p-6">
          <h3 className="text-2xl font-bold mb-6">All Users</h3>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-xl shadow p-5 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {user.email}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {user.role}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteUser(user.id)}
                    className="px-4 py-2 text-sm rounded-lg bg-indigo-500 text-white hover:bg-indigo-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
