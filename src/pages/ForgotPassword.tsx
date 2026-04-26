import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/users/password", {
        user: { email },
      });

      setMessage("Reset link sent to your email ✅");
    } catch {
      setMessage("Email not found ❌");
    }
  };

  return (
    <div className=" flex items-center justify-center  px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-10">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Forgot Password?</h2>
                <p className="text-gray-500 text-sm mt-1">Enter your email to receive a reset link.</p>
            </div>

            <div>
                <input
                type="email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
                />
            </div>

            <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md transition-colors shadow-md active:transform active:scale-95"
            >
                Send Reset Link
            </button>

            {message && (
                <p className="text-sm text-center text-green-600 bg-green-50 p-2 rounded border border-green-100">
                {message}
                </p>
            )}
            </form>
        </div>
        </div>
  );
}