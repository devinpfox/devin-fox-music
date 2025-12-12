import { useEffect, useRef } from 'react';

const AudioVisualizer = ({ audioElement, isPlaying }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);
  const connectedElementRef = useRef(null);

  useEffect(() => {
    if (!audioElement || !isPlaying) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Initialize Web Audio API
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 512;
      analyserRef.current.smoothingTimeConstant = 0.8;

      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
    }

    // Connect audio source - reconnect if audio element changed
    if (audioElement && connectedElementRef.current !== audioElement) {
      try {
        // Disconnect previous source if exists
        if (sourceRef.current) {
          sourceRef.current.disconnect();
        }

        // Create and connect new source
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioElement);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
        connectedElementRef.current = audioElement;
      } catch (error) {
        // Source already connected to this element, skip
        console.log('Audio source connection error:', error);
      }
    }

    // Resume audio context if suspended
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    // WMP9-style visualization with concentric rings
    const draw = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      // Clear with trail effect for smooth background animation
      ctx.fillStyle = 'rgba(10, 5, 21, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // Calculate average frequency levels
      const dataArray = dataArrayRef.current;
      const bufferLength = dataArray.length;

      // Bass (low frequencies)
      const bassEnd = Math.floor(bufferLength * 0.15);
      let bassSum = 0;
      for (let i = 0; i < bassEnd; i++) {
        bassSum += dataArray[i];
      }
      const bassAvg = bassSum / bassEnd / 255;

      // Mids
      const midEnd = Math.floor(bufferLength * 0.5);
      let midSum = 0;
      for (let i = bassEnd; i < midEnd; i++) {
        midSum += dataArray[i];
      }
      const midAvg = midSum / (midEnd - bassEnd) / 255;

      // Highs
      let highSum = 0;
      for (let i = midEnd; i < bufferLength; i++) {
        highSum += dataArray[i];
      }
      const highAvg = highSum / (bufferLength - midEnd) / 255;

      // Overall energy
      const energy = (bassAvg * 0.5 + midAvg * 0.3 + highAvg * 0.2);

      // Draw concentric rings - WMP style
      const numRings = 5;
      const baseRadius = Math.min(width, height) * 0.15;
      const ringSpacing = Math.min(width, height) * 0.08;

      for (let ring = 0; ring < numRings; ring++) {
        const phase = ring / numRings;
        const radius = baseRadius + (ring * ringSpacing);

        // Sample frequency data for this ring
        const sampleIndex = Math.floor((ring / numRings) * bufferLength);
        const sampleValue = dataArray[sampleIndex] / 255;

        // Ring expansion based on audio
        const expansionBass = bassAvg * 40;
        const expansionMid = sampleValue * 30;
        const finalRadius = radius + expansionBass + expansionMid;

        // Color selection - Electric Cyan base, Hot Magenta for energy peaks
        let ringColor;
        if (energy > 0.6 && ring === Math.floor(numRings / 2)) {
          // Hot Magenta glow for high energy center ring
          const magentaIntensity = Math.min(1, energy * 1.2);
          ringColor = `rgba(255, 0, 200, ${magentaIntensity * 0.6})`;
        } else {
          // Electric Cyan for other rings
          const cyanIntensity = 0.3 + (sampleValue * 0.5);
          ringColor = `rgba(0, 200, 255, ${cyanIntensity})`;
        }

        // Draw ring
        ctx.strokeStyle = ringColor;
        ctx.lineWidth = 2 + (sampleValue * 3);
        ctx.shadowBlur = 10 + (energy * 15);
        ctx.shadowColor = energy > 0.6 ? 'rgba(255, 0, 200, 0.5)' : 'rgba(0, 200, 255, 0.4)';

        ctx.beginPath();
        ctx.arc(centerX, centerY, finalRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Inner glow
        ctx.strokeStyle = energy > 0.6 && ring === Math.floor(numRings / 2)
          ? `rgba(255, 100, 220, ${energy * 0.2})`
          : `rgba(100, 220, 255, ${sampleValue * 0.2})`;
        ctx.lineWidth = 1;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(centerX, centerY, finalRadius - 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw horizontal equalizer bars at bottom - classic WMP touch
      const numBars = 32;
      const barWidth = width / numBars;
      const barSpacing = 2;
      const bottomPadding = 50;

      for (let i = 0; i < numBars; i++) {
        const sampleIndex = Math.floor((i / numBars) * bufferLength);
        const barHeight = (dataArray[sampleIndex] / 255) * (height * 0.15);

        const x = i * barWidth;
        const y = height - bottomPadding - barHeight;

        // Gradient from Electric Cyan to Hot Magenta based on frequency
        const colorMix = i / numBars;
        const r = Math.floor(0 + (255 * colorMix));
        const g = Math.floor(200 - (200 * colorMix));
        const b = Math.floor(255 - (55 * colorMix));

        const gradient = ctx.createLinearGradient(x, y + barHeight, x, y);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.4)`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.8)`);

        ctx.fillStyle = gradient;
        ctx.shadowBlur = 5;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.3)`;
        ctx.fillRect(x + barSpacing, y, barWidth - barSpacing * 2, barHeight);
      }

      // Reset shadow for next frame
      ctx.shadowBlur = 0;

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', setCanvasSize);
    };
  }, [audioElement, isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="audio-visualizer"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
        opacity: isPlaying ? 0.35 : 0,
        transition: 'opacity 1s ease'
      }}
    />
  );
};

export default AudioVisualizer;
