import React from "react";
import Hero from "../components/Hero";
import About from "../components/About";
import Package from "../components/Packages";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import ContactCTA from "../components/ContactCTA";

const Home = () => {
  return (
    <div>
      <Hero />
      <About />
      <Package />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <ContactCTA />
    </div>
  );
};

export default Home;
