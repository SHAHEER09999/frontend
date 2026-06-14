import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, Trash2, Shield, User, Loader2, Calendar } from "lucide-react";

type UserType = {
  id: number;
  email: string;
  role: string;
  created_at?: string;
};

const ManageUser = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/api/admin/users",
        {
          headers: {
            Authorization: token || "",
          },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: number, email: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${email}?`
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(userId);
      await axios.delete(
        `http://localhost:3000/api/admin/users/${userId}`,
        {
          headers: {
            Authorization: token || "",
          },
        }
      );

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userId)
      );
      alert("User deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    } finally {
      setDeletingId(null);
    }
  };

  // Beautiful Skeleton Loading State
  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-4 font-sans antialiased">
        <div className="h-8 bg-slate-200 rounded-lg w-48 animate-pulse mb-6" />
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-20 bg-white border border-slate-200 rounded-xl w-full animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans antialiased text-slate-800">
      
      {/* Header section */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shadow-sm">
          <Users size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage Users</h1>
          <p className="text-sm text-slate-500">View, monitor, and manage roles or delete platform accounts.</p>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 font-medium">
          No user accounts found.
        </div>
      ) : (
        // Stacked Long Bars Container
        <div className="flex flex-col gap-3.5">
          {users.map((user) => {
            const isDeleting = deletingId === user.id;
            const isBrand = user.role?.toLowerCase() === "brand";

            return (
              <div
                key={user.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-slate-200/80 rounded-xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
              >
                {/* Left: Avatar & Primary Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="hidden xs:flex flex-shrink-0 w-11 h-11 bg-slate-50 border border-slate-100 rounded-xl items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:border-blue-100 group-hover:text-blue-500 transition-colors">
                    <span className="text-xs font-bold font-mono text-slate-400 group-hover:text-blue-500">
                      #{user.id}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 text-base truncate">
                      {user.email}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} />
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Badge Status & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-0 pt-3 sm:pt-0 border-slate-100">
                  {/* Custom Dynamic Role Badges */}
                  <div>
                    {isBrand ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200/50 uppercase tracking-wider">
                        <Shield size={12} />
                        Brand
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50 uppercase tracking-wider">
                        <User size={12} />
                        Influencer
                      </span>
                    )}
                  </div>

                  {/* Elegant Delete Bar Action */}
                  <button
                    onClick={() => handleDelete(user.id, user.email)}
                    disabled={isDeleting}
                    className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 border shadow-sm ${
                      isDeleting
                        ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-white border-red-200/60 text-red-600 hover:bg-red-50 hover:border-red-300"
                    }`}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>Removing...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 size={15} />
                        <span>Delete</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageUser;