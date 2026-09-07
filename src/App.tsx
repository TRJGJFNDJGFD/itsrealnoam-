import { MotionConfig } from "framer-motion";
import Home from "./pages/Home";
import Status from "./pages/Status";
import { useRoute } from "./lib/router";

function App() {
  const pathname = useRoute();

  // Framer Motion animates transforms directly (not via CSS transitions), so
  // the prefers-reduced-motion override in globals.css doesn't reach it on
  // its own — this makes Framer Motion itself honor the OS setting.
  return (
    <MotionConfig reducedMotion="user">
      {pathname.startsWith("/status") ? <Status /> : <Home />}
    </MotionConfig>
  );
}

export default App;
