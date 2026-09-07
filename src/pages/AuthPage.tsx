import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../App";
import { Bus, Mail, Lock, User, Eye, EyeOff, ArrowRight, Ticket } from "lucide-react";

export function AuthPage() {
  const { navigate, login } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate auth (in real app, this would be Convex auth)
    setTimeout(() => {
      login({
        id: `user_${Date.now()}`,
        name: formData.name || "Traveler",
        email: formData.email || "traveler@anavandi.com",
      });
      setIsSubmitting(false);
    }, 1200);
  };

  const handleGuest = () => {
    login({
      id: "guest",
      name: "Guest Traveler",
      email: "guest@anavandi.com",
    });
    navigate("dashboard", { guestMode: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-ksrtc-cream via-vintage-parchment to-ksrtc-cream-dark" />

      {/* Floating bus elements */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute opacity-5"
          style={{
            left: `${10 + i * 20}%`,
            top: `${10 + i * 15}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        >
          <Bus className="w-24 h-24 text-ksrtc-red" />
        </motion.div>
      ))}

      {/* Main auth card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Ticket header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center w-20 h-20 bg-ksrtc-red rounded-2xl shadow-xl shadow-ksrtc-red/20 mb-4"
          >
            <Bus className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold text-vintage-ink">
            {isSignUp ? "Join the Journey" : "Board In"}
          </h1>
          <p className="text-vintage-sepia/60 mt-2">
            {isSignUp
              ? "Create your Anavandi traveler account"
              : "Welcome back, fellow traveler"}
          </p>
          <p className="font-malayalam text-sm text-ksrtc-brown/40 mt-1">
            {isSignUp ? "യാത്ര തുടങ്ങൂ" : "സ്വാഗതം"}
          </p>
        </div>

        {/* Auth form */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-ksrtc-brown/10 overflow-hidden border border-ksrtc-cream-dark">
          {/* Tabs */}
          <div className="flex border-b border-ksrtc-cream-dark">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-4 text-sm font-semibold transition-all ${
                !isSignUp
                  ? "text-ksrtc-red border-b-2 border-ksrtc-red bg-ksrtc-red/5"
                  : "text-vintage-sepia/50 hover:text-vintage-sepia"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-4 text-sm font-semibold transition-all ${
                isSignUp
                  ? "text-ksrtc-red border-b-2 border-ksrtc-red bg-ksrtc-red/5"
                  : "text-vintage-sepia/50 hover:text-vintage-sepia"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <AnimatePresence mode="wait">
              {isSignUp && (
                <motion.div
                  key="name"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <label className="block text-sm font-medium text-vintage-sepia/70 mb-1.5">
                    Traveler Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-vintage-sepia/30" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Enter your name"
                      className="w-full pl-11 pr-4 py-3 bg-ksrtc-cream/30 border border-ksrtc-cream-dark rounded-xl text-vintage-ink placeholder-vintage-sepia/30 focus:outline-none focus:ring-2 focus:ring-ksrtc-red/30 focus:border-ksrtc-red/50 transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium text-vintage-sepia/70 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-vintage-sepia/30" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                  placeholder="traveler@anavandi.com"
                  className="w-full pl-11 pr-4 py-3 bg-ksrtc-cream/30 border border-ksrtc-cream-dark rounded-xl text-vintage-ink placeholder-vintage-sepia/30 focus:outline-none focus:ring-2 focus:ring-ksrtc-red/30 focus:border-ksrtc-red/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-vintage-sepia/70 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-vintage-sepia/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-ksrtc-cream/30 border border-ksrtc-cream-dark rounded-xl text-vintage-ink placeholder-vintage-sepia/30 focus:outline-none focus:ring-2 focus:ring-ksrtc-red/30 focus:border-ksrtc-red/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-vintage-sepia/30 hover:text-vintage-sepia/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-ksrtc-red text-white rounded-xl font-bold text-lg shadow-lg shadow-ksrtc-red/25 hover:bg-ksrtc-red-dark transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  {isSignUp ? "Create Account" : "Board In"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="px-6 pb-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-ksrtc-cream-dark" />
              <span className="text-xs text-vintage-sepia/40">or</span>
              <div className="flex-1 h-px bg-ksrtc-cream-dark" />
            </div>

            {/* Guest option */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGuest}
              className="w-full mt-4 py-3 bg-ksrtc-cream/50 border-2 border-ksrtc-brown/15 text-ksrtc-brown rounded-xl font-semibold hover:bg-ksrtc-cream hover:border-ksrtc-gold/30 transition-all flex items-center justify-center gap-2"
            >
              <Ticket className="w-5 h-5" />
              Browse as Guest
            </motion.button>
          </div>
        </div>

        {/* Back to home */}
        <motion.button
          whileHover={{ x: -4 }}
          onClick={() => navigate("landing")}
          className="mt-6 text-sm text-vintage-sepia/50 hover:text-ksrtc-red transition-colors flex items-center gap-1 mx-auto"
        >
          ← Back to Home
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
