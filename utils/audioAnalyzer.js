/**
 * Advanced Audio Analysis for Intelligent Lyric Synchronization
 * Uses Web Audio API to analyze song structure and vocal patterns
 */

/**
 * Analyzes audio file to detect vocal sections, beats, and energy patterns
 * @param {string} audioUrl - URL to the audio file
 * @returns {Promise<Object>} Analysis data including vocal sections and beat times
 */
export async function analyzeAudio(audioUrl) {
  try {
    // Create audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Fetch and decode audio
    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Get audio data
    const channelData = audioBuffer.getChannelData(0); // Use first channel
    const sampleRate = audioBuffer.sampleRate;
    const duration = audioBuffer.duration;

    // Analyze the audio
    const analysis = {
      duration,
      introEnd: detectIntroEnd(channelData, sampleRate),
      outroStart: detectOutroStart(channelData, sampleRate, duration),
      vocalSections: detectVocalSections(channelData, sampleRate),
      energyMap: analyzeEnergyMap(channelData, sampleRate, duration),
      beatPattern: detectBeats(channelData, sampleRate),
    };

    // Close audio context to free resources
    audioContext.close();

    return analysis;
  } catch (error) {
    console.error('Error analyzing audio:', error);
    return null;
  }
}

/**
 * Detects when the intro ends (vocals start)
 * Looks for sustained high energy indicating vocals, not just beats
 */
function detectIntroEnd(channelData, sampleRate) {
  const windowSize = sampleRate * 1; // 1 second windows for better accuracy
  const threshold = 0.08; // Higher threshold - vocals have more energy than background
  const sustainedWindows = 2; // Need 2 consecutive high-energy windows
  let consecutiveHighEnergy = 0;

  for (let i = 0; i < channelData.length - windowSize; i += windowSize / 2) {
    const rms = calculateRMS(channelData, i, i + windowSize);
    const variance = calculateVariance(channelData, i, i + windowSize);

    // Vocals have both high RMS AND high variance
    const isLikelyVocal = rms > threshold && variance > 0.002;

    if (isLikelyVocal) {
      consecutiveHighEnergy++;
      if (consecutiveHighEnergy >= sustainedWindows) {
        // Found sustained vocal energy - add buffer before this point
        const vocalStart = (i / sampleRate);
        return Math.max(0, vocalStart - 2); // Back up 2 seconds for safety
      }
    } else {
      consecutiveHighEnergy = 0; // Reset if we hit low energy
    }
  }

  // If no clear intro detected, assume vocals start at 5 seconds
  // (most songs have at least a short intro)
  return 5;
}

/**
 * Detects when the outro starts (vocals end)
 */
function detectOutroStart(channelData, sampleRate, duration) {
  const windowSize = sampleRate * 0.5;
  const threshold = 0.015;

  // Scan from the end backwards
  for (let i = channelData.length - windowSize; i > 0; i -= windowSize) {
    const rms = calculateRMS(channelData, i, i + windowSize);
    if (rms > threshold) {
      // Found likely vocal end
      return Math.min(duration, (i / sampleRate) + 2); // Add 2 seconds buffer
    }
  }

  return duration;
}

/**
 * Detects vocal sections vs instrumental sections
 * Vocals typically have more mid-frequency energy and variability
 */
function detectVocalSections(channelData, sampleRate) {
  const windowSize = sampleRate * 2; // 2 second windows
  const sections = [];
  let inVocalSection = false;
  let sectionStart = 0;

  for (let i = 0; i < channelData.length; i += windowSize / 2) {
    const end = Math.min(i + windowSize, channelData.length);
    const rms = calculateRMS(channelData, i, end);
    const variance = calculateVariance(channelData, i, end);

    // Vocal sections have higher RMS and variance (more conservative thresholds)
    const isVocal = rms > 0.06 && variance > 0.002;

    if (isVocal && !inVocalSection) {
      // Starting a vocal section
      sectionStart = i / sampleRate;
      inVocalSection = true;
    } else if (!isVocal && inVocalSection) {
      // Ending a vocal section
      sections.push({
        start: sectionStart,
        end: i / sampleRate,
      });
      inVocalSection = false;
    }
  }

  // Close last section if still open
  if (inVocalSection) {
    sections.push({
      start: sectionStart,
      end: channelData.length / sampleRate,
    });
  }

  return sections;
}

/**
 * Creates an energy map of the song (0-1 scale)
 * Useful for detecting chorus (high energy) vs verse (lower energy)
 */
