import { MotionConfig } from "framer-motion";
import Home from "./pages/Home";

function App() {
  // Framer Motion animates transforms directly (not via CSS transitions), so
  // the prefers-reduced-motion override in globals.css doesn't reach it on
  // its own — this makes Framer Motion itself honor the OS setting.
  return (
    <MotionConfig reducedMotion="user">
      <Home />
    </MotionConfig>
  );
}

export default App;
