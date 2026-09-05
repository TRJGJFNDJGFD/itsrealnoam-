import { useState } from "react";
import { motion } from "framer-motion";
import { SITE_CONFIG } from "../config/site";
import CopyIP from "./CopyIP";
import PixelScene from "./PixelScene";

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } },
};

const STEPS = {
  java: [
    { title: "Open Minecraft: Java Edition", body: "Launch the game and go to Multiplayer from the main menu." },
    { title: "Add a server", body: 'Click "Add Server" and paste the Legend-IL address into the Server Address field.' },
    { title: "Join", body: "Save and double-click the server to connect. That's it." },
  ],
  bedrock: [
    { title: "Open Minecraft: Bedrock Edition", body: "Works on console, mobile and Windows — go to Servers from the main menu." },
    { title: "Add server", body: "Scroll to the bottom and select Add Server. Use the Legend-IL address as the Server Address." },
    { title: "Set the port", body: "Set the port to 19132, save, then tap the server to join." },
  ],
};

export default function JoinGuide() {
  const [tab, setTab] = useState<"java" | "bedrock">("java");
  // Bedrock steps only render once SITE_CONFIG.bedrockSupported is true —
  // don't advertise a platform the server hasn't confirmed it supports.
  const steps = STEPS[SITE_CONFIG.bedrockSupported ? tab : "java"];

  return (
    <section
      id="join"
      className="relative overflow-hidden bg-bg-secondary py-20 lg:py-28"
    >
      <PixelScene variant="practice" className="absolute inset-0 h-full w-full opacity-[0.12]" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg-secondary via-bg-secondary/95 to-bg-secondary" />
      <div className="relative mx-auto max-w-(--container-page) px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between"
        >
          <div className="max-w-sm">
            <span className="mb-3 block text-xs font-semibold tracking-[0.25em] text-accent">
              GET STARTED
            </span>
            <h2 className="text-3xl text-white-pure sm:text-4xl">HOW TO JOIN</h2>
            <p className="mt-4 text-text-secondary">
              {SITE_CONFIG.bedrockSupported
                ? "Legend-IL supports both Java and Bedrock Edition. Copy the address and connect in under a minute."
                : "Legend-IL runs on Java Edition. Copy the address and connect in under a minute."}
            </p>
            <CopyIP className="mt-6 max-w-xs" />
          </div>

          <div className="w-full max-w-md">
            {SITE_CONFIG.bedrockSupported && (
              <div className="mb-6 inline-flex border border-border" role="tablist" aria-label="Edition">
                <button
                  role="tab"
                  aria-selected={tab === "java"}
                  onClick={() => setTab("java")}
                  className={`focus-ring px-5 py-2 text-xs font-semibold tracking-[0.15em] transition-colors ${
                    tab === "java" ? "bg-accent text-bg" : "text-text-secondary hover:text-white-pure"
                  }`}
                >
                  JAVA
                </button>
                <button
                  role="tab"
                  aria-selected={tab === "bedrock"}
                  onClick={() => setTab("bedrock")}
                  className={`focus-ring px-5 py-2 text-xs font-semibold tracking-[0.15em] transition-colors ${
                    tab === "bedrock" ? "bg-accent text-bg" : "text-text-secondary hover:text-white-pure"
                  }`}
                >
                  BEDROCK
                </button>
              </div>
            )}

            <motion.ol
              variants={listVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              className="space-y-5"
            >
              {steps.map((step, i) => (
                <motion.li key={step.title} variants={itemVariants} className="flex gap-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border border-border text-xs text-accent">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white-pure">{step.title}</p>
                    <p className="mt-1 text-sm text-text-secondary">{step.body}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
