import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const KSRTC_DESTINATIONS = [
  { id: "tvm", name: "Thiruvananthapuram", short: "TVM", zone: "South" },
  { id: "kzm", name: "Kollam", short: "QLN", zone: "South" },
  { id: "ptt", name: "Pathanamthitta", short: "PTA", zone: "South" },
  { id: "kty", name: "Kottayam", short: "KTM", zone: "Central" },
  { id: "alp", name: "Alappuzha", short: "ALP", zone: "Central" },
  { id: "ern", name: "Ernakulam", short: "ERS", zone: "Central" },
  { id: "tsr", name: "Thrissur", short: "TCR", zone: "Central" },
  { id: "pkd", name: "Palakkad", short: "PGT", zone: "North" },
  { id: "clt", name: "Kozhikode", short: "CLT", zone: "North" },
  { id: "wyd", name: "Wayanad", short: "WYD", zone: "North" },
  { id: "knr", name: "Kannur", short: "CAN", zone: "North" },
  { id: "ksd", name: "Kasargod", short: "KSD", zone: "North" },
  { id: "idk", name: "Idukki", short: "IDK", zone: "Highrange" },
  { id: "mlp", name: "Malappuram", short: "MLP", zone: "North" },
  { id: "ptm", name: "Pathanamthitta", short: "PND", zone: "South" },
];

export const BUS_ROUTES = [
  "KSRTC Ordinary",
  "KSRTC Fast Passenger",
  "KSRTC Super Fast",
  "KSRTC Low Floor",
  "KSRTC AC Multi Axle",
  "Garuda",
  "Rajadhani",
  "Velu Sriviolu",
];

export const TRAVEL_VIBES = [
  "Morning misty ride",
  "Sunset golden hour",
  "Monsoon magic",
  "Night journey",
  "Hill station climb",
  "Backwater breeze",
  "Festival special",
  "Daily commute",
];

export const generateId = () => {
  return `travel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Vehicle types with interior themes
export type VehicleType =
  | "ksrtc-bus"
  | "scooter"
  | "auto-rickshaw"
  | "royal-enfield"
  | "car"
  | "train";

export interface VehicleConfig {
  id: VehicleType;
  name: string;
  icon: string;
  description: string;
  // Interior colors
  frameColor: string; // frame / body
  frameAccent: string; // secondary frame
  seatColor: string; // seat area
  seatAccent: string; // seat border
  ceilingColor: string; // top bar
  windowStyle: "bus" | "windshield" | "open" | "round";
  // UI theme
  accentColor: string; // accent for badges
  bgGradient: string; // full frame background
  seatLabel: string;
}

export const VEHICLES: Record<VehicleType, VehicleConfig> = {
  "ksrtc-bus": {
    id: "ksrtc-bus",
    name: "KSRTC Anavandi",
    icon: "🚌",
    description: "The classic Kerala bus experience",
    frameColor: "#8B4513",
    frameAccent: "#654321",
    seatColor: "#8B4513",
    seatAccent: "#A0522D",
    ceilingColor: "#A0522D",
    windowStyle: "bus",
    accentColor: "#C41E3A",
    bgGradient: "from-[#8B4513] to-[#654321]",
    seatLabel: "SEAT",
  },
  scooter: {
    id: "scooter",
    name: "Scooter Ride",
    icon: "🛵",
    description: "Feel the wind on a Kerala backroad",
    frameColor: "#2D2D2D",
    frameAccent: "#1A1A1A",
    seatColor: "#333",
    seatAccent: "#444",
    ceilingColor: "#555",
    windowStyle: "open",
    accentColor: "#FF6B35",
    bgGradient: "from-[#2D2D2D] to-[#1A1A1A]",
    seatLabel: "HANDLEBAR",
  },
  "auto-rickshaw": {
    id: "auto-rickshaw",
    name: "Auto Rickshaw",
    icon: "🛺",
    description: "The iconic Indian three-wheeler",
    frameColor: "#1B5E20",
    frameAccent: "#0D3B0D",
    seatColor: "#2E7D32",
    seatAccent: "#388E3C",
    ceilingColor: "#333",
    windowStyle: "open",
    accentColor: "#FFD600",
    bgGradient: "from-[#1B5E20] to-[#0D3B0D]",
    seatLabel: "SEAT",
  },
  "royal-enfield": {
    id: "royal-enfield",
    name: "Royal Enfield",
    icon: "🏍️",
    description: "The thump of a Bullet through the hills",
    frameColor: "#1A1A1A",
    frameAccent: "#0D0D0D",
    seatColor: "#2A1A0A",
    seatAccent: "#8B4513",
    ceilingColor: "#333",
    windowStyle: "open",
    accentColor: "#B8860B",
    bgGradient: "from-[#1A1A1A] to-[#0D0D0D]",
    seatLabel: "TANK",
  },
  car: {
    id: "car",
    name: "Car Journey",
    icon: "🚗",
    description: "A comfortable ride through Kerala",
    frameColor: "#37474F",
    frameAccent: "#263238",
    seatColor: "#455A64",
    seatAccent: "#546E7A",
    ceilingColor: "#455A64",
    windowStyle: "windshield",
    accentColor: "#0288D1",
    bgGradient: "from-[#37474F] to-[#263238]",
    seatLabel: "DASHBOARD",
  },
  train: {
    id: "train",
    name: "Train Ride",
    icon: "🚂",
    description: "Kerala's scenic railway routes",
    frameColor: "#5D4037",
    frameAccent: "#3E2723",
    seatColor: "#6D4C41",
    seatAccent: "#795548",
    ceilingColor: "#795548",
    windowStyle: "bus",
    accentColor: "#E65100",
    bgGradient: "from-[#5D4037] to-[#3E2723]",
    seatLabel: "SEAT",
  },
};

export const VEHICLE_LIST = Object.values(VEHICLES);

