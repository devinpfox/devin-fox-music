const LyricsDisplay = ({ lyrics }) => {

  if (!lyrics || lyrics.length === 0) {
    return (
      <div className="mt-6">
        <div className="neon-card-rounded">
          <div className="neon-card-rounded-inner p-6 text-center">
            <p className="text-gray-400 text-sm">No lyrics available</p>
          </div>
        </div>
      </div>
    );
  }

  // Group lyrics by section for better visual organization
  let currentSection = '';

  return (
    <div className="mt-6">
      <div className="neon-card-rounded">
        <div className="neon-card-rounded-inner p-6 max-h-96 overflow-y-auto custom-scrollbar">
          <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider sticky top-0 pb-2"
            style={{
              backgroundColor: 'rgba(20, 10, 50, 0.9)',
              textShadow: '0 0 15px rgba(0, 200, 255, 0.5)'
            }}>
            Lyrics
          </h3>

      <div className="space-y-2">
        {lyrics.map((lyric, index) => {
          const showSection = lyric.section && lyric.section !== currentSection;

          if (showSection) {
            currentSection = lyric.section;
          }

          return (
            <div key={index}>
              {/* Section Header */}
              {showSection && (
                <div className="mb-2 mt-4">
                  <span
                    className="text-xs font-semibold uppercase tracking-wider inline-block px-2 py-1 rounded"
                    style={{
                      background: 'linear-gradient(135deg, #FF00C8, #00C8FF)',
                      color: 'white',
                    }}
                  >
                    {lyric.section}
                  </span>
                </div>
              )}

              {/* Lyric Line */}
              <p className="text-base leading-relaxed text-white px-2 py-1">
                {lyric.text}
              </p>
            </div>
          );
        })}
      </div>
        </div>
      </div>
    </div>
  );
};

export default LyricsDisplay;
