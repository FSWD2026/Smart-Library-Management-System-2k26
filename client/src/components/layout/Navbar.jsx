import { useState, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { useClickOutside } from "../../hooks/useClickOutside";
import {
  FiMenu,
  FiX,
  FiBookOpen,
  FiUser,
  FiLogOut,
  FiBook,
  FiGrid,
  FiChevronDown,
} from "react-icons/fi";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((s) => s.auth);

  useClickOutside(dropRef, () => setDropdownOpen(false));

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
    setDropdownOpen(false);
  };

  const navLinks = [
    { to: "/books", label: "Books", icon: FiBook },
    ...(user?.role === "Admin"
      ? [{ to: "/admin/dashboard", label: "Dashboard", icon: FiGrid }]
      : []),
  ];

  return (
    <nav className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur-xl border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all">
              <FiBookOpen className="text-white text-lg" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              SmartLib
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600/20 text-indigo-400"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-xl transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-300">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <FiChevronDown
                    className={`text-gray-400 transition-transform text-sm ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl shadow-black/50 py-2 animate-slide-down">
                    <div className="px-4 py-2 border-b border-gray-800 mb-1">
                      <p className="text-sm font-medium text-gray-200 truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800 text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      <FiUser className="text-indigo-400" /> My Profile
                    </Link>
                    <Link
                      to="/my-borrows"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800 text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      <FiBookOpen className="text-indigo-400" /> My Borrows
                    </Link>
                    {user?.role === "Admin" && (
                      <>
                        <hr className="border-gray-800 my-1" />
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800 text-gray-300 hover:text-white transition-colors text-sm"
                        >
                          <FiGrid className="text-purple-400" /> Admin Panel
                        </Link>
                      </>
                    )}
                    <hr className="border-gray-800 my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800 text-red-400 hover:text-red-300 transition-colors w-full text-sm"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="btn-outline py-2 px-4 text-sm">
                  Login
                </Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-gray-800 pt-3 animate-slide-down">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2.5 px-3 rounded-xl mb-1 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600/20 text-indigo-400"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`
                }
              >
                <Icon size={16} /> {label}
              </NavLink>
            ))}
            {!isAuthenticated && (
              <div className="flex gap-2 mt-3">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="btn-outline py-2 px-4 text-sm flex-1 text-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary py-2 px-4 text-sm flex-1 text-center"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
