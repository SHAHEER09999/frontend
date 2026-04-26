import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.put("http://localhost:3000/users/password", {
        user: {
          reset_password_token: token,
          password,
          password_confirmation: password,
        },
      });

      setMessage("Password updated ✅");
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setMessage("Invalid or expired link ❌");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl shadow-md max-w-md mx-auto">
    <form onSubmit={handleSubmit} className="w-full space-y-10">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">
        Secure Your Account
        </h2>
        
        <div className="flex flex-col">
        <input
            type="password"
            placeholder="New password"
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
        </div>

        <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm"
        >
        Reset Password
        </button>

        {message && (
        <p className="text-sm text-center mt-2 p-2 bg-blue-50 text-blue-700 rounded-md border border-blue-100">
            {message}
        </p>
        )}
    </form>
    </div>
  );
}