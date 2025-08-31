import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Home, 
  Trophy, 
  Calendar, 
  BookOpen, 
  Megaphone, 
  Heart, 
  UserCheck,
  ChevronDown
} from 'lucide-react';

interface NavigationDropdownProps {
  currentPage: 'main' | 'registration' | 'results' | 'schedule' | 'news' | 'donation';
  onNavigate: (page: 'main' | 'registration' | 'results' | 'schedule' | 'news' | 'donation') => void;
  isDarkMode?: boolean;
}

export const NavigationDropdown: React.FC<NavigationDropdownProps> = ({ 
  currentPage, 
  onNavigate, 
  isDarkMode = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navItems = [
    {
      id: 'main',
      label: 'الصفحة الرئيسية',
      icon: Home,
      gradient: 'from-green-500 to-emerald-600',
      description: 'العودة للصفحة الرئيسية'
    },
    {
      id: 'registration',
      label: 'البحث عن التسجيل',
      icon: UserCheck,
      gradient: 'from-emerald-500 to-green-600',
      description: 'تحقق من تسجيلك في المسابقة'
    },
    {
      id: 'schedule',
      label: 'جدول الاختبارات',
      icon: Calendar,
      gradient: 'from-blue-500 to-purple-600',
      description: 'مواعيد الاختبارات والجدول الزمني'
    },
    {
      id: 'results',
      label: 'النتائج',
      icon: Trophy,
      gradient: 'from-purple-500 to-pink-600',
      description: 'نتائج المسابقة والترتيب'
    },
    {
      id: 'news',
      label: 'آخر الأخبار',
      icon: Megaphone,
      gradient: 'from-orange-500 to-red-600',
      description: 'أحدث الأخبار والإعلانات'
    },
    {
      id: 'donation',
      label: 'التبرعات',
      icon: Heart,
      gradient: 'from-red-500 to-pink-600',
      description: 'ساهم في دعم المسابقة'
    }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleNavigation = (pageId: string) => {
    onNavigate(pageId as 'main' | 'registration' | 'results' | 'schedule' | 'news' | 'donation');
    setIsOpen(false);
  };

  const getCurrentPageInfo = () => {
    return navItems.find(item => item.id === currentPage) || navItems[0];
  };

  const currentPageInfo = getCurrentPageInfo();

  return (
    <div className="fixed top-6 right-6 z-50" ref={dropdownRef}>
      {/* Navigation Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative p-4 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 hover:from-gray-700 hover:to-gray-800' 
            : 'bg-gradient-to-r from-white via-green-50 to-emerald-50 hover:from-green-50 hover:to-emerald-100'
        } border-2 ${
          isDarkMode ? 'border-gray-600/50' : 'border-green-200/50'
        } backdrop-blur-md hover:shadow-green-500/25`}
        title="قائمة التنقل"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
              : 'bg-gradient-to-r from-green-500 to-emerald-500'
          } group-hover:scale-110`}>
            {isOpen ? (
              <X className="w-6 h-6 text-white animate-spin" />
            ) : (
              <Menu className="w-6 h-6 text-white animate-pulse" />
            )}
          </div>
          
          <div className="hidden md:block text-right">
            <p className={`text-sm font-semibold ${
              isDarkMode ? 'text-gray-200' : 'text-gray-800'
            }`}>
              {currentPageInfo.label}
            </p>
            <p className={`text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              اضغط للتنقل
            </p>
          </div>
          
          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          } ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10"></div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm -z-10 animate-fadeIn" />
          
          {/* Menu */}
          <div className={`absolute top-full right-0 mt-4 w-96 rounded-3xl shadow-2xl overflow-hidden animate-slideInDown border-2 ${
            isDarkMode 
              ? 'bg-gray-800/95 border-gray-600/50' 
              : 'bg-white/95 border-green-200/50'
          } backdrop-blur-xl`}>
            {/* Header */}
            <div className={`p-6 border-b ${
              isDarkMode ? 'border-gray-700/50' : 'border-green-100/50'
            } bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-800'
                  }`}>
                    قائمة التنقل
                  </h3>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    اختر الصفحة المطلوبة
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 text-right group animate-slideInRight ${
                      isActive 
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg` 
                        : isDarkMode
                        ? 'bg-gray-700/50 hover:bg-gray-600/70 text-gray-300 hover:text-white'
                        : 'bg-green-50/50 hover:bg-green-100/70 text-gray-700 hover:text-gray-900'
                    } border-2 ${
                      isActive 
                        ? 'border-white/20' 
                        : isDarkMode 
                        ? 'border-gray-600/30 hover:border-green-500/50' 
                        : 'border-green-200/30 hover:border-green-400/50'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110 ${
                        isActive 
                          ? 'bg-white/20' 
                          : isDarkMode
                          ? 'bg-gray-600/50 group-hover:bg-green-600/50'
                          : 'bg-green-200/50 group-hover:bg-green-500/50'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          isActive 
                            ? 'text-white animate-bounce-slow' 
                            : isDarkMode
                            ? 'text-gray-300 group-hover:text-white'
                            : 'text-green-600 group-hover:text-white'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className={`text-lg font-bold mb-1 ${
                          isActive 
                            ? 'text-white' 
                            : isDarkMode
                            ? 'text-gray-200 group-hover:text-white'
                            : 'text-gray-800 group-hover:text-gray-900'
                        }`}>
                          {item.label}
                        </h4>
                        <p className={`text-sm ${
                          isActive 
                            ? 'text-white/80' 
                            : isDarkMode
                            ? 'text-gray-400 group-hover:text-gray-200'
                            : 'text-gray-600 group-hover:text-gray-700'
                        }`}>
                          {item.description}
                        </p>
                      </div>
                      
                      {isActive && (
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      )}
                    </div>
                    
                    {/* Hover glow effect */}
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r ${item.gradient} blur-xl -z-10`}></div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className={`p-4 border-t ${
              isDarkMode ? 'border-gray-700/50' : 'border-green-100/50'
            } bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-green-500/5`}>
              <div className="text-center">
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  مسابقة المولد النبوي الشريف
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className={`text-xs ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    دار المناسبات الشرقيه - دمليج
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};