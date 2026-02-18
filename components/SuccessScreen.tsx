
import React from 'react';
import FlowerAnimation from './FlowerAnimation';

const SuccessScreen: React.FC = () => {

  return (
    <div className="absolute inset-0 overflow-hidden">
      <FlowerAnimation />
      <div className="absolute z-20 text-center p-8 bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg animate-fade-in anim-delay-6000 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-rose-600 animate-pulse">
            Yes!
          </h2>
          <p className="text-gray-700 mt-2 text-lg">Happy Valentine's Day!</p>
        </div>

        <style>{`
          .animate-fade-in {
            animation: fadeIn 1s ease-in-out forwards;
            opacity: 0;
          }
          .anim-delay-6000 {
            animation-delay: 6000ms;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
    </div>
  );
};

export default SuccessScreen;