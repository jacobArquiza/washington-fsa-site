import type { ReactNode } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { AnimatePresence, motion } from "motion/react";

type MissionCardProps = {
  value: string;
  title: string;
  description: string;
  icon: ReactNode;
  isActive: boolean;
};

export default function MissionCard({
  value,
  title,
  description,
  icon,
  isActive,
}: MissionCardProps) {
  return (
    <Accordion.Item value={value} asChild>
      <motion.article layout className="relative px-3 py-4 sm:px-6">
        {isActive && (
          <motion.div
            layoutId="active-mission-card"
            className="absolute inset-0 rounded-xl bg-gold/20"
          />
        )}

        <Accordion.Header className="relative z-10">
          <Accordion.Trigger asChild>
            <motion.button
              type="button"
              whileTap={{ scale: 0.985 }}
              className="flex min-h-12 w-full items-center gap-3 text-left font-display text-lg text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-blue focus-visible:ring-offset-4 focus-visible:ring-offset-cream sm:gap-4 sm:text-2xl lg:text-3xl"
            >
              {icon}
              {title}
            </motion.button>
          </Accordion.Trigger>
        </Accordion.Header>

        <AnimatePresence initial={false}>
          {isActive && (
            <Accordion.Content forceMount asChild>
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="relative z-10 overflow-hidden"
              >
                <p className="ml-9 mt-3 max-w-md text-base leading-snug text-ink/80 sm:ml-10 sm:text-lg">
                  {description}
                </p>
              </motion.div>
            </Accordion.Content>
          )}
        </AnimatePresence>
      </motion.article>
    </Accordion.Item>
  );
}
