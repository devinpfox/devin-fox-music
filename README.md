# Devin Fox - Electronic Press Kit (EPK)

A stunning Next.js web application featuring a neon-animated background and glassmorphic design for artist Devin Fox's EPK.

## Features

- **Animated Neon Background**: Dynamic gradient animation with blue-cyan and pink-magenta colors
- **Glassmorphic Design**: Modern frosted glass effect with backdrop blur
- **Interactive Music Player**: Built-in audio player with play/pause controls
- **Responsive Layout**: Mobile-first design optimized for all screen sizes
- **Modern Stack**: Built with Next.js, React, and Tailwind CSS

## Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager

## Installation

1. Navigate to the project directory:
   ```bash
   cd devin-fox-epk
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Add required assets to the `public/` folder:
   - `devin-fox-artist.jpg` - Artist profile image
   - `run-n-tell.mp3` - Track 1
   - `luv-somebody.mp3` - Track 2
   - `aint-bad.mp3` - Track 3

## Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the EPK.

## Building for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Project Structure

```
devin-fox-epk/
├── components/
│   ├── ArtistHeader.js    # Artist profile header with circular image
│   ├── ArtistBio.js       # Biography section
│   └── MusicPlaylist.js   # Interactive music player
├── pages/
│   ├── _app.js            # Next.js app wrapper
│   └── index.js           # Main EPK page
├── public/
│   └── [assets]           # Images and audio files
├── styles/
│   └── globals.css        # Global styles and animations
└── package.json
```

## Customization

### Updating Artist Information

Edit the components in the `components/` folder:
- **ArtistHeader.js**: Change artist name and title
- **ArtistBio.js**: Update biography text
- **MusicPlaylist.js**: Modify track list

### Changing Colors

The neon color scheme can be adjusted in:
- `tailwind.config.js`: Define custom color variables
- `styles/globals.css`: Modify gradient colors in animations

### Adding More Tracks

In `components/MusicPlaylist.js`, add new tracks to the `tracks` array:

```javascript
const tracks = [
  { id: 1, title: 'Your Track', file: '/your-track.mp3' },
  // Add more tracks here
];
```

## Technologies Used

- **Next.js 14**: React framework for production
- **React 18**: UI library
- **Tailwind CSS 3**: Utility-first CSS framework
- **CSS3 Animations**: Custom keyframe animations for neon effects

## Performance Optimizations

- Next.js Image component for optimized image loading
- CSS animations running on GPU with `transform` and `opacity`
- Backdrop blur filter for performant glassmorphism
- Lazy loading of audio files

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is private and proprietary.

## Credits

Design and Development: Custom implementation based on Neo-Vegas Pop aesthetic
Artist: Devin Fox
