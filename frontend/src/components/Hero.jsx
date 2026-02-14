
import React from 'react';
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';

const Hero = () => { 
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-6 border border-indigo-500/20">
                The Ultimate Coding Arena
              </span>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-black dark:text-white leading-tight mb-6">
  Level Up Your <br />
  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 dark:from-indigo-400 dark:via-violet-400 dark:to-cyan-400">
    Coding Skills
  </span>
</h1>
              <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                Join thousands of developers worldwide to master algorithms, compete in weekly contests, 
                and build your professional portfolio with our structured learning paths.
              </p>
              


                  <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                    <Link to="/problems">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                       className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold transition-all shadow-xl shadow-blue-500/30"
                      >
                        Start Learning
                      </motion.button>
                    </Link>
                    <Link to="/problems">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-700 transition-all"
                      >
                        Problem Set
                      </motion.button>
                    </Link>
                  </div>
            </motion.div>

            {/* Platform Stats */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 flex justify-center lg:justify-start gap-8 border-t border-slate-800 pt-8"
            >

 
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Code Snippet Card */}
              <div className="relative overflow-hidden rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900/50 to-black/50 p-6">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm text-gray-400">example.js</span>
                </div>
                <pre className="text-sm font-mono text-gray-300 overflow-x-auto">
                  <code>{`function solveProblem(n) {
              let result = [];
              for (let i = 0; i < n; i++) {
                if (i % 3 === 0 && i % 5 === 0) {
                  result.push("CodeArena");
                } else if (i % 3 === 0) {
                  result.push("Code");
                } else if (i % 5 === 0) {
                  result.push("Arena");
                } else {
                  result.push(i);
                }
              }
              return result;
            }`}</code>
                </pre>
              </div>

              {/* Terminal Output Card */}
              <div className="relative overflow-hidden rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900/50 to-black/50 p-6">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-cyan-500"></div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                  </div>
                  <span className="text-sm text-gray-400">terminal</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 font-mono text-sm">$</span>
                    <span className="text-gray-300 font-mono text-sm">npm test</span>
                  </div>
                  <div className="text-emerald-400 font-mono text-sm">✓ All tests passed (5/5)</div>
                  <div className="text-gray-500 font-mono text-sm">Execution time: 42ms</div>
                  <div className="text-gray-500 font-mono text-sm">Memory used: 12.4MB</div>
                </div>
              </div>
            </div>




            </motion.div>
          </div>

          {/* Visualization / Image */}
          <div className="flex-1 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10"
            >
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-4 shadow-2xl overflow-hidden">
                {/* Mock Code Header */}
                <div className="flex gap-2 mb-4 px-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                </div>
                <img 
                  src="https://picsum.photos/id/1/800/600" 
                  alt="Code Editor Dashboard" 
                  className="rounded-xl grayscale opacity-80 hover:grayscale-0 transition-all duration-700"
                />
              </div>

              {/* Floating Code Snippet Card */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 hidden md:block"
              >
                <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 shadow-2xl backdrop-blur-md">
                  <div className="font-mono text-xs text-indigo-400 mb-2">algorithm.cpp</div>
                  <pre className="text-[10px] text-slate-300">
                    <code>{`while(left <= right) {\n  int mid = left + (right-left)/2;\n  if(arr[mid] == target) return mid;\n  ...\n}`}</code>
                  </pre>
                </div>
              </motion.div>

              {/* Floating Success Card */}
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-8 -left-8 hidden md:block"
              >
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 shadow-2xl backdrop-blur-md flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Accepted</div>
                    <div className="text-sm text-white font-bold">Solution Passed!</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 