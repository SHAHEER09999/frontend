import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../services/auth";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("brand");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await signup(email, password, role);
      console.log("Signup success:", data);
      navigate("/check-email", {
        state: { email: data?.data?.email ?? email }
      });

    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="min-h-full flex flex-col items-center justify-center py-6 px-4">
        <div className="max-w-[600px] w-full">

          {/* Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 shadow-sm">

            <h1 className="text-slate-900 text-center text-3xl font-semibold">
              Create your account
            </h1>

            <form onSubmit={handleSubmit} className="mt-10 space-y-6">

              <div className="grid sm:grid-cols-2 gap-6">

                <div>
                  <label className="text-slate-900 text-sm font-medium mb-2 block">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-slate-900 text-sm font-medium mb-2 block">
                    Role
                  </label>
                  <select
                    className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="">Select role</option>
                    <option value="influencer">Influencer</option>
                    <option value="brand">Brand</option>
                  </select>
                </div>

                <div> 
                  <label className="text-slate-900 text-sm font-medium mb-2 block">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-slate-900 text-sm font-medium mb-2 block">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600"
                    placeholder="Confirm password"
                  />
                </div>

              </div>

              {/* Terms */}
              <div className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-blue-600 border-slate-300 rounded"/>
                <label className="ml-2 text-sm text-slate-900">
                  I agree to the{" "}
                  <Link to="/terms" className="text-blue-600 hover:underline">
                    Terms & Conditions
                  </Link>
                </label>
              </div>

              {/* Google */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-md text-sm font-medium text-slate-700 hover:bg-gray-100"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  className="w-5 h-5"
                />
                Sign up with Google
              </button>

              {/* Signup button */}
              <button
                type="submit"
                className="w-full py-2 px-4 text-[15px] font-medium tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign up
              </button>

              <p className="text-slate-900 text-sm text-center">
                Already have an account?
                <Link to="/login" className="text-blue-600 hover:underline ml-1 font-semibold">
                  Login here
                </Link>
              </p>

            </form>

          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp