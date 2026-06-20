import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setIsSubmitting(true);
      const { data, token } = await login(email, password);

      if (token) {
        loginUser(data.data, token);
        const role = data.data.role;
        if (role === "admin") { 
          navigate("/Admin-Dashboard");
        } else {
          navigate("/User-Dashboard");
        }
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password configuration.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-[480px] w-full">
        {/* Card - Increased Vertical Padding */}
        <div className="py-10 px-6 sm:py-14 sm:px-12 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-8">
          
          <div className="text-center space-y-3">
            <h1 className="text-gray-800 text-3xl font-extrabold tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Access your workspace panel dashboard to resume collaborations
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-400">
                  <Mail size={16} />
                </span>
                <input 
                  name="username" 
                  type="email" 
                  required 
                  placeholder="name@example.com"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full text-gray-800 text-sm border border-gray-300 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-bold text-pink-600 hover:text-pink-700 transition">
                  Forgot password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-400">
                  <Lock size={16} />
                </span>
                <input 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  required 
                  placeholder="Enter your security token"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full text-gray-800 text-sm border border-gray-300 pl-11 pr-11 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-400 hover:text-gray-600 transition"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Action Block */}
            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition duration-200 disabled:cursor-not-allowed shadow-sm"
              >
                <LogIn size={16} />
                {isSubmitting ? "Authenticating..." : "Sign In"}
              </button>
            </div>

            <p className="text-gray-500 text-xs text-center pt-4 font-medium">
              Don't have an account?{" "}
              <Link to="/signup" className="text-teal-600 hover:text-teal-700 font-bold ml-1 transition">
                Register here
              </Link>
            </p>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;