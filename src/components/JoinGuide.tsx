import { useState } from "react";
import { motion } from "framer-motion";
import CopyIP from "./CopyIP";

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
  const steps = STEPS[tab];

  return (
    <section className="relative border-t border-border bg-bg-secondary py-20 lg:py-28">
      <div className="mx-auto max-w-(--container-page) px-6 lg:px-10">
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
              Legend-IL supports both Java and Bedrock Edition. Copy the address and connect in
              under a minute.
            </p>
            <CopyIP className="mt-6 max-w-xs" />
          </div>

          <div className="w-full max-w-md">
            <div className="mb-6 inline-flex border border-border">
              <button
                onClick={() => setTab("java")}
                className={`focus-ring px-5 py-2 text-xs font-semibold tracking-[0.15em] transition-colors ${
                  tab === "java" ? "bg-accent text-bg" : "text-text-secondary hover:text-white-pure"
                }`}
              >
                JAVA
              </button>
              <button
                onClick={() => setTab("bedrock")}
                className={`focus-ring px-5 py-2 text-xs font-semibold tracking-[0.15em] transition-colors ${
                  tab === "bedrock" ? "bg-accent text-bg" : "text-text-secondary hover:text-white-pure"
                }`}
              >
                BEDROCK
              </button>
            </div>

            <ol className="space-y-5">
              {steps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border border-border text-xs text-accent">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white-pure">{step.title}</p>
                    <p className="mt-1 text-sm text-text-secondary">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
