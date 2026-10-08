"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
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

const taglineLine1 = ["Fast,", "reliable", "document", "exchange", "for", "financial", "institutions."];
const taglineLine2 = ["All", "in", "one", "elegant", "platform."];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const desktopLeftRef = useRef<HTMLDivElement>(null);
  const desktopRightRef = useRef<HTMLDivElement>(null);

  // GSAP animation orchestration
  useEffect(() => {
    const ctx = gsap.context(() => {
      // ----------------------------------------------------
      // DESKTOP GSAP TIMELINE (xl screens)
      // Uses the single unified new-hero.webp full background
      // ----------------------------------------------------
      const desktopTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Initial state locks to prevent FOUC
      gsap.set(".desktop-divider-line", { scaleY: 0, transformOrigin: "top" });
      gsap.set(".desktop-login-card", { opacity: 0, y: 25, scale: 0.97 });
      gsap.set(".desktop-footer-badge", { opacity: 0 });

      // 1. Brand logo smooth entrance
      desktopTl.fromTo(
        ".desktop-logo",
        { opacity: 0, scale: 0.88, y: -20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.75, ease: "back.out(1.2)" }
      );

      // 2. Tagline wave typing: words rise and unblur in liquid sequence
      desktopTl.fromTo(
        ".desktop-tagline-word",
        { opacity: 0, y: 16, filter: "blur(4px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.45, stagger: 0.05, ease: "power2.out" },
        "-=0.2"
      );

      // 3. Feature cards ocean wave: cascade from high to low settling like a sea wave on the lower reflective floor
      desktopTl.fromTo(
        ".desktop-feature-card",
        { opacity: 0, y: -60, rotation: -2.5, scale: 0.9, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          rotation: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.65,
          stagger: 0.15,
          ease: "back.out(1.35)",
        },
        "+=0.4"
      );

      // 4. Architectural divider line draws down
      desktopTl.to(
        ".desktop-divider-line",
        { scaleY: 1, duration: 0.6, ease: "power2.inOut" },
        "-=0.1"
      );

      // 5. Right section: Sign-in view reveals smoothly in full view over Zimbabwe map
      desktopTl.to(
        ".desktop-login-card",
        { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: "power4.out" },
        "-=0.2"
      );

      desktopTl.to(
        ".desktop-footer-badge",
        { opacity: 1, duration: 0.45, ease: "power2.out" },
        "-=0.3"
      );

      // ----------------------------------------------------
      // MOBILE / TABLET GSAP TIMELINE (< xl screens)
      // 3-Act Cinematic Welcome Sequence
      // Act 1: Brand (Centered Logo + Tagline wave alone)
      // Act 2: Cards (Boxy stack top-to-bottom through center)
      // Act 3: Sign-In (Permanent screen over Zimbabwe map)
      // ----------------------------------------------------
      const mobileTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Initial state locks
      gsap.set(".mobile-act-brand", { opacity: 1, y: 0 });
      gsap.set(".mobile-act-cards", { opacity: 0, y: 0, pointerEvents: "none" });
      gsap.set(".mobile-act-signin", { opacity: 0, pointerEvents: "none" });
      gsap.set(".mobile-bg-signin", { opacity: 0 });

      // ACT 1: BRAND WELCOME ALONE (Centered Logo & Tagline wave)
      mobileTl.fromTo(
        ".mobile-brand-logo",
        { opacity: 0, scale: 0.86, y: -20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.75, ease: "back.out(1.2)" }
      );

      mobileTl.fromTo(
        ".mobile-tagline-word",
        { opacity: 0, y: 16, filter: "blur(4px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.45, stagger: 0.05, ease: "power2.out" },
        "-=0.2"
      );

      // User absorbs the brand view alone (~2.0s pause)
      mobileTl.to(
        ".mobile-act-brand",
        { opacity: 0, y: -30, filter: "blur(6px)", duration: 0.65, ease: "power2.inOut", pointerEvents: "none" },
        "+=2.0"
      );

      // ACT 2: CARDS WAVE CASCADE (Boxy cards stack top-to-bottom)
      mobileTl.set(".mobile-act-cards", { opacity: 1, pointerEvents: "auto" });

      // The 4 cards cascade down in sequence like an ocean sea wave from top to bottom
      mobileTl.fromTo(
        ".mobile-card-item",
        { opacity: 0, y: -50, scale: 0.9, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.6,
          stagger: 0.16,
          ease: "back.out(1.35)",
        },
        "-=0.1"
      );

      // Cards remain for user viewing (~2.5s pause)
      mobileTl.to(
        ".mobile-act-cards",
        { opacity: 0, y: 30, filter: "blur(6px)", duration: 0.65, ease: "power2.inOut", pointerEvents: "none" },
        "+=2.5"
      );

      // ACT 3: SIGN-IN REVEAL (Final permanent screen)
      // Background crossfades to hero-right (Zimbabwe network map)
      mobileTl.to(
        ".mobile-bg-signin",
        { opacity: 1, duration: 0.85, ease: "power2.inOut" },
        "-=0.3"
      );

      mobileTl.set(".mobile-act-signin", { pointerEvents: "auto" });

      mobileTl.fromTo(
        ".mobile-act-signin",
        { opacity: 0, scale: 0.96, filter: "blur(8px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.85, ease: "power3.out" },
        "-=0.5"
      );

      mobileTl.fromTo(
        ".mobile-login-card-inner",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.65, ease: "power4.out" },
        "-=0.5"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen w-full relative overflow-x-hidden selection:bg-eezysend-blue/20">
      {/* ========================================================= */}
      {/* DESKTOP VIEW (xl:flex) — 2-Column Split (55% / 45%)       */}
      {/* Uses the single, full new-hero.webp background            */}
      {/* ========================================================= */}
      <div className="hidden xl:flex relative z-10 min-h-screen flex-row bg-[url('/new-hero.webp')] bg-cover bg-center">
        {/* LEFT HERO PANEL (55%) */}
        <div
          ref={desktopLeftRef}
          className="relative w-[55%] min-h-screen flex flex-col justify-between p-10 xl:p-14 pb-8 z-10"
        >
          {/* Architectural Split Line */}
          <div
            className="desktop-divider-line absolute right-0 top-0 bottom-0 w-[1.5px] bg-linear-to-b from-slate-300/40 via-slate-400/80 to-slate-300/40 shadow-[1px_0_0_rgba(255,255,255,0.9)] pointer-events-none"
            aria-hidden="true"
          />

          {/* Top spacer */}
          <div className="shrink-0 h-4 xl:h-8" />

          {/* Center Brand & Tagline Block */}
          <div className="my-auto flex flex-col items-center justify-center text-center px-4 max-w-2xl mx-auto w-full translate-y-6 xl:translate-y-16">
            <div className="desktop-logo flex justify-center mb-5">
              <img
                src="/new-logo.webp"
                alt="EezySend"
                className="h-16 sm:h-20 xl:h-22 2xl:h-24 w-auto object-contain drop-shadow-[0_6px_24px_rgba(10,62,148,0.12)]"
              />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              {/* Tagline Line 1 (Words wave in) */}
              <p className="text-base sm:text-lg xl:text-[18.5px] text-slate-800 font-semibold tracking-normal leading-relaxed font-body drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)] flex flex-wrap justify-center gap-x-1.5">
                {taglineLine1.map((word, i) => (
                  <span key={i} className="desktop-tagline-word inline-block">
                    {word}
                  </span>
                ))}
              </p>

              {/* Tagline Line 2 (Words wave in) */}
              <p className="text-xs sm:text-sm xl:text-[14.5px] text-slate-600 font-medium font-body drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] flex flex-wrap justify-center gap-x-1.5">
                {taglineLine2.map((word, i) => (
                  <span key={i} className="desktop-tagline-word inline-block">
                    {word}
                  </span>
                ))}
              </p>
            </div>
          </div>

          {/* Bottom Feature Cards (Sitting directly on the lower glassy water horizon) */}
          <div className="w-full grid grid-cols-4 gap-3 mt-auto pt-6">
            {featureCards.map((card) => (
              <div
                key={card.title}
                className="desktop-feature-card group relative bg-white/40 hover:bg-white/60 backdrop-blur-md border border-slate-300/50 hover:border-slate-300/80 rounded-xl p-3 transition-colors duration-200"
              >
                <div className="w-7 h-7 rounded-lg bg-white/70 border border-slate-200/80 flex items-center justify-center mb-1.5 text-slate-600 group-hover:text-eezysend-blue transition-colors">
                  <card.icon className="w-3.5 h-3.5" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 tracking-tight leading-tight mb-0.5 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-[10.5px] text-slate-500 font-normal leading-snug transition-colors">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT AUTH PANEL (45%) — Centered along Zimbabwe network map of new-hero.webp */}
        <div
          ref={desktopRightRef}
          className="relative w-[45%] min-h-screen flex flex-col items-center justify-center p-8 xl:translate-x-12"
        >
          <div className="desktop-login-card">
            <LoginForm />
          </div>
          <div className="desktop-footer-badge mt-6 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-white/40 backdrop-blur-xs border border-white/60 text-xs text-slate-600 font-medium shadow-2xs">
              &copy; {new Date().getFullYear()} EezySend &middot; All rights reserved
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE & TABLET VIEW (< xl) — 3-Act Cinematic Drama       */}
      {/* Act 1: Brand alone (Logo + Tagline wave centered)         */}
      {/* Act 2: Cards wave cascade (Boxy cards stack top-to-bottom */}
      {/*        through center, glassy unaltered)                  */}
      {/* Act 3: Final Sign-in Screen (Permanent screen)            */}
      {/* ========================================================= */}
      <div className="xl:hidden relative z-10 min-h-screen w-full overflow-hidden bg-slate-900">
        {/* Background 1: hero-left.webp */}
        <div
          className="mobile-bg-welcome absolute inset-0 w-full h-full bg-[url('/hero-left.webp')] bg-cover bg-center z-0"
          aria-hidden="true"
        />

        {/* Background 2: hero-right.webp (Zimbabwe glowing network map) - reveals ONLY in Act 3 */}
        <div
          className="mobile-bg-signin absolute inset-0 w-full h-full bg-[url('/hero-right.webp')] bg-cover bg-center z-1 opacity-0 pointer-events-none"
          aria-hidden="true"
        />

        {/* ------------------------------------------------------- */}
        {/* ACT 1: BRAND WELCOME ALONE (Centered in viewport)       */}
        {/* ------------------------------------------------------- */}
        <div className="mobile-act-brand absolute inset-0 w-full h-full flex flex-col items-center justify-center p-6 sm:p-10 text-center z-10">
          <div className="max-w-md mx-auto w-full flex flex-col items-center">
            <div className="mobile-brand-logo flex justify-center mb-6">
              <img
                src="/new-logo.webp"
                alt="EezySend"
                className="h-16 sm:h-20 w-auto object-contain drop-shadow-[0_6px_24px_rgba(10,62,148,0.12)]"
              />
            </div>

            {/* Tagline Wave Words */}
            <div className="space-y-2.5 max-w-sm sm:max-w-md mx-auto">
              <p className="text-base sm:text-lg text-slate-800 font-semibold tracking-normal leading-relaxed font-body drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)] flex flex-wrap justify-center gap-x-1.5">
                {taglineLine1.map((word, i) => (
                  <span key={i} className="mobile-tagline-word inline-block">
                    {word}
                  </span>
                ))}
              </p>

              <p className="text-xs sm:text-sm text-slate-600 font-medium font-body drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] flex flex-wrap justify-center gap-x-1.5">
                {taglineLine2.map((word, i) => (
                  <span key={i} className="mobile-tagline-word inline-block">
                    {word}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------- */}
        {/* ACT 2: FEATURE CARDS ALONE (Boxy Stack Top-to-Bottom)   */}
        {/* Centered vertically & horizontally, spanning top to bottom */}
        {/* ------------------------------------------------------- */}
        <div className="mobile-act-cards absolute inset-0 w-full h-full flex flex-col items-center justify-center p-6 sm:p-10 z-20">
          <div className="w-full max-w-65 sm:max-w-75 mx-auto flex flex-col gap-2.5 sm:gap-3">
            {featureCards.map((card) => (
              <div
                key={card.title}
                className="mobile-card-item group relative bg-white/45 hover:bg-white/60 backdrop-blur-md border border-slate-300/50 hover:border-slate-300/80 rounded-xl p-3 flex flex-col items-start transition-colors shadow-xs"
              >
                <div className="w-7 h-7 rounded-lg bg-white/70 border border-slate-200/80 flex items-center justify-center mb-1.5 text-slate-600 group-hover:text-eezysend-blue transition-colors">
                  <card.icon className="w-3.5 h-3.5" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-700 tracking-tight leading-tight mb-0.5">
                    {card.title}
                  </h3>
                  <p className="text-[10.5px] text-slate-500 font-normal leading-snug">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------- */}
        {/* ACT 3: FINAL SIGN-IN SCREEN (Permanent Destination)     */}
        {/* ------------------------------------------------------- */}
        <div className="mobile-act-signin absolute inset-0 w-full min-h-screen flex flex-col justify-between p-6 sm:p-10 z-30">
          {/* Top Logo */}
          <div className="flex justify-center pt-2">
            <img
              src="/new-logo.webp"
              alt="EezySend"
              className="h-8 sm:h-9 w-auto object-contain drop-shadow-sm"
            />
          </div>

          {/* Centered Login Card directly over Zimbabwe network map */}
          <div className="my-auto flex justify-center items-center w-full py-4 mobile-login-card-inner">
            <LoginForm />
          </div>

          {/* Footer Copyright */}
          <div className="text-center pb-2">
            <span className="inline-block px-3.5 py-1 rounded-full bg-white/50 backdrop-blur-xs border border-white/60 text-[11px] text-slate-600 font-medium shadow-2xs">
              &copy; {new Date().getFullYear()} EezySend &middot; All rights reserved
            </span>
          </div>
        </div>
      </div>

      {/* Decorative gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-eezysend-blue/30 to-transparent pointer-events-none" />
    </div>
  );
}
