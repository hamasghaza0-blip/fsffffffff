import React, { useState } from 'react';
import { Result } from '../types';
import { ChevronDown, ChevronUp, List, Filter, Clock, Calendar, AlertCircle, Lock, X } from 'lucide-react';
import { getCategoryColor, getGradeColor } from '../utils/contestStats';
import { supabase, isSupabaseConfigured, handleSupabaseError, testSupabaseConnection } from '../utils/supabase';

interface AllResultsSectionProps {
  isDarkMode?: boolean;
}

export const AllResultsSection: React.FC<AllResultsSectionProps> = ({ isDarkMode = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  const correctPassword = '159200209Aa?';
  
  // حساب الترتيب داخل كل فئة
  const calculateRanksInCategories = (results: any[]) => {
    const categorizedResults: { [key: string]: any[] } = {};
    
    // تجميع النتائج حسب الفئة
    results.forEach(result => {
      const category = result.category?.toString() || 'غير محدد';
      if (!categorizedResults[category]) {
        categorizedResults[category] = [];
      }
      categorizedResults[category].push(result);
    });
    
    // ترتيب كل فئة وإضافة الترتيب
    const rankedResults: Result[] = [];
    Object.keys(categorizedResults).forEach(category => {
      const categoryResults = categorizedResults[category]
        .sort((a, b) => (b.grade || 0) - (a.grade || 0))
        .map((item, index) => ({
          id: item.no,
          name: item.name,
          category: item.category?.toString() || 'غير محدد',
          grade: item.grade || 0,
          rank: index + 1,
          no: item.no
        }));
      
      rankedResults.push(...categoryResults);
    });
    
    return rankedResults;
  };
  
  // جلب النتائج من Supabase
  const fetchResults = async () => {
    // Test connection first
    const connectionOk = await testSupabaseConnection();
    if (!connectionOk) {
      console.error('Cannot connect to database');
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('results')
        .select('*')
        .order('category', { ascending: true })
        .order('grade', { ascending: false });

      if (error) {
        const errorMessage = handleSupabaseError(error);
        console.error('Error fetching results:', errorMessage);
        setResults([]);
        return;
      }

      // تحويل البيانات وحساب الترتيب داخل كل فئة
      const formattedResults = calculateRanksInCategories(data || []);

      setResults(formattedResults);
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      console.error('Error fetching results:', errorMessage);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const categories = [...new Set(results.map(r => r.category))];
  const filteredResults = selectedCategory === 'all' 
    ? results 
    : results.filter(r => r.category === selectedCategory);

  const handleExpand = () => {
    if (!isExpanded) {
      if (!isAuthenticated) {
        setShowPasswordModal(true);
      } else if (results.length === 0) {
        fetchResults();
        setIsExpanded(true);
      } else {
        setIsExpanded(true);
      }
    } else {
      setIsExpanded(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setShowPasswordModal(false);
      setPasswordError('');
      setPassword('');
      if (results.length === 0) {
        fetchResults();
      }
      setIsExpanded(true);
    } else {
      setPasswordError('كلمة المرور غير صحيحة');
      setPassword('');
    }
  };

  const handleCloseModal = () => {
    setShowPasswordModal(false);
    setPassword('');
    setPasswordError('');
  };

  return (
    <section className={`py-16 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <button
            onClick={handleExpand}
            className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-3 mx-auto font-semibold text-lg transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
          >
            <List className="w-6 h-6 group-hover:animate-bounce" />
            عرض جميع النتائج
            {isExpanded ? <ChevronUp className="w-5 h-5 group-hover:animate-bounce" /> : <ChevronDown className="w-5 h-5 group-hover:animate-bounce" />}
          </button>
        </div>

        {/* Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 border-2 border-gray-600/50' 
                : 'bg-gradient-to-br from-white via-blue-50 to-purple-50 border-2 border-blue-200'
            }`}>
              {/* Close button */}
              <button
                onClick={handleCloseModal}
                className={`absolute top-4 left-4 z-10 p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800'
                }`}
              >
                <X className="w-5 h-5" />
              </button>

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
                    منطقة الإدمن
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    أدخل كلمة المرور لعرض جميع النتائج
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

                  {passwordError && (
                    <div className={`p-4 rounded-xl border-2 text-center animate-fadeIn ${
                      isDarkMode 
                        ? 'bg-red-900/30 border-red-600/50 text-red-300' 
                        : 'bg-red-100 border-red-300 text-red-700'
                    }`}>
                      <div className="flex items-center justify-center gap-2">
                        <X className="w-5 h-5" />
                        <span className="font-semibold">{passwordError}</span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold transform hover:scale-105 hover:shadow-xl"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Lock className="w-5 h-5" />
                      دخول
                    </div>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {isExpanded && (
          <div className="animate-fadeIn">
            {results.length === 0 ? (
              /* No results message */
              <div className="max-w-2xl mx-auto">
                <div className={`border-2 rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-orange-900/20 via-yellow-900/20 to-amber-900/20 border-orange-600/50' 
                    : 'bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 border-orange-200'
                }`}>
                  {/* Background decorative elements */}
                  <div className={`absolute top-4 right-4 opacity-30 ${isDarkMode ? 'text-orange-400' : 'text-orange-200'}`}>
                    <Clock className="w-16 h-16 animate-spin-slow" />
                  </div>
                  <div className={`absolute bottom-4 left-4 opacity-20 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-200'}`}>
                    <Calendar className="w-12 h-12 animate-bounce-slow" />
                  </div>
                  
                  <div className="text-center relative z-10">
                    <div className="flex justify-center items-center gap-3 mb-6">
                      <AlertCircle className={`w-12 h-12 animate-pulse ${isDarkMode ? 'text-orange-400' : 'text-orange-500'}`} />
                      <Clock className={`w-12 h-12 animate-tick ${isDarkMode ? 'text-amber-400' : 'text-amber-500'}`} />
                    </div>
                    
                    <h3 className={`text-3xl md:text-4xl font-bold mb-4 animate-fadeInScale ${isDarkMode ? 'text-orange-200' : 'text-orange-800'}`}>
                      لا توجد نتائج متاحة حالياً
                    </h3>
                    
                    <div className={`backdrop-blur-sm rounded-2xl p-6 mb-6 border transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-800/70 border-orange-600/30' 
                        : 'bg-white/70 border-orange-100'
                    }`}>
                      <p className={`text-lg md:text-xl leading-relaxed mb-4 ${isDarkMode ? 'text-orange-200' : 'text-orange-700'}`}>
                        قد تكون النتائج لم تُرفع بعد أو هناك مشكلة في التحميل
                      </p>
                      <p className={`font-semibold ${isDarkMode ? 'text-orange-300' : 'text-orange-600'}`}>
                        يرجى المحاولة مرة أخرى أو التواصل مع إدارة المسابقة
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className={`p-4 rounded-xl border transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gradient-to-r from-blue-900/30 to-blue-800/30 border-blue-600/50' 
                          : 'bg-gradient-to-r from-blue-100 to-blue-200 border-blue-200'
                      }`}>
                        <Calendar className={`w-8 h-8 mx-auto mb-2 animate-bounce-slow ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>البحث الفردي</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>جرب البحث عن اسمك أعلاه</p>
                      </div>
                      
                      <div className={`p-4 rounded-xl border transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gradient-to-r from-green-900/30 to-green-800/30 border-green-600/50' 
                          : 'bg-gradient-to-r from-green-100 to-green-200 border-green-200'
                      }`}>
                        <AlertCircle className={`w-8 h-8 mx-auto mb-2 animate-pulse ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                        <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-green-200' : 'text-green-800'}`}>تواصل معنا</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>للاستفسار عن النتائج</p>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-amber-600/50' 
                          : 'bg-gradient-to-r from-amber-100 to-orange-100 border-amber-200'
                      }`}>
                        <Clock className={`w-5 h-5 animate-tick ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                        <span className={`font-semibold ${isDarkMode ? 'text-amber-200' : 'text-amber-800'}`}>النتائج متاحة للبحث الفردي أعلاه</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Filter section */}
                {categories.length > 0 && (
                <div className={`p-6 rounded-xl mb-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-4 justify-center flex-wrap">
                    <Filter className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`px-4 py-2 rounded-full transition-all ${
                        selectedCategory === 'all' 
                          ? 'bg-blue-600 text-white' 
                          : isDarkMode
                          ? 'bg-gray-600 text-blue-400 hover:bg-gray-500'
                          : 'bg-white text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      جميع الفئات
                    </button>
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full transition-all ${
                          selectedCategory === category 
                            ? 'bg-blue-600 text-white' 
                            : isDarkMode
                            ? 'bg-gray-600 text-blue-400 hover:bg-gray-500'
                            : 'bg-white text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                )}

                {/* Results table */}
                <div className={`rounded-2xl shadow-lg overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        <tr>
                          <th className="px-6 py-4 text-center">الترتيب في الفئة</th>
                          <th className="px-6 py-4 text-center">الاسم</th>
                          <th className="px-6 py-4 text-center">رقم الطالب</th>
                          <th className="px-6 py-4 text-center">الفئة</th>
                          <th className="px-6 py-4 text-center">الدرجة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredResults.map((result, index) => (
                          <tr key={result.id} className={`border-b transition-colors ${
                            isDarkMode 
                              ? 'border-gray-600 hover:bg-gray-600' 
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}>
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                                result.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                                result.rank === 2 ? 'bg-gray-100 text-gray-800' :
                                result.rank === 3 ? 'bg-amber-100 text-amber-800' :
                                isDarkMode ? 'bg-blue-900/50 text-blue-200' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {result.rank}
                              </span>
                            </td>
                            <td className={`px-6 py-4 text-center font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                              {result.name}
                            </td>
                            <td className={`px-6 py-4 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {result.no || result.id}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(result.category, isDarkMode)}`}>
                                {result.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-block px-3 py-1 rounded-lg font-bold text-lg ${getGradeColor(result.grade, isDarkMode)}`}>
                                {result.grade}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className={`p-4 text-center transition-colors duration-300 ${
                    isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-50 text-gray-600'
                  }`}>
                    إجمالي النتائج: {filteredResults.length} نتيجة
                  </div>
                </div>
              </>
            )}
            
            {/* Quran Verse */}
            <div className={`border rounded-2xl p-6 mt-8 text-center transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-600/50' 
                : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
            }`}>
              <p className={`text-xl md:text-2xl font-bold mb-2 ${isDarkMode ? 'text-yellow-200' : 'text-yellow-800'}`} style={{
                textShadow: '0 0 10px rgba(255, 193, 7, 0.5), 0 0 20px rgba(255, 193, 7, 0.3)'
              }}>
                "وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا"
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                صدق الله العظيم - سورة المزمل
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};