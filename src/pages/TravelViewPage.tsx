import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../App";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  ArrowRight,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Camera,
  Users,
  Maximize,
  Minimize,
  Bus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  UserPlus,
  UserCheck,
  Eye,
  Plus,
  Bookmark,
  Bike,
  Car,
  Train,
} from "lucide-react";
import { VehicleInterior, VehiclePicker } from "../components/VehicleInterior";
import { type VehicleType, VEHICLES } from "../lib/utils";

const MOMENT_TYPES = [
  { type: "exciting", emoji: "⚡", label: "Exciting" },
  { type: "scenic", emoji: "🏔️", label: "Scenic" },
  { type: "nostalgic", emoji: "🌅", label: "Nostalgic" },
  { type: "wildlife", emoji: "🦜", label: "Wildlife" },
  { type: "food", emoji: "🍛", label: "Food Stop" },
  { type: "landmark", emoji: "🏛️", label: "Landmark" },
  { type: "sunset", emoji: "🌇", label: "Sunset" },
  { type: "monsoon", emoji: "🌧️", label: "Monsoon" },
] as const;

// Demo data
const TRAVEL_DATA = {
  id: "demo-garuda",
  title: "Monsoon Magic TVM to Kollam",
  from: "Thiruvananthapuram",
  to: "Kollam",
  route: "Ordinary",
  vibe: "Monsoon magic",
  traveler: "Ravi Kumar",
  travelerId: "ravi",
  description: "The paddy fields were covered in mist as the Anavandi climbed through the Western Ghats.",
  photos: [
    { gradient: "linear-gradient(135deg, #4A6741, #8FBC8F)", caption: "Misty paddy fields near Kazhakkoottam", time: "6:45 AM" },
    { gradient: "linear-gradient(135deg, #6B8E5A, #90B06A)", caption: "Winding road through Attingal", time: "7:15 AM" },
    { gradient: "linear-gradient(135deg, #3D6B4F, #7FB069)", caption: "Rain-kissed coconut palms", time: "7:45 AM" },
    { gradient: "linear-gradient(135deg, #5B7D4F, #A8C97F)", caption: "Local market near Varkala", time: "8:20 AM" },
    { gradient: "linear-gradient(135deg, #4A7C59, #85B58F)", caption: "Backwater bridge near Paravur", time: "8:50 AM" },
    { gradient: "linear-gradient(135deg, #556B2F, #8FBC8F)", caption: "Approaching Kollam town", time: "9:15 AM" },
    { gradient: "linear-gradient(135deg, #2E5A3A, #6B9E6A)", caption: "The Anavandi at Kollam depot", time: "9:30 AM" },
    { gradient: "linear-gradient(135deg, #3A5F4A, #7FB07F)", caption: "Morning tea at the final stop", time: "9:45 AM" },
  ],
};

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function TravelViewPage() {
  const { state, navigate } = useApp();
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoAdvance, setIsAutoAdvance] = useState(true);
  const [liked, setLiked] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [showMomentPicker, setShowMomentPicker] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [moments, setMoments] = useState<Record<number, { type: string; label: string }[]>>({});
  const [vehicleType, setVehicleType] = useState<VehicleType>("ksrtc-bus");
  const [showVehiclePicker, setShowVehiclePicker] = useState(false);
  const travel = TRAVEL_DATA;

  useEffect(() => {
    if (!isAutoAdvance || !isPlaying) return;
    const timer = setInterval(() => {
      setCurrentPhoto((prev) => (prev + 1) % travel.photos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isAutoAdvance, isPlaying, travel.photos.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setCurrentPhoto((prev) => (prev - 1 + travel.photos.length) % travel.photos.length);
      else if (e.key === "ArrowRight") setCurrentPhoto((prev) => (prev + 1) % travel.photos.length);
      else if (e.key === "Escape") { if (isFullscreen) setIsFullscreen(false); else navigate("dashboard"); }
      else if (e.key === " ") { e.preventDefault(); setIsPlaying((p) => !p); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isFullscreen, navigate, travel.photos.length]);

  const addMoment = (type: string, label: string) => {
    setMoments((prev) => ({
      ...prev,
      [currentPhoto]: [...(prev[currentPhoto] || []), { type, label }],
    }));
    setShowMomentPicker(false);
  };

  const currentPhotoMoments = moments[currentPhoto] || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen ${isFullscreen ? "bg-black" : "bg-vintage-parchment"}`}
    >
      {/* Top bar */}
      {!isFullscreen && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-vintage-parchment/90 backdrop-blur-md border-b border-ksrtc-brown/10">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={() => navigate("dashboard")} className="flex items-center gap-2 text-vintage-sepia/70 hover:text-ksrtc-red transition-colors">
              <ArrowLeft className="w-5 h-5" /><span className="text-sm font-medium">Back</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-vintage-sepia/40">{currentPhoto + 1} / {travel.photos.length}</span>
              <div className="w-px h-4 bg-ksrtc-cream-dark mx-1" />
              <button onClick={() => setLiked(!liked)} className={`p-2 rounded-full transition-all ${liked ? "bg-ksrtc-red/10 text-ksrtc-red" : "text-vintage-sepia/40 hover:text-ksrtc-red"}`}>
                <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
              </button>
              <button className="p-2 rounded-full text-vintage-sepia/40 hover:text-ksrtc-red transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`${isFullscreen ? "" : "pt-16"}`}>
        {/* Route header */}
        {!isFullscreen && (
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="font-display text-2xl font-bold text-vintage-ink">{travel.title}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-ksrtc-red" />
                  <span className="text-sm text-vintage-sepia/70">{travel.from}</span>
                  <ArrowRight className="w-3 h-3 text-ksrtc-gold" />
                  <span className="text-sm text-vintage-sepia/70">{travel.to}</span>
                  <span className="px-2 py-0.5 bg-ksrtc-red/10 text-ksrtc-red text-xs rounded-full ml-2">{travel.route}</span>
                </div>
                <button onClick={() => navigate("traveler-profile", { travelerId: travel.travelerId })} className="text-xs text-vintage-sepia/50 hover:text-ksrtc-red mt-1 flex items-center gap-1">
                  by {travel.traveler}
                </button>
              </div>
              <div className="flex items-center gap-2">
                {/* Follow button */}
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
                    isFollowing ? "bg-ksrtc-cream text-ksrtc-brown" : "bg-ksrtc-red text-white shadow-sm"
                  }`}>
                  {isFollowing ? <><UserCheck className="w-4 h-4" /> Following</> : <><UserPlus className="w-4 h-4" /> Follow</>}
                </motion.button>
                {/* Relive button */}
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("relive", { travelId: travel.id })}
                  className="px-4 py-2 bg-ksrtc-gold/10 text-ksrtc-gold-dark rounded-lg text-sm font-semibold flex items-center gap-1.5 hover:bg-ksrtc-gold/20 transition-all">
                  <Sparkles className="w-4 h-4" /> Relive
                </motion.button>
                <button onClick={() => setShowInfo(!showInfo)} className={`p-2 rounded-lg transition-all ${showInfo ? "bg-ksrtc-cream text-ksrtc-red" : "bg-ksrtc-cream/30 text-vintage-sepia/40"}`}>
                  <Eye className="w-5 h-5" />
                </button>
                <button onClick={() => setIsFullscreen(true)} className="p-2 rounded-lg bg-ksrtc-cream/30 text-vintage-sepia/40 hover:bg-ksrtc-cream hover:text-ksrtc-red transition-all">
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Vehicle window with photo */}
        <div className={`${isFullscreen ? "max-w-full px-2 py-2" : "max-w-5xl mx-auto px-4"}`}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
            {/* Vehicle type badge */}
            <div className="flex items-center justify-between mb-2">
              <button onClick={() => setShowVehiclePicker(!showVehiclePicker)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/80 border border-ksrtc-cream-dark text-sm font-medium text-vintage-ink hover:bg-white transition-all">
                <span>{VEHICLES[vehicleType].icon}</span> {VEHICLES[vehicleType].name}
                <ChevronRight className={`w-3 h-3 transition-transform ${showVehiclePicker ? "rotate-90" : ""}`} />
              </button>
            </div>
            {/* Vehicle picker dropdown */}
            <AnimatePresence>
              {showVehiclePicker && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mb-3">
                  <VehiclePicker selected={vehicleType} onSelect={(v) => { setVehicleType(v); setShowVehiclePicker(false); }} />
                </motion.div>
              )}
            </AnimatePresence>
            <VehicleInterior vehicleType={vehicleType} isFullscreen={isFullscreen}>
              {/* Photo */}
              <AnimatePresence mode="wait">
                <motion.div key={currentPhoto} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.6 }}
                  className="absolute z-[5] left-3 top-3 bottom-6 rounded-sm overflow-hidden" style={{ right: vehicleType === "ksrtc-bus" ? "calc(50%+3px)" : "3px" }}>
                  <div className="absolute inset-0" style={{ background: travel.photos[currentPhoto].gradient }} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Camera className="w-16 h-16 text-white/20 mb-4" />
                    <p className="text-white/60 text-sm font-medium px-4 text-center">{travel.photos[currentPhoto].caption}</p>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/40 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">{travel.photos[currentPhoto].time}</div>
                </motion.div>
              </AnimatePresence>
              {/* Moment markers */}
              {currentPhotoMoments.length > 0 && (
                <div className="absolute left-3 top-3 z-20 flex flex-col gap-1.5">
                  {currentPhotoMoments.map((m, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                      className="bg-black/40 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/10">
                      <span>{MOMENT_TYPES.find(mt => mt.type === m.type)?.emoji || "✨"}</span>
                      <span className="font-medium">{m.label}</span>
                    </motion.div>
                  ))}
                </div>
              )}
              {/* Navigation arrows */}
              <button onClick={() => setCurrentPhoto((prev) => (prev - 1 + travel.photos.length) % travel.photos.length)}
                className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setCurrentPhoto((prev) => (prev + 1) % travel.photos.length)}
                className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
              {/* Photo indicators */}
              <div className="absolute left-3 bottom-2 z-20 flex gap-1">
                {travel.photos.map((_, i) => (
                  <button key={i} onClick={() => setCurrentPhoto(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentPhoto ? "bg-white w-4" : "bg-white/40 hover:bg-white/60"}`} />
                ))}
              </div>
            </VehicleInterior>
          </motion.div>

          {/* Controls */}
          <div className={`flex items-center justify-center gap-3 mt-4 ${isFullscreen ? "fixed bottom-4 left-1/2 -translate-x-1/2 bg-vintage-ink/80 backdrop-blur-xl rounded-2xl px-6 py-3 z-50" : ""}`}>
            <button onClick={() => setCurrentPhoto((prev) => (prev - 1 + travel.photos.length) % travel.photos.length)}
              className={`p-2.5 rounded-full transition-all ${isFullscreen ? "text-white hover:bg-white/10" : "bg-ksrtc-cream/50 text-vintage-sepia hover:bg-ksrtc-cream"}`}>
              <SkipBack className="w-5 h-5" />
            </button>
            <button onClick={() => setIsPlaying(!isPlaying)}
              className={`p-3 rounded-full transition-all ${isFullscreen ? "bg-ksrtc-red text-white shadow-lg" : "bg-ksrtc-red text-white shadow-lg shadow-ksrtc-red/25"}`}>
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <button onClick={() => setCurrentPhoto((prev) => (prev + 1) % travel.photos.length)}
              className={`p-2.5 rounded-full transition-all ${isFullscreen ? "text-white hover:bg-white/10" : "bg-ksrtc-cream/50 text-vintage-sepia hover:bg-ksrtc-cream"}`}>
              <SkipForward className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-white/10 mx-1" />
            {/* Add moment button */}
            <div className="relative">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => setShowMomentPicker(!showMomentPicker)}
                className={`p-2.5 rounded-full transition-all ${showMomentPicker ? "bg-ksrtc-gold text-white" : isFullscreen ? "text-white hover:bg-white/10" : "bg-ksrtc-gold/10 text-ksrtc-gold-dark hover:bg-ksrtc-gold/20"}`}>
                <Plus className="w-5 h-5" />
              </motion.button>
              {/* Moment picker */}
              <AnimatePresence>
                {showMomentPicker && (
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-2xl border border-ksrtc-cream-dark p-3 w-56 z-30">
                    <p className="text-xs font-bold text-vintage-sepia/60 mb-2">Mark a moment</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {MOMENT_TYPES.map((mt) => (
                        <button key={mt.type} onClick={() => addMoment(mt.type, mt.label)}
                          className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium text-vintage-ink hover:bg-ksrtc-cream/50 transition-all text-left">
                          <span>{mt.emoji}</span> {mt.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button onClick={() => setIsAutoAdvance(!isAutoAdvance)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${isAutoAdvance ? "bg-ksrtc-gold/20 text-ksrtc-gold-dark" : isFullscreen ? "text-white/50 hover:text-white" : "text-vintage-sepia/40 hover:text-vintage-sepia"}`}>
              {isAutoAdvance ? "Auto" : "Manual"}
            </button>
            {isFullscreen && (
              <button onClick={() => setIsFullscreen(false)} className="p-2.5 rounded-full text-white hover:bg-white/10 transition-all ml-2">
                <Minimize className="w-5 h-5" />
              </button>
            )}
            {!isFullscreen && (
              <button onClick={() => setIsFullscreen(true)} className="p-2.5 rounded-full bg-ksrtc-cream/30 text-vintage-sepia/40 hover:bg-ksrtc-cream transition-all">
                <Maximize className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Photo strip */}
          {!isFullscreen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="mt-6 flex gap-3 overflow-x-auto pb-2">
              {travel.photos.map((photo, i) => (
                <motion.button key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPhoto(i)}
                  className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all relative ${
                    i === currentPhoto ? "border-ksrtc-red shadow-md scale-105" : "border-transparent opacity-60 hover:opacity-80"
                  }`}>
                  <div className="w-full h-full" style={{ background: photo.gradient }} />
                  {moments[i] && moments[i].length > 0 && (
                    <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-ksrtc-gold rounded-full flex items-center justify-center">
                      <Sparkles className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Info panel */}
          {!isFullscreen && showInfo && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-white rounded-2xl p-6 border border-ksrtc-cream-dark">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-ksrtc-red/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-ksrtc-red" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-vintage-ink">{travel.traveler}</p>
                  <p className="text-xs text-vintage-sepia/60 mt-1">{travel.description}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Bus className="w-4 h-4 text-ksrtc-red" />
                <span className="text-xs text-vintage-sepia/60">{travel.route} • {travel.vibe} • {travel.photos.length} photos</span>
              </div>
              {/* Moments summary */}
              {Object.keys(moments).length > 0 && (
                <div className="mt-4 pt-4 border-t border-ksrtc-cream-dark">
                  <p className="text-xs font-bold text-vintage-sepia/60 mb-2 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Your Moments</p>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(moments).flatMap(([_, ms]) =>
                      ms.map((m, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-ksrtc-gold/10 text-ksrtc-gold-dark rounded-full">
                          {MOMENT_TYPES.find(mt => mt.type === m.type)?.emoji} {m.label}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {!isFullscreen && (
          <div className="max-w-5xl mx-auto px-4 mt-6 mb-12">
            <p className="text-xs text-vintage-sepia/30 text-center">
              Space: play/pause • ← →: navigate • +: mark moment • F: fullscreen • Esc: back
            </p>
          </div>
        )}
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" onClick={() => setIsFullscreen(false)} />
      )}
    </motion.div>
  );
}
