import { useState, useRef, useEffect } from 'react';
import NowPlayingWidget from './NowPlayingWidget';
import { fetchLyrics } from '../utils/lyricsParser';

const tracks = [
  {
    id: 1,
    title: 'Love Somebody',
    chorusFile: '/love-somebody-chorus.mp3',
    fullFile: '/luv-somebody.mp3',
    lyrics: '/love-somebody.txt'
  },
  {
    id: 2,
    title: "Run 'n Tell",
    chorusFile: '/run-n-tell-chorus.mp3',
    fullFile: '/run-n-tell.mp3',
    lyrics: '/run-n-tell.txt'
  },
  {
    id: 3,
    title: "Ain't Bad",
    chorusFile: "/ain't-bad-chorus.mp3",
    fullFile: '/aint-bad.mp3',
    lyrics: '/aint-bad.txt'
  },
];

const MusicPlaylist = ({ onPlaybackChange }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [lyrics, setLyrics] = useState([]);
  const [showLyrics, setShowLyrics] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [playingFullVersion, setPlayingFullVersion] = useState({});

  const audioRefs = useRef({});
  const updateIntervalRef = useRef(null);
  const progressBarRef = useRef(null);

  // Notify parent of playback changes
  useEffect(() => {
    if (onPlaybackChange) {
      onPlaybackChange({
        audioElement: currentTrack ? audioRefs.current[currentTrack] : null,
        isPlaying,
        currentTrack
      });
    }
  }, [currentTrack, isPlaying, onPlaybackChange]);

  // Format time in MM:SS
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle seeking when clicking or dragging on progress bar
  const handleSeek = (e) => {
    if (!currentTrack || !progressBarRef.current) return;

    const audio = audioRefs.current[currentTrack];
    if (!audio || !audio.duration) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * audio.duration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Handle mouse down on progress bar
  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleSeek(e);
  };

  // Handle mouse move while dragging
  const handleMouseMove = (e) => {
    if (isDragging) {
      handleSeek(e);
    }
  };

  // Handle mouse up anywhere
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const togglePlay = (trackId) => {
    const audio = audioRefs.current[trackId];

    if (!audio) return;

    // If clicking on currently playing track, pause it
    if (currentTrack === trackId && isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    // Stop all other tracks
    Object.keys(audioRefs.current).forEach((id) => {
      if (audioRefs.current[id] && parseInt(id) !== trackId) {
        audioRefs.current[id].pause();
        audioRefs.current[id].currentTime = 0;
      }
    });

    // Reset currentTime if track has ended
    if (audio.ended || audio.currentTime >= audio.duration) {
      audio.currentTime = 0;
    }

    // Play the selected track
    audio.play();
    setCurrentTrack(trackId);
    setIsPlaying(true);

    // Set duration when available
    if (audio.duration) {
      setDuration(audio.duration);
    }
  };

  // Fetch lyrics when track changes
  useEffect(() => {
    const loadLyrics = async () => {
      if (!currentTrack) {
        setLyrics([]);
        return;
      }

      const track = tracks.find(t => t.id === currentTrack);
      if (!track || !track.lyrics) {
        setLyrics([]);
        return;
      }

      const parsedLyrics = await fetchLyrics(track.lyrics);
      setLyrics(parsedLyrics);
    };

    loadLyrics();
  }, [currentTrack]);


  // Update current time while playing
  useEffect(() => {
    if (isPlaying && currentTrack) {
      updateIntervalRef.current = setInterval(() => {
        const audio = audioRefs.current[currentTrack];
        if (audio) {
          setCurrentTime(audio.currentTime);
        }
      }, 100); // Update every 100ms for smooth sync
    } else {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    }

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [isPlaying, currentTrack]);


  return (
    <section className="mt-6">
      {/* TRACKS Header with Decorative Lines */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-40"></div>
        <h2 className="px-6 text-2xl font-bold text-white uppercase tracking-widest"
          style={{
            textShadow: '0 2px 6px rgba(0, 0, 0, 0.4), 0 0 10px rgba(0, 200, 255, 0.3)'
          }}>
          TRACKS
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-40"></div>
      </div>

      <ul className="space-y-4">
        {tracks.map((track) => (
          <li key={track.id} className="neon-track">
            <div className="neon-track-inner">
              {/* Track Title and Play Button */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => togglePlay(track.id)}
              >
                <div className="flex items-center gap-4">
                  {/* Track Number Badge */}
                  <div className="track-number text-white">
                    {track.id < 10 ? `0${track.id}` : track.id}
                  </div>

                  {/* Track Title */}
                  <span className="text-white text-lg font-medium">
                    {track.title}
                  </span>
                </div>

                {/* Neon Play/Pause Button */}
                <div className="flex items-center">
                  {currentTrack === track.id && isPlaying ? (
                    // Neon Pause Button
                    <div className="neon-play-btn cursor-pointer">
                      <div className="neon-play-btn-inner">
                        <svg
                          className="w-5 h-5"
                          style={{ color: '#00C8FF' }}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    // Neon Play Button
                    <div className="neon-play-btn cursor-pointer">
                      <div className="neon-play-btn-inner">
                        <svg
                          className="w-5 h-5"
                          style={{ color: '#00C8FF', marginLeft: '3px' }}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}

                {/* Hidden HTML Audio Element */}
                <audio
                  ref={(el) => (audioRefs.current[track.id] = el)}
                  src={playingFullVersion[track.id] ? track.fullFile : track.chorusFile}
                  onLoadedMetadata={(e) => {
                    if (currentTrack === track.id) {
                      setDuration(e.target.duration);
                    }
                  }}
                  onEnded={() => {
                    if (currentTrack === track.id) {
                      setIsPlaying(false);
                      setCurrentTrack(null);
                      setCurrentTime(0);
                      setShowLyrics(false);
                    }
                  }}
                />
              </div>
            </div>

              {/* Progress Bar - Only show for currently playing track */}
              {currentTrack === track.id && (
                <div className="mt-4 space-y-3 pt-4 border-t border-cyan-500/20" onClick={(e) => e.stopPropagation()}>
                  <div
                    ref={progressBarRef}
                    className="relative py-2 group"
                    style={{ cursor: isDragging ? 'grabbing' : 'pointer' }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleMouseDown(e);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSeek(e);
                    }}
                  >
                    {/* Background Track */}
                    <div className="relative h-2 rounded-full overflow-hidden"
                      style={{
                        background: 'rgba(100, 100, 150, 0.3)',
                        boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.5)'
                      }}>
                      {/* Progress Fill */}
                      <div
                        className="absolute h-full rounded-full transition-all"
                        style={{
                          width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                          background: 'linear-gradient(90deg, #FF00C8, #00C8FF)',
                          boxShadow: '0 0 10px rgba(0, 200, 255, 0.6)'
                        }}
                      />
                    </div>

                    {/* Scrubber Handle */}
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full shadow-lg transition-opacity ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                      style={{
                        left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                        transform: 'translate(-50%, -50%)',
                        background: 'linear-gradient(135deg, #00C8FF, #FF00C8)',
                        boxShadow: '0 0 15px rgba(0, 200, 255, 0.8), 0 0 25px rgba(255, 0, 200, 0.5)',
                      }}
                    />
                  </div>

                  {/* Time Display */}
                  <div className="flex justify-between text-sm text-cyan-300 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex gap-2">
                    {/* Listen to Full Demo Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const audio = audioRefs.current[track.id];
                        const wasPlaying = currentTrack === track.id && isPlaying;

                        setPlayingFullVersion(prev => ({
                          ...prev,
                          [track.id]: !prev[track.id]
                        }));

                        // Reset to beginning and resume playback after switching versions
                        if (wasPlaying) {
                          setTimeout(() => {
                            if (audio) {
                              audio.currentTime = 0;
                              audio.play();
                            }
                          }, 100);
                        }
                      }}
                      className="flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                      style={{
                        background: playingFullVersion[track.id]
                          ? 'linear-gradient(135deg, rgba(150, 100, 255, 0.25), rgba(180, 130, 255, 0.2))'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid',
                        borderColor: playingFullVersion[track.id]
                          ? 'rgba(150, 100, 255, 0.4)'
                          : 'rgba(255, 255, 255, 0.15)',
                        color: playingFullVersion[track.id] ? 'rgba(180, 150, 255, 1)' : 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(12px)'
                      }}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                        />
                      </svg>
                      <span className="text-xs">{playingFullVersion[track.id] ? 'Playing Full' : 'Full Demo'}</span>
                    </button>

                    {/* See Lyrics Toggle Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowLyrics(!showLyrics);
                      }}
                      className="flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                      style={{
                        background: showLyrics
                          ? 'linear-gradient(135deg, rgba(100, 150, 255, 0.25), rgba(150, 180, 255, 0.2))'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid',
                        borderColor: showLyrics
                          ? 'rgba(100, 150, 255, 0.4)'
                          : 'rgba(255, 255, 255, 0.15)',
                        color: showLyrics ? 'rgba(150, 200, 255, 1)' : 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(12px)'
                      }}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={showLyrics ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                        />
                      </svg>
                      <span className="text-xs">{showLyrics ? 'Hide' : 'Lyrics'}</span>
                    </button>
                  </div>

                  {/* Inline Lyrics Display */}
                  {showLyrics && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      {lyrics && lyrics.length > 0 ? (
                        <div className="max-h-64 overflow-y-auto pr-2"
                          style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'rgba(100, 150, 255, 0.3) transparent'
                          }}>
                          <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3"
                            style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                            Lyrics
                          </h4>
                          <div className="space-y-3">
                            {(() => {
                              let currentSection = '';
                              return lyrics.map((lyric, index) => {
                                const showSection = lyric.section && lyric.section !== currentSection;
                                if (showSection) currentSection = lyric.section;

                                return (
                                  <div key={index}>
                                    {showSection && (
                                      <div className="mb-2 mt-4 first:mt-0">
                                        <span className="text-xs font-semibold uppercase tracking-wider inline-block px-2 py-1 rounded"
                                          style={{
                                            background: 'linear-gradient(135deg, rgba(100, 150, 255, 0.2), rgba(150, 180, 255, 0.15))',
                                            color: 'rgba(150, 200, 255, 0.9)',
                                            border: '1px solid rgba(100, 150, 255, 0.25)'
                                          }}>
                                          {lyric.section}
                                        </span>
                                      </div>
                                    )}
                                    <p className="text-sm leading-relaxed text-white/80 px-1">
                                      {lyric.text}
                                    </p>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-white/50 text-center py-4">No lyrics available</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* WMP-Inspired Now Playing Widget */}
      <NowPlayingWidget
        isPlaying={isPlaying && currentTrack}
        trackTitle={currentTrack ? tracks.find(t => t.id === currentTrack)?.title : ''}
      />
    </section>
  );
};

export default MusicPlaylist;
