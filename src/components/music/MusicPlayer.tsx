import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Radio,
  Music,
  Youtube,
  Link2,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

/* ─── Playlist (ambient track names) ─── */
const PLAYLIST = [
  { title: "യാത്രയുടെ ഗാനം", subtitle: "Song of the Journey", artist: "Anavandi Radio", duration: "3:42" },
  { title: "മഴയത്തെ വഴി", subtitle: "Road in the Rain", artist: "Anavandi Radio", duration: "4:15" },
  { title: "പച്ചപ്പിന്റെ നാട്", subtitle: "Land of Green", artist: "Anavandi Radio", duration: "3:58" },
  { title: "വൈകുന്നേരത്തെ തേയില", subtitle: "Evening Tea", artist: "Anavandi Radio", duration: "4:02" },
  { title: "തെങ്ങിന്റെ കുല", subtitle: "Coconut Palm Grove", artist: "Anavandi Radio", duration: "3:35" },
  { title: "കായൽ തീരം", subtitle: "Backwater Shore", artist: "Anavandi Radio", duration: "4:28" },
];

/* ─── Helper: extract YouTube video ID from any YT URL ─── */
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pat of patterns) {
    const m = url.match(pat);
    if (m) return m[1];
  }
  return null;
}

/* ─── YouTube IFrame API hook ─── */
function useYouTubePlayer() {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  const loadPlayer = useCallback((videoId: string) => {
    // Destroy old player
    if (playerRef.current) {
      try { playerRef.current.destroy(); } catch {}
      playerRef.current = null;
      setIsReady(false);
    }

    // Load IFrame API if needed
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }

    const createPlayer = () => {
      if (!containerRef.current) return;
      const divId = `yt-player-${Date.now()}`;
      containerRef.current.innerHTML = `<div id="${divId}" class="w-full h-full"></div>`;

      const YT = window.YT;
      if (!YT || !YT.Player) return;

      playerRef.current = new YT.Player(divId, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          fs: 0,
          iv_load_policy: 3,
          disablekb: 1,
        },
        events: {
          onReady: () => setIsReady(true),
          onStateChange: (e: any) => {
            // Could track play state here
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      // Wait for API to load
      const checkInterval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(checkInterval);
          createPlayer();
        }
      }, 200);
      // Cleanup after 10s if it never loads
      setTimeout(() => clearInterval(checkInterval), 10000);
    }
  }, []);

  const destroyPlayer = useCallback(() => {
    if (playerRef.current) {
      try { playerRef.current.destroy(); } catch {}
      playerRef.current = null;
      setIsReady(false);
    }
  }, []);

  return { containerRef, isReady, loadPlayer, destroyPlayer, playerRef };
}

/* ─── Web Audio ambient generator (unchanged) ─── */
function createAmbientOscillator(audioCtx: AudioContext, freq: number, type: OscillatorType = "sine") {
  const osc = audioCtx.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  return osc;
}

