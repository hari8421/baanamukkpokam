import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Play, Pause, SkipForward, SkipBack, Radio } from "lucide-react";

// Royalty-free ambient tracks inspired by Kerala/vintage vibes
// Using publicly available CC0 audio URLs for ambient Kerala bus sounds
const PLAYLIST = [
  {
    title: "യാത്രയുടെ ഗാനം",
    subtitle: "Song of the Journey",
    artist: "Anavandi Radio",
    // We use a subtle ambient sound generator instead of external URLs
    duration: "3:42",
  },
  {
    title: "മഴയത്തെ വഴി",
    subtitle: "Road in the Rain",
    artist: "Anavandi Radio",
    duration: "4:15",
  },
  {
    title: "പച്ചപ്പിന്റെ നാട്",
    subtitle: "Land of Green",
    artist: "Anavandi Radio",
    duration: "3:58",
  },
  {
    title: "വൈകുന്നേരത്തെ തേയില",
    subtitle: "Evening Tea",
    artist: "Anavandi Radio",
    duration: "4:02",
  },
  {
    title: "തെങ്ങിന്റെ കുല",
    subtitle: "Coconut Palm Grove",
    artist: "Anavandi Radio",
    duration: "3:35",
  },
  {
    title: "കായൽ തീരം",
    subtitle: "Backwater Shore",
    artist: "Anavandi Radio",
    duration: "4:28",
  },
];

// Create ambient audio using Web Audio API
function createAmbientOscillator(audioCtx: AudioContext, freq: number, type: OscillatorType = "sine") {
  const osc = audioCtx.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  return osc;
}

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(0.15);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const createAmbientMusic = useCallback(() => {
    if (audioCtxRef.current) return;

    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(ctx.destination);
    gainNodeRef.current = masterGain;

    // Create a gentle, warm ambient soundscape
    // Base drone - like a bus engine hum
    const bassOsc = createAmbientOscillator(ctx, 55, "sine");
    const bassGain = ctx.createGain();
    bassGain.gain.value = 0.08;
    bassOsc.connect(bassGain);
    bassGain.connect(masterGain);
    bassOsc.start();

    // Warm pad tones
    const padNotes = [220, 277, 330, 440]; // Am chord + octave
    const pads: OscillatorNode[] = [];

    padNotes.forEach((freq, i) => {
      const osc = createAmbientOscillator(ctx, freq, "sine");
      const gain = ctx.createGain();
      gain.gain.value = 0;
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      pads.push(osc);

      // Gentle volume swells
      const swellTime = 8 + i * 2;
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.04, now + swellTime);
      gain.gain.linearRampToValueAtTime(0, now + swellTime * 2);
      gain.gain.linearRampToValueAtTime(0.04, now + swellTime * 3);
    });

    // Add noise for bus ambient feel
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.02;
    }
    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;

    // Filter the noise to make it sound like road/wind
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 400;

    noiseNode.connect(filter);
    filter.connect(masterGain);
    noiseNode.start();
    noiseNodeRef.current = noiseNode;

    oscillatorsRef.current = [bassOsc, ...pads];

    // Auto-cycle pad frequencies for variety
    setInterval(() => {
      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") return;
      pads.forEach((osc, i) => {
        const scales = [
          [220, 277, 330, 440], // Am
          [196, 247, 294, 392], // G
          [175, 220, 262, 349], // F
          [220, 262, 330, 440], // C/Am
        ];
        const scaleIdx = Math.floor(Math.random() * scales.length);
        osc.frequency.linearRampToValueAtTime(
          scales[scaleIdx][i],
          (audioCtxRef.current?.currentTime ?? 0) + 2
        );
      });
    }, 8000);
  }, [volume]);

  const togglePlay = () => {
    if (!isPlaying) {
      createAmbientMusic();
      audioCtxRef.current?.resume();
    } else {
      audioCtxRef.current?.suspend();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? volume : 0;
    }
    setIsMuted(!isMuted);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % PLAYLIST.length);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach((osc) => {
        try { osc.stop(); } catch {}
      });
      noiseNodeRef.current?.stop();
      audioCtxRef.current?.close();
    };
  }, []);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2, duration: 0.8, type: "spring" }}
      className="fixed bottom-6 right-6 z-50"
    >
      {/* Expanded playlist */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-72 bg-vintage-ink/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-ksrtc-gold/20 overflow-hidden mb-2"
          >
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Radio className="w-4 h-4 text-ksrtc-gold" />
                <span className="text-ksrtc-gold text-sm font-semibold">Anavandi Radio</span>
              </div>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {PLAYLIST.map((track, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ x: 4 }}
                    onClick={() => setCurrentTrack(i)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      i === currentTrack
                        ? "bg-ksrtc-red/20 text-ksrtc-cream"
                        : "text-vintage-parchment/60 hover:bg-white/5"
                    }`}
                  >
                    <div className="text-sm font-medium">{track.title}</div>
                    <div className="text-xs opacity-60">{track.subtitle}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main player button */}
      <div className="flex items-center gap-2">
        {/* Volume slider on hover */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          whileHover={{ width: 80, opacity: 1 }}
          className="overflow-hidden"
        >
          <input
            type="range"
            min="0"
            max="0.5"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1 accent-ksrtc-gold"
          />
        </motion.div>

        {/* Player controls */}
        <div className="bg-vintage-ink/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-ksrtc-gold/20 p-2 flex items-center gap-1">
          <button
            onClick={prevTrack}
            className="w-8 h-8 rounded-full flex items-center justify-center text-vintage-parchment/50 hover:text-white hover:bg-white/10 transition-all"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-ksrtc-red flex items-center justify-center text-white shadow-lg shadow-ksrtc-red/30"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </motion.button>

          <button
            onClick={nextTrack}
            className="w-8 h-8 rounded-full flex items-center justify-center text-vintage-parchment/50 hover:text-white hover:bg-white/10 transition-all"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-6 bg-white/10 mx-1" />

          <button
            onClick={toggleMute}
            className="w-8 h-8 rounded-full flex items-center justify-center text-vintage-parchment/50 hover:text-white hover:bg-white/10 transition-all"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-vintage-parchment/50 hover:text-white hover:bg-white/10 transition-all"
          >
            <Radio className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Track info (when playing) */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-10 right-0 bg-vintage-ink/80 backdrop-blur px-3 py-1 rounded-full text-xs text-vintage-parchment/70 whitespace-nowrap"
          >
            ♪ {PLAYLIST[currentTrack].title}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
