# Lyrics Synchronization Guide

Your EPK now features **synchronized lyrics** that display as your songs play! The lyrics automatically highlight the current line and auto-scroll for the best viewing experience.

## How It Works

### Automatic Synchronization

The system automatically calculates timing for each lyric line based on:
1. **Song duration** - Gets the total length of the track
2. **Number of lyrics lines** - Counts all lyric lines in your file
3. **Even distribution** - Spreads lines evenly across the song with smart buffering

**Formula:**
- 5% buffer at start (intro/music)
- 5% buffer at end (outro)
- 90% of song divided evenly among all lyric lines

### Features

✅ **Auto-scroll** - Lyrics automatically scroll to keep current line centered
✅ **Current line highlighting** - Active line glows in cyan with larger text
✅ **Past lines dimmed** - Previously sung lines fade to 50% opacity
✅ **Section headers** - Shows Verse, Chorus, etc. with gradient badges
✅ **Smooth transitions** - All animations are smooth and GPU-accelerated

## Lyrics File Format

Your lyrics files should be plain text (.txt) with this structure:

```
[Verse]
First line of verse
Second line of verse
Third line of verse

[Pre-Chorus]
Pre-chorus line one
Pre-chorus line two

[Chorus]
Chorus line one
Chorus line two
Chorus line three

[Verse]
Second verse line one
...
```

### Section Markers

Use brackets `[Section Name]` to mark different parts:
- `[Verse]`
- `[Pre-Chorus]` or `[Prehook]`
- `[Chorus]` or `[Hook]`
- `[Post-Chorus]`
- `[Bridge]`
- `[Outro]`
- `[Intro]`
- Any custom section name

**Note:** Section markers are displayed as styled badges above the lyrics.

## Manual Timestamps (Optional)

For **more accurate synchronization**, you can add manual timestamps to your lyrics files.

### Format

Add timestamps in `[MM:SS]` or `[M:SS]` format before the line:

```
[Verse]
[0:05] Phone rings, I hit reply with a text
[0:08] Seems like you just wanted more, wanted to see what was next
[0:12] Send pics, I know you're just tryna flex
[0:15] I've seen this all before, it's gonna turn to a mess

[Pre-Chorus]
[0:20] I'm not here for a fight
[0:23] Just need you to shake me up for a night
[0:27] Trying hard to break free, why won't you just take me?
```

### How to Create Timestamps

1. **Play the song** in your favorite audio player
2. **Note the time** when each line starts
3. **Add timestamps** using the format above
4. **Test and adjust** - Play the song in your EPK and fine-tune

### Timestamp Tips

- Round to whole seconds for simplicity
- You don't need timestamps for every line - mix manual and auto!
- Lines without timestamps will auto-calculate based on surrounding timed lines
- Be consistent with your format: `[0:15]` or `[00:15]` both work

## Current Lyrics Files

Your EPK currently has these lyrics files mapped:

| Track | Audio File | Lyrics File |
|-------|-----------|-------------|
| Love Somebody | `/luv-somebody.mp3` | `/love-somebody.txt` |
| Run 'n Tell | `/run-n-tell.mp3` | `/run-n-tell.txt` |
| Ain't Bad | `/aint-bad.mp3` | `/aint-bad.txt` |

## Adding New Tracks with Lyrics

To add a new track with synchronized lyrics:

1. **Add audio file** to `/public/` folder (e.g., `new-song.mp3`)
2. **Add lyrics file** to `/public/` folder (e.g., `new-song.txt`)
3. **Update the tracks array** in `components/MusicPlaylist.js`:

```javascript
const tracks = [
  { id: 1, title: 'Love Somebody', file: '/luv-somebody.mp3', lyrics: '/love-somebody.txt' },
  { id: 2, title: "Run 'n Tell", file: '/run-n-tell.mp3', lyrics: '/run-n-tell.txt' },
  { id: 3, title: "Ain't Bad", file: '/aint-bad.mp3', lyrics: '/aint-bad.txt' },
  { id: 4, title: 'New Song', file: '/new-song.mp3', lyrics: '/new-song.txt' }, // ← Add here
];
```

## Styling Customization

Want to customize the lyrics display? Edit `components/LyricsDisplay.js`:

**Colors:**
- Current line color: `color: isCurrent ? '#00C8FF' : 'white'`
- Section badge gradient: `background: 'linear-gradient(135deg, #FF00C8, #00C8FF)'`

**Sizes:**
- Max height: `max-h-96` (384px) - Change to `max-h-[500px]` for taller display
- Font size: `text-base` - Change to `text-lg` for larger text

**Effects:**
- Glow intensity: `textShadow: isCurrent ? '0 0 10px rgba(0, 200, 255, 0.5)' : 'none'`
- Scale current line: `scale-105` - Change to `scale-110` for more emphasis

## Troubleshooting

### Lyrics not showing?
- Check that the `.txt` file exists in the `/public` folder
- Verify the filename matches exactly (case-sensitive)
- Check browser console (F12) for errors

### Timing is off?
- **Too fast?** Add more buffer or use manual timestamps
- **Too slow?** Reduce buffer time in `lyricsParser.js`:
  ```javascript
  const startBuffer = duration * 0.03; // Reduce from 0.05 to 0.03
  const endBuffer = duration * 0.03;
  ```

### Lyrics not scrolling smoothly?
- Ensure you're using a modern browser (Chrome, Firefox, Safari)
- Check that `scroll-behavior: smooth` is in `globals.css`

### Section headers not showing?
- Make sure section names are in brackets: `[Verse]` not `Verse:`
- Section markers should be on their own line

## Advanced: Custom Sync Algorithm

Want to implement a more sophisticated sync algorithm? Edit `utils/lyricsParser.js`:

The `calculateLyricTiming()` function is where the magic happens. You can:
- Weight chorus lines differently (show longer)
- Analyze syllable count for better distribution
- Integrate with Web Audio API for beat detection
- Import from LRC or SRT format

## Technical Details

**Update Frequency:** 100ms (10 times per second)
**Scroll Behavior:** Smooth CSS scroll with centering
**Performance:** GPU-accelerated with CSS transforms
**Browser Support:** All modern browsers (Chrome, Firefox, Safari, Edge)

## Support

Need help with lyrics synchronization? Check:
1. `utils/lyricsParser.js` - Parsing and timing logic
2. `components/LyricsDisplay.js` - Display component
3. `components/MusicPlaylist.js` - Integration and state management

---

**Enjoy your synchronized lyrics!** 🎵✨
