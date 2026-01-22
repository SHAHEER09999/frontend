import React from 'react';
import { Search, User, Menu } from 'lucide-react';
import { Link } from "react-router-dom";
import { isLoggedIn, getCurrentUser, logout } from "../utils/auth";
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';



const Navbar: React.FC = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();

  return (
    <nav className="fixed w-full top-0 left-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-pink-500">
          Brand<span className="text-gray-800">Fluencer</span>
        </Link>  


        {/* Desktop Menu */}
        <div className="hidden lg:flex flex-1 justify-center items-center gap-6 text-sm font-semibold text-gray-700">
          <button className="px-4 py-2 rounded-full hover:bg-gray-50 hover:text-teal-600 transition">
            Search
          </button>
          <button className="px-4 py-2 rounded-full hover:bg-gray-50 hover:text-teal-600 transition">
            How It Works
          </button>
          <button className="px-4 py-2 rounded-full hover:bg-gray-50 hover:text-teal-600 transition">
            Pricing
          </button>
          <button className="px-4 py-2 rounded-full hover:bg-gray-50 hover:text-teal-600 transition">
            Features
          </button>
         
          <button className="px-4 py-2 rounded-full hover:bg-gray-50 hover:text-teal-600 transition">
            BrandStories
          </button>
        </div>

        {/* Desktop Buttons */}
        {!isLoggedIn() && (
          <div className="hidden lg:flex items-center gap-3 ml-auto">
            <Link to="/login" className="h-10 w-32 inline-flex items-center justify-center gap-2 rounded-full font-semibold border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 transition">
              Login
            </Link>
            <Link to="/signup" className="h-10 w-32 inline-flex items-center justify-center gap-2 rounded-full font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:opacity-95 transition">
              Signup
            </Link>
          </div>
         )}
         {isLoggedIn() && user.role !== "admin" && (
            <Link to="/profile"><FaUserCircle size={40} color="#333" /></Link>
          )}

          {isLoggedIn() && user.role === "admin" && (
            <Link to="/admin"> <FaUserCircle size={40} color="#333" /></Link>
          )}
        {/* Mobile Menu Button */}
        <div className="lg:hidden ml-auto flex items-center gap-2">
          <button className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition">
            <Menu size={24} />
          </button>
        </div>
      </div>

      
    </nav>
  );
};

export default Navbar;
