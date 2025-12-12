# Quick Setup Guide

Follow these steps to get your Devin Fox EPK running:

## Step 1: Install Dependencies

Open your terminal in the `devin-fox-epk` folder and run:

```bash
npm install
```

This will install Next.js, React, Tailwind CSS, and all other required packages.

## Step 2: Add Your Assets

Copy the following files to the `public/` folder:

1. **devin-fox-artist.jpg** - Your artist photo
   - Recommended size: 512x512px or larger
   - Format: JPG, PNG, or WebP

2. **run-n-tell.mp3** - First track
3. **luv-somebody.mp3** - Second track
4. **aint-bad.mp3** - Third track

**Note**: The app will work without these files, but you'll see broken image/audio until you add them.

## Step 3: Start Development Server

Run the development server:

```bash
npm run dev
```

## Step 4: View Your EPK

Open your browser and navigate to:

```
http://localhost:3000
```

You should see your EPK with the animated neon background!

## Step 5: Customize (Optional)

### Update Bio Text
Edit `components/ArtistBio.js` to change the biography text.

### Change Track Names
Edit `components/MusicPlaylist.js` to update track titles or add more tracks.

### Modify Colors
Edit `tailwind.config.js` or `styles/globals.css` to adjust the neon color scheme.

## Building for Production

When ready to deploy:

```bash
npm run build
npm start
```

## Deployment Options

- **Vercel** (Recommended): https://vercel.com - Free for Next.js apps
- **Netlify**: https://netlify.com
- **AWS Amplify**: https://aws.amazon.com/amplify/

## Troubleshooting

### Images not showing?
- Ensure image files are in the `public/` folder
- Check that filenames match exactly (case-sensitive)
- Restart the dev server after adding files

### Audio not playing?
- Verify MP3 files are in `public/` folder
- Check browser console for errors (F12)
- Ensure filenames match the paths in MusicPlaylist.js

### Styles not applying?
- Run `npm run dev` again
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

## Need Help?

Check the main README.md for more detailed documentation.
