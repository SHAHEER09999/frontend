import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const AdminDashboard = () => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100">
      
      {/* 🔹 Sidebar */}
      <div className="w-64 bg-gray-600 text-white flex flex-col justify-between p-4">

        {/* Top Links */}
        <div className="flex flex-col gap-3">
          {[
            { name: "Users", path: "manageusers" },
            { name: "Reports", path: "reports" }
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="bg-teal-500 hover:bg-pink-300 px-4 py-2 rounded-lg text-center font-medium transition-all duration-300 shadow-md"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Bottom Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-md"
          >
            Logout
          </button>
        </div>
      </div>

     

    </div>
  );
}

export default AdminDashboard

