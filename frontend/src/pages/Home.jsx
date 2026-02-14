

import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen selection:bg-indigo-500/30">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
