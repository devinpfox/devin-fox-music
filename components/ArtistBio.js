const ArtistBio = () => (
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
        <p className="text-base text-gray-100 leading-relaxed text-center">
Devin Fox is a platinum songwriter and former boyband member who returns after nearly a decade away with a sharper sound and a renewed artistic vision. Drawing from his lifelong love of 80s new wave and his affinity for indie and alternative music, Devin fuses nostalgic texture with instinctive pop craftsmanship. The result is a distinctive, forward-leaning style built for the evolving 2026 landscape and a bold new chapter in his evolution as an artist.
        </p>
      </div>
    </div>
  </section>
);

export default ArtistBio;
