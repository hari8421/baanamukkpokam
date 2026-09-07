import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "../App";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { MusicPlayer } from "../components/music/MusicPlayer";
import {
  Camera,
  MapPin,
  ArrowRight,
  Plus,
  Search,
  Filter,
  Clock,
  Users,
  Bus,
  Sparkles,
} from "lucide-react";
import { KSRTC_DESTINATIONS, VEHICLES, type VehicleType } from "../lib/utils";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

// Only ONE demo travel — the rest should come from Convex live data
const SEED_TRAVELS = [
  {
    _id: "seed-1" as string,
    title: "Monsoon Magic TVM to Kollam",
    from: "Thiruvananthapuram",
    to: "Kollam",
    route: "Ordinary",
    vibe: "Monsoon magic",
    vehicle: "ksrtc-bus" as VehicleType,
    photoCount: 24,
    travelerName: "Ravi Kumar",
    publishedAt: Date.now() - 7200000,
    description: "The paddy fields were covered in mist as the Anavandi climbed through the Western Ghats...",
  },
];

type TravelItem = (typeof SEED_TRAVELS)[0] | Record<string, unknown>;

function isSeedTravel(t: TravelItem): t is (typeof SEED_TRAVELS)[0] {
  return typeof t._id === "string" && t._id.startsWith("seed-");
}

function getTravelTitle(t: TravelItem): string {
  return (t.title as string) || "Untitled Journey";
}

function getTravelFrom(t: TravelItem): string {
  return (t.from as string) || "";
}

function getTravelTo(t: TravelItem): string {
  return (t.to as string) || "";
}

function getTravelVibe(t: TravelItem): string {
  return (t.vibe as string) || "Monsoon magic";
}

function getTravelVehicle(t: TravelItem): VehicleType {
  return ((t.vehicle as string) || "ksrtc-bus") as VehicleType;
}

function getTravelPhotoCount(t: TravelItem): number {
  return (t.photoCount as number) || 0;
}

function getTravelTravelerName(t: TravelItem): string {
  return (t.travelerName as string) || "Unknown";
}

function getTravelRoute(t: TravelItem): string {
  return (t.route as string) || "";
}

function getTravelId(t: TravelItem): string {
  if (isSeedTravel(t)) return t._id;
  return (t._id as string) || (t.id as string) || "unknown";
}

function getTravelDescription(t: TravelItem): string {
  if (isSeedTravel(t)) return t.description;
  return (t.description as string) || "";
}

function getTravelPublishedAt(t: TravelItem): number {
  if (isSeedTravel(t)) return t.publishedAt;
  return (t.publishedAt as number) || Date.now();
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function TravelCard({
  travel,
  index,
}: {
  travel: TravelItem;
  index: number;
}) {
  const { navigate } = useApp();
  const vehicleType = getTravelVehicle(travel);
  const vehicle = VEHICLES[vehicleType];

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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-ksrtc-cream-dark/50 cursor-pointer group"
      onClick={() => navigate("travel-view", { travelId: getTravelId(travel) })}
    >
      <div className="h-44 relative overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
          style={{ background: gradients[getTravelVibe(travel)] || gradients["Monsoon magic"] }}
        />
        {/* Window frame */}
        <div className="absolute inset-0 flex">
          <div className="w-1 bg-ksrtc-window-frame/60" />
          <div className="flex-1 relative"><div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" /></div>
          <div className="w-0.5 bg-ksrtc-window-frame/40" />
          <div className="flex-1 relative"><div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" /></div>
          <div className="w-1 bg-ksrtc-window-frame/60" />
        </div>
        {/* Vehicle + photo count */}
        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <span>{vehicle.icon}</span> {getTravelPhotoCount(travel)} photos
        </div>
        <div className="absolute top-3 right-3 bg-ksrtc-red/90 text-white text-xs px-3 py-1.5 rounded-full">
          {getTravelVibe(travel)}
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <div className="w-10 h-10 bg-ksrtc-red rounded-full flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-white ml-0.5" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-display text-lg font-bold text-vintage-ink mb-2 line-clamp-1">{getTravelTitle(travel)}</h3>
        <p className="text-sm text-vintage-sepia/60 mb-3 line-clamp-2">{getTravelDescription(travel)}</p>
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-ksrtc-red flex-shrink-0" />
          <span className="text-sm font-medium text-vintage-ink">{getTravelFrom(travel)}</span>
          <ArrowRight className="w-3 h-3 text-ksrtc-gold" />
          <span className="text-sm font-medium text-vintage-ink">{getTravelTo(travel)}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-vintage-sepia/50">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {getTravelTravelerName(travel)}</span>
            <span className="flex items-center gap-1"><Bus className="w-3 h-3" /> {getTravelRoute(travel)}</span>
          </div>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatTimeAgo(getTravelPublishedAt(travel))}</span>
        </div>
      </div>
    </motion.div>
  );
}

