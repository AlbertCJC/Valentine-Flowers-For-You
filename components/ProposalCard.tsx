import React, { useState, useRef, useCallback } from 'react';
import HeartIcon from './HeartIcon';

interface ProposalCardProps {
  onAccept: () => void;
}

const ProposalCard: React.FC<ProposalCardProps> = ({ onAccept }) => {
  // Start with empty style so it sits naturally in the flexbox
  const [noButtonStyle, setNoButtonStyle] = useState<React.CSSProperties>({});
  const [placeholderStyle, setPlaceholderStyle] = useState<React.CSSProperties>({});
  
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const teleportButton = useCallback(() => {
    const button = noButtonRef.current;
    const card = cardRef.current;
    if (!button || !card) return;

    // 1. If this is the FIRST hover, we need to create a placeholder
    // to keep the "Yes" button from shifting when "No" runs away.
    if (noButtonStyle.position !== 'fixed') {
      const rect = button.getBoundingClientRect();
      setPlaceholderStyle({
        width: rect.width,
        height: rect.height,
      });
    }

    // 2. Calculate standard teleport logic
    const cardRect = card.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const areaSize = 300; // Teleport area size
    const margin = 20;    // Screen margin

    // Screen boundaries
    const screenBounds = {
      minX: margin,
      maxX: window.innerWidth - buttonRect.width - margin,
      minY: margin,
      maxY: window.innerHeight - buttonRect.height - margin,
    };

    // Teleport area boundaries around the card
    const areaCenterX = cardRect.left + cardRect.width / 2;
    const areaCenterY = cardRect.top + cardRect.height / 2;
    const teleportArea = {
      minX: areaCenterX - areaSize / 2,
      maxX: areaCenterX + areaSize / 2 - buttonRect.width,
      minY: areaCenterY - areaSize / 2,
      maxY: areaCenterY + areaSize / 2 - buttonRect.height,
    };

    // Valid zone intersection
    const validZone = {
      minX: Math.max(screenBounds.minX, teleportArea.minX),
      maxX: Math.min(screenBounds.maxX, teleportArea.maxX),
      minY: Math.max(screenBounds.minY, teleportArea.minY),
      maxY: Math.min(screenBounds.maxY, teleportArea.maxY),
    };

    // Calculate range
    const rangeX = validZone.maxX - validZone.minX;
    const rangeY = validZone.maxY - validZone.minY;

    // Fallback if zone is invalid
    if (rangeX < 0 || rangeY < 0) {
      const fallbackX = screenBounds.minX + Math.random() * (screenBounds.maxX - screenBounds.minX);
      const fallbackY = screenBounds.minY + Math.random() * (screenBounds.maxY - screenBounds.minY);
      
      setNoButtonStyle({
        position: 'fixed', // Ensure it switches to fixed
        top: fallbackY,
        left: fallbackX,
        transition: 'all 0.2s ease', // Smooth movement
      });
      return;
    }

    // Generate random position
    const newLeft = validZone.minX + Math.random() * rangeX;
    const newTop = validZone.minY + Math.random() * rangeY;

    setNoButtonStyle({
      position: 'fixed', // Ensure it switches to fixed
      top: newTop,
      left: newLeft,
      transition: 'all 0.2s ease', // Smooth movement
    });

  }, [noButtonStyle.position]);

  return (
    <div ref={cardRef} className="relative bg-white/70 backdrop-blur-md p-6 sm:p-8 md:p-12 rounded-3xl shadow-2xl text-center flex flex-col items-center w-full max-w-lg">
      <div className="text-pink-500 mb-4">
        <HeartIcon className="w-16 h-16 md:w-24 md:h-24 animate-pulse" />
      </div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6">
        Will you be my Valentine?
      </h1>
      
      <div className="flex flex-row flex-nowrap items-center justify-center gap-4 w-full">
        <button
          onClick={onAccept}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-110"
        >
          Yes
        </button>
        
        {/* Placeholder keeps the layout stable after the button leaves */}
        <div style={placeholderStyle}>
          <button
            ref={noButtonRef}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all"
            style={noButtonStyle}
            onMouseEnter={teleportButton}
            onTouchStart={(e) => {
              e.preventDefault();
              teleportButton();
            }}
            onClick={teleportButton} // Backup click handler
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProposalCard;