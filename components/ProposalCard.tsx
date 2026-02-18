import React, { useState, useRef, useCallback } from 'react';
import HeartIcon from './HeartIcon';

interface ProposalCardProps {
  onAccept: () => void;
}

const SAD_MESSAGES = [
  { emoji: '😢', text: "You don't like me?" },
  { emoji: '🥺', text: 'Are you sure?' },
  { emoji: '😭', text: 'Please reconsider!' },
  { emoji: '💔', text: 'My heart...' },
  { emoji: '😥', text: 'Is it my breath?' },
  { emoji: '🤔', text: 'Bad date idea?' },
  { emoji: '👀', text: 'Just click yes...' },
  { emoji: '🙏', text: 'I can change!' },
];


const ProposalCard: React.FC<ProposalCardProps> = ({ onAccept }) => {
  // Start with empty style so it sits naturally in the flexbox
  const [noButtonStyle, setNoButtonStyle] = useState<React.CSSProperties>({});
  const [placeholderStyle, setPlaceholderStyle] = useState<React.CSSProperties>({});
  const [noClickCount, setNoClickCount] = useState(0);
  
  // State for the message left behind at the button's old position
  const [ghostMessage, setGhostMessage] = useState<{
    render: boolean;
    show: boolean;
    emoji: string;
    text: string;
    top: number;
    left: number;
  }>({ render: false, show: false, emoji: '', text: '', top: 0, left: 0 });

  const noButtonRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const messageTimeoutRef = useRef<number | null>(null);
  const unmountTimeoutRef = useRef<number | null>(null);

  const teleportButton = useCallback(() => {
    const button = noButtonRef.current;
    const card = cardRef.current;
    if (!button || !card) return;

    // 1. Capture the button's exact position before it moves
    const oldRect = button.getBoundingClientRect();

    // 2. Clear any pending timeouts to prevent overlapping animations
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    if (unmountTimeoutRef.current) clearTimeout(unmountTimeoutRef.current);

    // 3. Immediately start hiding any previous ghost message
    setGhostMessage(prev => ({ ...prev, show: false }));

    const newClickCount = noClickCount + 1;
    setNoClickCount(newClickCount);

    // 4. On every move, create a new ghost message
    const messageIndex = (newClickCount - 1) % SAD_MESSAGES.length;
    const { emoji, text } = SAD_MESSAGES[messageIndex];
    
    // Set the message to be rendered, then trigger the fade-in transition
    setGhostMessage({
      render: true,
      show: false, // Will be set to true right after to trigger transition
      emoji, text,
      top: oldRect.top,
      left: oldRect.left,
    });
    
    requestAnimationFrame(() => {
      setGhostMessage(prev => ({...prev, show: true}));
    });

    // Set a timer to start fading out the message
    messageTimeoutRef.current = window.setTimeout(() => {
      setGhostMessage(prev => ({ ...prev, show: false }));
      // And another timer to remove it from the DOM after the fade-out
      unmountTimeoutRef.current = window.setTimeout(() => {
        setGhostMessage(prev => ({ ...prev, render: false }));
      }, 500); // This must match the CSS transition duration
    }, 2000);


    // 5. Create a placeholder to prevent layout shifts
    if (noButtonStyle.position !== 'fixed') {
      setPlaceholderStyle({
        width: oldRect.width,
        height: oldRect.height,
      });
    }

    // 6. Calculate the new position for the button and teleport it
    const cardRect = card.getBoundingClientRect();
    const buttonRect = oldRect; // Use the captured position
    const areaSize = 300;
    const margin = 20;

    const screenBounds = {
      minX: margin,
      maxX: window.innerWidth - buttonRect.width - margin,
      minY: margin,
      maxY: window.innerHeight - buttonRect.height - margin,
    };

    const areaCenterX = cardRect.left + cardRect.width / 2;
    const areaCenterY = cardRect.top + cardRect.height / 2;
    const teleportArea = {
      minX: areaCenterX - areaSize / 2,
      maxX: areaCenterX + areaSize / 2 - buttonRect.width,
      minY: areaCenterY - areaSize / 2,
      maxY: areaCenterY + areaSize / 2 - buttonRect.height,
    };

    const validZone = {
      minX: Math.max(screenBounds.minX, teleportArea.minX),
      maxX: Math.min(screenBounds.maxX, teleportArea.maxX),
      minY: Math.max(screenBounds.minY, teleportArea.minY),
      maxY: Math.min(screenBounds.maxY, teleportArea.maxY),
    };

    const rangeX = validZone.maxX - validZone.minX;
    const rangeY = validZone.maxY - validZone.minY;

    let newLeft: number, newTop: number;
    if (rangeX < 0 || rangeY < 0) {
      newLeft = screenBounds.minX + Math.random() * (screenBounds.maxX - screenBounds.minX);
      newTop = screenBounds.minY + Math.random() * (screenBounds.maxY - screenBounds.minY);
    } else {
      newLeft = validZone.minX + Math.random() * rangeX;
      newTop = validZone.minY + Math.random() * rangeY;
    }

    setNoButtonStyle({
      position: 'fixed',
      top: newTop,
      left: newLeft,
      transition: 'all 0.2s ease',
    });

  }, [noButtonStyle.position, noClickCount]);

  return (
    <>
      {/* The message left behind at the button's previous position */}
      {ghostMessage.render && (
        <div
          className={`fixed flex items-center justify-center bg-red-500 text-white font-bold py-3 px-6 rounded-full shadow-lg text-center transition-opacity duration-500 z-50 pointer-events-none whitespace-nowrap ${ghostMessage.show ? 'opacity-90' : 'opacity-0'}`}
          style={{
            top: `${ghostMessage.top}px`,
            left: `${ghostMessage.left}px`,
          }}
        >
          {ghostMessage.emoji} {ghostMessage.text}
        </div>
      )}

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
    </>
  );
};

export default ProposalCard;