import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "../App";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { MusicPlayer } from "../components/music/MusicPlayer";
import {
  ArrowLeft,
  MapPin,
  ArrowRight,
  Camera,
  UserPlus,
  UserCheck,
  Bus,
  Sparkles,
  Clock,
  Globe,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { VEHICLES, type VehicleType } from "../lib/utils";

// Single seed traveler for demo — everything else is live data
const SEED_TRAVELER = {
  _id: "seed-ravi" as string,
  name: "Ravi Kumar",
  bio: "KSRTC bus enthusiast from Thiruvananthapuram. I capture Kerala's beauty through Anavandi windows. 🚌",
  avatar: "R",
  followerCount: 342,
  followingCount: 28,
  travelCount: 3,
};

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
  onRelive,
}: {
  travel: {
    _id: string;
    title: string;
    from: string;
    to: string;
    vibe: string;
    photoCount: number;
    momentCount?: number;
    publishedAt: number;
    vehicle?: string;
  };
  index: number;
  onRelive: () => void;
}) {
  const vehicleType = ((travel.vehicle || "ksrtc-bus") as VehicleType);
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-ksrtc-cream-dark group"
    >
      <div
        className="h-36 relative cursor-pointer"
        onClick={onRelive}
      >
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" style={{ background: gradients[travel.vibe] || gradients["Monsoon magic"] }} />
        <div className="absolute inset-0 flex">
          <div className="w-0.5 bg-ksrtc-window-frame/40" />
          <div className="flex-1" />
          <div className="w-0.5 bg-ksrtc-window-frame/40" />
          <div className="flex-1" />
          <div className="w-0.5 bg-ksrtc-window-frame/40" />
        </div>
        <div className="absolute top-2 right-2 bg-black/40 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
          <Camera className="w-3 h-3" /> {travel.photoCount}
        </div>
        {(travel.momentCount ?? 0) > 0 && (
          <div className="absolute top-2 left-2 bg-ksrtc-gold/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> {travel.momentCount} moments
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-ksrtc-red/90 text-white text-xs px-2 py-1 rounded-full">
          {travel.vibe}
        </div>
        {/* Relive overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-ksrtc-red text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
            <Sparkles className="w-4 h-4" /> Relive Journey
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-display text-base font-bold text-vintage-ink mb-1 line-clamp-1">{travel.title}</h3>
        <div className="flex items-center gap-1 text-xs text-vintage-sepia/60 mb-2">
          <MapPin className="w-3 h-3" />
          {travel.from} <ArrowRight className="w-2.5 h-2.5" /> {travel.to}
        </div>
        <div className="flex items-center justify-between text-xs text-vintage-sepia/40">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTimeAgo(travel.publishedAt)}</span>
          {vehicle && <span className="flex items-center gap-1">{vehicle.icon} {vehicle.name}</span>}
        </div>
      </div>
    </motion.div>
  );
}

// Live traveler profile — only rendered when Convex is available
function LiveTravelerContent({ travelerId }: { travelerId: string }) {
  const traveler = useQuery(api.travelers.get, { travelerId: travelerId as any });
  const travels = useQuery(api.travels.byTraveler, { travelerId: travelerId as any });

  if (traveler === undefined || travels === undefined) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-ksrtc-cream/50 rounded w-1/3" />
          <div className="h-4 bg-ksrtc-cream/30 rounded w-2/3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-ksrtc-cream/30 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (traveler === null) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Globe className="w-16 h-16 text-vintage-sepia/20 mx-auto mb-4" />
        <p className="text-vintage-sepia/40 text-lg">Traveler not found</p>
        <p className="text-vintage-sepia/30 text-sm mt-1">This traveler hasn't joined yet</p>
      </div>
    );
  }

  const initials = traveler.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2);

  return (
    <>
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-ksrtc-red via-ksrtc-red-dark to-ksrtc-brown-dark py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          {[...Array(6)].map((_, i) => (
            <Bus key={i} className="absolute text-white" style={{ left: `${i * 18}%`, top: `${20 + i * 10}%`, transform: `rotate(${i * 15}deg)`, width: "40px" }} />
          ))}
        </div>
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 bg-ksrtc-cream/20 rounded-2xl flex items-center justify-center text-3xl font-display font-bold text-white border-2 border-white/20">
              {initials}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold text-white">{traveler.name}</h1>
              <p className="text-white/60 text-sm mt-1 font-malayalam">യാത്രക്കാരൻ</p>
              <p className="text-white/80 text-sm mt-2 max-w-lg">{traveler.bio}</p>
              <div className="flex items-center gap-6 mt-4">
                <div className="text-center">
                  <p className="text-white font-bold text-lg">{traveler.travelCount}</p>
                  <p className="text-white/50 text-xs">Journeys</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-lg">{traveler.followerCount}</p>
                  <p className="text-white/50 text-xs">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-lg">{traveler.followingCount}</p>
                  <p className="text-white/50 text-xs">Following</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Travels grid */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="font-display text-xl font-bold text-vintage-ink mb-6">
          Journeys by {traveler.name}
        </h2>
        {travels.length === 0 ? (
          <div className="text-center py-16">
            <Camera className="w-12 h-12 text-vintage-sepia/20 mx-auto mb-3" />
            <p className="text-vintage-sepia/40">No journeys posted yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {travels.map((travel, i) => (
              <TravelCard
                key={travel._id}
                travel={{
                  _id: travel._id,
                  title: travel.title,
                  from: travel.from,
                  to: travel.to,
                  vibe: travel.vibe,
                  photoCount: travel.photoCount,
                  momentCount: travel.momentCount,
                  publishedAt: travel.publishedAt,
                  vehicle: travel.vehicle,
                }}
                index={i}
                onRelive={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// Seed traveler profile — fallback when Convex is not available
function SeedTravelerContent({ travelerId }: { travelerId: string }) {
  const { navigate } = useApp();
  const [isFollowing, setIsFollowing] = useState(false);
  const traveler = SEED_TRAVELER;
  const initials = traveler.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  if (travelerId !== "seed-ravi" && travelerId !== "ravi") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Globe className="w-16 h-16 text-vintage-sepia/20 mx-auto mb-4" />
        <p className="text-vintage-sepia/40 text-lg">Traveler not found</p>
        <p className="text-vintage-sepia/30 text-sm mt-1 mb-6">Connect to Convex to see live traveler profiles</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("dashboard")}
          className="px-6 py-3 bg-ksrtc-red text-white rounded-xl font-bold"
        >
          Browse Journeys
        </motion.button>
      </div>
    );
  }

  // Seed demo travels
  const seedTravels = [
    {
      _id: "seed-t1",
      title: "Monsoon Magic TVM to Kollam",
      from: "Thiruvananthapuram",
      to: "Kollam",
      vibe: "Monsoon magic",
      photoCount: 24,
      momentCount: 8,
      publishedAt: Date.now() - 7200000,
      vehicle: "ksrtc-bus",
    },
    {
      _id: "seed-t4",
      title: "Dawn Service to Palakkad",
      from: "Ernakulam",
      to: "Palakkad",
      vibe: "Morning misty ride",
      photoCount: 18,
      momentCount: 5,
      publishedAt: Date.now() - 259200000,
      vehicle: "ksrtc-bus",
    },
    {
      _id: "seed-t7",
      title: "Night Magic to Kannur",
      from: "Kozhikode",
      to: "Kannur",
      vibe: "Night journey",
      photoCount: 15,
      momentCount: 3,
      publishedAt: Date.now() - 604800000,
      vehicle: "ksrtc-bus",
    },
  ];

  return (
    <>
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-ksrtc-red via-ksrtc-red-dark to-ksrtc-brown-dark py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          {[...Array(6)].map((_, i) => (
            <Bus key={i} className="absolute text-white" style={{ left: `${i * 18}%`, top: `${20 + i * 10}%`, transform: `rotate(${i * 15}deg)`, width: "40px" }} />
          ))}
        </div>
        <div className="max-w-3xl mx-auto relative z-10">
          <button onClick={() => navigate("dashboard")} className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Journeys
          </button>
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 bg-ksrtc-cream/20 rounded-2xl flex items-center justify-center text-3xl font-display font-bold text-white border-2 border-white/20">
              {initials}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold text-white">{traveler.name}</h1>
              <p className="text-white/60 text-sm mt-1 font-malayalam">യാത്രക്കാരൻ</p>
              <p className="text-white/80 text-sm mt-2 max-w-lg">{traveler.bio}</p>
              <div className="flex items-center gap-6 mt-4">
                <div className="text-center">
                  <p className="text-white font-bold text-lg">{seedTravels.length}</p>
                  <p className="text-white/50 text-xs">Journeys</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-lg">{traveler.followerCount}</p>
                  <p className="text-white/50 text-xs">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-lg">{traveler.followingCount}</p>
                  <p className="text-white/50 text-xs">Following</p>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFollowing(!isFollowing)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                isFollowing
                  ? "bg-white/20 text-white border border-white/30"
                  : "bg-ksrtc-gold text-white shadow-lg"
              }`}
            >
              {isFollowing ? (
                <><UserCheck className="w-4 h-4" /> Following</>
              ) : (
                <><UserPlus className="w-4 h-4" /> Follow</>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Travels grid */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="font-display text-xl font-bold text-vintage-ink mb-6">
          Journeys by {traveler.name}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {seedTravels.map((travel, i) => (
            <TravelCard
              key={travel._id}
              travel={travel}
              index={i}
              onRelive={() => navigate("relive", { travelId: travel._id })}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export function TravelerProfilePage() {
  const { state, navigate, hasConvex } = useApp();
  const travelerId = state.viewingTravelerId || "seed-ravi";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-vintage-parchment"
    >
      <Header />

      <div className="pt-20">
        {hasConvex ? (
          <LiveTravelerContent travelerId={travelerId} />
        ) : (
          <SeedTravelerContent travelerId={travelerId} />
        )}
      </div>

      <Footer />
      <MusicPlayer />
    </motion.div>
  );
}
