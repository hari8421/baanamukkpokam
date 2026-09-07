import { type VehicleType, type VehicleConfig, VEHICLES } from "../lib/utils";
import { Camera } from "lucide-react";

interface VehicleInteriorProps {
  vehicleType: VehicleType;
  children: React.ReactNode;
  className?: string;
  isFullscreen?: boolean;
}

// Bus-specific interior frame
function BusFrame({ config }: { config: ReturnType<typeof Object.values>[0] }) {
  return (
    <>
      {/* Ceiling / luggage rack */}
      <div className="absolute top-0 left-0 right-0 h-8 z-20" style={{ background: `linear-gradient(to bottom, ${config.ceilingColor}, ${config.frameColor})` }}>
        <div className="absolute bottom-0 left-4 right-4 h-1 rounded" style={{ background: config.frameAccent }} />
      </div>
      {/* Seats at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 z-20 flex">
        <div className="flex-1 flex items-center justify-center border-t-2" style={{ background: `linear-gradient(to top, ${config.frameAccent}, ${config.frameColor})`, borderColor: config.seatAccent }}>
          <div className="text-xs font-bold" style={{ color: `${config.seatColor}40` }}>{config.seatLabel}</div>
        </div>
        <div className="w-2" style={{ background: "#555" }} />
        <div className="flex-1 flex items-center justify-center border-t-2" style={{ background: `linear-gradient(to top, ${config.frameAccent}, ${config.frameColor})`, borderColor: config.seatAccent }}>
          <div className="text-xs font-bold" style={{ color: `${config.seatColor}40` }}>{config.seatLabel}</div>
        </div>
      </div>
    </>
  );
}

// Scooter / Motorbike - open style
function OpenFrame({ config }: { config: ReturnType<typeof Object.values>[0] }) {
  return (
    <>
      {/* Handlebar / mirrors at top */}
      <div className="absolute top-0 left-0 right-0 h-12 z-20 flex items-center justify-between px-8" style={{ background: `linear-gradient(to bottom, ${config.ceilingColor}CC, transparent)` }}>
        <div className="w-8 h-1 rounded-full" style={{ background: config.seatAccent }} />
        <div className="w-16 h-1 rounded-full" style={{ background: config.seatAccent }} />
        <div className="w-8 h-1 rounded-full" style={{ background: config.seatAccent }} />
      </div>
      {/* Road at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-8 z-20" style={{ background: "#333" }}>
        <div className="absolute top-1/2 -translate-y-1/2 h-0.5 left-0 right-0" style={{ background: "repeating-linear-gradient(90deg, #DAA520, #DAA520 20px, transparent 20px, transparent 40px)" }} />
      </div>
      {/* Windshield edge */}
      <div className="absolute top-12 left-0 right-0 h-1 z-20" style={{ background: `${config.frameAccent}40` }} />
    </>
  );
}

