import { useState } from 'react';
import Head from 'next/head';
import ArtistHeader from '../components/ArtistHeader';
import ArtistBio from '../components/ArtistBio';
import MusicPlaylist from '../components/MusicPlaylist';
import AudioVisualizer from '../components/AudioVisualizer';

export default function EPK() {
  const [playbackState, setPlaybackState] = useState({
    audioElement: null,
    isPlaying: false,
    currentTrack: null
  });

  return (
    <>
      <Head>
        <title>Devin Fox - Official EPK</title>
        <meta name="description" content="Devin Fox - Platinum songwriter and former After Romeo member. Electronic Press Kit featuring latest music and bio." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* 1. Full-Screen Neon Animated Background */}
      <div className="neon-background"></div>

      {/* 1b. Audio Visualizer - Right above background */}
      <AudioVisualizer
        audioElement={playbackState.audioElement}
        isPlaying={playbackState.isPlaying}
      />

      {/* 1c. WMP-Inspired Animated Light Waves Overlay */}
      <div className="light-waves"></div>

      {/* 2. Main Content Wrapper: Centered and Narrow */}
      <main className="relative z-10 flex min-h-screen items-center justify-center p-4 py-16">

        {/* 3. EPK Content Container */}
        <div className="w-full max-w-4xl">
          <ArtistHeader />
          <ArtistBio />
          <MusicPlaylist onPlaybackChange={setPlaybackState} />
        </div>
      </main>
    </>
  );
}
