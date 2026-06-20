import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../services/auth";
import { UserPlus, AlertCircle } from "lucide-react";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("brand");
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 1. Validate Form Fields are not empty
    if (!email.trim() || !password || !confirmPassword || !role) {
      setError("Please fill in all registration fields.");
      return;
    }

    // 2. Validate Password Matching
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify your entries.");
      return;
    }

    // 3. Validate Compulsory Terms Checkbox
    if (!agreeTerms) {
      setError("You must accept the Terms & Conditions to complete registration.");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = await signup(email, password, role);
      navigate("/check-email", {
        state: { email: data?.data?.email ?? email }
      });
    } catch (err: any) {
      setError(err.message || "An error occurred during account creation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-[600px] w-full">
        {/* Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-6">
          
          <div className="text-center space-y-2">
            <h1 className="text-gray-800 text-3xl font-extrabold tracking-tight">
              Create your account
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Join the ecosystem to build high-performance brand-creator matches
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Role
                </label>
                <select
                  className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white transition"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="brand">Brand</option>
                  <option value="influencer">Influencer</option>
                </select>
              </div>

              <div> 
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Terms Requirement */}
            <div className="flex items-start bg-gray-50 border border-gray-100 p-3 rounded-xl">
              <input 
                id="terms"
                type="checkbox" 
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded cursor-pointer transition"
              />
              <label htmlFor="terms" className="ml-2.5 text-xs text-gray-600 leading-relaxed cursor-pointer select-none">
                I explicitly understand and agree to the platform's standard{" "}
                <Link to="/terms-and-privacy" className="text-pink-600 hover:text-pink-700 font-bold underline transition">
                  Terms & Conditions & Privacy Policy
                </Link>
              </label>
            </div>

            {/* Signup button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 transition duration-200 disabled:cursor-not-allowed shadow-sm"
            >
              <UserPlus size={16} />
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </button>

            {/* Google Divider */}
           

           

            <p className="text-gray-500 text-xs text-center pt-2 font-medium">
              Already have an account?
              <Link to="/login" className="text-teal-600 hover:text-teal-700 font-bold ml-1 transition">
                Login here
              </Link>
            </p>

          </form>

        </div>
      </div>
    </div>
  );
};

export default SignUp;