import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import JoinGuide from "../components/JoinGuide";
import FeaturesSection from "../components/FeaturesSection";
import CommunitySection from "../components/CommunitySection";
import Footer from "../components/Footer";
import SectionSeam from "../components/SectionSeam";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-bg">
      <Navbar />
      <main>
        <Hero />
        <SectionSeam />
        <JoinGuide />
        <SectionSeam />
        <FeaturesSection />
        <SectionSeam />
        <CommunitySection />
      </main>
      <Footer />
    </div>
  );
}
