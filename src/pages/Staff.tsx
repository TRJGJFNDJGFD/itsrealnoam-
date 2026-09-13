import { motion } from "framer-motion";
import { MessageCircle, ShieldCheck } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PixelScene from "../components/PixelScene";
import { SITE_CONFIG } from "../config/site";
import { STAFF_CATEGORIES } from "../config/staff";

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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STAFF_CATEGORIES.map((category, i) => (
              <motion.div
                key={category.role}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.04, ease }}
                whileHover={{ y: -3 }}
                className="border border-border bg-surface p-6 transition-colors duration-300 hover:border-accent/20 hover:bg-surface-light"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={18} className="text-accent" />
                  <h3 className="text-sm font-semibold tracking-[0.1em] text-white-pure">
                    {category.role.toUpperCase()}
                  </h3>
                </div>

                {category.members.length > 0 ? (
                  <ul className="mt-4 flex flex-col gap-1.5">
                    {category.members.map((name) => (
                      <li key={name} className="text-base text-text-primary">
                        {name}
                      </li>
                    ))}
                  </ul>
                ) : category.recruiting ? (
                  <a
                    href={SITE_CONFIG.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent/80"
                  >
                    <MessageCircle size={14} />
                    Recruiting — apply on Discord
                  </a>
                ) : (
                  <p className="mt-4 text-sm text-text-muted">Vacant</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.main>

      <Footer />
    </div>
  );
}
