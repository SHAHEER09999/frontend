import React from 'react';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const UserDashboard: React.FC = () => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleDeleteRequest = async () => {
  try {
    await axios.post(
      "http://localhost:3000/users/request_delete",
      {},
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    alert("Confirmation email sent 📧");
  } catch {
    alert("Failed to send email ❌");
  }
};

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };
  return (
    <div>
      <button onClick={handleLogout} className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
          Logout
      </button>
      <button onClick={handleDeleteRequest} className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
        Delete Account
      </button>
    </div>
  );
};



export default UserDashboard;