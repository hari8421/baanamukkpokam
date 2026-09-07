/// <reference types="vite/client" />

/* YouTube IFrame API global types */
interface YT {
  Player: new (
    divId: string,
    options: {
      videoId: string;
      width?: string | number;
      height?: string | number;
      playerVars?: Record<string, any>;
      events?: Record<string, (event: any) => void>;
    }
  ) => YT.Player;
}

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  destroy(): void;
  getDuration(): number;
  getCurrentTime(): number;
  getVolume(): number;
  setVolume(vol: number): void;
}

declare namespace YT {
  interface Player extends YTPlayer {}
}

interface Window {
  YT?: YT;
  onYouTubeIframeAPIReady?: () => void;
}
