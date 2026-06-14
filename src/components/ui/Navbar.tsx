import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserCircle, Menu, X } from "lucide-react"; 
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const role = user?.role;

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinkStyles = "cursor-pointer hover:text-teal-500 transition-colors";

  const shouldShowInfluencersLink = !isLoggedIn || role === "brand";

  // Handle smooth scroll to section on Home page
  const handleNavClick = (sectionId: string) => {
    setIsOpen(false);
    if (window.location.pathname === "/") {
      // If already on home page, just scroll
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // Navigate to home page with hash, then scroll after navigation
      navigate(`/#${sectionId}`);
      // Small delay to allow page to load
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  // Handle click on "Influencers" - navigate to separate page
  const handleInfluencersClick = () => {
    setIsOpen(false);
    navigate("/influencers");
  };

  return (
    <nav className="relative bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" onClick={() => setIsOpen(false)}>
          <div className="flex">
            <p className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-pink-500">
              Brand
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-800">
              Fluencer
            </p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:block">
          <ul className="flex items-center gap-x-8 text-sm font-medium text-gray-700">
            <Link to="/" className={navLinkStyles}>Home</Link>
            <button onClick={() => handleNavClick("about")} className={navLinkStyles}>
              About
            </button>
            <button onClick={() => handleNavClick("features")} className={navLinkStyles}>
              Features
            </button>
            <button onClick={() => handleNavClick("how-it-works")} className={navLinkStyles}>
              How It Works
            </button>
            
            {/* Conditionalized Influencers link for desktop */}
            {shouldShowInfluencersLink && (
              <button onClick={handleInfluencersClick} className={navLinkStyles}>
                Influencers
              </button>
            )}

            {isLoggedIn ? (
              <Link to={role === "admin" ? "/Admin-Dashboard" : "/User-Dashboard"} className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 group-hover:border-teal-400 transition-all">
                  <UserCircle className="text-gray-500 group-hover:text-teal-500" size={28} />
                </div>
                <span className="text-gray-800 font-bold group-hover:text-teal-500">Profile</span>
              </Link>
            ) : (
              <>
                <Link to="/login" className={navLinkStyles}>Login</Link>
                <Link to="/signup">
                  <button className="px-6 py-2 rounded-full font-bold text-white bg-gradient-to-r from-teal-500 to-pink-500 hover:opacity-90 transition-opacity shadow-md">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </ul>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-gray-800 focus:outline-none">
            {isOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar/Menu */}
      <div className={`md:hidden absolute w-full bg-white z-20 border-b transition-all duration-300 ease-in-out ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <ul className="flex flex-col p-6 gap-y-4 font-medium text-gray-700">
          <Link to="/" onClick={toggleMenu} className={navLinkStyles}>Home</Link>
          <button onClick={() => handleNavClick("about")} className={navLinkStyles}>
            About
          </button>
          <button onClick={() => handleNavClick("features")} className={navLinkStyles}>
            Features
          </button>
          <button onClick={() => handleNavClick("how-it-works")} className={navLinkStyles}>
            How It Works
          </button>
          
          {/* Conditionalized Influencers link for mobile drawer */}
          {shouldShowInfluencersLink && (
            <button onClick={handleInfluencersClick} className={navLinkStyles}>
              Influencers
            </button>
          )}
          
          <hr className="my-2 border-gray-100" />
          
          {isLoggedIn ? (
            <Link to={role === "admin" ? "/Admin-Dashboard" : "/User-Dashboard"} onClick={toggleMenu} className="flex items-center gap-3 py-2">
              <UserCircle className="text-teal-500" size={24} />
              <span className="font-bold">My Profile</span>
            </Link>
          ) : (
            <div className="flex flex-col gap-4">
              <Link to="/login" onClick={toggleMenu} className={navLinkStyles}>Login</Link>
              <Link to="/signup" onClick={toggleMenu}>
                <button className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-teal-500 to-pink-500">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;