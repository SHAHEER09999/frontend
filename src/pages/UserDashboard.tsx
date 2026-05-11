import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  LayoutDashboard,
  Briefcase,
  MessageCircle,
  Calendar,
  DollarSign,
  LogOut,
  User,
  Trash2,
} from "lucide-react";

const UserDashboardLayout = () => {
  const { logoutUser, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const menuItems = [
    { name: "Dashboard", path: "profile", icon: LayoutDashboard },
    { name: "Opportunities", path: "campaigns", icon: Briefcase },
    { name: "Messages", path: "chats", icon: MessageCircle },
    { name: "Meetings", path: "meetings", icon: Calendar },
    { name: "Accounts", path: "accounts", icon: DollarSign },
  ];

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100">

      {/* 🔹 Desktop Sidebar */}
      <div className="hidden md:flex w-64 bg-white border-r p-4 flex-col justify-between">
        
        {/* Top */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6">Dashboard</h2>

          <div className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const isActive = location.pathname.includes(item.path);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-blue-100 text-blue-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t pt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {user?.email?.split("@")[0]}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full bg-gray-800 hover:bg-black text-white py-2 rounded-lg"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      

      {/* 🔹 Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t flex justify-around items-center py-2 shadow-md z-50">
        {menuItems.map((item) => {
          const isActive = location.pathname.includes(item.path);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center text-xs ${
                isActive ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <Icon size={20} />
            </Link>
          );
        })}

        {/* Logout icon */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center text-gray-500"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
};

export default UserDashboardLayout;