import { motion } from "framer-motion";
import { MessageCircle, ShieldCheck } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PixelScene from "../components/PixelScene";
import { STAFF } from "../config/staff";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Staff() {
  return (
    <div className="relative min-h-screen bg-bg">
      <Navbar />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden pb-28 pt-32 lg:pt-36"
      >
        <PixelScene variant="community" className="absolute inset-0 h-full w-full opacity-[0.08]" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg to-bg" />

        <div className="relative mx-auto flex max-w-(--container-page) flex-col gap-10 px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <h1 className="text-3xl text-white-pure sm:text-4xl">Staff</h1>
            <p className="mt-2 text-sm text-text-secondary">
              The people running and moderating Legend-IL.
            </p>
          </motion.div>

          {STAFF.length === 0 ? (
            <p className="border border-border bg-surface p-6 text-sm text-text-secondary">
              The team list hasn't been filled in yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {STAFF.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.06, ease }}
                  whileHover={{ y: -3 }}
                  className="border border-border bg-surface p-6 transition-colors duration-300 hover:border-accent/20 hover:bg-surface-light"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck size={18} className="text-accent" />
                    <h3 className="text-lg font-semibold text-white-pure">{member.name}</h3>
                  </div>
                  <p className="mt-1 text-xs font-semibold tracking-[0.1em] text-text-secondary">
                    {member.role.toUpperCase()}
                  </p>
                  {member.discord && (
                    <a
                      href={member.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring mt-4 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-text-muted transition-colors hover:text-accent"
                    >
                      <MessageCircle size={14} />
                      DISCORD
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.main>

      <Footer />
    </div>
  );
}
