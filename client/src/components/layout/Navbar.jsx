import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { useClickOutside } from "../../hooks/useClickOutside";
import {
  FiMenu,
  FiX,
  FiBookOpen,
  FiUser,
  FiLogOut,
  FiSettings,
} from "react-icons/fi";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const dropRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((s) => s.auth);

  useClickOutside(dropRef, () => setDropdown(false));

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navLinks = [
    { to: "/books", label: "Books" },
    ...(user?.role === "Admin"
      ? [{ to: "/admin/dashboard", label: "Dashboard" }]
      : []),
  ];

  return (
    <nav className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
              <FiBookOpen className="text-white text-lg" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              SmartLib
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-gray-400 hover:text-indigo-400 transition-colors font-medium"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropdown(!dropdown)}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-xl transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-300">
                    {user?.name?.split(" ")[0]}
                  </span>
                </button>

                {dropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl py-2 animate-slide-down">
                    <Link
                      to="/profile"
                      onClick={() => setDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
                    >
                      <FiUser className="text-indigo-400" /> Profile
                    </Link>
                    <Link
                      to="/my-borrows"
                      onClick={() => setDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
                    >
                      <FiBookOpen className="text-indigo-400" /> My Borrows
                    </Link>
                    <hr className="border-gray-700 my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800 text-red-400 hover:text-red-300 transition-colors w-full"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-outline py-2 px-4 text-sm">
                  Login
                </Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              {open ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {open && (
          <div className="md:hidden py-4 border-t border-gray-800 animate-slide-down">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block py-2.5 px-2 text-gray-400 hover:text-indigo-400 transition-colors font-medium"
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
