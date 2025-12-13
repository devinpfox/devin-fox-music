import { useState } from 'react';

const ArtistBio = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="mb-8">
      {/* Bio Header with Decorative Lines */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-40"></div>
        <h2 className="px-6 text-2xl font-bold text-white uppercase tracking-widest"
          style={{
            textShadow: '0 2px 6px rgba(0, 0, 0, 0.4), 0 0 10px rgba(0, 200, 255, 0.3)'
          }}>
          ARTIST BIO
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-40"></div>
      </div>

      {/* Bio Content Card */}
      <div className="neon-card-rounded mb-8">
        <div className="neon-card-rounded-inner p-8">
          <div className="text-base text-gray-100 leading-relaxed">
            <p className="mb-4">
              Devin Fox is a highly disciplined songwriter, producer, and composer specializing in commercially precise Pop/Indie/R&B. He possesses a rare instinct for anthemic, global pop hooks and commercially precise melodies. As an early signal of his ability to deliver hit records, he contributed to the platinum-selling J-Pop scene, earning a composer credit on the platinum-selling J-Pop single "SO RIGHT" for J SOUL BROTHERS III from EXILE TRIBE at just 15 years old.
            </p>

            {isExpanded && (
              <>
                <p className="mb-4">
                  Following early success as a member of a major-label boyband, Fox intentionally stepped away from the performance spotlight to dedicate his time to refining his production and writing craft. This period shaped a sharper, more intentional creative vision rooted in discipline, clarity, and complete creative control.
                </p>

                <p className="mb-4">
                  Now re-emerging with a fully realized sound, Fox delivers sleek, sophisticated production across his Pop/Indie/R&B catalog. His work balances nostalgia and immediacy, pairing modern sonic quality with melodies built to last.
                </p>

                <p>
                  This chapter marks a clear artistic pivot: Fox is focused on a publishing-first strategy, providing a fully realized, radio-ready song catalog to generate high-value cuts and sync opportunities for major artists and third-party projects.
                </p>
              </>
            )}

            {/* Read More Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-4 mx-auto block px-6 py-2 rounded-full text-sm font-medium transition-all duration-300"
              style={{
                background: isExpanded
                  ? 'linear-gradient(135deg, rgba(100, 150, 255, 0.25), rgba(150, 180, 255, 0.2))'
                  : 'linear-gradient(135deg, rgba(0, 200, 255, 0.2), rgba(150, 100, 255, 0.2))',
                border: '1px solid',
                borderColor: isExpanded
                  ? 'rgba(100, 150, 255, 0.4)'
                  : 'rgba(0, 200, 255, 0.3)',
                color: 'rgba(200, 220, 255, 1)',
                backdropFilter: 'blur(12px)',
                boxShadow: isExpanded
                  ? '0 0 10px rgba(100, 150, 255, 0.2)'
                  : '0 0 10px rgba(0, 200, 255, 0.2)'
              }}
            >
              {isExpanded ? 'Read Less' : 'Read More'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtistBio;
