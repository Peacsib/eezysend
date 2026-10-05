"use client";

import Image from "next/image";
import { useState } from "react";
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
    desc: "End-to-end encryption for all transfers",
  },
  {
    icon: Zap,
    title: "Instant Transfer",
    desc: "Real-time document delivery",
  },
  {
    icon: Building2,
    title: "Multi-Institution",
    desc: "Connect across financial networks",
  },
  {
    icon: Lock,
    title: "Compliance Ready",
    desc: "Meets regulatory requirements",
  },
];

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div 
      className="min-h-screen w-full relative overflow-x-hidden bg-cover bg-center"
      style={{
        backgroundImage: "url('/hero-new.png')",
      }}
    >
      {/* Overlay only on right side for auth panel */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent xl:via-slate-900/60 to-slate-900/85 xl:to-50%" />
      
      <div className="relative z-10 min-h-screen flex flex-col xl:flex-row">
        {/* ========================================================= */}
        {/* LEFT HERO PANEL - Content Only */}
        {/* ========================================================= */}
        <div className="relative w-full xl:w-[55%] min-h-screen flex flex-col justify-between p-6 lg:p-10 xl:p-12 xl:border-r-2 xl:border-white/30 pb-20 xl:pb-6">
          
          {/* Top-Left Logo */}
          <div className="flex items-center justify-between">
            <div className="inline-block">
              <Image
                src="/eezysend.png"
                alt="EezySend Logo"
                width={280}
                height={80}
                className="h-10 sm:h-12 lg:h-14 2xl:h-16 w-auto object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
                priority
              />
            </div>
          </div>

          {/* Center Typography */}
          <div className="pt-4 pb-6 max-w-2xl space-y-3 lg:space-y-4 2xl:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-light tracking-tight leading-[1.1] text-white font-display">
              <span className="inline-block relative font-fancy italic font-semibold text-[#84cc16] drop-shadow-[0_2px_24px_rgba(132,204,22,0.5)]" 
                style={{
                  textShadow: '0 2px 24px rgba(132, 204, 22, 0.5), 0 0 40px rgba(132, 204, 22, 0.3)'
                }}>
                Secure
                <svg className="absolute -bottom-1 left-0 w-full h-1" viewBox="0 0 100 8" preserveAspectRatio="none">
                  <path d="M0,7 Q25,0 50,5 T100,4" stroke="#84cc16" strokeWidth="2" fill="none" opacity="0.6"></path>
                </svg>
              </span>{' '}
              Document Transfer Made{' '}
              <span className="inline-block relative font-fancy italic font-semibold text-[#84cc16] drop-shadow-[0_2px_24px_rgba(132,204,22,0.5)]"
                style={{
                  textShadow: '0 2px 24px rgba(132, 204, 22, 0.5), 0 0 40px rgba(132, 204, 22, 0.3)'
                }}>
                Easy.
                <svg className="absolute -bottom-1 left-0 w-full h-1 lg:h-1.5" viewBox="0 0 100 8" preserveAspectRatio="none">
                  <path d="M0,7 Q25,0 50,5 T100,4" stroke="#84cc16" strokeWidth="2" fill="none" opacity="0.6"></path>
                </svg>
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-white/85 font-light leading-relaxed max-w-lg font-body">
              Fast, reliable document exchange for financial institutions.
              <span className="block mt-1 text-white/60 text-sm sm:text-base lg:text-base">All in one elegant platform.</span>
            </p>
          </div>

          {/* Bottom 4 Feature Cards - Subtle & Non-Distracting */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {featureCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-lg lg:rounded-xl p-3 lg:p-4 transition-all duration-300 cursor-pointer"
              >
                {/* Icon Container */}
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-white/10 group-hover:bg-white/15 flex items-center justify-center mb-2 lg:mb-3 transition-all duration-300">
                  <card.icon className="w-4 h-4 lg:w-5 lg:h-5 text-white/70 group-hover:text-white/90" strokeWidth={2} />
                </div>
                
                {/* Content */}
                <div>
                  <h3 className="text-xs lg:text-sm font-semibold text-white/85 group-hover:text-white/95 tracking-tight leading-tight mb-1 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-[10px] lg:text-xs text-white/50 group-hover:text-white/65 leading-snug font-light line-clamp-2 transition-colors">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Scroll indicator - Mobile only */}
          <motion.div 
            className="xl:hidden absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <p className="text-xs text-white/60 font-light">Scroll for Sign In</p>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <svg 
                className="w-6 h-6 text-white/60" 
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
        {/* RIGHT AUTH PANEL */}
        {/* ========================================================= */}
        <div className="relative w-full xl:w-[45%] min-h-screen flex flex-col items-center justify-center p-6 md:p-10">
          {/* Login Form */}
          <LoginForm isLogin={isLogin} setIsLogin={setIsLogin} />
          
          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs lg:text-sm text-white/80 font-light">
              &copy; {new Date().getFullYear()} EezySend &middot; All rights reserved
            </p>
          </div>
        </div>
      </div>

      {/* Decorative gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#84cc16]/50 to-transparent" />
    </div>
  );
}
