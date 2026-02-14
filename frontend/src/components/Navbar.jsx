import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../authSlice";


const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const navLinks = [
    { name: "Problems", href: "/problems" },
    { name: "Contest", href: "/contest" },
    { name: "Help/FAQ", href: "/help" },
    ...(!isAuthenticated ? [{ name: "Sign In", href: "/login" }] : []),
    

  ];

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/90 backdrop-blur-xl border-b border-gray-800 py-4"
            : "bg-black/50 backdrop-blur-md py-6"
        }`}
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo with animation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 group"
            >
              <Link
                to="/"
                className="relative text-2xl font-bold font-mono tracking-tighter text-white flex items-center"
              >
                <motion.span 
                  className="text-gray-300"
                  animate={{ rotate: hoveredLink === "logo" ? 180 : 0 }}
                  transition={{ duration: 0.5 }}
                  onMouseEnter={() => setHoveredLink("logo")}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  &lt;&gt;
                </motion.span>
                <span className="ml-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  CodeArena
                </span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></div>
              </Link>
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative"
                  onMouseEnter={() => setHoveredLink(link.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <Link
                    to={link.href}
                    className="relative px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors group"
                  >
                    {link.name}
                    <AnimatePresence>
                      {hoveredLink === link.name && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"
                        />
                      )}
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Link>
                </motion.div>
              ))}

              {/* Show Start Learning button OR User dropdown */}
              {isAuthenticated && user ? (
                <div className="relative ml-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="relative flex items-center space-x-3 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-900 to-black border border-gray-800 hover:border-gray-600 transition-all group"
                  >
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 via-gray-800 to-black flex items-center justify-center text-white font-bold shadow-lg border border-gray-700 group-hover:border-gray-500 transition-colors">
                        {getUserInitials()}
                      </div>
                      <motion.div
                        animate={{ scale: userDropdownOpen ? 1 : 0 }}
                        className="absolute -inset-1 rounded-full bg-gradient-to-r from-white/20 to-transparent"
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-white">{user?.firstName || user?.username}</p>
                      <p className="text-xs text-gray-400">{user?.role === "admin" ? "Admin" : "Member"}</p>
                    </div>
                    <motion.div
                      animate={{ rotate: userDropdownOpen ? 180 : 0 }}
                      className="text-gray-400"
                    >
                      ▼
                    </motion.div>
                  </motion.button>

                  {/* User Dropdown Menu */}
                  <AnimatePresence>
                    {userDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setUserDropdownOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-3 w-72 bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800 overflow-hidden z-50"
                        >
                          {/* User Info */}
                          <div className="p-5 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-black">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 via-gray-800 to-black flex items-center justify-center text-white font-bold text-lg border border-gray-700">
                                {getUserInitials()}
                              </div>
                              <div>
                                <p className="text-white font-semibold">{user?.firstName || user?.username}</p>
                                {user?.email && (
                                  <p className="text-gray-400 text-sm truncate">{user.email}</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Dropdown Items */}
                          <div className="py-2">
                            <Link
                              to="/profile"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all group"
                            >
                              <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center mr-3 group-hover:bg-gray-700 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium">Profile</p>
                                <p className="text-xs text-gray-500">View your profile</p>
                              </div>
                            </Link>
                            
                            {user?.role === "admin" && (
                              <Link
                                to="/admin"
                                onClick={() => setUserDropdownOpen(false)}
                                className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-900/20 transition-all group"
                              >
                                <div className="w-10 h-10 rounded-lg bg-purple-900/30 flex items-center justify-center mr-3 group-hover:bg-purple-900/50 transition-colors">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="font-medium">Admin Dashboard</p>
                                  <p className="text-xs text-gray-500">Manage platform</p>
                                </div>
                              </Link>
                            )}

                            <div className="px-4 py-2">
                              <button
                                onClick={handleLogout}
                                className="flex items-center justify-center w-full px-4 py-3 rounded-xl bg-gradient-to-r from-gray-800 to-black border border-gray-700 text-red-400 hover:text-red-300 hover:border-red-500/50 hover:bg-red-900/20 transition-all group"
                              >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="ml-2"
                >
                  <Link to="/signup">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative px-6 py-3 rounded-xl bg-gradient-to-r from-white to-gray-200 text-black font-semibold shadow-2xl hover:shadow-white/20 transition-all overflow-hidden group"
                    >
                      <span className="relative z-10">Start Learning</span>
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.5 }}
                      />
                    </motion.button>
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center gap-3">
              {isAuthenticated && user && (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 via-gray-800 to-black flex items-center justify-center text-white font-bold border border-gray-700">
                    {getUserInitials()}
                  </div>
                </button>
              )}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="relative w-10 h-10 flex items-center justify-center bg-gray-900 border border-gray-800 rounded-xl"
              >
                <span className="sr-only">Menu</span>
                <div className="relative w-6 h-6">
                  <motion.span
                    animate={{ 
                      rotate: mobileMenuOpen ? 45 : 0,
                      y: mobileMenuOpen ? 8 : 0 
                    }}
                    className="absolute left-0 top-0 block h-0.5 w-6 bg-white"
                  />
                  <motion.span
                    animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
                    className="absolute left-0 top-2 block h-0.5 w-6 bg-white"
                  />
                  <motion.span
                    animate={{ 
                      rotate: mobileMenuOpen ? -45 : 0,
                      y: mobileMenuOpen ? -8 : 0 
                    }}
                    className="absolute left-0 top-4 block h-0.5 w-6 bg-white"
                  />
                </div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-gray-900/95 backdrop-blur-xl border-b border-gray-800"
            >
              <div className="px-4 py-6 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-xl font-medium transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}

                {isAuthenticated && user ? (
                  <>
                    <div className="pt-4 border-t border-gray-800">
                      <div className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 via-gray-800 to-black flex items-center justify-center text-white font-bold text-lg border border-gray-700">
                            {getUserInitials()}
                          </div>
                          <div>
                            <p className="text-white font-semibold">{user?.firstName || user?.username}</p>
                            {user?.email && (
                              <p className="text-gray-400 text-sm">{user.email}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                        <div className="px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-xl mx-1 transition-all">
                          Profile
                        </div>
                      </Link>
                      
                      {user?.role === "admin" && (
                        <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                          <div className="px-4 py-3 text-purple-300 hover:text-white hover:bg-purple-900/20 rounded-xl mx-1 transition-all">
                            Admin Dashboard
                          </div>
                        </Link>
                      )}
                      
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 mt-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-xl transition-all"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <div className="px-4 py-3 mt-4 bg-gradient-to-r from-white to-gray-200 text-black font-semibold rounded-xl text-center">
                      Start Learning
                    </div>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-10"></div>
    </>
  );
};

export default Navbar;