"use client";

import { motion } from "framer-motion";
import LoginForm from "@/components/LoginForm";
import {
  Shield,
  Zap,
  Building2,
  Lock,
} from "lucide-react";

const featureCards = [
  {
    icon: Shield,
    title: "Bank-Grade Security",
    desc: "End-to-end encryption",
  },
  {
    icon: Zap,
    title: "Instant Transfer",
    desc: "Real-time delivery",
  },
  {
    icon: Building2,
    title: "Multi-Institution",
    desc: "Connected network",
  },
  {
    icon: Lock,
    title: "Compliance Ready",
    desc: "Regulatory standards",
  },
];

export default function Home() {
  return (
    <div
      className="min-h-screen w-full relative overflow-x-hidden bg-cover bg-[position:28%_center] sm:bg-[position:30%_center] xl:bg-center"
      style={{
        backgroundImage: "url('/hero2.png')",
      }}
    >
      <div className="relative z-10 min-h-screen flex flex-col xl:flex-row">
        {/* ========================================================= */}
        {/* LEFT HERO PANEL - Clean, Minimal with Baked-in Logo */}
        {/* ========================================================= */}
        <div className="relative w-full xl:w-[55%] min-h-screen flex flex-col justify-between p-6 sm:p-8 lg:p-10 xl:p-12 pb-16 xl:pb-8">
          {/* Distinct Architectural Split Line */}
          <div
            className="hidden xl:block absolute right-0 top-0 bottom-0 w-[1.5px] bg-linear-to-b from-slate-300/40 via-slate-400/80 to-slate-300/40 shadow-[1px_0_0_rgba(255,255,255,0.9)] pointer-events-none"
            aria-hidden="true"
          />

          {/* Top spacer matching the height of the baked-in logo in hero2.png */}
          <div className="h-[40vh] sm:h-[41vh] xl:h-[42vh] flex-shrink-0 pointer-events-none" />

          {/* Tagline - Centered precisely against the entire EezySend logo in hero2.png with balanced spacing */}
          <div className="w-full flex justify-center mt-2.5 sm:mt-3 hero-tagline-aligned pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-full text-center space-y-1.5 px-4 max-w-3xl pointer-events-auto"
            >
              <p className="text-sm sm:text-base lg:text-[17px] xl:text-[17.5px] text-slate-800 font-semibold tracking-normal leading-relaxed font-body drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)] xl:whitespace-nowrap">
                Fast, reliable document exchange for financial institutions.
              </p>
              <p className="text-xs sm:text-sm lg:text-[14px] text-slate-600 font-medium font-body drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
                All in one elegant platform.
              </p>
            </motion.div>
          </div>

          {/* Bottom Feature Cards - Subtle, harmonious & non-competing */}
          <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mt-auto pt-6">
            {featureCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 + index * 0.04 }}
                className="group relative bg-white/30 hover:bg-white/55 backdrop-blur-[3px] border border-slate-300/40 hover:border-slate-300/70 rounded-xl p-2.5 sm:p-3 transition-colors duration-200"
              >
                {/* Icon - Soft & Understated */}
                <div className="w-7 h-7 rounded-lg bg-white/60 border border-slate-200/70 flex items-center justify-center mb-1.5 text-slate-600 group-hover:text-eezysend-blue transition-colors">
                  <card.icon className="w-3.5 h-3.5" strokeWidth={1.8} />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 tracking-tight leading-tight mb-0.5 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-[10.5px] text-slate-500 font-normal leading-snug transition-colors">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Scroll indicator - Mobile only */}
          <motion.div
            className="xl:hidden mt-4 flex flex-col items-center gap-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <p className="text-xs text-slate-600 font-medium">Scroll for Sign In</p>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <svg
                className="w-6 h-6 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT AUTH PANEL - Focused, Compact Share */}
        {/* ========================================================= */}
        <div className="relative w-full xl:w-[45%] min-h-screen flex flex-col items-center justify-center p-6 md:p-8 xl:p-6 2xl:p-8">
          {/* Login Form */}
          <LoginForm />

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs lg:text-sm text-slate-600 font-medium">
              &copy; {new Date().getFullYear()} EezySend &middot; All rights reserved
            </p>
          </div>
        </div>
      </div>

      {/* Decorative gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-eezysend-blue/30 to-transparent" />
    </div>
  );
}
