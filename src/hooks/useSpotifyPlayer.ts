import { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { useAuthStore } from '@/store/authStore';
import { spotifyService } from '@/services/spotify.service';
import type { SpotifyPlayer } from '@/types/spotify';

// Type para setTimeout no Node.js vs browser
type Timeout = ReturnType<typeof setTimeout>;

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: {
      Player: new (options: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume: number;
      }) => SpotifyPlayer;
    };
  }
}

export const useSpotifyPlayer = () => {
  const { accessToken } = useAuthStore();
  const {
    setIsPlaying,
    setCurrentTrack,
    setProgress,
    setDuration,
    volume,
    isPlaying,
    setShuffle,
    setRepeat,
  } = usePlayerStore();

  const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const intervalRef = useRef<Timeout | null>(null);
  const syncIntervalRef = useRef<Timeout | null>(null);
  const sdkLoadedRef = useRef(false);

  // Load Spotify Web Playback SDK only once
  useEffect(() => {
    console.log('SpotifyPlayerProvider useEffect called:', { accessToken: !!accessToken, sdkLoaded: sdkLoadedRef.current });
    
    if (!accessToken || sdkLoadedRef.current) return;

    const existingScript = document.querySelector('script[src="https://sdk.scdn.co/spotify-player.js"]');
    if (existingScript) {
      console.log('Spotify SDK script already exists');
      sdkLoadedRef.current = true;
      // If the script exists but the player isn't initialized, we might need to re-trigger SDK ready
      if (window.Spotify && !player) {
        window.onSpotifyWebPlaybackSDKReady();
      }
      return;
    }

    console.log('Loading Spotify SDK script');
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);
    sdkLoadedRef.current = true;

    // Add timeout to check if SDK loads
    setTimeout(() => {
      if (!window.Spotify) {
        console.error('🚨 Spotify SDK failed to load after 10 seconds');
      } else if (!player) {
        console.warn('⚠️ Spotify SDK loaded but player not created after 10 seconds');
      }
    }, 10000);

    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log('Spotify Web Playback SDK Ready callback called');
      
      if (player) {
        console.log('Player already exists, skipping creation');
        return; // Prevent multiple player instances
      }

      console.log('Creating new Spotify Player');
      const spotifyPlayer = new window.Spotify.Player({
        name: 'Magalu Spotify Player',
        getOAuthToken: (cb) => {
          console.log('getOAuthToken callback called');
          cb(accessToken);
        },
        volume: volume,
      });

      // Error handling
      spotifyPlayer.addListener('initialization_error', ({ message }) => {
        console.error('🚨 Spotify Player initialization error:', message);
      });

      spotifyPlayer.addListener('authentication_error', ({ message }) => {
        console.error('🚨 Spotify Player authentication error:', message);
        console.error('🔑 Current access token:', accessToken ? 'Present' : 'Missing');
      });

      spotifyPlayer.addListener('account_error', ({ message }) => {
        console.error('Spotify Player account error:', message);
      });

      spotifyPlayer.addListener('playback_error', ({ message }) => {
        console.error('Spotify Player playback error:', message);
      });

      // Playback status updates
      spotifyPlayer.addListener('player_state_changed', (state) => {
        console.log('🎵 Player state changed:', {
          paused: state?.paused,
          position: state?.position,
          track: state?.track_window?.current_track?.name,
          context: state?.context?.uri
        });
        
        if (!state) return;

        const track = state.track_window.current_track;
        
        // Only update the current track if it's actually different to avoid showing old tracks during transitions
        const currentTrackInStore = usePlayerStore.getState().currentTrack;
        const isNewTrack = !currentTrackInStore || currentTrackInStore.id !== track.id;
        
        if (isNewTrack) {
          console.log('🔄 Track changed from', currentTrackInStore?.name, 'to', track.name);
          
          const convertedTrack = {
            id: track.id,
            name: track.name,
            duration_ms: track.duration_ms,
            artists: track.artists.map((artist: { name: string; uri: string }) => ({
              id: artist.uri.split(':')[2],
              name: artist.name,
              images: [],
              genres: [],
              popularity: 0,
              followers: { total: 0 },
              external_urls: { spotify: '' },
            })),
            album: {
              id: track.album.uri.split(':')[2],
              name: track.album.name,
              images: track.album.images,
              artists: [],
              release_date: '',
              total_tracks: 0,
              album_type: 'album' as const,
              external_urls: { spotify: '' },
              uri: track.album.uri,
            },
            popularity: 0,
            preview_url: null,
            external_urls: { spotify: '' },
          };

          setCurrentTrack(convertedTrack);
        } else {
          console.log('🔄 Same track, only updating playback state');
        }

        // Update player store state to sync with Spotify
        setIsPlaying(!state.paused);
        setProgress(state.position);
        setDuration(track.duration_ms);
        setShuffle(state.shuffle);
        
        // Convert Spotify repeat mode to our format
        const repeatMode = state.repeat_mode === 0 ? 'off' : state.repeat_mode === 1 ? 'context' : 'track';
        setRepeat(repeatMode);
      });

      // Ready
      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('🎵 Spotify Player Ready with Device ID:', device_id);
        setDeviceId(device_id);
        setIsReady(true);
        console.log('✅ isReady set to true');
      });

      // Not Ready
      spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('❌ Spotify Player Device ID has gone offline:', device_id);
        setIsReady(false);
        console.log('❌ isReady set to false');
      });

      // Connect to the player!
      console.log('🔗 Connecting to Spotify Player...');
      spotifyPlayer.connect().then(success => {
        console.log('🔗 Player connection result:', success);
      });
      setPlayer(spotifyPlayer);
      console.log('✅ Player instance set in state');
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [accessToken, volume, player, setCurrentTrack, setDuration, setIsPlaying, setProgress, setRepeat, setShuffle]);

  // Update progress every second
  useEffect(() => {
    if (!player || !isReady) return;

    if (isPlaying && player) {
      intervalRef.current = setInterval(async () => {
        try {
          if (player && typeof player.getCurrentState === 'function') {
            const state = await player.getCurrentState();
            if (state) {
              setProgress(state.position);
            }
          }
        } catch (error) {
          console.error('Error getting current state:', error);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, player, isReady, setProgress]);

  // Sync with other devices periodically
  useEffect(() => {
    if (accessToken) {
      const syncWithDevices = async () => {
        try {
          const data = await spotifyService.getCurrentPlayback();

          if (data && data.item) {
            // Convert Spotify API track to our Track format
            const track = {
              id: data.item.id,
              name: data.item.name,
              duration_ms: data.item.duration_ms,
              popularity: data.item.popularity || 0,
              preview_url: data.item.preview_url,
              external_urls: { spotify: data.item.external_urls?.spotify || '' },
              artists: data.item.artists.map((artist: any) => ({
                id: artist.id,
                name: artist.name,
                images: [],
                genres: [],
                popularity: 0,
                followers: { total: 0 },
                external_urls: { spotify: artist.external_urls?.spotify || '' },
              })),
              album: {
                id: data.item.album.id,
                name: data.item.album.name,
                images: data.item.album.images || [],
                artists: [],
                release_date: data.item.album.release_date || '',
                total_tracks: data.item.album.total_tracks || 0,
                album_type: 'album' as const,
                external_urls: { spotify: data.item.album.external_urls?.spotify || '' },
                uri: data.item.album.uri,
              },
            };

            // Update store with current track from other device
            setCurrentTrack(track);
            setIsPlaying(data.is_playing);
            setProgress(data.progress_ms || 0);
            setDuration(data.item.duration_ms);

            // Update shuffle and repeat state
            setShuffle(data.shuffle_state);

            const newRepeatState = data.repeat_state === 'track' ? 'track' : data.repeat_state === 'context' ? 'context' : 'off';
            setRepeat(newRepeatState);
          }
        } catch (error) {
          console.error('❌ Error syncing with devices:', error);
        }
      };

      // Sync immediately and then every 5 seconds
      syncWithDevices();
      syncIntervalRef.current = setInterval(syncWithDevices, 5000);
    }

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    };
  }, [accessToken, setCurrentTrack, setIsPlaying, setProgress, setDuration, setShuffle, setRepeat]);

  // Player control functions
  const play = async () => {
    console.log('▶️ play called', { player: !!player, isReady, deviceId, accessToken: !!accessToken });

    if (!accessToken) {
      console.warn('⚠️ play: No access token available');
      return;
    }

    try {
      await spotifyService.play(deviceId || undefined);
      console.log('✅ play successful');
      setIsPlaying(true);
    } catch (error) {
      console.error('❌ play error:', error);
    }
  };

  const pause = async () => {
    console.log('⏸️ pause called', { player: !!player, isReady, deviceId, accessToken: !!accessToken });

    if (!accessToken) {
      console.warn('⚠️ pause: No access token available');
      return;
    }

    try {
      await spotifyService.pause();
      console.log('✅ pause successful');
      setIsPlaying(false);
    } catch (error) {
      console.error('❌ pause error:', error);
    }
  };

  const togglePlay = async () => {
    console.log('🎵 togglePlay called', { player: !!player, isReady, isPlaying });
    
    if (isPlaying) {
      await pause();
    } else {
      await play();
    }
  };

  const nextTrack = async () => {
    console.log('⏭️ nextTrack called', { player: !!player, isReady, deviceId, accessToken: !!accessToken });

    if (!accessToken) {
      console.warn('⚠️ nextTrack: No access token available');
      return;
    }

    try {
      await spotifyService.nextTrack(deviceId || undefined);
      console.log('✅ nextTrack successful');
    } catch (error) {
      console.error('❌ nextTrack error:', error);
    }
  };

  const previousTrack = async () => {
    console.log('⏮️ previousTrack called', { player: !!player, isReady, deviceId, accessToken: !!accessToken });

    if (!accessToken) {
      console.warn('⚠️ previousTrack: No access token available');
      return;
    }

    try {
      await spotifyService.previousTrack(deviceId || undefined);
      console.log('✅ previousTrack successful');
    } catch (error) {
      console.error('❌ previousTrack error:', error);
    }
  };

  const seek = (position: number) => {
    console.log('⏩ seek called', { position, player: !!player, isReady, deviceId, accessToken: !!accessToken });

    if (!accessToken) {
      console.warn('⚠️ seek: No access token available');
      return;
    }

    // Update the local progress immediately to provide instant feedback
    setProgress(position);

    spotifyService.seek(Math.round(position), deviceId || undefined)
      .then(() => {
        console.log('✅ seek successful');
      })
      .catch(error => {
        console.error('❌ seek error:', error);
      });
  };

  const setVolume = (volume: number) => {
    console.log('🔊 setVolume called', { volume, player: !!player, isReady });
    if (player) {
      player.setVolume(volume).catch(error => {
        console.error('❌ setVolume error:', error);
      });
    } else {
      console.warn('⚠️ setVolume: No player available');
    }
  };

  const playTrack = async (trackUri: string, contextUri?: string) => {
    console.log('playTrack called with:', { trackUri, contextUri, deviceId, isReady });

    if (!player || !deviceId || !accessToken) {
      console.warn('Player not ready or missing credentials:', {
        player: !!player,
        deviceId,
        accessToken: !!accessToken
      });
      return;
    }

    try {
      if (contextUri) {
        console.log('🎵 Playing album/playlist:', contextUri);
      } else if (trackUri) {
        console.log('🎵 Playing track:', trackUri);
      }

      await spotifyService.play(deviceId || undefined, trackUri, contextUri);
      console.log('✅ Play request successful');
      setIsPlaying(true);
    } catch (error) {
      console.error('❌ Error playing track:', error);
    }
  };

  const toggleShuffle = async (shuffle: boolean) => {
    if (!accessToken || !deviceId) return;

    try {
      await spotifyService.toggleShuffle(shuffle, deviceId || undefined);
      setShuffle(shuffle);
    } catch (error) {
      console.error('❌ Error toggling shuffle:', error);
    }
  };

  const toggleRepeat = async (repeat: 'track' | 'context' | 'off') => {
    if (!accessToken || !deviceId) return;

    try {
      await spotifyService.toggleRepeat(repeat, deviceId || undefined);
      setRepeat(repeat);
    } catch (error) {
      console.error('❌ Error toggling repeat:', error);
    }
  };

  return {
    player,
    deviceId,
    isReady,
    play,
    pause,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
    playTrack,
    toggleShuffle,
    toggleRepeat,
  };
};
