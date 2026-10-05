"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, LogIn } from "lucide-react";

interface LoginFormProps {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
}

export default function LoginForm({ isLogin, setIsLogin }: LoginFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    institution: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsLoading(false);
      // router.push("/dashboard");
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-full max-w-[260px] sm:max-w-[280px] lg:max-w-[300px] xl:max-w-[320px] relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/10 backdrop-blur-xl rounded-xl lg:rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-5 sm:p-6 lg:p-7 border border-white/20"
      >
        {/* Header */}
        <div className="text-center mb-4 lg:mb-5">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-light tracking-tight text-white font-display">
            Welcome{' '}
            <span className="inline-block relative font-fancy italic font-semibold text-[#84cc16]">
              Back
              <svg className="absolute -bottom-0.5 left-0 w-full h-0.5 lg:h-1" viewBox="0 0 100 6" preserveAspectRatio="none">
                <path d="M0,5 Q25,0 50,4 T100,3" stroke="#84cc16" strokeWidth="1.2" fill="none" opacity="0.5"></path>
              </svg>
            </span>
          </h2>
        </div>

        {/* Sign In / Register Tabs */}
        <div className="relative flex bg-white/5 rounded-lg p-0.5 border border-white/10 mb-4 lg:mb-5 select-none">
          {isLogin ? (
            <motion.div
              layoutId="tabActivePill"
              className="absolute inset-0 bg-white/15 backdrop-blur-sm rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.2)] border border-white/20"
              style={{ width: '50%', left: 0 }}
            />
          ) : (
            <motion.div
              layoutId="tabActivePill"
              className="absolute inset-0 bg-white/15 backdrop-blur-sm rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.2)] border border-white/20"
              style={{ width: '50%', left: '50%' }}
            />
          )}
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`relative z-10 flex-1 py-2 lg:py-2.5 text-xs sm:text-sm lg:text-base font-bold tracking-wider transition-colors rounded-lg ${
              isLogin ? 'text-white' : 'text-white/50 hover:text-white/70'
            }`}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`relative z-10 flex-1 py-2 lg:py-2.5 text-xs sm:text-sm lg:text-base font-bold tracking-wider transition-colors rounded-lg ${
              !isLogin ? 'text-white' : 'text-white/50 hover:text-white/70'
            }`}
          >
            REGISTER
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="institution" className="block text-white/90 text-xs lg:text-sm font-bold mb-1 font-body">
                Institution
              </label>
              <select
                id="institution"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                className="w-full h-10 lg:h-11 px-3 lg:px-4 text-sm lg:text-base bg-white/10 backdrop-blur-md border border-white/20 focus:border-[#84cc16] focus:ring-2 focus:ring-[#84cc16]/30 rounded-lg text-white transition-all font-body focus:outline-none placeholder:text-white/40"
                required={!isLogin}
              >
                <option value="" className="bg-slate-900 text-white">Select institution</option>
                <option value="bank" className="bg-slate-900 text-white">Commercial Bank</option>
                <option value="microfinance" className="bg-slate-900 text-white">Microfinance</option>
                <option value="mobile" className="bg-slate-900 text-white">Mobile Money</option>
                <option value="insurance" className="bg-slate-900 text-white">Insurance</option>
                <option value="other" className="bg-slate-900 text-white">Other</option>
              </select>
            </div>
          )}

          <div>
            <label htmlFor="email-input" className="block text-white/90 text-xs lg:text-sm font-bold mb-1 font-body">
              Email
            </label>
            <input
              id="email-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="username"
              placeholder="you@institution.com"
              className="w-full h-10 lg:h-11 px-3 lg:px-4 text-sm lg:text-base bg-white/10 backdrop-blur-md border border-white/20 focus:border-[#84cc16] focus:ring-2 focus:ring-[#84cc16]/30 rounded-lg text-white placeholder:text-white/40 transition-all font-body focus:outline-none"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password-input" className="text-white/90 text-xs lg:text-sm font-bold font-body">
                Password
              </label>
              {isLogin && (
                <button
                  type="button"
                  className="text-[9px] lg:text-xs text-white/60 hover:text-[#84cc16] font-semibold transition-colors font-body"
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                placeholder="Enter password"
                className="w-full h-10 lg:h-11 pl-3 lg:pl-4 pr-10 lg:pr-11 text-sm lg:text-base bg-white/10 backdrop-blur-md border border-white/20 focus:border-[#84cc16] focus:ring-2 focus:ring-[#84cc16]/30 rounded-lg text-white placeholder:text-white/40 transition-all font-body focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4 lg:w-5 lg:h-5" /> : <Eye className="w-4 h-4 lg:w-5 lg:h-5" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block text-white/90 text-xs lg:text-sm font-bold mb-1 font-body">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="w-full h-10 lg:h-11 px-3 lg:px-4 text-sm lg:text-base bg-white/10 backdrop-blur-md border border-white/20 focus:border-[#84cc16] focus:ring-2 focus:ring-[#84cc16]/30 rounded-lg text-white placeholder:text-white/40 transition-all font-body focus:outline-none"
                required={!isLogin}
              />
            </div>
          )}

          {isLogin && (
            <div className="flex items-center">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/30 bg-white/10 text-[#84cc16] focus:ring-[#84cc16] focus:ring-offset-0 w-4 h-4"
                />
                <span className="text-xs lg:text-sm font-semibold text-white/80 font-body">Remember me</span>
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 lg:h-12 bg-gradient-to-r from-[#16a34a] to-[#84cc16] hover:from-[#16a34a]/90 hover:to-[#84cc16]/90 text-white font-semibold text-sm lg:text-base tracking-wide rounded-lg shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group font-display"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <span>{isLogin ? "Sign In" : "Create Account"}</span>
              </>
            )}
          </button>

          {/* Secure connection */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] lg:text-xs pt-1">
            <Lock className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-emerald-400" />
            <span className="font-semibold text-white/70 font-body">Encrypted connection</span>
          </div>
        </form>
      </motion.div>

      {/* Terms - Minimal */}
      <p className="text-center text-[9px] lg:text-[10px] text-white/70 mt-3 font-body">
        By continuing, you agree to our{" "}
        <button className="text-white/90 hover:text-white hover:underline font-semibold">Terms</button>
        {" "}and{" "}
        <button className="text-white/90 hover:text-white hover:underline font-semibold">Privacy</button>
      </p>
    </div>
  );
}
