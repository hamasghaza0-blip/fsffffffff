import React from 'react';
import { Trophy, Users, Award, Sparkles } from 'lucide-react';

interface HeaderProps {
  isDarkMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode = false }) => {
  return (
    <header className={`text-white relative overflow-hidden transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900' 
        : 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800'
    }`}>
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-sparkle absolute top-10 left-10 text-yellow-300 opacity-70">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="floating-sparkle absolute top-20 right-20 text-white opacity-50" style={{ animationDelay: '1s' }}>
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="floating-sparkle absolute bottom-20 left-1/4 text-yellow-200 opacity-60" style={{ animationDelay: '2s' }}>
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="floating-sparkle absolute bottom-10 right-1/3 text-white opacity-40" style={{ animationDelay: '0.5s' }}>
          <Sparkles className="w-3 h-3" />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="flex justify-center items-center gap-3 mb-4 animate-slideInDown">
            <Trophy className="w-12 h-12 text-yellow-300 animate-bounce-slow trophy-glow" />
            <h1 className="text-4xl md:text-5xl font-bold gradient-text-animated glowing-text">
              مسابقه المولد النبوي الشريف بدار المناسبات الشرقيه
            </h1>
            <Trophy className="w-12 h-12 text-yellow-300 animate-bounce-slow trophy-glow" style={{ animationDelay: '0.5s' }} />
          </div>
          <p className="text-xl md:text-2xl text-blue-100 mb-6 animate-slideInUp subtitle-glow">
            مسابقه القران الكريم بدار المناسبات الشرقيه لعام ٢٠٢٥
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base animate-fadeInScale">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full hover-glow animate-pulse-soft">
              <Users className="w-5 h-5" />
              <span>مشاركون من جميع المراحل</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full hover-glow animate-pulse-soft" style={{ animationDelay: '0.3s' }}>
              <Award className="w-5 h-5" />
              <span>جوائز قيمة للفائزين</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quran Verse */}
      <div className="bg-gradient-to-r from-yellow-400/20 via-white/10 to-yellow-400/20 border-t border-yellow-300/30 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xl md:text-2xl text-yellow-200 font-bold glowing-text-main mb-2">
            "وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا"
          </p>
          <p className="text-yellow-300/80 text-sm">
            صدق الله العظيم - سورة المزمل
          </p>
        </div>
      </div>
    </header>
  );
};