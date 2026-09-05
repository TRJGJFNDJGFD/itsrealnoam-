import { motion } from "framer-motion";
import { GAMES } from "../config/site";
import GameCard from "./GameCard";
import ComingSoonCard from "./ComingSoonCard";

const featured = GAMES.find((g) => g.featured)!;
const rest = GAMES.filter((g) => !g.featured);

export default function GamesSection() {
  return (
    <section id="games" className="relative border-t border-border bg-bg">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
      >
        <GameCard game={featured} size="large" />
      </motion.div>

      <div className="grid border-t border-border sm:grid-cols-2">
        {rest.map((game, i) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 * (i + 1) }}
          >
            <GameCard game={game} />
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 * (rest.length + 1) }}
          className="border-t border-border sm:border-l sm:border-t-0"
        >
          <ComingSoonCard />
        </motion.div>
      </div>
    </section>
  );
}
