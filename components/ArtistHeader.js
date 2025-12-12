import Image from 'next/image';
import { useState } from 'react';

const ArtistHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Horizontal Neon Header Card */}
      <header className="mb-8">
        <div className="neon-card-rounded">
          <div className="neon-card-rounded-inner p-6">
            <div className="flex items-center gap-8">
              {/* Artist Image - Left Side with Visualizer Aura */}
              <div className="relative flex-shrink-0">
                {/* WMP Visualizer Aura */}
                <div className="visualizer-aura"></div>

                <div
                  className="relative z-10 w-48 h-48 rounded-3xl p-1 cursor-pointer transition-transform duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #FF00C8, #00C8FF, #00FFFF)',
                    boxShadow: '0 0 25px rgba(0, 200, 255, 0.6), 0 0 50px rgba(255, 0, 200, 0.4)'
                  }}
                  onClick={() => setIsModalOpen(true)}
                >
                  <div className="relative w-full h-full rounded-3xl overflow-hidden">
                    <Image
                      src="/devin-fox-artist.jpg"
                      alt="Devin Fox"
                      width={192}
                      height={192}
                      className="rounded-3xl object-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>

              {/* Artist Info - Right Side */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-5xl font-bold text-white tracking-wider uppercase mb-3"
                  style={{
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.4), 0 0 12px rgba(0, 200, 255, 0.3)'
                  }}>
                  DEVIN FOX
                </h1>
                <p className="text-lg text-gray-200 tracking-widest uppercase"
                  style={{
                    textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)'
                  }}>
                  ARTIST / PRODUCER / SONGWRITER
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modal Popup */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-w-2xl max-h-[90vh] animate-fadeIn">
            {/* Close Button */}
            <button
              className="absolute -top-10 right-0 text-white text-3xl font-bold hover:text-neon-pink transition-colors duration-200"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>

            {/* Full Size Image */}
            <div
              className="rounded-2xl p-1"
              style={{
                background: 'linear-gradient(135deg, #FF00C8, #FF6B9D, #00C8FF)',
                boxShadow: '0 0 30px rgba(255, 0, 200, 0.8), 0 0 60px rgba(0, 200, 255, 0.6)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative rounded-2xl overflow-hidden">
                <Image
                  src="/devin-fox-artist.jpg"
                  alt="Devin Fox - Full Size"
                  width={800}
                  height={1000}
                  className="rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ArtistHeader;
