import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useApp } from "../App";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { MusicPlayer } from "../components/music/MusicPlayer";
import {
  Bus,
  Camera,
  Users,
  MapPin,
  ChevronDown,
  Play,
  Star,
  ArrowRight,
  Mountain,
  TreePalm,
  Waves,
  Sparkles,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────
   Kerala Scenic Road Scene — SVG parallax with vehicles
   ───────────────────────────────────────────────────────── */

function KeralaScenery() {
  const [scrollX, setScrollX] = useState(0);

  useEffect(() => {
    let frame: number;
    const tick = () => {
      setScrollX((p) => (p + 0.4) % 6000);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky gradient — golden hour */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #F4A460 0%, #FFDAB9 25%, #FFF8DC 50%, #E8D5A8 75%, #C2B280 100%)",
        }}
      />

      {/* Sun */}
      <motion.div
        className="absolute"
        style={{ right: "15%", top: "8%" }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-200 to-orange-300 opacity-80 blur-sm" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-yellow-100 to-orange-200 opacity-60" />
      </motion.div>

      {/* Distant mountains — layer 1 */}
      <svg
        className="absolute bottom-[42%] w-[6000px] opacity-20"
        style={{ transform: `translateX(-${scrollX * 0.05}px)` }}
        viewBox="0 0 6000 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0,160 Q300,60 600,140 Q900,40 1200,120 Q1500,80 1800,150 Q2100,30 2400,130 Q2700,70 3000,145 Q3300,50 3600,120 Q3900,80 4200,140 Q4500,40 4800,130 Q5100,60 5400,140 Q5700,80 6000,160 L6000,200 L0,200Z"
          fill="#5B7D4F"
        />
      </svg>

      {/* Medium hills — layer 2 */}
      <svg
        className="absolute bottom-[36%] w-[6000px] opacity-30"
        style={{ transform: `translateX(-${scrollX * 0.15}px)` }}
        viewBox="0 0 6000 180"
        preserveAspectRatio="none"
      >
        <path
          d="M0,140 Q400,80 800,130 Q1200,50 1600,120 Q2000,90 2400,140 Q2800,60 3200,110 Q3600,80 4000,130 Q4400,50 4800,120 Q5200,70 5600,130 Q6000,90 6000,140 L6000,180 L0,180Z"
          fill="#3D6B4F"
        />
      </svg>

      {/* Paddy fields — layer 3 */}
      <svg
        className="absolute bottom-[28%] w-[6000px] opacity-40"
        style={{ transform: `translateX(-${scrollX * 0.25}px)` }}
        viewBox="0 0 6000 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,80 Q500,60 1000,75 Q1500,50 2000,70 Q2500,55 3000,80 Q3500,60 4000,75 Q4500,50 5000,70 Q5500,55 6000,80 L6000,120 L0,120Z"
          fill="#228B22"
        />
      </svg>

      {/* Coconut trees — layer 4 */}
      <svg
        className="absolute bottom-[24%] w-[6000px] opacity-60"
        style={{ transform: `translateX(-${scrollX * 0.4}px)` }}
        viewBox="0 0 6000 100"
        preserveAspectRatio="none"
      >
        {/* Palm trees scattered */}
        {Array.from({ length: 60 }).map((_, i) => {
          const x = i * 100 + (i % 3) * 30;
          const h = 40 + Math.sin(i * 0.8) * 15;
          const lean = Math.sin(i * 1.2) * 5;
          return (
            <g key={i} transform={`translate(${x + lean}, ${100 - h})`}>
              <rect x="3" y={h - 10} width="3" height="10" fill="#8B7355" />
              <ellipse cx="4" cy="0" rx="18" ry="10" fill="#2E8B57" opacity="0.8" />
              <ellipse cx="4" cy="-5" rx="12" ry="7" fill="#228B22" opacity="0.6" />
            </g>
          );
        })}
      </svg>

      {/* Near trees / bushes — layer 5 */}
      <svg
        className="absolute bottom-[18%] w-[6000px] opacity-70"
        style={{ transform: `translateX(-${scrollX * 0.6}px)` }}
        viewBox="0 0 6000 80"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 40 }).map((_, i) => {
          const x = i * 150;
          return (
            <g key={i}>
              <ellipse cx={x} cy="50" rx="30" ry="25" fill="#1B5E20" opacity="0.7" />
              <ellipse cx={x + 20} cy="45" rx="25" ry="20" fill="#2E7D32" opacity="0.5" />
            </g>
          );
        })}
      </svg>

      {/* ROAD — 2-lane Kerala highway with shoulders, matches 28vh vehicle container */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[25%]"
        style={{ background: "linear-gradient(to top, #4a4a4a, #555 8%, #606060 25%, #6a6a6a 45%, #757575 65%, #808080 82%, #8a8a8a 100%)" }}
      >
        {/* Asphalt texture */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.15) 1px, rgba(0,0,0,0.15) 2px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)",
          }}
        />
        {/* Upper gravel shoulder edge */}
        <div
          className="absolute top-0 left-0 right-0 h-[3%]"
          style={{ background: "linear-gradient(to bottom, #8a7a60, #7a6a50)" }}
        />
        {/* Upper shoulder line */}
        <div
          className="absolute top-[4%] left-0 right-0 h-[2px]"
          style={{ background: "rgba(255,255,255,0.18)" }}
        />
        {/* Far lane divider — dashed white */}
        <div
          className="absolute top-[28%] -translate-y-1/2 h-[2px]"
          style={{
            width: "6000px",
            transform: `translateX(-${scrollX * 0.95}px) translateY(-50%)`,
            background:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.25), rgba(255,255,255,0.25) 22px, transparent 22px, transparent 44px)",
          }}
        />
        {/* Center line — double yellow (median) */}
        <div
          className="absolute top-[50%] h-[2px]"
          style={{
            width: "6000px",
            transform: `translateX(-${scrollX * 1}px) translateY(-3px)`,
            background:
              "repeating-linear-gradient(90deg, #DAA520, #DAA520 25px, transparent 25px, transparent 50px)",
          }}
        />
        <div
          className="absolute top-[50%] h-[2px]"
          style={{
            width: "6000px",
            transform: `translateX(-${scrollX * 1}px) translateY(3px)`,
            background:
              "repeating-linear-gradient(90deg, #DAA520, #DAA520 25px, transparent 25px, transparent 50px)",
          }}
        />
        {/* Near lane divider — dashed white */}
        <div
          className="absolute top-[72%] -translate-y-1/2 h-[2px]"
          style={{
            width: "6000px",
            transform: `translateX(-${scrollX * 1.05}px) translateY(-50%)`,
            background:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.2) 22px, transparent 22px, transparent 44px)",
          }}
        />
        {/* Lower shoulder line */}
        <div
          className="absolute bottom-[5%] left-0 right-0 h-[2px]"
          style={{ background: "rgba(255,255,255,0.15)" }}
        />
        {/* Lower gravel shoulder */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[5%]"
          style={{ background: "linear-gradient(to top, #8a7a60, #7a6a50)" }}
        />
      </div>

      {/* Floating dust / fireflies */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 2 + Math.random() * 3,
            height: 2 + Math.random() * 3,
            left: `${Math.random() * 100}%`,
            top: `${30 + Math.random() * 40}%`,
            background: `rgba(255, 215, 0, ${0.3 + Math.random() * 0.4})`,
          }}
          animate={{
            y: [0, -20 - Math.random() * 40],
            x: [0, Math.random() * 30 - 15],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 6,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ──── Vehicles on distinct lanes with guaranteed no overlap ────
   KEY FIX: Use a fixed-position vehicle lane container that overlays
   the road exactly. Each vehicle gets its own named lane row.
   The container is 100vw × 25vh, pinned to bottom:0, so bottom-percentages
   are relative to 25vh (= the road zone). This guarantees each vehicle's
   wheel-contact sits precisely at its lane without any visual bleed.
   ──── */

function VehicleLanes() {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 pointer-events-none"
      style={{ height: "28vh" }}
    >
      {/* Lane 1: Train — behind road, topmost, very faded */}
      <motion.div
        className="absolute left-0"
        style={{ bottom: "26vh", opacity: 0.2 }}  
        animate={{ x: ["calc(105vw)", "calc(-35vw)"] }}
        transition={{ duration: 55, repeat: Infinity, ease: "linear", delay: 3 }}
      >
        <svg width="160" height="24" viewBox="0 0 280 45" className="drop-shadow-sm">
          <rect x="0" y="8" width="60" height="30" rx="4" fill="#E65100" />
          <rect x="5" y="12" width="15" height="10" rx="2" fill="#B8D4E3" opacity="0.7" />
          <rect x="60" y="14" width="210" height="24" rx="3" fill="#BF360C" />
          {Array.from({ length: 14 }).map((_, i) => (
            <rect key={i} x={68 + i * 14} y="18" width="10" height="8" rx="2" fill="#B8D4E3" opacity="0.6" />
          ))}
          <rect x="0" y="30" width="270" height="3" fill="#FFD600" />
          {[25, 55, 100, 140, 180, 220, 260].map((x) => (
            <circle key={x} cx={x} cy="40" r="4" fill="#333" />
          ))}
        </svg>
      </motion.div>

      {/* Lane 2: KSRTC Bus — far lane, L→R */}
      <motion.div
        className="absolute left-0"
        style={{ bottom: "19vh", opacity: 0.85 }}
        animate={{ x: ["calc(-18vw)", "calc(118vw)"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 0 }}
      >
        <svg width="110" height="44" viewBox="0 0 180 75" style={{ display: "block" }}>
          <ellipse cx="90" cy="73" rx="80" ry="3" fill="rgba(0,0,0,0.1)" />
          <rect x="8" y="10" width="164" height="42" rx="6" fill="#C41E3A" />
          <rect x="12" y="6" width="156" height="7" rx="3" fill="#8B0000" />
          {[20, 48, 76, 104, 132].map((x) => (
            <rect key={x} x={x} y="16" width="20" height="14" rx="3" fill="#B8D4E3" opacity="0.8" />
          ))}
          <rect x="8" y="38" width="164" height="14" fill="#8B4513" />
          <rect x="50" y="40" width="80" height="10" rx="3" fill="#F5E6C8" />
          <text x="90" y="48" textAnchor="middle" fill="#C41E3A" fontSize="6" fontWeight="bold" fontFamily="sans-serif">KSRTC</text>
          <circle cx="12" cy="42" r="3.5" fill="#DAA520" />
          <circle cx="168" cy="42" r="2.5" fill="#FF4444" />
          <circle cx="42" cy="60" r="9" fill="#333" /><circle cx="42" cy="60" r="4.5" fill="#666" />
          <circle cx="138" cy="60" r="9" fill="#333" /><circle cx="138" cy="60" r="4.5" fill="#666" />
        </svg>
      </motion.div>

      {/* Lane 3: Royal Enfield — far inner, R→L */}
      <motion.div
        className="absolute left-0"
        style={{ bottom: "12.5vh" }}
        animate={{ x: ["calc(108vw)", "calc(-14vw)"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 5 }}
      >
        <svg width="48" height="32" viewBox="0 0 80 52" style={{ display: "block" }}>
          <ellipse cx="40" cy="50" rx="35" ry="2" fill="rgba(0,0,0,0.08)" />
          <ellipse cx="35" cy="26" rx="15" ry="9" fill="#1A1A1A" />
          <ellipse cx="35" cy="24" rx="11" ry="6" fill="#2A1A0A" />
          <rect x="18" y="18" width="18" height="5" rx="2.5" fill="#8B4513" />
          <rect x="52" y="8" width="3" height="18" rx="1" fill="#666" />
          <rect x="47" y="6" width="13" height="2.5" rx="1.25" fill="#888" />
          <circle cx="57" cy="12" r="3.5" fill="#B8860B" opacity="0.8" />
          <rect x="8" y="30" width="16" height="3" rx="1.5" fill="#555" />
          <rect x="28" y="30" width="10" height="7" rx="2" fill="#444" />
          <circle cx="18" cy="42" r="8" fill="#333" /><circle cx="18" cy="42" r="4.5" fill="#555" />
          <circle cx="58" cy="42" r="8" fill="#333" /><circle cx="58" cy="42" r="4.5" fill="#555" />
        </svg>
      </motion.div>

      {/* Lane 4: Scooter — near inner, L→R (zippy) */}
      <motion.div
        className="absolute left-0"
        style={{ bottom: "6vh" }}
        animate={{ x: ["calc(-12vw)", "calc(112vw)"] }}
        transition={{ duration: 11, repeat: Infinity, ease: "linear", delay: 8 }}
      >
        <svg width="40" height="28" viewBox="0 0 68 48" style={{ display: "block" }}>
          <ellipse cx="34" cy="46" rx="26" ry="2" fill="rgba(0,0,0,0.08)" />
          <ellipse cx="34" cy="28" rx="16" ry="10" fill="#FF6B35" />
          <rect x="20" y="20" width="28" height="5" rx="2.5" fill="#333" />
          <rect x="48" y="13" width="3" height="16" rx="1" fill="#666" />
          <rect x="43" y="10" width="13" height="3" rx="1.5" fill="#888" />
          <circle cx="53" cy="16" r="3" fill="#FFD700" opacity="0.8" />
          <circle cx="18" cy="38" r="7" fill="#333" /><circle cx="18" cy="38" r="3.5" fill="#555" />
          <circle cx="52" cy="38" r="7" fill="#333" /><circle cx="52" cy="38" r="3.5" fill="#555" />
          <rect x="8" y="33" width="11" height="3" rx="1.5" fill="#555" />
        </svg>
      </motion.div>

      {/* Lane 5: Car — near outer, R→L */}
      <motion.div
        className="absolute left-0"
        style={{ bottom: "0.8vh" }}
        animate={{ x: ["calc(108vw)", "calc(-16vw)"] }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear", delay: 2 }}
      >
        <svg width="64" height="30" viewBox="0 0 105 48" style={{ display: "block" }}>
          <ellipse cx="52" cy="46" rx="46" ry="2" fill="rgba(0,0,0,0.1)" />
          <rect x="5" y="20" width="95" height="17" rx="4" fill="#37474F" />
          <path d="M24,20 L33,7 L72,7 L81,20 Z" fill="#455A64" />
          <path d="M28,19 L36,10 L52,10 L52,19 Z" fill="#B8D4E3" opacity="0.7" />
          <path d="M55,19 L55,10 L69,10 L77,19 Z" fill="#B8D4E3" opacity="0.7" />
          <rect x="95" y="24" width="5" height="4" rx="1" fill="#FFD700" opacity="0.8" />
          <rect x="4" y="24" width="5" height="4" rx="1" fill="#FF4444" opacity="0.8" />
          <circle cx="27" cy="40" r="7" fill="#333" /><circle cx="27" cy="40" r="3.5" fill="#666" />
          <circle cx="78" cy="40" r="7" fill="#333" /><circle cx="78" cy="40" r="3.5" fill="#666" />
        </svg>
      </motion.div>

      {/* Lane 6: Auto — closest to viewer, R→L */}
      <motion.div
        className="absolute left-0"
        style={{ bottom: "-3vh" }}  
        animate={{ x: ["calc(105vw)", "calc(-14vw)"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 12 }}
      >
        <svg width="52" height="34" viewBox="0 0 88 58" style={{ display: "block" }}>
          <ellipse cx="44" cy="56" rx="36" ry="2" fill="rgba(0,0,0,0.1)" />
          <path d="M14,33 L19,14 L68,14 L78,33 Z" fill="#1B5E20" />
          <rect x="10" y="28" width="72" height="18" rx="4" fill="#2E7D32" />
          <path d="M17,14 L24,5 L63,5 L70,14 Z" fill="#333" />
          <rect x="24" y="17" width="38" height="10" rx="2" fill="#B8D4E3" opacity="0.7" />
          <rect x="58" y="33" width="18" height="11" rx="2" fill="#1B5E20" />
          <text x="67" y="41" textAnchor="middle" fill="#FFD600" fontSize="5" fontWeight="bold" fontFamily="sans-serif">₹20</text>
          <circle cx="26" cy="52" r="7" fill="#333" /><circle cx="26" cy="52" r="3.5" fill="#666" />
          <circle cx="66" cy="52" r="7" fill="#333" /><circle cx="66" cy="52" r="3.5" fill="#666" />
          <rect x="10" y="31" width="72" height="2" fill="#FFD600" />
        </svg>
      </motion.div>
    </div>
  );
}

/* ──── Section Components ──── */

function FeatureCard({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, type: "spring", bounce: 0.3 }}
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-500 group cursor-pointer border border-ksrtc-cream-dark/50 hover:border-ksrtc-gold/30">
        <motion.div
          className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-ksrtc-red/10 to-ksrtc-gold/10 flex items-center justify-center group-hover:from-ksrtc-red/20 group-hover:to-ksrtc-gold/20 transition-all duration-300"
          whileHover={{ rotate: 5, scale: 1.1 }}
        >
          <Icon className="w-8 h-8 text-ksrtc-red" />
        </motion.div>
        <h3 className="font-display text-xl font-bold text-vintage-ink mb-3">{title}</h3>
        <p className="text-vintage-sepia/70 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

function TravelShowcaseCard({
  travel,
  delay,
}: {
  travel: { id: string; route: string; from: string; to: string; vibe: string; photos: number; vehicle: string };
  delay: number;
}) {
  const { navigate } = useApp();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const gradients: Record<string, string> = {
    "Monsoon magic": "linear-gradient(135deg, #4A6741, #8FBC8F)",
    "Sunset golden hour": "linear-gradient(135deg, #D4764E, #F4A460)",
    "Night journey": "linear-gradient(135deg, #1A1A3E, #4A4A7E)",
    "Hill station climb": "linear-gradient(135deg, #5B8C5A, #A8D5A2)",
    "Backwater breeze": "linear-gradient(135deg, #2E8B57, #90B06A)",
    "Morning misty ride": "linear-gradient(135deg, #6B8E5A, #C8D8B0)",
    "Festival special": "linear-gradient(135deg, #C41E3A, #E8766B)",
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-ksrtc-cream-dark/50 cursor-pointer group"
      onClick={() => navigate("travel-view", { guestMode: true, travelId: travel.id })}
    >
      {/* Photo area */}
      <div className="h-48 relative overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
          style={{ background: gradients[travel.vibe] || gradients["Monsoon magic"] }}
        />
        {/* Window frame overlay */}
        <div className="absolute inset-0 flex">
          <div className="w-1 bg-ksrtc-window-frame/60" />
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
          <div className="w-0.5 bg-ksrtc-window-frame/40" />
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          <div className="w-1 bg-ksrtc-window-frame/60" />
        </div>
        {/* Vehicle icon */}
        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <span>{travel.vehicle || "🚌"}</span>
          <Camera className="w-3 h-3" /> {travel.photos}
        </div>
        {/* Vibe */}
        <div className="absolute top-3 right-3 bg-ksrtc-red/90 text-white text-xs px-3 py-1.5 rounded-full">
          {travel.vibe}
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <div className="w-10 h-10 bg-ksrtc-red rounded-full flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-white ml-0.5" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-ksrtc-red font-bold text-sm">{travel.from}</span>
          <ArrowRight className="w-3 h-3 text-ksrtc-gold" />
          <span className="text-ksrtc-red font-bold text-sm">{travel.to}</span>
        </div>
        <p className="text-xs text-vintage-sepia/60">{travel.route}</p>
      </div>
    </motion.div>
  );
}

/* ──── Landing Page ──── */

export function LandingPage() {
  const { navigate } = useApp();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.15]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  const sampleTravels = [
    { id: "demo-1", route: "Garuda AC", from: "Thiruvananthapuram", to: "Kozhikode", vibe: "Monsoon magic", photos: 24, vehicle: "🚌" },
    { id: "demo-2", route: "Rajadhani", from: "Ernakulam", to: "Thiruvananthapuram", vibe: "Sunset golden hour", photos: 18, vehicle: "🚗" },
    { id: "demo-3", route: "Royal Enfield", from: "Kottayam", to: "Idukki", vibe: "Hill station climb", photos: 35, vehicle: "🏍️" },
    { id: "demo-4", route: "Ordinary", from: "Kollam", to: "Alappuzha", vibe: "Backwater breeze", photos: 31, vehicle: "🛺" },
    { id: "demo-5", route: "Super Fast", from: "Thrissur", to: "Wayanad", vibe: "Night journey", photos: 12, vehicle: "🚌" },
    { id: "demo-6", route: "Scooter Ride", from: "Palakkad", to: "Kannur", vibe: "Morning misty ride", photos: 15, vehicle: "🛵" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <Header />

      {/* ═══════════════ HERO: Kerala Scenic Road ═══════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <KeralaScenery />

        {/* Vehicles on distinct road lanes — single container, no overlap */}
        <VehicleLanes />

        {/* Hero text overlay */}
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="relative z-40 text-center px-4 max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-md border border-ksrtc-red/15 rounded-full px-5 py-2.5 mb-8 shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-ksrtc-gold" />
            <span className="text-ksrtc-red font-semibold text-sm tracking-wide">Kerala's #1 Travel Experience</span>
            <Sparkles className="w-4 h-4 text-ksrtc-gold" />
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, type: "spring" }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight drop-shadow-sm"
          >
            <span className="text-vintage-ink">Travel Kerala,</span>
            <br />
            <span className="bg-gradient-to-r from-ksrtc-red via-ksrtc-red-dark to-ksrtc-brown bg-clip-text text-transparent">
              One Window at a Time
            </span>
          </motion.h1>

          {/* Malayalam subtitle */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="font-malayalam text-xl md:text-2xl text-ksrtc-brown/70 mb-4"
          >
            കേരളം കണ്ടു സഞ്ചരിക്കൂ, ഒരു ജാലകം ഒരു യാത്ര
          </motion.p>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-lg md:text-xl text-vintage-sepia/70 max-w-2xl mx-auto mb-10 font-body"
          >
            Bus, scooter, Royal Enfield, auto, car, or train — share your journey through
            the windows and let co-travelers ride along.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("auth")}
              className="px-8 py-4 bg-ksrtc-red text-white rounded-2xl font-bold text-lg shadow-xl shadow-ksrtc-red/25 hover:bg-ksrtc-red-dark transition-colors flex items-center gap-3"
            >
              <Camera className="w-5 h-5" />
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 bg-white/80 backdrop-blur-md border-2 border-ksrtc-brown/20 text-ksrtc-brown rounded-2xl font-bold text-lg hover:border-ksrtc-gold hover:bg-white transition-all flex items-center gap-3 shadow-lg"
            >
              <Play className="w-5 h-5" />
              Explore as Guest
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
            className="mt-12 flex items-center justify-center gap-8 text-vintage-sepia/50 text-sm"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>2.4K Travelers</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>14 Districts</span>
            </div>
            <div className="flex items-center gap-2">
              <Bus className="w-4 h-4" />
              <span>6 Vehicle Types</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-vintage-sepia/40" />
        </motion.div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section id="explore" className="py-24 px-4 relative bg-gradient-to-b from-vintage-parchment to-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-ksrtc-gold/10 text-ksrtc-gold-dark text-sm font-semibold px-5 py-2 rounded-full mb-4">
              ✦ How It Works ✦
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-vintage-ink mb-4">
              Any Vehicle, Every Road
            </h2>
            <p className="text-vintage-sepia/70 max-w-xl mx-auto text-lg">
              Bus, scooter, auto, Royal Enfield, car, or train — pick your ride and share the journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={MapPin}
              title="Pick Your Route"
              description="Select start and end destinations from Kerala's iconic routes. Choose your vehicle and the road is yours."
              delay={0}
            />
            <FeatureCard
              icon={Camera}
              title="Capture & Share"
              description="Post photos from your ride — the misty hills, emerald backwaters, winding roads. Each photo becomes a window."
              delay={0.15}
            />
            <FeatureCard
              icon={Users}
              title="Travel Together"
              description="Others open your journey and ride as co-travelers, viewing the landscape through the vehicle's windows."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════ VEHICLE SHOWCASE ═══════════════ */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-ksrtc-cream/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-vintage-ink mb-3">
              Choose Your Ride
            </h2>
            <p className="text-vintage-sepia/60">Each vehicle has its own unique window view</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { icon: "🚌", name: "KSRTC Bus", color: "#C41E3A" },
              { icon: "🛵", name: "Scooter", color: "#FF6B35" },
              { icon: "🛺", name: "Auto", color: "#1B5E20" },
              { icon: "🏍️", name: "Royal Enfield", color: "#1A1A1A" },
              { icon: "🚗", name: "Car", color: "#37474F" },
              { icon: "🚂", name: "Train", color: "#E65100" },
            ].map((v, i) => (
              <motion.div
                key={v.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -5, scale: 1.05 }}
                className="bg-white rounded-2xl p-5 text-center border border-ksrtc-cream-dark/50 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div
                  className="text-3xl mb-2 group-hover:scale-110 transition-transform"
                >
                  {v.icon}
                </div>
                <p className="text-xs font-semibold text-vintage-ink">{v.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ JOURNEYS ═══════════════ */}
      <section className="py-24 px-4 bg-gradient-to-b from-ksrtc-cream/30 to-vintage-parchment">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-ksrtc-red/10 text-ksrtc-red text-sm font-semibold px-4 py-2 rounded-full mb-4">
              🚌 Recent Journeys 🚌
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-vintage-ink mb-4">
              Ride Along
            </h2>
            <p className="text-vintage-sepia/70 max-w-xl mx-auto">
              Click any journey to ride as a co-traveler through the windows
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleTravels.map((t, i) => (
              <TravelShowcaseCard key={t.id} travel={t} delay={i * 0.1} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("auth")}
              className="px-8 py-3 bg-ksrtc-red/10 text-ksrtc-red rounded-full font-semibold hover:bg-ksrtc-red hover:text-white transition-all duration-300"
            >
              View All Journeys →
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ QUOTE ═══════════════ */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="flex justify-center gap-4 mb-8">
              <TreePalm className="w-8 h-8 text-ksrtc-green/40" />
              <Waves className="w-8 h-8 text-ksrtc-sky/60" />
              <Mountain className="w-8 h-8 text-ksrtc-brown/40" />
            </div>
            <blockquote className="font-display text-2xl md:text-3xl text-vintage-ink/80 italic leading-relaxed mb-6">
              "The journey of a thousand miles begins with a single step onto the Anavandi..."
            </blockquote>
            <p className="font-malayalam text-xl text-ksrtc-brown/50 mb-8">
              "യാത്രയുടെ ഓർമ്മകൾ എന്നും നിലനിൽക്കും"
            </p>
            <p className="text-vintage-sepia/50 text-sm">— Every Kerala traveler ever</p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 road-line opacity-20" />
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section className="py-24 px-4 bg-gradient-to-b from-vintage-parchment to-ksrtc-cream">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-vintage-ink mb-6">
              Ready to Board?
            </h2>
            <p className="text-vintage-sepia/70 text-lg mb-10 max-w-xl mx-auto">
              Create your account and start sharing your Kerala journeys with fellow travelers.
            </p>
            <motion.div
              whileHover={{ scale: 1.03, rotate: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("auth")}
              className="inline-block cursor-pointer"
            >
              <div className="ticket-shape bg-ksrtc-red px-16 py-8 shadow-xl shadow-ksrtc-red/20">
                <div className="text-ksrtc-cream/80 text-xs tracking-widest uppercase mb-2">Boarding Pass</div>
                <div className="text-white font-display text-2xl font-bold mb-1">Kerala → Paradise</div>
                <div className="text-ksrtc-cream/60 text-sm">Click to start your journey</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <MusicPlayer />
    </motion.div>
  );
}
