import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

const NowPlayingWidget = ({ isPlaying, trackTitle }) => {
  const [position, setPosition] = useState({ x: null, y: null });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const widgetRef = useRef(null);
  const hasShownTooltipRef = useRef(false);

  // Initialize position to bottom center on first render
  useEffect(() => {
    if (position.x === null && widgetRef.current) {
      const rect = widgetRef.current.getBoundingClientRect();
      setPosition({
        x: (window.innerWidth - rect.width) / 2,
        y: window.innerHeight - rect.height - 32 // 32px from bottom
      });
    }
  }, [position.x]);

  // Show tooltip on first play
  useEffect(() => {
    if (isPlaying && !hasShownTooltipRef.current) {
      hasShownTooltipRef.current = true;
      setShowTooltip(true);

      // Hide after 7 seconds
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [isPlaying]);

  const handleMouseDown = (e) => {
    if (!widgetRef.current) return;

    // Hide tooltip when dragging starts
    setShowTooltip(false);

    const rect = widgetRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !widgetRef.current) return;

    const rect = widgetRef.current.getBoundingClientRect();
    let newX = e.clientX - dragOffset.x;
    let newY = e.clientY - dragOffset.y;

    // Keep within viewport bounds
    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - rect.height;

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e) => {
    if (!widgetRef.current) return;

    // Hide tooltip when dragging starts
    setShowTooltip(false);

    const touch = e.touches[0];
    const rect = widgetRef.current.getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !widgetRef.current) return;

    e.preventDefault(); // Prevent scrolling while dragging
    const touch = e.touches[0];
    const rect = widgetRef.current.getBoundingClientRect();
    let newX = touch.clientX - dragOffset.x;
    let newY = touch.clientY - dragOffset.y;

    // Keep within viewport bounds
    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - rect.height;

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    setPosition({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragOffset]);

  if (!isPlaying || !trackTitle) return null;

  return (
    <>
      {/* Tooltip - "move me :)" */}
      {showTooltip && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: position.x !== null ? `${position.x + 20}px` : 'calc(50% + 20px)',
            top: position.y !== null ? `${position.y - 60}px` : 'auto',
            bottom: position.y === null ? 'calc(32px + 100px)' : 'auto',
            transform: position.x === null ? 'translateX(-50%)' : 'none',
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <div className="relative">
            <div
              className="px-4 py-2 rounded-full text-sm font-medium"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 200, 255, 0.9), rgba(150, 100, 255, 0.9))',
                boxShadow: '0 4px 12px rgba(0, 200, 255, 0.4), 0 0 20px rgba(0, 200, 255, 0.2)',
                color: 'white',
                backdropFilter: 'blur(10px)'
              }}
            >
              move me :)
            </div>
            {/* Arrow pointing down */}
            <div
              className="absolute left-1/2 transform -translate-x-1/2"
              style={{
                top: '100%',
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid rgba(0, 200, 255, 0.9)'
              }}
            />
          </div>
        </div>
      )}

      <div
        ref={widgetRef}
        className="fixed z-50 w-full max-w-3xl px-4"
        style={{
          left: position.x !== null ? `${position.x}px` : '50%',
          top: position.y !== null ? `${position.y}px` : 'auto',
          bottom: position.y === null ? '32px' : 'auto',
          transform: position.x === null ? 'translateX(-50%)' : 'none',
          cursor: isDragging ? 'grabbing' : 'grab',
          transition: isDragging ? 'none' : 'box-shadow 0.3s ease'
        }}
      >
        {/* WMP Mini Player Chrome Rim */}
        <div
        className="neon-card-rounded"
        style={{ padding: '2px' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="neon-card-rounded-inner px-6 py-4 relative"
          style={{
            background: 'linear-gradient(180deg, rgba(30, 20, 60, 0.85) 0%, rgba(25, 15, 50, 0.9) 100%)',
            boxShadow: isDragging
              ? 'inset 0 2px 3px rgba(0, 200, 255, 0.15), inset 0 -1px 2px rgba(0, 0, 0, 0.3), 0 8px 32px rgba(0, 0, 0, 0.5)'
              : 'inset 0 2px 3px rgba(0, 200, 255, 0.15), inset 0 -1px 2px rgba(0, 0, 0, 0.3)',
            userSelect: 'none',
            WebkitUserSelect: 'none'
          }}>
          {/* Drag Handle Indicator */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex gap-1 opacity-40 pointer-events-none">
            <div className="w-1 h-1 rounded-full bg-white"></div>
            <div className="w-1 h-1 rounded-full bg-white"></div>
            <div className="w-1 h-1 rounded-full bg-white"></div>
          </div>

          <div className="flex items-center gap-4">
            {/* Mini Album Art with Neon Border */}
            <div
              className="relative w-14 h-14 rounded-xl p-0.5 flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #FF00C8, #00C8FF)',
                boxShadow: '0 0 15px rgba(0, 200, 255, 0.5), 0 0 30px rgba(255, 0, 200, 0.3)'
              }}
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image
                  src="/devin-fox-artist.jpg"
                  alt="Now Playing"
                  width={56}
                  height={56}
                  className="rounded-xl object-cover w-full h-full"
                />
              </div>
            </div>

            {/* Now Playing Text with Marquee */}
            <div className="flex-1 overflow-hidden min-w-0">
              <div className="text-xs text-cyan-400 mb-1 font-medium" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                Now Playing :
              </div>
              <div className="overflow-hidden">
                <div className="marquee-text text-white font-medium text-base">
                  {trackTitle} — Devin Fox&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{trackTitle} — Devin Fox
                </div>
              </div>
            </div>

            {/* Progress Bar Placeholder */}
            <div className="hidden md:flex flex-1 h-1.5 rounded-full overflow-hidden max-w-xs"
              style={{
                background: 'rgba(100, 100, 150, 0.3)',
                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.5)'
              }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: '60%',
                  background: 'linear-gradient(90deg, #FF00C8, #00C8FF)',
                  boxShadow: '0 0 10px rgba(0, 200, 255, 0.6)'
                }}
              />
            </div>

            {/* Neon Equalizer Bars */}
            <div className="flex items-end space-x-1.5 h-8 flex-shrink-0">
              <div
                className="equalizer-bar w-1.5 rounded-t"
                style={{
                  minHeight: '6px',
                  background: 'linear-gradient(to top, #00C8FF, #00FFFF)',
                  boxShadow: '0 0 8px rgba(0, 200, 255, 0.6)'
                }}
              ></div>
              <div
                className="equalizer-bar w-1.5 rounded-t"
                style={{
                  minHeight: '6px',
                  background: 'linear-gradient(to top, #FF00C8, #FF6B9D)',
                  boxShadow: '0 0 8px rgba(255, 0, 200, 0.6)'
                }}
              ></div>
              <div
                className="equalizer-bar w-1.5 rounded-t"
                style={{
                  minHeight: '6px',
                  background: 'linear-gradient(to top, #00C8FF, #00FFFF)',
                  boxShadow: '0 0 8px rgba(0, 200, 255, 0.6)'
                }}
              ></div>
              <div
                className="equalizer-bar w-1.5 rounded-t"
                style={{
                  minHeight: '6px',
                  background: 'linear-gradient(to top, #FF00C8, #FF6B9D)',
                  boxShadow: '0 0 8px rgba(255, 0, 200, 0.6)'
                }}
              ></div>
              <div
                className="equalizer-bar w-1.5 rounded-t"
                style={{
                  minHeight: '6px',
                  background: 'linear-gradient(to top, #00C8FF, #00FFFF)',
                  boxShadow: '0 0 8px rgba(0, 200, 255, 0.6)'
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default NowPlayingWidget;
