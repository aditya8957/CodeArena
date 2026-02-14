import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ title, description, icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -5, borderColor: 'rgba(99, 102, 241, 0.5)' }}
    className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl transition-colors group cursor-default"
  >
    <div className="w-12 h-12 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-500 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm">
      {description}
    </p>
  </motion.div>
);

const Features = () => {
  const features = [
    {
      title: "Practice Problems",
      description:
        "Access our vast library of hand-picked problems spanning data structures, dynamic programming, and more.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      title: "Compete in Contests",
      description:
        "Join weekly and bi-weekly global contests. Climb the leaderboard, earn points, and win prizes from top tech companies.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Structured Paths",
      description:
        "Follow curated learning roadmaps tailored for career tracks like FAANG interview prep, Machine Learning, or Frontend mastery.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A2 2 0 013 15.487V5.487a2 2 0 011.132-1.803l7.447-3.724a2 2 0 011.842 0l7.447 3.724A2 2 0 0121 5.487v10a2 2 0 01-1.132 1.803L15 20l-3 1.5-3-1.5z" />
        </svg>
      ),
    },
    {
      title: "Track Your Progress",
      description:
        "Deep dive into your performance analytics. Track your solving speed, accuracy, and compare with peers globally.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold text-white mb-4"
          >
            Built for Serious Coders
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            We provide all the tools you need to sharpen your logic and build a successful career in tech.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              delay={idx * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