// Live data component — only rendered inside ConvexProvider
function LiveTravelsGrid({ searchQuery, selectedFilter }: { searchQuery: string; selectedFilter: string }) {
  const liveTravels = useQuery(api.travels.list, { limit: 50 });

  if (liveTravels === undefined) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-ksrtc-cream-dark/50 animate-pulse">
            <div className="h-44 bg-ksrtc-cream/50" />
            <div className="p-5 space-y-3">
              <div className="h-5 bg-ksrtc-cream/50 rounded w-3/4" />
              <div className="h-4 bg-ksrtc-cream/30 rounded w-full" />
              <div className="h-3 bg-ksrtc-cream/20 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (liveTravels.length === 0) {
    return null; // Will be handled by parent empty state
  }

  const filtered = liveTravels.filter((t) => {
    const matchesSearch =
      !searchQuery ||
      t.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || t.vibe.toLowerCase().includes(selectedFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.map((travel, i) => (
        <TravelCard key={travel._id} travel={travel as unknown as TravelItem} index={i} />
      ))}
    </div>
  );
}

export function DashboardPage() {
  const { state, navigate, hasConvex } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filters = ["all", "Monsoon", "Sunset", "Night", "Hill", "Festival", "Ordinary"];

  // Filter the seed travel
  const filteredSeedTravels = SEED_TRAVELS.filter((t) => {
    const matchesSearch =
      !searchQuery ||
      t.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || t.vibe.toLowerCase().includes(selectedFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-vintage-parchment"
    >
      <Header />

      <div className="pt-20 pb-8">
        {/* Hero banner */}
        <div className="bg-gradient-to-r from-ksrtc-red via-ksrtc-red-dark to-ksrtc-brown-dark py-12 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {[...Array(8)].map((_, i) => (
              <Bus
                key={i}
                className="absolute text-white"
                style={{ left: `${i * 12}%`, top: `${10 + i * 8}%`, width: `${30 + i * 4}px`, transform: `rotate(${i * 5 - 20}deg)` }}
              />
            ))}
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
                {state.guestMode ? "Welcome, Guest Traveler" : `Welcome back, ${state.user?.name}`}
              </h1>
              <p className="text-ksrtc-cream/70 font-malayalam text-lg">കേരളത്തിന്റെ യാത്രാ ഓർമ്മകൾ</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 flex gap-3"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vintage-sepia/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search routes, destinations, vibes..."
                  className="w-full pl-12 pr-4 py-3.5 bg-white/90 backdrop-blur rounded-xl text-vintage-ink placeholder-vintage-sepia/30 focus:outline-none focus:ring-2 focus:ring-ksrtc-gold shadow-lg"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => state.guestMode ? navigate("auth") : navigate("post-travel")}
                className="px-6 py-3.5 bg-ksrtc-gold text-white rounded-xl font-bold shadow-lg hover:bg-ksrtc-gold-dark transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Post Journey</span>
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Filter className="w-4 h-4 text-vintage-sepia/40 flex-shrink-0" />
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedFilter === f
                    ? "bg-ksrtc-red text-white shadow-sm"
                    : "bg-white text-vintage-sepia/60 hover:bg-ksrtc-cream border border-ksrtc-cream-dark"
                }`}
              >
                {f === "all" ? "All Journeys" : f}
              </button>
            ))}
          </div>
        </div>

        {/* Travel grid */}
        <div className="max-w-6xl mx-auto px-4">
          {hasConvex ? (
            <LiveTravelsGrid searchQuery={searchQuery} selectedFilter={selectedFilter} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSeedTravels.map((travel, i) => (
                <TravelCard key={travel._id} travel={travel} index={i} />
              ))}
            </div>
          )}

          {/* Empty state — shown when both live and seed are empty */}
          {!hasConvex && filteredSeedTravels.length === 0 && (
            <div className="text-center py-20">
              <Bus className="w-16 h-16 text-vintage-sepia/20 mx-auto mb-4" />
              <p className="text-vintage-sepia/40 text-lg">No journeys found</p>
              <p className="text-vintage-sepia/30 text-sm mt-1 mb-6">
                {searchQuery ? "Try different search terms" : "Be the first to post a journey!"}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => state.guestMode ? navigate("auth") : navigate("post-travel")}
                className="px-6 py-3 bg-ksrtc-red text-white rounded-xl font-bold flex items-center gap-2 mx-auto"
              >
                <Sparkles className="w-4 h-4" /> Post First Journey
              </motion.button>
            </div>
          )}

          {/* Show CTA hint when Convex has no data */}
          {hasConvex && (
            <div className="text-center mt-8">
              <p className="text-vintage-sepia/30 text-sm">
                {state.guestMode
                  ? "Sign in to post your own journey"
                  : "Post a journey to see it here with live data"}
              </p>
            </div>
          )}
        </div>

        {/* Destination quick picks */}
        <div className="max-w-6xl mx-auto px-4 mt-16">
          <h2 className="font-display text-2xl font-bold text-vintage-ink mb-6">KSRTC Destinations</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {KSRTC_DESTINATIONS.slice(0, 10).map((dest, i) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-white rounded-xl p-4 text-center border border-ksrtc-cream-dark/50 hover:border-ksrtc-gold/30 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSearchQuery(dest.name)}
              >
                <div className="w-10 h-10 bg-ksrtc-red/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <MapPin className="w-5 h-5 text-ksrtc-red" />
                </div>
                <p className="text-sm font-semibold text-vintage-ink">{dest.short}</p>
                <p className="text-xs text-vintage-sepia/50 mt-0.5">{dest.zone}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
      <MusicPlayer />
    </motion.div>
  );
}