function analyzeEnergyMap(channelData, sampleRate, duration) {
  const windowSize = sampleRate * 1; // 1 second windows
  const energyMap = [];

  for (let i = 0; i < channelData.length; i += windowSize) {
    const end = Math.min(i + windowSize, channelData.length);
    const rms = calculateRMS(channelData, i, end);

    energyMap.push({
      time: i / sampleRate,
      energy: Math.min(rms * 20, 1), // Normalize to 0-1
    });
  }

  return energyMap;
}

/**
 * Detects beats/downbeats in the audio
 * Useful for aligning lyrics to musical beats
 */
function detectBeats(channelData, sampleRate) {
  const windowSize = sampleRate * 0.05; // 50ms windows
  const beats = [];
  const threshold = 0.3;
  let lastBeatTime = -1;

  for (let i = 0; i < channelData.length - windowSize; i += windowSize / 2) {
    const rms = calculateRMS(channelData, i, i + windowSize);
    const time = i / sampleRate;

    // Detect sudden increases in energy (potential beats)
    if (rms > threshold && (time - lastBeatTime) > 0.3) {
      beats.push(time);
      lastBeatTime = time;
    }
  }

  return beats;
}

/**
 * Calculates Root Mean Square (RMS) energy
 */
function calculateRMS(data, start, end) {
  let sum = 0;
  const count = end - start;

  for (let i = start; i < end; i++) {
    sum += data[i] * data[i];
  }

  return Math.sqrt(sum / count);
}

/**
 * Calculates variance in the signal
 * Higher variance often indicates vocals
 */
function calculateVariance(data, start, end) {
  const count = end - start;
  let mean = 0;

  // Calculate mean
  for (let i = start; i < end; i++) {
    mean += Math.abs(data[i]);
  }
  mean /= count;

  // Calculate variance
  let variance = 0;
  for (let i = start; i < end; i++) {
    const diff = Math.abs(data[i]) - mean;
    variance += diff * diff;
  }

  return variance / count;
}

/**
 * Intelligently maps lyrics to analyzed audio sections
 * @param {Array} lyrics - Parsed lyrics array
 * @param {Object} analysis - Audio analysis data
 * @returns {Array} Lyrics with intelligent timestamps
 */
export function mapLyricsToAudio(lyrics, analysis) {
  if (!analysis || lyrics.length === 0) {
    return lyrics;
  }

  const { introEnd, outroStart, vocalSections, energyMap } = analysis;

  // Calculate available vocal time
  const vocalDuration = outroStart - introEnd;

  // Group lyrics by section type
  const lyricSections = groupLyricsBySection(lyrics);

  // Safety check - ensure intro detection worked and isn't too early
  const safeIntroEnd = Math.max(introEnd, 3); // Never start before 3 seconds

  console.log('🎯 Intro ends at:', safeIntroEnd.toFixed(1), 'seconds');
  console.log('🎵 Outro starts at:', outroStart.toFixed(1), 'seconds');
  console.log('📊 Vocal duration:', (outroStart - safeIntroEnd).toFixed(1), 'seconds');

  // Distribute lyrics across vocal sections intelligently
  let currentTime = safeIntroEnd;
  const timedLyrics = [];

  lyricSections.forEach((section, sectionIndex) => {
    const isChorus = section.name.toLowerCase().includes('chorus') ||
                     section.name.toLowerCase().includes('hook');

    // Choruses typically have higher energy - try to align them
    if (isChorus && energyMap.length > 0) {
      // Find high energy sections
      const highEnergyTimes = energyMap
        .filter(e => e.energy > 0.7 && e.time > currentTime)
        .map(e => e.time);

      if (highEnergyTimes.length > 0) {
        currentTime = highEnergyTimes[0];
      }
    }

    // Calculate time per line for this section
    const linesInSection = section.lines.length;
    const sectionDuration = (vocalDuration / lyrics.length) * linesInSection * 1.1;
    const timePerLine = sectionDuration / linesInSection;

    // Assign timestamps to each line
    section.lines.forEach((lyric, lineIndex) => {
      timedLyrics.push({
        ...lyric,
        timestamp: currentTime + (lineIndex * timePerLine),
      });
    });

    currentTime += sectionDuration;
  });

  return timedLyrics;
}

/**
 * Groups lyrics by their section markers
 */
function groupLyricsBySection(lyrics) {
  const sections = [];
  let currentSection = null;

  lyrics.forEach((lyric) => {
    if (!currentSection || currentSection.name !== lyric.section) {
      currentSection = {
        name: lyric.section || 'Unknown',
        lines: [],
      };
      sections.push(currentSection);
    }
    currentSection.lines.push(lyric);
  });

  return sections;
}
