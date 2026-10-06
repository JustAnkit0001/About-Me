"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ComponentProps, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  hoverLift?: boolean;
} & Omit<ComponentProps<typeof motion.div>, "children" | "className">;

export function Reveal({
  children,
  className,
  delay = 0,
  hoverLift = false,
  ...props
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={
        hoverLift && !prefersReducedMotion ? { y: -3 } : undefined
      }
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.55,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