// Auto-rickshaw - open sides with frame
function AutoFrame({ config }: { config: ReturnType<typeof Object.values>[0] }) {
  return (
    <>
      {/* Roof */}
      <div className="absolute top-0 left-0 right-0 h-10 z-20" style={{ background: `linear-gradient(to bottom, ${config.ceilingColor}, ${config.frameColor})` }}>
        {/* Chrome strip */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "#FFD600" }} />
      </div>
      {/* Side bars */}
      <div className="absolute top-10 bottom-0 left-0 w-2 z-20" style={{ background: config.frameAccent }} />
      <div className="absolute top-10 bottom-0 right-0 w-2 z-20" style={{ background: config.frameAccent }} />
      {/* Meter area at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-12 z-20 flex items-center justify-center" style={{ background: `linear-gradient(to top, ${config.frameAccent}, ${config.frameColor})` }}>
        <div className="px-4 py-1 rounded-lg" style={{ background: config.seatAccent }}>
          <div className="text-xs font-bold" style={{ color: "#FFD600" }}>METER</div>
        </div>
      </div>
    </>
  );
}

// Royal Enfield - tank + handlebar view
function EnfieldFrame({ config }: { config: ReturnType<typeof Object.values>[0] }) {
  return (
    <>
      {/* Handlebar */}
      <div className="absolute top-0 left-0 right-0 h-14 z-20 flex items-center justify-center" style={{ background: `linear-gradient(to bottom, ${config.ceilingColor}CC, transparent)` }}>
        <div className="flex items-center gap-8">
          <div className="w-6 h-6 rounded-full border-2" style={{ borderColor: config.seatAccent }} />
          <div className="w-24 h-1 rounded-full" style={{ background: config.seatAccent }} />
          <div className="w-6 h-6 rounded-full border-2" style={{ borderColor: config.seatAccent }} />
        </div>
      </div>
      {/* Road / tank at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-20 z-20 flex flex-col">
        <div className="flex-1 flex items-center justify-center" style={{ background: `linear-gradient(to top, ${config.frameAccent}, ${config.frameColor}CC)` }}>
          <div className="px-6 py-2 rounded-t-xl border-t-2 border-x-2" style={{ borderColor: config.seatAccent, background: config.seatColor }}>
            <div className="text-[10px] font-bold tracking-widest" style={{ color: config.accentColor }}>ROYAL ENFIELD</div>
          </div>
        </div>
        <div className="h-4" style={{ background: "#333" }}>
          <div className="absolute bottom-1 left-0 right-0 h-0.5" style={{ background: "repeating-linear-gradient(90deg, #DAA520, #DAA520 15px, transparent 15px, transparent 30px)" }} />
        </div>
      </div>
    </>
  );
}

// Car - dashboard + windshield
function CarFrame({ config }: { config: ReturnType<typeof Object.values>[0] }) {
  return (
    <>
      {/* Roof liner */}
      <div className="absolute top-0 left-0 right-0 h-6 z-20" style={{ background: `linear-gradient(to bottom, ${config.ceilingColor}, transparent)` }} />
      {/* Side pillars */}
      <div className="absolute top-0 bottom-0 left-0 w-3 z-20" style={{ background: config.frameAccent }} />
      <div className="absolute top-0 bottom-0 right-0 w-3 z-20" style={{ background: config.frameAccent }} />
      {/* Dashboard */}
      <div className="absolute bottom-0 left-0 right-0 h-14 z-20 flex items-end" style={{ background: `linear-gradient(to top, ${config.frameAccent}, ${config.frameColor}CC)` }}>
        <div className="w-full h-10 flex items-center justify-between px-8 pb-1">
          <div className="w-12 h-6 rounded border" style={{ borderColor: config.seatAccent, background: "#111" }}>
            <div className="w-full h-full flex items-center justify-center text-[8px] font-bold" style={{ color: config.accentColor }}>GPS</div>
          </div>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-3 h-3 rounded-full" style={{ background: i === 0 ? config.accentColor : config.seatAccent }} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// Train - large windows
function TrainFrame({ config }: { config: ReturnType<typeof Object.values>[0] }) {
  return (
    <>
      {/* Luggage rack */}
      <div className="absolute top-0 left-0 right-0 h-10 z-20" style={{ background: `linear-gradient(to bottom, ${config.ceilingColor}, ${config.frameColor})` }}>
        <div className="absolute bottom-1 left-6 right-6 h-3 border rounded-sm" style={{ borderColor: config.seatAccent, background: `${config.frameAccent}60` }} />
      </div>
      {/* Seats */}
      <div className="absolute bottom-0 left-0 right-0 h-16 z-20 flex">
        <div className="flex-1 border-t-2 flex items-center justify-center" style={{ background: `linear-gradient(to top, ${config.frameAccent}, ${config.frameColor})`, borderColor: config.seatAccent }}>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-8 h-6 rounded-t-lg" style={{ background: config.seatColor, border: `1px solid ${config.seatAccent}` }} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

const FRAME_COMPONENTS: Record<string, React.FC<{ config: ReturnType<typeof Object.values>[0] }>> = {
  bus: BusFrame,
  open: OpenFrame,
  round: OpenFrame,
  windshield: CarFrame,
};

export function VehicleInterior({ vehicleType, children, className = "", isFullscreen = false }: VehicleInteriorProps) {
  const config: VehicleConfig = VEHICLES[vehicleType];
  const FrameComponent = FRAME_COMPONENTS[config.windowStyle] || BusFrame;

  return (
    <div className={`${isFullscreen ? "w-full h-[80vh]" : "aspect-[16/10]"} ${config.bgGradient} rounded-2xl overflow-hidden shadow-2xl relative ${className}`}>
      <FrameComponent config={config} />
      {/* Window area */}
      <div className="absolute z-10 left-0 right-0" style={{ top: config.windowStyle === "bus" ? "2rem" : config.windowStyle === "open" ? "3.5rem" : config.windowStyle === "windshield" ? "1.5rem" : "2.5rem", bottom: config.windowStyle === "bus" ? "4rem" : config.windowStyle === "open" ? "2rem" : config.windowStyle === "windshield" ? "3.5rem" : "4rem" }}>
        {/* Window frame overlay */}
        <div className="absolute inset-0 z-15 pointer-events-none">
          {config.windowStyle !== "open" && (
            <>
              <div className="absolute left-1/2 top-0 bottom-0 w-1.5" style={{ background: `${config.frameAccent}CC` }} />
              <div className="absolute top-0 left-0 right-0 h-3" style={{ background: `${config.frameAccent}CC` }} />
              <div className="absolute bottom-0 left-0 right-0 h-6" style={{ background: `${config.frameAccent}CC` }} />
            </>
          )}
          <div className="absolute top-0 bottom-0 left-0 w-3" style={{ background: `${config.frameAccent}CC` }} />
          <div className="absolute top-0 bottom-0 right-0 w-3" style={{ background: `${config.frameAccent}CC` }} />
          <div className="absolute inset-0 glass-reflection" />
        </div>
        {children}
      </div>
    </div>
  );
}

// Vehicle picker component for PostTravelPage
export function VehiclePicker({
  selected,
  onSelect,
}: {
  selected: VehicleType;
  onSelect: (v: VehicleType) => void;
}) {
  const vehicles = Object.values(VEHICLES);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {vehicles.map((v) => (
        <button
          key={v.id}
          onClick={() => onSelect(v.id)}
          className={`p-4 rounded-xl border-2 text-left transition-all ${
            selected === v.id
              ? "border-ksrtc-red bg-ksrtc-red/5 shadow-md"
              : "border-ksrtc-cream-dark hover:border-ksrtc-gold/30 bg-white"
          }`}
        >
          <div className="text-2xl mb-1">{v.icon}</div>
          <div className="text-sm font-bold text-vintage-ink">{v.name}</div>
          <div className="text-xs text-vintage-sepia/50 mt-0.5">{v.description}</div>
        </button>
      ))}
    </div>
  );
}