/* ─── Main Player ─── */
export function MusicPlayer() {
  const [mode, setMode] = useState<"ambient" | "youtube">("ambient");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(0.15);

  // YouTube state
  const [ytUrl, setYtUrl] = useState("");
  const [ytVideoId, setYtVideoId] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [ytPlaying, setYtPlaying] = useState(false);

  // Ambient refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);

  // YouTube refs
  const { containerRef: ytContainerRef, isReady: ytReady, loadPlayer, destroyPlayer, playerRef } =
    useYouTubePlayer();

  /* ─── Ambient music ─── */
  const createAmbientMusic = useCallback(() => {
    if (audioCtxRef.current) return;
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(ctx.destination);
    gainNodeRef.current = masterGain;

    const bassOsc = createAmbientOscillator(ctx, 55, "sine");
    const bassGain = ctx.createGain();
    bassGain.gain.value = 0.08;
    bassOsc.connect(bassGain);
    bassGain.connect(masterGain);
    bassOsc.start();

    const padNotes = [220, 277, 330, 440];
    const pads: OscillatorNode[] = [];
    padNotes.forEach((freq, i) => {
      const osc = createAmbientOscillator(ctx, freq, "sine");
      const gain = ctx.createGain();
      gain.gain.value = 0;
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      pads.push(osc);
      const swellTime = 8 + i * 2;
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.04, now + swellTime);
      gain.gain.linearRampToValueAtTime(0, now + swellTime * 2);
      gain.gain.linearRampToValueAtTime(0.04, now + swellTime * 3);
    });

    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.02;
    }
    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 400;
    noiseNode.connect(filter);
    filter.connect(masterGain);
    noiseNode.start();
    noiseNodeRef.current = noiseNode;

    oscillatorsRef.current = [bassOsc, ...pads];

    const intervalId = setInterval(() => {
      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") return;
      pads.forEach((osc, i) => {
        const scales = [
          [220, 277, 330, 440],
          [196, 247, 294, 392],
          [175, 220, 262, 349],
          [220, 262, 330, 440],
        ];
        const scaleIdx = Math.floor(Math.random() * scales.length);
        osc.frequency.linearRampToValueAtTime(
          scales[scaleIdx][i],
          (audioCtxRef.current?.currentTime ?? 0) + 2
        );
      });
    }, 8000);

    // Store interval for cleanup
    (audioCtxRef.current as any)._intervalId = intervalId;
  }, [volume]);

  /* ─── Toggle play (ambient) ─── */
  const togglePlay = () => {
    if (mode === "youtube") {
      if (!playerRef.current) return;
      if (ytPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      setYtPlaying(!ytPlaying);
      return;
    }

    if (!isPlaying) {
      createAmbientMusic();
      audioCtxRef.current?.resume();
    } else {
      audioCtxRef.current?.suspend();
    }
    setIsPlaying(!isPlaying);
  };

  /* ─── Switch mode ─── */
  const switchMode = (newMode: "ambient" | "youtube") => {
    if (newMode === mode) return;

    // Stop current
    if (mode === "ambient" && isPlaying) {
      audioCtxRef.current?.suspend();
      setIsPlaying(false);
    }
    if (mode === "youtube" && ytPlaying) {
      playerRef.current?.pauseVideo();
      setYtPlaying(false);
    }

    setMode(newMode);
    setIsPlaying(false);
    setYtPlaying(false);

    if (newMode === "youtube") {
      setShowUrlInput(true);
    }
  };

  /* ─── Load YouTube video ─── */
  const loadYouTube = () => {
    const id = extractYouTubeId(ytUrl);
    if (!id) return;
    setYtVideoId(id);
    loadPlayer(id);
    setYtPlaying(true);
  };

  /* ─── Handle URL paste ─── */
  const handleUrlPaste = (val: string) => {
    setYtUrl(val);
    const id = extractYouTubeId(val);
    if (id) {
      setYtVideoId(id);
      loadPlayer(id);
      setYtPlaying(true);
      setShowUrlInput(false);
    }
  };

  /* ─── Volume for ambient ─── */
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  /* ─── Cleanup ─── */
  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach((osc) => {
        try { osc.stop(); } catch {}
      });
      noiseNodeRef.current?.stop();
      if (audioCtxRef.current && (audioCtxRef.current as any)._intervalId) {
        clearInterval((audioCtxRef.current as any)._intervalId);
      }
      audioCtxRef.current?.close();
      destroyPlayer();
    };
  }, [destroyPlayer]);

  const isAnyPlaying = mode === "ambient" ? isPlaying : ytPlaying;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2, duration: 0.8, type: "spring" }}
      className="fixed bottom-6 right-6 z-50"
    >
      {/* ═══ Expanded Panel ═══ */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-80 bg-vintage-ink/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-ksrtc-gold/20 overflow-hidden mb-2"
          >
            {/* Mode Toggle */}
            <div className="flex border-b border-white/10">
              <button
                onClick={() => switchMode("ambient")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  mode === "ambient"
                    ? "text-ksrtc-gold bg-white/5 border-b-2 border-ksrtc-gold"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                <Radio className="w-4 h-4" />
                Ambient
              </button>
              <button
                onClick={() => switchMode("youtube")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  mode === "youtube"
                    ? "text-red-400 bg-white/5 border-b-2 border-red-400"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                <Youtube className="w-4 h-4" />
                YouTube
              </button>
            </div>

            {/* ─── Ambient Playlist ─── */}
            {mode === "ambient" && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Radio className="w-4 h-4 text-ksrtc-gold" />
                  <span className="text-ksrtc-gold text-sm font-semibold">Anavandi Radio</span>
                </div>
                <div className="space-y-1 max-h-56 overflow-y-auto">
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
            )}

            {/* ─── YouTube Section ─── */}
            {mode === "youtube" && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Youtube className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 text-sm font-semibold">YouTube Player</span>
                </div>

                {/* URL Input */}
                <div className="mb-3">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                      <input
                        type="text"
                        value={ytUrl}
                        onChange={(e) => setYtUrl(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && loadYouTube()}
                        placeholder="Paste YouTube URL..."
                        className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-red-400/50 transition-colors"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={loadYouTube}
                      disabled={!extractYouTubeId(ytUrl)}
                      className="px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-600 transition-colors"
                    >
                      Play
                    </motion.button>
                  </div>
                  <p className="text-[10px] text-white/25 mt-1.5 ml-1">
                    Supports youtube.com/watch, youtu.be, shorts, and embed URLs
                  </p>
                </div>

                {/* Embedded YouTube Player */}
                {ytVideoId && (
                  <div className="relative rounded-xl overflow-hidden border border-white/10 mb-3">
                    <div
                      ref={ytContainerRef}
                      className="w-full aspect-video bg-black"
                    />
                    {/* Overlay gradient for aesthetics */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                )}

                {/* Quick suggestions */}
                {!ytVideoId && (
                  <div className="text-center py-6">
                    <Music className="w-8 h-8 text-white/10 mx-auto mb-2" />
                    <p className="text-xs text-white/30">Paste a YouTube link above to start playing</p>
                    <p className="text-[10px] text-white/20 mt-1">
                      Try Kerala vintage songs, KSRTC sounds, or road trip playlists
                    </p>
                  </div>
                )}

                {/* Playing indicator */}
                {ytVideoId && ytPlaying && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 rounded-lg">
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          className="w-0.5 bg-red-400 rounded-full"
                          animate={{ height: [4, 12, 4] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-red-300">Playing from YouTube</span>
                  </div>
                )}
              </div>
            )}

            {/* Volume control */}
            <div className="px-4 pb-3">
              <div className="flex items-center gap-2">
                <VolumeX className="w-3 h-3 text-white/30" />
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1 h-1 accent-ksrtc-gold"
                />
                <Volume2 className="w-3 h-3 text-white/30" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Mini YouTube Player (shown when YT playing but panel collapsed) ═══ */}
      <AnimatePresence>
        {mode === "youtube" && ytVideoId && !isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-20 right-0 mb-2 w-56 rounded-xl overflow-hidden shadow-2xl border border-white/10"
          >
            <div ref={ytContainerRef} className="w-full aspect-video bg-black" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Main Controls ═══ */}
      <div className="flex items-center gap-2">
        {/* Volume slider */}
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

        {/* Player bar */}
        <div className="bg-vintage-ink/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-ksrtc-gold/20 p-2 flex items-center gap-1">
          {mode === "ambient" && (
            <>
              <button
                onClick={() => setCurrentTrack((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-vintage-parchment/50 hover:text-white hover:bg-white/10 transition-all"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-colors ${
              mode === "youtube"
                ? "bg-red-500 shadow-red-500/30"
                : "bg-ksrtc-red shadow-ksrtc-red/30"
            }`}
          >
            {isAnyPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </motion.button>

          {mode === "ambient" && (
            <>
              <button
                onClick={() => setCurrentTrack((prev) => (prev + 1) % PLAYLIST.length)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-vintage-parchment/50 hover:text-white hover:bg-white/10 transition-all"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          <div className="w-px h-6 bg-white/10 mx-1" />

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-vintage-parchment/50 hover:text-white hover:bg-white/10 transition-all"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-vintage-parchment/50 hover:text-white hover:bg-white/10 transition-all"
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <Radio className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ═══ Now Playing Toast ═══ */}
      <AnimatePresence>
        {isAnyPlaying && !isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-10 right-0 bg-vintage-ink/80 backdrop-blur px-3 py-1 rounded-full text-xs text-vintage-parchment/70 whitespace-nowrap flex items-center gap-1.5"
          >
            {mode === "youtube" ? (
              <>
                <Youtube className="w-3 h-3 text-red-400" />
                <span>YouTube</span>
              </>
            ) : (
              <>
                <span>♪</span>
                <span>{PLAYLIST[currentTrack].title}</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
