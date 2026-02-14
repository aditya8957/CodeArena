import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

function Profile() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({});
  const { user } = useSelector((state) => state.auth);
  const [floatingBubbles, setFloatingBubbles] = useState([]);
  const [difficultyStats, setDifficultyStats] = useState({
    easy: { solved: 0, total: 0 },
    medium: { solved: 0, total: 0 },
    hard: { solved: 0, total: 0 }
  });

  // Generate floating bubbles like in homepage
  useEffect(() => {
    const bubbles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 20 + 5,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: Math.random() * 10 + 15,
      opacity: Math.random() * 0.3 + 0.1
    }));
    setFloatingBubbles(bubbles);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, []);

  // Initialize profile data when user is available
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        age: user.age || "",
        bio: user.bio || "Code enthusiast, problem solver, lifelong learner",
        github: user.github || "",
        linkedin: user.linkedin || "",
        leetcode: user.leetcode || ""
      });
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data } = await axiosClient.get("/user/profile");
      setStats(data);
      
      // Update profile data with user info from response
      if (data.user) {
        setProfileData({
          firstName: data.user.firstName || "",
          lastName: data.user.lastName || "",
          age: data.user.age || "",
          bio: data.user.bio || "Code enthusiast, problem solver, lifelong learner",
          github: data.user.github || "",
          linkedin: data.user.linkedin || "",
          leetcode: data.user.leetcode || ""
        });
      }
      
      // Fetch difficulty stats
      const problemsRes = await axiosClient.get("/problem/getAllProblem");
      const allProblems = problemsRes.data;
      
      const solvedRes = await axiosClient.get("/problem/problemSolvedByUser");
      const solvedProblems = solvedRes.data;
      
      const easyTotal = allProblems.filter(p => p.difficulty?.toLowerCase() === 'easy').length;
      const mediumTotal = allProblems.filter(p => p.difficulty?.toLowerCase() === 'medium').length;
      const hardTotal = allProblems.filter(p => p.difficulty?.toLowerCase() === 'hard').length;
      
      const easySolved = solvedProblems.filter(p => p.difficulty?.toLowerCase() === 'easy').length;
      const mediumSolved = solvedProblems.filter(p => p.difficulty?.toLowerCase() === 'medium').length;
      const hardSolved = solvedProblems.filter(p => p.difficulty?.toLowerCase() === 'hard').length;
      
      setDifficultyStats({
        easy: { solved: easySolved, total: easyTotal },
        medium: { solved: mediumSolved, total: mediumTotal },
        hard: { solved: hardSolved, total: hardTotal }
      });
      
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

