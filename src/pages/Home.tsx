import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import JoinGuide from "../components/JoinGuide";
import FeaturesSection from "../components/FeaturesSection";
import CommunitySection from "../components/CommunitySection";
import Footer from "../components/Footer";
import SectionSeam from "../components/SectionSeam";
import NetworkStatusTeaser from "../components/NetworkStatusTeaser";

export default function Home() {
  // Arriving here via client-side navigation (e.g. "STATUS" -> back to
  // "/#join") doesn't trigger the browser's native hash-scroll, so do it
  // ourselves once the page has mounted.
  useEffect(() => {
    if (!window.location.hash) return;
    document.querySelector(window.location.hash)?.scrollIntoView();
  }, []);

  return (
    <div className="relative min-h-screen bg-bg">
      <Navbar />
      <main>
        <Hero />
        <SectionSeam />
        <JoinGuide />
        <SectionSeam />
        <FeaturesSection />
        <NetworkStatusTeaser />
        <SectionSeam />
        <CommunitySection />
      </main>
      <Footer />
    </div>
  );
}
