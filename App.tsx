
import React, { useState, useEffect } from 'react';
import ProposalCard from './components/ProposalCard';
import SuccessScreen from './components/SuccessScreen';
import './flower.css';

const App: React.FC = () => {
  const [isAccepted, setIsAccepted] = useState(false);

  // This effect manages the global side-effect of the 'not-loaded' class on the body,
  // which controls when the flower animations start.
  useEffect(() => {
    if (isAccepted) {
      // When the proposal is accepted, we wait a moment before starting the animations.
      const timer = setTimeout(() => {
        document.body.classList.remove('not-loaded');
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // On initial load, ensure the animations are paused.
      document.body.classList.add('not-loaded');
    }
  }, [isAccepted]);

  return (
    <main className={`relative w-screen h-screen font-sans ${
        !isAccepted ? 'bg-gradient-to-br from-pink-200 via-rose-200 to-red-300' : 'bg-transparent'
    }`}>
      {/* Success screen container: Always in the DOM, visibility controlled by opacity */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in ${isAccepted ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
        aria-hidden={!isAccepted}
      >
        {isAccepted && <SuccessScreen />}
      </div>

      {/* Proposal card container: Centered with flex, visibility controlled by opacity */}
      <div
        className={`w-full h-full flex items-center justify-center px-4 transition-opacity duration-500 ease-out ${isAccepted ? 'opacity-0' : 'opacity-100'}`}
        aria-hidden={isAccepted}
      >
        {!isAccepted && <ProposalCard onAccept={() => setIsAccepted(true)} />}
      </div>
    </main>
  );
};

export default App;