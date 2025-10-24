import { create } from 'zustand';
import type { Track } from '@/types';

interface PlayerStore {
  // Player state
  isPlaying: boolean;
  currentTrack: Track | null;
  volume: number;
  progress: number;
  duration: number;
  shuffle: boolean;
  repeat: 'off' | 'track' | 'context';

  // Queue management
  queue: Track[];
  currentIndex: number;

  // Actions
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTrack: (track: Track | null) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;

  // Queue actions
  setQueue: (tracks: Track[], startIndex?: number) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;

  // Player controls
  playTrack: (track: Track, queue?: Track[]) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  seekTo: (time: number) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  // Initial state
  isPlaying: false,
  currentTrack: null,
  volume: 0.5,
  progress: 0,
  duration: 0,
  shuffle: false,
  repeat: 'off',
  queue: [],
  currentIndex: -1,

  // Basic setters
  setIsPlaying: isPlaying => set({ isPlaying }),
  setCurrentTrack: currentTrack => set({ currentTrack }),
  setVolume: volume => set({ volume: Math.max(0, Math.min(1, volume)) }),
  setProgress: progress => set({ progress }),
  setDuration: duration => set({ duration }),

  toggleShuffle: () => set(state => ({ shuffle: !state.shuffle })),

  toggleRepeat: () =>
    set(state => ({
      repeat:
        state.repeat === 'off'
          ? 'context'
          : state.repeat === 'context'
            ? 'track'
            : 'off',
    })),

  // Queue management
  setQueue: (tracks, startIndex = 0) =>
    set({
      queue: tracks,
      currentIndex: startIndex,
      currentTrack: tracks[startIndex] || null,
    }),

  addToQueue: track =>
    set(state => ({
      queue: [...state.queue, track],
    })),

  removeFromQueue: index =>
    set(state => {
      const newQueue = state.queue.filter((_, i) => i !== index);
      const newCurrentIndex =
        index < state.currentIndex
          ? state.currentIndex - 1
          : state.currentIndex;

      return {
        queue: newQueue,
        currentIndex: newCurrentIndex,
        currentTrack: newQueue[newCurrentIndex] || null,
      };
    }),

  nextTrack: () => {
    const { queue, currentIndex, shuffle, repeat } = get();

    if (queue.length === 0) return;

    let nextIndex: number;

    if (repeat === 'track') {
      nextIndex = currentIndex;
    } else if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= queue.length) {
        nextIndex = repeat === 'context' ? 0 : currentIndex;
      }
    }

    if (nextIndex !== currentIndex || repeat === 'track') {
      set({
        currentIndex: nextIndex,
        currentTrack: queue[nextIndex],
        progress: 0,
      });
    }
  },

  previousTrack: () => {
    const { queue, currentIndex } = get();

    if (queue.length === 0) return;

    const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;

    set({
      currentIndex: prevIndex,
      currentTrack: queue[prevIndex],
      progress: 0,
    });
  },

  // Player controls
  playTrack: (track, queue) => {
    if (queue) {
      const trackIndex = queue.findIndex(t => t.id === track.id);
      set({
        queue,
        currentIndex: trackIndex >= 0 ? trackIndex : 0,
        currentTrack: track,
        isPlaying: true,
        progress: 0,
      });
    } else {
      set({
        currentTrack: track,
        isPlaying: true,
        progress: 0,
      });
    }
  },

  pauseTrack: () => set({ isPlaying: false }),

  togglePlay: () => set(state => ({ isPlaying: !state.isPlaying })),

  seekTo: time => set({ progress: time }),
}));
