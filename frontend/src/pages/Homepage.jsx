import { useEffect, useState } from 'react';
import { NavLink } from 'react-router'; // Fixed import
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import { motion } from 'framer-motion';

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all' 
  });
  const [floatingBubbles, setFloatingBubbles] = useState([]);

  // Generate floating bubbles
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
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

const filteredProblems = problems.filter(problem => {
  const difficultyMatch =
    filters.difficulty === 'all' ||
    problem.difficulty === filters.difficulty;

  const tagMatch =
    filters.tag === 'all' ||
    (Array.isArray(problem.tags) && problem.tags.includes(filters.tag));

  const statusMatch =
    filters.status === 'all' ||
    solvedProblems.some(sp => sp._id === problem._id);

  return difficultyMatch && tagMatch && statusMatch;
});


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

      {/* Main Content */}
      <div className="relative z-10 container mx-auto p-4 lg:p-8">
        {/* Header with Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 lg:mb-12"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            Problem Set
          </h1>
          <div className="flex flex-wrap gap-4 text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{problems.filter(p => p.difficulty === 'easy').length} Easy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>{problems.filter(p => p.difficulty === 'medium').length} Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>{problems.filter(p => p.difficulty === 'hard').length} Hard</span>
            </div>
            {user && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>{solvedProblems.length} Solved</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Modern Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 lg:mb-12"
        >
          <div className="flex flex-wrap gap-4">
            {/* Status Filter */}
            <div className="relative group">
              <select 
                className="appearance-none bg-gray-900 border border-gray-700 rounded-xl px-6 py-3 text-white font-medium focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/20 pr-12 cursor-pointer transition-all hover:border-gray-600"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="all" className="bg-gray-900">All Problems</option>
                <option value="solved" className="bg-gray-900">Solved Only</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                ▼
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="relative group">
              <select 
                className="appearance-none bg-gray-900 border border-gray-700 rounded-xl px-6 py-3 text-white font-medium focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/20 pr-12 cursor-pointer transition-all hover:border-gray-600"
                value={filters.difficulty}
                onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
              >
                <option value="all" className="bg-gray-900">All Difficulties</option>
                <option value="easy" className="bg-gray-900">Easy</option>
                <option value="medium" className="bg-gray-900">Medium</option>
                <option value="hard" className="bg-gray-900">Hard</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                ▼
              </div>
            </div>

            {/* Tag Filter */}
            <div className="relative group">
              <select 
                className="appearance-none bg-gray-900 border border-gray-700 rounded-xl px-6 py-3 text-white font-medium focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/20 pr-12 cursor-pointer transition-all hover:border-gray-600"
                value={filters.tag}
                onChange={(e) => setFilters({...filters, tag: e.target.value})}
              >
                <option value="all" className="bg-gray-900">All Tags</option>
                <option value="array" className="bg-gray-900">Array</option>
                  <option value="string" className="bg-gray-900">String</option>
                  <option value="binary-search" className="bg-gray-900">Binary Search</option>
                  <option value="two-pointer" className="bg-gray-900">Two Pointer</option>
                  <option value="sliding-window" className="bg-gray-900">Sliding Window</option>
                  <option value="greedy" className="bg-gray-900">Greedy</option>
                  <option value="recursion" className="bg-gray-900">Recursion</option>
                  <option value="backtracking" className="bg-gray-900">Backtracking</option>
                  <option value="divide-conquer" className="bg-gray-900">Divide & Conquer</option>
                  <option value="dp" className="bg-gray-900">Dynamic Programming</option>
                  <option value="linkedList" className="bg-gray-900">Linked List</option>
                  <option value="stack" className="bg-gray-900">Stack</option>
                  <option value="queue" className="bg-gray-900">Queue</option>
                  <option value="heap" className="bg-gray-900">Heap / Priority Queue</option>
                  <option value="hashing" className="bg-gray-900">Hashing</option>

                  <option value="tree" className="bg-gray-900">Tree</option>
                  <option value="binaryTree" className="bg-gray-900">Binary Tree</option>
                  <option value="bst" className="bg-gray-900">Binary Search Tree</option>
                  <option value="graph" className="bg-gray-900">Graph</option>
                  <option value="trie" className="bg-gray-900">Trie</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                ▼
              </div>
            </div>
          </div>
        </motion.div>

        {/* Problems Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid gap-4 lg:gap-6"
        >
          {filteredProblems.map((problem, index) => (
            <motion.div
              key={problem._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-gray-800 hover:border-gray-700 transition-all duration-300"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/0 to-white/0 group-hover:via-white/5 group-hover:to-white/0 transition-all duration-500"></div>
              
              <div className="relative p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <NavLink 
                        to={`/problem/${problem._id}`}
                        className="text-xl lg:text-2xl font-bold text-white hover:text-gray-200 transition-colors"
                      >
                        {problem.title}
                      </NavLink>
                      {solvedProblems.some(sp => sp._id === problem._id) && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-1 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-green-400 text-sm font-medium">Solved</span>
                        </motion.div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyStyle(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                      {/* <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-800 text-gray-300 border border-gray-700">
                        {problem.tags}
                      </span> */}


                        <div className="flex gap-2">
                        {(Array.isArray(problem.tags)
                          ? problem.tags
                          : problem.tags
                              .replace(/([a-z])([A-Z])/g, '$1 $2') 
                              .split(/[, ]+/)                    
                        ).map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-full text-xs font-medium bg-gray-800/50 text-gray-300 border border-gray-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>


                    </div>
                  </div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="lg:self-start"
                  >
                    <NavLink 
                      to={`/problem/${problem._id}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
                    >
                      <span>Solve</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </NavLink>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProblems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-gray-500 text-6xl mb-4">🧩</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Problems Found</h3>
            <p className="text-gray-400">Try adjusting your filters to find more problems.</p>
          </motion.div>
        )}
      </div>

      {/* Add CSS for grid animation */}
      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(-80px) translateY(-80px); }
        }
      `}</style>
    </div>
  );
}

const getDifficultyStyle = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy': 
      return 'bg-green-500/10 text-green-400 border-green-500/30';
    case 'medium': 
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    case 'hard': 
      return 'bg-red-500/10 text-red-400 border-red-500/30';
    default: 
      return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
  }
};

export default Homepage;