const handleSaveProfile = async () => {
  try {
    // Prepare the data to send
    const updateData = {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      age: profileData.age ? parseInt(profileData.age) : undefined,
      bio: profileData.bio,
      github: profileData.github,
      linkedin: profileData.linkedin,
      leetcode: profileData.leetcode
    };

    // Remove empty strings or undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === '') {
        delete updateData[key];
      }
    });

    console.log('Sending update data:', updateData);

    // Send PUT request to update user profile
    const { data } = await axiosClient.put("/user/update", updateData);
    
    console.log('Update response:', data);
    
    // Show success message
    alert(data.message || 'Profile updated successfully!');
    
    // Update local state with the returned user data
    if (data.user) {
      // If you have a Redux action to update user, dispatch it here
      // dispatch(updateUser(data.user));
    }
    
    // Refresh profile data
    await fetchProfile();
    setEditing(false);
    
  } catch (error) {
    console.error("Error updating profile:", error);
    
    // Show error message
    if (error.response?.data?.error) {
      if (Array.isArray(error.response.data.error)) {
        alert('Error: ' + error.response.data.error.join(', '));
      } else {
        alert('Error: ' + error.response.data.error);
      }
    } else {
      alert('Failed to update profile. Please try again.');
    }
  }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancelEdit = () => {
    setEditing(false);
    // Reset to original user data
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        age: user.age || "",
        bio: user.bio || "Code enthusiast, problem solver, lifelong learner",
        github: user.github || "",
        linkedin: user.linkedin || "",
        leetcode: user.leetcode || ""
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  if (!stats) return null;

  const progress = stats.totalProblems > 0 ? (stats.solvedCount / stats.totalProblems) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Floating Bubbles Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingBubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className="absolute rounded-full border border-white/10 bg-white/5"
            style={{
              width: bubble.size,
              height: bubble.size,
              left: `${bubble.left}%`,
              top: '-50px',
              opacity: bubble.opacity
            }}
            animate={{
              y: [0, window.innerHeight + 100],
              x: [0, Math.sin(bubble.id) * 50]
            }}
            transition={{
              duration: bubble.duration,
              delay: bubble.delay,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, #fff 1px, transparent 1px),
            linear-gradient(to bottom, #fff 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          animation: 'gridMove 40s linear infinite'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 lg:p-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 lg:mb-12"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                Profile Dashboard
              </h1>
              <p className="text-gray-400">
                Track your coding journey and achievements 🚀
              </p>
            </div>
            <div className="flex gap-3">
              {editing ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveProfile}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg"
                  >
                    Save Changes
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancelEdit}
                    className="px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all"
                  >
                    Cancel
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditing(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg"
                >
                  Edit Profile
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Left Column - Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
              {/* Profile Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500/30 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  {stats.rank && (
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center border-4 border-gray-900">
                      <span className="text-white font-bold text-sm">#{stats.rank}</span>
                    </div>
                  )}
                </div>
                
                {editing ? (
                  <div className="w-full space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleInputChange}
                        placeholder="First Name"
                        className="col-span-1 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last Name"
                        className="col-span-1 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <input
                      type="number"
                      name="age"
                      value={profileData.age}
                      onChange={handleInputChange}
                      placeholder="Age"
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    />
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself..."
                      rows="3"
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {user?.firstName || profileData.firstName} {user?.lastName || profileData.lastName}
                    </h2>
                    <p className="text-gray-400 mb-4">{user?.emailId}</p>
                    <p className="text-gray-300 italic mb-4">{profileData.bio}</p>
                    <div className="flex flex-wrap justify-center gap-4">
                      {profileData.age && (
                        <span className="px-3 py-1 bg-gray-800/50 text-gray-300 rounded-full text-sm">
                          Age: {profileData.age}
                        </span>
                      )}
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30">
                        {user?.role || 'User'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="border-t border-gray-800 pt-6">
                <h3 className="text-gray-400 mb-4">Connect with me</h3>
                {editing ? (
                  <div className="space-y-3">
                    <input
                      type="url"
                      name="github"
                      value={profileData.github}
                      onChange={handleInputChange}
                      placeholder="https://github.com/username"
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 text-sm"
                    />
                    <input
                      type="url"
                      name="linkedin"
                      value={profileData.linkedin}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 text-sm"
                    />
                    <input
                      type="url"
                      name="leetcode"
                      value={profileData.leetcode}
                      onChange={handleInputChange}
                      placeholder="https://leetcode.com/username"
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 text-sm"
                    />
                  </div>
                ) : (
                  <div className="flex flex-wrap justify-center gap-4">
                    {profileData.github && (
                      <a href={profileData.github} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-lg transition-all">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span className="text-sm">GitHub</span>
                      </a>
                    )}
                    {profileData.linkedin && (
                      <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer"
                         className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-lg transition-all">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        <span className="text-sm">LinkedIn</span>
                      </a>
                    )}
                    {profileData.leetcode && (
                      <a href={profileData.leetcode} target="_blank" rel="noopener noreferrer"
                         className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-lg transition-all">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.516-.514.498-1.366-.037-1.901-.535-.535-1.387-.552-1.902-.038l-10.1 10.101c-.981.982-1.494 2.337-1.494 3.835 0 1.498.513 2.895 1.494 3.875l4.347 4.361c.981.979 2.337 1.452 3.834 1.452s2.853-.512 3.835-1.494l2.609-2.637c.514-.514.496-1.365-.039-1.9s-1.386-.553-1.899-.039zM20.811 13.01H10.666c-.702 0-1.27.604-1.27 1.346s.568 1.346 1.27 1.346h10.145c.701 0 1.27-.604 1.27-1.346s-.569-1.346-1.27-1.346z"/>
                        </svg>
                        <span className="text-sm">LeetCode</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Stats */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            
            {/* Main Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <StatCard 
                title="Problems Solved" 
                value={`${stats.solvedCount}/${stats.totalProblems}`}
                icon="🎯"
                color="from-green-500/20 to-emerald-600/20"
                borderColor="border-green-500/30"
              />
              <StatCard 
                title="Accuracy" 
                value={`${stats.accuracy || 0}%`}
                icon="📈"
                color="from-blue-500/20 to-cyan-600/20"
                borderColor="border-blue-500/30"
              />
              <StatCard 
                title="Total Submissions" 
                value={stats.totalSubmissions || 0}
                icon="📊"
                color="from-purple-500/20 to-pink-600/20"
                borderColor="border-purple-500/30"
              />
              <StatCard 
                title="Accepted" 
                value={stats.acceptedSubmissions || 0}
                icon="✅"
                color="from-yellow-500/20 to-orange-600/20"
                borderColor="border-yellow-500/30"
              />
            </div>

            {/* Progress Section with Difficulty Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-gray-800"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">Problem Solving Progress</h3>
                <span className="text-gray-400">{progress.toFixed(1)}%</span>
              </div>
              
              <div className="space-y-8">
                {/* Overall Progress */}
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Overall Progress</span>
                    <span>{stats.solvedCount}/{stats.totalProblems}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                    />
                  </div>
                </div>

                {/* Difficulty Breakdown */}
                <div className="space-y-6">
                  <h4 className="text-gray-300 font-medium">Difficulty Breakdown</h4>
                  
                  {[
                    { 
                      label: "Easy", 
                      solved: difficultyStats.easy.solved, 
                      total: difficultyStats.easy.total, 
                      color: "from-green-400 to-emerald-500",
                      icon: "🟢"
                    },
                    { 
                      label: "Medium", 
                      solved: difficultyStats.medium.solved, 
                      total: difficultyStats.medium.total, 
                      color: "from-yellow-400 to-amber-500",
                      icon: "🟡"
                    },
                    { 
                      label: "Hard", 
                      solved: difficultyStats.hard.solved, 
                      total: difficultyStats.hard.total, 
                      color: "from-red-400 to-rose-500",
                      icon: "🔴"
                    }
                  ].map((diff, index) => {
                    const diffProgress = diff.total > 0 ? (diff.solved / diff.total) * 100 : 0;
                    return (
                      <div key={diff.label} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{diff.icon}</span>
                            <div>
                              <span className="text-gray-300 font-medium">{diff.label}</span>
                              <p className="text-gray-500 text-sm">
                                {diffProgress.toFixed(1)}% complete
                              </p>
                            </div>
                          </div>
                          <span className="text-white font-bold">
                            {diff.solved}/{diff.total}
                          </span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${diffProgress}%` }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                            className={`h-full bg-gradient-to-r ${diff.color}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Daily Streak Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Activity</h3>
                <div className="flex items-center gap-2 text-yellow-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                  <span className="font-bold">{stats.currentStreak || 0} day streak</span>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div key={index} className="aspect-square rounded-lg bg-gray-800 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 rounded-full bg-gradient-to-br from-yellow-500/30 to-orange-600/30"></div>
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-sm text-center mt-4">
                Keep solving problems to maintain your streak!
              </p>
            </motion.div>
          </div>
        </div>

        {/* Additional Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-gray-300">Contribution</h4>
              <span className="text-2xl">🏆</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.contribution || 0}</p>
            <p className="text-gray-400 text-sm mt-2">Community contributions</p>
          </div> */}
{/*           
          <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-gray-300">Active Days</h4>
              <span className="text-2xl">📅</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.activeDays || 0}</p>
            <p className="text-gray-400 text-sm mt-2">Days with submissions</p>
          </div> */}
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(-80px) translateY(-80px); }
        }
      `}</style>
    </div>
  );
}

const StatCard = ({ title, value, icon, color, borderColor }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`bg-gradient-to-br ${color} backdrop-blur-sm border ${borderColor} rounded-2xl p-4 lg:p-6 text-center`}
  >
    <div className="text-2xl lg:text-3xl mb-3">{icon}</div>
    <p className="text-gray-400 text-sm mb-1">{title}</p>
    <p className="text-xl lg:text-2xl font-bold text-white">{value}</p>
  </motion.div>
);

export default Profile;