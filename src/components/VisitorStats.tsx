import React, { useState, useEffect } from 'react';
import { Eye, Users, Calendar, Lock, Unlock, X, BarChart3, TrendingUp } from 'lucide-react';

interface VisitorStatsProps {
  isDarkMode?: boolean;
}

export const VisitorStats: React.FC<VisitorStatsProps> = ({ isDarkMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [visitorCount, setVisitorCount] = useState(0);
  const [todayVisitors, setTodayVisitors] = useState(0);
  const [weeklyVisitors, setWeeklyVisitors] = useState(0);

  const correctPassword = '159200209Aa?';

  useEffect(() => {
    // Track visitor count
    const trackVisitor = () => {
      const today = new Date().toDateString();
      const lastVisit = localStorage.getItem('lastVisit');
      const totalVisitors = parseInt(localStorage.getItem('totalVisitors') || '0');
      const todayVisitorsCount = parseInt(localStorage.getItem(`visitors_${today}`) || '0');
      const weekStart = getWeekStart();
      const weeklyVisitorsCount = parseInt(localStorage.getItem(`weekly_${weekStart}`) || '0');

      if (lastVisit !== today) {
        // New visitor for today
        const newTotal = totalVisitors + 1;
        const newTodayCount = todayVisitorsCount + 1;
        const newWeeklyCount = weeklyVisitorsCount + 1;

        localStorage.setItem('totalVisitors', newTotal.toString());
        localStorage.setItem(`visitors_${today}`, newTodayCount.toString());
        localStorage.setItem(`weekly_${weekStart}`, newWeeklyCount.toString());
        localStorage.setItem('lastVisit', today);

        setVisitorCount(newTotal);
        setTodayVisitors(newTodayCount);
        setWeeklyVisitors(newWeeklyCount);
      } else {
        setVisitorCount(totalVisitors);
        setTodayVisitors(todayVisitorsCount);
        setWeeklyVisitors(weeklyVisitorsCount);
      }
    };

    trackVisitor();
  }, []);

  const getWeekStart = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek;
    const weekStart = new Date(now.setDate(diff));
    return weekStart.toDateString();
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('غير مسموح لك - كلمة المرور خاطئة');
      setPassword('');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsAuthenticated(false);
    setPassword('');
    setError('');
  };

  return (
    <>
      {/* Stats Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 animate-pulse-soft ${
          isDarkMode 
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
            : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
        } text-white hover:shadow-purple-500/50`}
        title="إحصائيات الزوار"
      >
        <div className="relative">
          <BarChart3 className="w-6 h-6 animate-pulse" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
        </div>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 border-2 border-gray-600/50' 
              : 'bg-gradient-to-br from-white via-blue-50 to-purple-50 border-2 border-blue-200'
          }`}>
            {/* Close button */}
            <button
              onClick={handleClose}
              className={`absolute top-4 left-4 z-10 p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            {!isAuthenticated ? (
              /* Password Form */
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/50' 
                      : 'bg-gradient-to-r from-purple-100 to-blue-100'
                  }`}>
                    <Lock className={`w-10 h-10 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                    إحصائيات الزوار
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    أدخل كلمة المرور للوصول للإحصائيات
                  </p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <div className={`relative rounded-xl border-2 focus-within:border-purple-500 transition-colors ${
                      isDarkMode ? 'border-gray-600' : 'border-gray-200'
                    }`}>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="كلمة المرور..."
                        className={`w-full px-4 py-3 rounded-xl focus:outline-none transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-700 text-gray-100 placeholder-gray-400' 
                            : 'bg-white text-gray-900 placeholder-gray-500'
                        }`}
                        dir="ltr"
                      />
                      <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <Lock className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className={`p-4 rounded-xl border-2 text-center animate-fadeIn ${
                      isDarkMode 
                        ? 'bg-red-900/30 border-red-600/50 text-red-300' 
                        : 'bg-red-100 border-red-300 text-red-700'
                    }`}>
                      <div className="flex items-center justify-center gap-2">
                        <X className="w-5 h-5" />
                        <span className="font-semibold">{error}</span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold transform hover:scale-105 hover:shadow-xl"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Unlock className="w-5 h-5" />
                      دخول
                    </div>
                  </button>
                </form>
              </div>
            ) : (
              /* Stats Display */
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-green-900/50 to-blue-900/50' 
                      : 'bg-gradient-to-r from-green-100 to-blue-100'
                  }`}>
                    <BarChart3 className={`w-10 h-10 ${isDarkMode ? 'text-green-400' : 'text-green-600'} animate-pulse`} />
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                    إحصائيات الموقع
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    بيانات الزوار والمشاهدات
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Total Visitors */}
                  <div className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-600/50 hover:border-blue-500/70' 
                      : 'bg-gradient-to-r from-blue-100 to-purple-100 border-blue-300 hover:border-blue-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="text-right">
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>إجمالي الزوار</p>
                        <p className={`text-3xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          {visitorCount.toLocaleString('ar-EG')}
                        </p>
                      </div>
                      <div className={`p-3 rounded-full ${
                        isDarkMode ? 'bg-blue-800/50' : 'bg-blue-200'
                      }`}>
                        <Users className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      </div>
                    </div>
                  </div>

                  {/* Today's Visitors */}
                  <div className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-600/50 hover:border-green-500/70' 
                      : 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 hover:border-green-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="text-right">
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>زوار اليوم</p>
                        <p className={`text-3xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                          {todayVisitors.toLocaleString('ar-EG')}
                        </p>
                      </div>
                      <div className={`p-3 rounded-full ${
                        isDarkMode ? 'bg-green-800/50' : 'bg-green-200'
                      }`}>
                        <Eye className={`w-8 h-8 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                      </div>
                    </div>
                  </div>

                  {/* Weekly Visitors */}
                  <div className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-600/50 hover:border-purple-500/70' 
                      : 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300 hover:border-purple-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="text-right">
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>زوار هذا الأسبوع</p>
                        <p className={`text-3xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                          {weeklyVisitors.toLocaleString('ar-EG')}
                        </p>
                      </div>
                      <div className={`p-3 rounded-full ${
                        isDarkMode ? 'bg-purple-800/50' : 'bg-purple-200'
                      }`}>
                        <TrendingUp className={`w-8 h-8 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`mt-6 p-4 rounded-xl text-center ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-600/50' 
                    : 'bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300'
                }`}>
                  <p className={`text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                    آخر تحديث: {new Date().toLocaleString('ar-EG')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};