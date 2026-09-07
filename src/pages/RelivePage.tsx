import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../App";
import { Header } from "../components/layout/Header";
import {
  ArrowLeft,
  Sparkles,
  Heart,
  MapPin,
  ArrowRight,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Star,
  Eye,
  Camera,
  Maximize,
  Minimize,
  Bookmark,
  BookmarkCheck,
  Music,
  Volume2,
  Clock,
  Bus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Moment type config
const MOMENT_CONFIG: Record<string, { emoji: string; color: string; bg: string }> = {
  exciting: { emoji: "⚡", color: "text-yellow-400", bg: "bg-yellow-400/20" },
  scenic: { emoji: "🏔️", color: "text-emerald-400", bg: "bg-emerald-400/20" },
  nostalgic: { emoji: "🌅", color: "text-orange-400", bg: "bg-orange-400/20" },
  wildlife: { emoji: "🦜", color: "text-green-400", bg: "bg-green-400/20" },
  food: { emoji: "🍛", color: "text-red-400", bg: "bg-red-400/20" },
  landmark: { emoji: "🏛️", color: "text-blue-400", bg: "bg-blue-400/20" },
  sunset: { emoji: "🌇", color: "text-orange-300", bg: "bg-orange-300/20" },
  monsoon: { emoji: "🌧️", color: "text-cyan-400", bg: "bg-cyan-400/20" },
  custom: { emoji: "✨", color: "text-purple-400", bg: "bg-purple-400/20" },
};

// Demo data with moments
const RELIVE_DATA = {
  id: "t1",
  title: "Monsoon Magic TVM to Kollam",
  from: "Thiruvananthapuram",
  to: "Kollam",
  vibe: "Monsoon magic",
  traveler: "Ravi Kumar",
  description: "The paddy fields were covered in mist as the Anavandi climbed through the Western Ghats.",
  photos: [
    { gradient: "linear-gradient(135deg, #4A6741, #8FBC8F)", caption: "Misty paddy fields near Kazhakkoottam", time: "6:45 AM",
      moments: [{ type: "scenic", label: "Misty Paddy Fields", note: "Fog rolling over emerald fields — pure magic!" }] },
    { gradient: "linear-gradient(135deg, #6B8E5A, #90B06A)", caption: "Winding road through Attingal", time: "7:15 AM",
      moments: [{ type: "exciting", label: "Hairpin Bends!", note: "The driver navigated these with masterful skill" }] },
    { gradient: "linear-gradient(135deg, #3D6B4F, #7FB069)", caption: "Rain-kissed coconut palms", time: "7:45 AM",
      moments: [{ type: "monsoon", label: "First Rain", note: "The scent of wet earth through the open window" }] },
    { gradient: "linear-gradient(135deg, #5B7D4F, #A8C97F)", caption: "Local market near Varkala", time: "8:20 AM",
      moments: [{ type: "food", label: "Tea Stall Stop", note: "Cutting chai and parotta at the roadside stall" }] },
    { gradient: "linear-gradient(135deg, #4A7C59, #85B58F)", caption: "Backwater bridge near Paravur", time: "8:50 AM",
      moments: [{ type: "landmark", label: "Paravur Bridge", note: "The historic bridge crossing the backwaters" }] },
    { gradient: "linear-gradient(135deg, #556B2F, #8FBC8F)", caption: "Approaching Kollam town", time: "9:15 AM",
      moments: [] },
    { gradient: "linear-gradient(135deg, #2E5A3A, #6B9E6A)", caption: "The Anavandi at Kollam depot", time: "9:30 AM",
      moments: [{ type: "nostalgic", label: "Journey's End", note: "Every Anavandi journey ends with a sense of completion" }] },
    { gradient: "linear-gradient(135deg, #3A5F4A, #7FB07F)", caption: "Morning tea at the final stop", time: "9:45 AM",
      moments: [{ type: "scenic", label: "Kollam Sunrise", note: "Golden light bathed the entire depot" }] },
  ],
};

// Photo viewer with bus window
function RelivePhotoViewer({
  photos,
  currentIndex,
  moments,
}: {
  photos: typeof RELIVE_DATA.photos;
  currentIndex: number;
  moments: { type: string; label: string; note: string }[];
}) {
  return (
    <div className="relative w-full h-full">
      {/* Scenic background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{ background: photos[currentIndex].gradient }} />
        {/* Clouds / atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Bus window frame */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute left-1/2 top-0 bottom-0 w-1.5 bg-ksrtc-window-frame/80" />
        <div className="absolute top-0 left-0 right-0 h-3 bg-ksrtc-window-frame/80" />
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-ksrtc-window-frame/80" />
        <div className="absolute top-0 bottom-0 left-0 w-3 bg-ksrtc-window-frame/80" />
        <div className="absolute top-0 bottom-0 right-0 w-3 bg-ksrtc-window-frame/80" />
        <div className="absolute inset-0 glass-reflection" />
      </div>

      {/* Photo content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6 }}
          className="absolute z-5 left-3 top-3 bottom-6 right-[calc(50%+3px)] rounded-sm overflow-hidden"
        >
          <div className="absolute inset-0" style={{ background: photos[currentIndex].gradient }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <Camera className="w-14 h-14 text-white/20 mb-3" />
            <p className="text-white/60 text-sm font-medium text-center">{photos[currentIndex].caption}</p>
          </div>
          <div className="absolute bottom-2 left-2 bg-black/40 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
            {photos[currentIndex].time}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Moment indicators on the photo */}
      {moments.length > 0 && (
        <div className="absolute left-3 top-3 z-20 flex flex-col gap-2">
          {moments.map((m, i) => {
            const config = MOMENT_CONFIG[m.type] || MOMENT_CONFIG.custom;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className={`${config.bg} backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10 max-w-[200px]`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{config.emoji}</span>
                  <span className="text-white text-xs font-bold">{m.label}</span>
                </div>
                {m.note && <p className="text-white/60 text-[10px] mt-1 leading-relaxed">{m.note}</p>}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Navigation */}
      <button
        onClick={() => {}}
        className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => {}}
        className="absolute left-[calc(50%-12px)] top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// Timeline component
function Timeline({
  photos,
  currentIndex,
  onSelect,
}: {
  photos: typeof RELIVE_DATA.photos;
  currentIndex: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-ksrtc-cream-dark" />

      <div className="space-y-1">
        {photos.map((photo, i) => {
          const hasMoment = photo.moments.length > 0;
          const config = hasMoment ? MOMENT_CONFIG[photo.moments[0].type] : null;

          return (
            <motion.button
              key={i}
              whileHover={{ x: 4 }}
              onClick={() => onSelect(i)}
              className={`w-full text-left pl-10 pr-4 py-2 rounded-lg relative transition-all ${
                i === currentIndex
                  ? "bg-ksrtc-red/10"
                  : "hover:bg-ksrtc-cream/30"
              }`}
            >
              {/* Dot */}
              <div
                className={`absolute left-2.5 top-3 w-3 h-3 rounded-full border-2 transition-all ${
                  i === currentIndex
                    ? "bg-ksrtc-red border-ksrtc-red scale-125"
                    : hasMoment
                    ? `bg-ksrtc-gold border-ksrtc-gold`
                    : "bg-white border-ksrtc-cream-dark"
                }`}
              />

              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${i === currentIndex ? "text-ksrtc-red" : "text-vintage-ink"}`}>
                    {photo.time}
                    {hasMoment && (
                      <span className="ml-2 text-xs">{config?.emoji}</span>
                    )}
                  </p>
                  <p className="text-xs text-vintage-sepia/50 line-clamp-1">{photo.caption}</p>
                </div>
                {hasMoment && (
                  <span className="text-xs bg-ksrtc-gold/10 text-ksrtc-gold-dark px-2 py-0.5 rounded-full">
                    {photo.moments.length}
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export function RelivePage() {
  const { state, navigate } = useApp();
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoAdvance, setIsAutoAdvance] = useState(true);
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());
  const travel = RELIVE_DATA;

  // Auto-advance
  useEffect(() => {
    if (!isAutoAdvance || !isPlaying) return;
    const timer = setInterval(() => {
      setCurrentPhoto((prev) => (prev + 1) % travel.photos.length);
    }, 5000); // Slower for relive — more contemplative
    return () => clearInterval(timer);
  }, [isAutoAdvance, isPlaying, travel.photos.length]);

  // Keyboard
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setCurrentPhoto((prev) => (prev - 1 + travel.photos.length) % travel.photos.length);
      else if (e.key === "ArrowRight") setCurrentPhoto((prev) => (prev + 1) % travel.photos.length);
      else if (e.key === "Escape") { if (isFullscreen) setIsFullscreen(false); else navigate("dashboard"); }
      else if (e.key === " ") { e.preventDefault(); setIsPlaying((p) => !p); }
      else if (e.key === "b" || e.key === "B") {
        setBookmarked((prev) => {
          const next = new Set(prev);
          if (next.has(currentPhoto)) next.delete(currentPhoto);
          else next.add(currentPhoto);
          return next;
        });
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isFullscreen, navigate, travel.photos.length, currentPhoto]);

  const toggleBookmark = (i: number) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  // Get current photo's moments
  const currentMoments = travel.photos[currentPhoto].moments;
  const totalMoments = travel.photos.reduce((acc, p) => acc + p.moments.length, 0);

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
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-ksrtc-gold/10 text-ksrtc-gold-dark text-xs font-bold rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Reliving
              </span>
              <span className="text-xs text-vintage-sepia/40">{currentPhoto + 1} / {travel.photos.length}</span>
            </div>
          </div>
        </div>
      )}

      <div className={`${isFullscreen ? "" : "pt-16"}`}>
        {/* Route header */}
        {!isFullscreen && (
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-2xl font-bold text-vintage-ink">{travel.title}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-ksrtc-red" />
                  <span className="text-sm text-vintage-sepia/70">{travel.from}</span>
                  <ArrowRight className="w-3 h-3 text-ksrtc-gold" />
                  <span className="text-sm text-vintage-sepia/70">{travel.to}</span>
                  <span className="px-2 py-0.5 bg-ksrtc-red/10 text-ksrtc-red text-xs rounded-full ml-2">{travel.vibe}</span>
                </div>
                <p className="text-xs text-vintage-sepia/50 mt-1">by {travel.traveler}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-vintage-sepia/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> {totalMoments} moments
                </span>
                <span className="text-xs text-vintage-sepia/40 flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {travel.photos.length} photos
                </span>
              </div>
            </div>
          </div>
        )}

        <div className={`max-w-6xl mx-auto px-4 ${isFullscreen ? "h-screen flex flex-col" : ""}`}>
          <div className={`flex gap-4 ${isFullscreen ? "flex-1 min-h-0" : ""}`}>
            {/* Main view */}
            <div className={`${isFullscreen ? "flex-1" : "flex-1"}`}>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
                className={`${isFullscreen ? "h-full" : "aspect-[16/10]"} bg-gradient-to-b from-[#8B4513] to-[#654321] rounded-2xl overflow-hidden shadow-2xl`}
              >
                {/* Bus interior */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#A0522D] to-[#8B4513] z-20" />
                <div className="absolute bottom-0 left-0 right-0 h-16 z-20 flex">
                  <div className="flex-1 bg-gradient-to-t from-[#654321] to-[#8B4513] border-t-2 border-[#A0522D] flex items-center justify-center">
                    <div className="text-[#F5E6C8]/20 text-xs font-bold">SEAT</div>
                  </div>
                  <div className="w-2 bg-[#555]" />
                  <div className="flex-1 bg-gradient-to-t from-[#654321] to-[#8B4513] border-t-2 border-[#A0522D] flex items-center justify-center">
                    <div className="text-[#F5E6C8]/20 text-xs font-bold">SEAT</div>
                  </div>
                </div>
                {/* Window */}
                <div className="absolute top-8 bottom-16 left-0 right-0 z-10">
                  <RelivePhotoViewer photos={travel.photos} currentIndex={currentPhoto} moments={currentMoments} />
                </div>
              </motion.div>

              {/* Controls */}
              <div className={`flex items-center justify-center gap-3 mt-4 ${isFullscreen ? "fixed bottom-4 left-1/2 -translate-x-1/2 bg-vintage-ink/80 backdrop-blur-xl rounded-2xl px-6 py-3" : ""}`}>
                <button onClick={() => setCurrentPhoto((prev) => (prev - 1 + travel.photos.length) % travel.photos.length)}
                  className={`p-2.5 rounded-full ${isFullscreen ? "text-white hover:bg-white/10" : "bg-ksrtc-cream/50 text-vintage-sepia hover:bg-ksrtc-cream"}`}>
                  <SkipBack className="w-5 h-5" />
                </button>
                <button onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-3 rounded-full ${isFullscreen ? "bg-ksrtc-red text-white" : "bg-ksrtc-red text-white shadow-lg shadow-ksrtc-red/25"}`}>
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <button onClick={() => setCurrentPhoto((prev) => (prev + 1) % travel.photos.length)}
                  className={`p-2.5 rounded-full ${isFullscreen ? "text-white hover:bg-white/10" : "bg-ksrtc-cream/50 text-vintage-sepia hover:bg-ksrtc-cream"}`}>
                  <SkipForward className="w-5 h-5" />
                </button>
                <div className="w-px h-6 bg-white/10 mx-1" />
                <button onClick={() => toggleBookmark(currentPhoto)}
                  className={`p-2.5 rounded-full transition-all ${bookmarked.has(currentPhoto) ? "text-ksrtc-gold" : isFullscreen ? "text-white/50 hover:text-white" : "text-vintage-sepia/40 hover:text-ksrtc-gold"}`}>
                  {bookmarked.has(currentPhoto) ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                </button>
                <button onClick={() => setIsAutoAdvance(!isAutoAdvance)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${isAutoAdvance ? "bg-ksrtc-gold/20 text-ksrtc-gold-dark" : isFullscreen ? "text-white/50" : "text-vintage-sepia/40"}`}>
                  {isAutoAdvance ? "Auto" : "Manual"}
                </button>
                {isFullscreen && (
                  <button onClick={() => setIsFullscreen(false)} className="p-2.5 rounded-full text-white hover:bg-white/10">
                    <Minimize className="w-5 h-5" />
                  </button>
                )}
                {!isFullscreen && (
                  <button onClick={() => setIsFullscreen(true)} className="p-2.5 rounded-full bg-ksrtc-cream/30 text-vintage-sepia/40 hover:bg-ksrtc-cream">
                    <Maximize className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Timeline sidebar (desktop) */}
            {!isFullscreen && (
              <div className="hidden lg:block w-72 flex-shrink-0">
                <div className="bg-white rounded-2xl p-4 border border-ksrtc-cream-dark sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
                  <h3 className="font-display text-sm font-bold text-vintage-ink mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-ksrtc-red" /> Journey Timeline
                  </h3>
                  <Timeline photos={travel.photos} currentIndex={currentPhoto} onSelect={setCurrentPhoto} />

                  {/* Moment summary */}
                  <div className="mt-4 pt-4 border-t border-ksrtc-cream-dark">
                    <h4 className="text-xs font-bold text-vintage-sepia/60 mb-2">Moments Found</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(
                        travel.photos.reduce<Record<string, number>>((acc, p) => {
                          p.moments.forEach((m) => { acc[m.type] = (acc[m.type] || 0) + 1; });
                          return acc;
                        }, {})
                      ).map(([type, count]) => {
                        const config = MOMENT_CONFIG[type];
                        return (
                          <span key={type} className={`text-xs px-2 py-1 rounded-full ${config?.bg || "bg-gray-100"}`}>
                            {config?.emoji} {count}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bookmarked count */}
                  {bookmarked.size > 0 && (
                    <div className="mt-3 pt-3 border-t border-ksrtc-cream-dark">
                      <p className="text-xs text-ksrtc-gold-dark flex items-center gap-1">
                        <BookmarkCheck className="w-3 h-3" /> {bookmarked.size} bookmarked moments
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Keyboard hints */}
        {!isFullscreen && (
          <div className="max-w-5xl mx-auto px-4 mt-6 mb-12">
            <p className="text-xs text-vintage-sepia/30 text-center">
              Space: play/pause • ← →: navigate • B: bookmark moment • F: fullscreen • Esc: back
            </p>
          </div>
        )}
      </div>

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" onClick={() => setIsFullscreen(false)} />
      )}
    </motion.div>
  );
}
