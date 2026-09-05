import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import JoinGuide from "../components/JoinGuide";
import GamesSection from "../components/GamesSection";
import GameSpotlights from "../components/GameSpotlights";
import FeaturesSection from "../components/FeaturesSection";
import CommunitySection from "../components/CommunitySection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-bg">
      <Navbar />
      <main>
        <Hero />
        <JoinGuide />
        <GamesSection />
        <GameSpotlights />
        <FeaturesSection />
        <CommunitySection />
      </main>
      <Footer />
    </div>
  );
}
