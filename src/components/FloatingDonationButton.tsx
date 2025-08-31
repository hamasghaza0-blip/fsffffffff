import React from 'react';
import { Heart } from 'lucide-react';

interface FloatingDonationButtonProps {
  onNavigate: (page: 'donation') => void;
  isDarkMode?: boolean;
}

export const FloatingDonationButton: React.FC<FloatingDonationButtonProps> = ({ 
  onNavigate, 
  isDarkMode = false 
}) => {
  return (
    <button
      onClick={() => onNavigate('donation')}
      className={`fixed bottom-6 left-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 animate-pulse-soft ${
        isDarkMode 
          ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700' 
          : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
      } text-white hover:shadow-red-500/50`}
      title="تبرع الآن"
    >
      <div className="relative">
        <Heart className="w-6 h-6 animate-pulse" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
      </div>
    </button>
  );
};