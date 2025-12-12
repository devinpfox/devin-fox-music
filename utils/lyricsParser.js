/**
 * Fetches and parses lyrics from a text file
 * @param {string} lyricsFile - Path to the lyrics file
 * @returns {Promise<Array>} Parsed lyrics array with sections and lines
 */
export async function fetchLyrics(lyricsFile) {
  try {
    const response = await fetch(lyricsFile);
    const text = await response.text();
    return parseLyrics(text);
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    return [];
  }
}

/**
 * Parses lyrics text into structured format
 * Supports section markers like [Verse], [Chorus], etc.
 * Supports optional timestamps like [00:15] or [0:15]
 * @param {string} text - Raw lyrics text
 * @returns {Array} Array of lyric objects with section, line, and optional timestamp
 */
export function parseLyrics(text) {
  const lines = text.split('\n');
  const parsed = [];
  let currentSection = '';
  let timestamp = null;

  lines.forEach((line) => {
    line = line.trim();

    // Skip empty lines
    if (!line) return;

    // Check for section marker [Verse], [Chorus], etc.
    const sectionMatch = line.match(/^\[([^\]]+)\]$/);
    if (sectionMatch) {
      const content = sectionMatch[1];

      // Check if it's a timestamp [00:15], [0:15], or [0:15.5]
      const timestampMatch = content.match(/^(\d{1,2}):(\d{2}(?:\.\d+)?)$/);
      if (timestampMatch) {
        const minutes = parseInt(timestampMatch[1]);
        const seconds = parseFloat(timestampMatch[2]);
        timestamp = minutes * 60 + seconds;
      } else {
        // It's a section marker
        currentSection = content;
      }
      return;
    }

    // Add the line with its section and optional timestamp
    parsed.push({
      section: currentSection,
      text: line,
      timestamp: timestamp,
    });

    // Reset timestamp after use
    timestamp = null;
  });

  return parsed;
}

/**
 * Calculates timing for each lyric line based on song duration
 * If timestamps are provided in lyrics, use those
 * Otherwise, distribute lines evenly across the song duration
 * @param {Array} lyrics - Parsed lyrics array
 * @param {number} duration - Song duration in seconds
 * @returns {Array} Lyrics with calculated timing
 */
export function calculateLyricTiming(lyrics, duration) {
  if (!lyrics || lyrics.length === 0) return [];

  // Check if any lyrics have manual timestamps
  const hasTimestamps = lyrics.some(lyric => lyric.timestamp !== null);

  if (hasTimestamps) {
    // Use provided timestamps
    return lyrics;
  }

  // Calculate even distribution
  // Leave some buffer at start (5%) and end (5%)
  const startBuffer = duration * 0.05;
  const endBuffer = duration * 0.05;
  const availableDuration = duration - startBuffer - endBuffer;
  const timePerLine = availableDuration / lyrics.length;

  return lyrics.map((lyric, index) => ({
    ...lyric,
    timestamp: startBuffer + (index * timePerLine),
  }));
}

/**
 * Gets the current lyric index based on current playback time
 * @param {Array} lyrics - Lyrics with timing
 * @param {number} currentTime - Current playback time in seconds
 * @returns {number} Index of the current lyric line
 */
export function getCurrentLyricIndex(lyrics, currentTime) {
  if (!lyrics || lyrics.length === 0) return -1;

  // Find the last lyric whose timestamp is less than or equal to current time
  for (let i = lyrics.length - 1; i >= 0; i--) {
    if (lyrics[i].timestamp <= currentTime) {
      return i;
    }
  }

  return -1;
}
