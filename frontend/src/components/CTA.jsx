import React from 'react';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-black to-gray-900 p-12 text-center border border-gray-700"
        >
          {/* Animated grid background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(to right, #fff 1px, transparent 1px),
                linear-gradient(to bottom, #fff 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              animation: 'gridMove 20s linear infinite'
            }}></div>
            
            {/* Animated floating elements */}
            <motion.div 
              className="absolute w-32 h-32 border border-white/20 rounded-full"
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.div 
              className="absolute w-40 h-40 border border-white/10 rounded-full"
              animate={{
                x: [100, 0, 100],
                y: [50, 0, 50],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Pulsing dots */}
            <div className="absolute top-1/4 left-1/4">
              <motion.div 
                className="w-3 h-3 bg-white rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            <div className="absolute bottom-1/4 right-1/4">
              <motion.div 
                className="w-2 h-2 bg-white rounded-full"
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </div>

          {/* Glitch text effect */}
          <div className="relative z-10">
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
                Ready to Dominate <br className="hidden md:block" />
                the <span className="relative">
                  <span className="text-white">Leaderboard</span>
                  <span className="absolute top-0 left-0 text-gray-400 animate-pulse" style={{ animationDuration: '3s' }}>
                    Leaderboard
                  </span>
                  <span className="absolute top-0 left-0 text-gray-600 opacity-70" style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 66%, 0 66%)'
                  }}>
                    Leaderboard
                  </span>
                </span>?
              </h2>
            </div>
            
            <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto">
              Start your journey today and join a global community of competitive programmers.
            </p>
            
            <Link to="/problems">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-10 py-4 bg-white text-black rounded-xl font-bold text-lg shadow-2xl hover:bg-gray-100 transition-colors overflow-hidden group"
              >
                <span className="relative z-10">Start Learning Now</span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
              </motion.button>
            </Link>
            
            <div className="mt-8 text-gray-400 text-sm font-medium flex items-center justify-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div 
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="w-8 h-8 rounded-full border-2 border-gray-800 bg-gradient-to-br from-gray-700 to-gray-900"
                  />
                ))}
              </div>
              <span><span className="font-bold">Real-time</span> code execution</span>
            </div>
            
            {/* Binary code animation */}
            <div className="mt-12 opacity-20 text-xs font-mono text-gray-500 overflow-hidden">
              <motion.div
                animate={{ x: [-100, 100] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="whitespace-nowrap"
              >
                01010011 01110100 01100001 01110010 01110100 00100000 01000011 01101111 01100100 01101001 01101110 01100111 00100000 01010100 01101111 01100100 01100001 01111001 00100000 00101101 00100000 01000011 01101111 01100100 01100101 01000001 01110010 01100101 01101110 01100001 00100000
              </motion.div>
            </div>
          </div>
          
          {/* Add CSS for grid animation */}
          <style jsx>{`
            @keyframes gridMove {
              0% { transform: translateX(0) translateY(0); }
              100% { transform: translateX(-50px) translateY(-50px); }
            }
          `}</style>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;