import React, { useState, useEffect } from 'react';
import { Home, Trophy, Calendar, BookOpen, Megaphone, Heart, UserCheck } from 'lucide-react';

interface NavigationProps {
  currentPage: 'main' | 'registration' | 'results' | 'schedule' | 'news' | 'donation';
  onNavigate: (page: 'main' | 'registration' | 'results' | 'schedule' | 'news' | 'donation') => void;
  isDarkMode?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate, isDarkMode = false }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    {
      id: 'main',
      label: 'الصفحة الرئيسية',
      icon: Home,
      gradient: 'from-green-500 to-emerald-600',
      hoverGradient: 'hover:from-green-600 hover:to-emerald-700'
    },
    {
      id: 'registration',
      label: 'البحث عن التسجيل',
      icon: UserCheck,
      gradient: 'from-emerald-500 to-green-600',
      hoverGradient: 'hover:from-emerald-600 hover:to-green-700'
    },
    {
      id: 'schedule',
      label: 'جدول الاختبارات',
      icon: Calendar,
      gradient: 'from-blue-500 to-purple-600',
      hoverGradient: 'hover:from-blue-600 hover:to-purple-700'
    },
    {
      id: 'results',
      label: 'النتائج',
      icon: Trophy,
      gradient: 'from-purple-500 to-pink-600',
      hoverGradient: 'hover:from-purple-600 hover:to-pink-700'
    },
    {
      id: 'news',
      label: 'آخر الأخبار',
      icon: Megaphone,
      gradient: 'from-orange-500 to-red-600',
      hoverGradient: 'hover:from-orange-600 hover:to-red-700'
    },
    {
      id: 'donation',
      label: 'التبرعات',
      icon: Heart,
      gradient: 'from-red-500 to-pink-600',
      hoverGradient: 'hover:from-red-600 hover:to-pink-700'
    }
  ];

  return (
    <nav className={`backdrop-blur-md shadow-xl border-b sticky top-0 z-40 transition-all duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    } ${
      isDarkMode 
        ? 'bg-gray-900/95 border-gray-700' 
        : 'bg-white/95 border-gray-200'
    }`}>
      <div className="container mx-auto px-4 py-4">
        {/* Logo/Title section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              isDarkMode 
                ? 'bg-gradient-to-r from-gray-600 to-gray-500' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600'
            }`}>
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>مسابقة المولد النبوي</h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>دار المناسبات الشرقيه - دمليج</p>
            </div>
          </div>
          
          {/* Quick stats */}
          <div className={`hidden md:flex items-center gap-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>المسابقة نشطة</span>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as 'main' | 'registration' | 'results' | 'schedule' | 'news' | 'donation')}
                className={`
                  group relative px-6 py-3 rounded-xl font-semibold text-sm md:text-base
                  transition-all duration-300 transform hover:scale-105 hover:-translate-y-1
                  ${isActive 
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg` 
                    : isDarkMode
                    ? `bg-gray-800 text-gray-300 hover:bg-gray-700 ${item.hoverGradient} hover:text-white`
                    : `bg-gray-100 text-gray-700 hover:bg-gray-200 ${item.hoverGradient} hover:text-white`
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${isActive ? 'animate-bounce-slow' : 'group-hover:animate-bounce'}`} />
                  <span>{item.label}</span>
                </div>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full animate-pulse"></div>
                )}
                
                {/* Hover glow effect */}
                <div className={`
                  absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  bg-gradient-to-r ${item.gradient} blur-xl -z-10
                `}></div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};