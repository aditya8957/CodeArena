import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function Contest() {
  const [floatingBubbles, setFloatingBubbles] = useState([]);
  const [mounted, setMounted] = useState(false);

  // Simple placeholder contest data
  const contests = [
    {
      id: 1,
      title: "Weekly Coding Challenge",
      platform: "CodeArena",
      difficulty: "Medium",
      duration: "2 hours",
      date: "Coming Soon",
      description: "Test your coding skills with weekly challenges"
    },
    {
      id: 2,
      title: "Algorithms Showdown",
      platform: "CodeArena",
      difficulty: "Hard",
      duration: "3 hours",
      date: "Coming Soon",
      description: "Compete in algorithm optimization challenges"
    },
    {
      id: 3,
      title: "Frontend Frenzy",
      platform: "CodeArena",
      difficulty: "Easy",
      duration: "1.5 hours",
      date: "Coming Soon",
      description: "Build responsive and interactive web interfaces"
    }
  ];

  useEffect(() => {
    setMounted(true);
    
    const bubbles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 20 + 8,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: Math.random() * 15 + 20,
      opacity: Math.random() * 0.15 + 0.05
    }));
    setFloatingBubbles(bubbles);
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'hard': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated Background */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Bubbles */}
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
                x: [0, Math.sin(bubble.id) * 30]
              }}
              transition={{
                duration: bubble.duration,
                delay: bubble.delay,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
          
          {/* Animated Grid */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(to right, #fff 1px, transparent 1px),
                linear-gradient(to bottom, #fff 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}></div>
          </div>

          {/* Glowing Orbs */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div 
            className="inline-flex items-center justify-center mb-6"
            animate={{ 
              scale: [1, 1.03, 1],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-purple-500/30">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Upcoming Contests
          </motion.h1>
          <motion.p 
            className="text-gray-400 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Exciting coding competitions are on the horizon. Stay tuned for more details!
          </motion.p>
        </motion.div>

        {/* Contests Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {contests.map((contest) => (
            <motion.div
              key={contest.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 * contest.id }}
              className="group"
            >
              <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:border-indigo-500/50 hover:shadow-indigo-500/20 hover:transform hover:-translate-y-2 h-full">
                {/* Contest Card */}
                <div className="p-8 h-full flex flex-col">
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-indigo-400 font-semibold">
                        {contest.platform}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(contest.difficulty)}`}>
                        {contest.difficulty}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                      {contest.title}
                    </h3>
                    
                    <p className="text-gray-400 mb-6">
                      {contest.description}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center text-gray-300">
                      <svg className="w-5 h-5 mr-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-400">Duration</p>
                        <p className="font-medium">{contest.duration}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-300">
                      <svg className="w-5 h-5 mr-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-400">Date</p>
                        <p className="font-medium">{contest.date}</p>
                      </div>
                    </div>
                  </div>

                  {/* Coming Soon Badge */}
                  <div className="mt-auto pt-6 border-t border-gray-800">
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">Details Coming Soon</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Info Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-3xl mx-auto mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">More Contests Coming Soon!</h3>
            <p className="text-gray-400 mb-6">
              We're working on bringing you exciting coding competitions with amazing prizes. 
              Check back regularly for updates on upcoming events.
            </p>
            <div className="inline-flex items-center gap-2 text-indigo-400">
              <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span>Stay tuned for announcements</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Contest;