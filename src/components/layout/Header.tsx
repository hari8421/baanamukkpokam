import { motion } from "framer-motion";
import { useApp } from "../../App";
import { Bus, User, LogOut, Plus } from "lucide-react";

export function Header() {
  const { state, navigate, logout } = useApp();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="fixed top-0 left-0 right-0 z-50 bg-vintage-parchment/90 backdrop-blur-md border-b border-ksrtc-brown/10"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("landing")}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-ksrtc-red rounded-lg flex items-center justify-center shadow-md">
            <Bus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-vintage-ink leading-tight">Anavandi</h1>
            <p className="text-[10px] text-vintage-sepia/50 tracking-wider uppercase">Travels</p>
          </div>
        </motion.button>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => navigate("landing")}
            className="px-4 py-2 text-sm font-medium text-vintage-sepia/70 hover:text-ksrtc-red transition-colors rounded-lg hover:bg-ksrtc-red/5"
          >
            Home
          </button>
          {state.user && (
            <>
              <button
                onClick={() => navigate("dashboard")}
                className="px-4 py-2 text-sm font-medium text-vintage-sepia/70 hover:text-ksrtc-red transition-colors rounded-lg hover:bg-ksrtc-red/5"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate("post-travel")}
                className="px-4 py-2 text-sm font-medium text-vintage-sepia/70 hover:text-ksrtc-red transition-colors rounded-lg hover:bg-ksrtc-red/5"
              >
                Post Travel
              </button>
            </>
          )}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {state.user ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("post-travel")}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-ksrtc-red text-white text-sm font-semibold rounded-lg shadow-sm"
              >
                <Plus className="w-4 h-4" />
                New Journey
              </motion.button>
              <div className="flex items-center gap-2 pl-3 border-l border-ksrtc-brown/10">
                <div className="w-8 h-8 bg-ksrtc-gold/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-ksrtc-gold-dark" />
                </div>
                <button
                  onClick={logout}
                  className="text-vintage-sepia/40 hover:text-ksrtc-red transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("auth")}
              className="px-5 py-2 bg-ksrtc-red text-white text-sm font-semibold rounded-lg shadow-sm"
            >
              Board In
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
