import React, { useState, useEffect } from 'react';
import { Search, User, CheckCircle, XCircle, Calendar, Phone, UserCheck, Clock, AlertTriangle, GraduationCap } from 'lucide-react';
import { Reciter } from '../types';
import { supabase } from '../utils/supabase';

interface RegistrationSearchProps {
  isDarkMode?: boolean;
}

export const RegistrationSearch: React.FC<RegistrationSearchProps> = ({ isDarkMode = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<Reciter | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [totalStudents, setTotalStudents] = useState(0);

  // دالة لتنظيف النص وإزالة الهمزات والمسافات الزائدة
  const normalizeText = (text: string): string => {
    return text
      .trim()
      .replace(/\s+/g, ' ') // استبدال المسافات المتعددة بمسافة واحدة
      .replace(/[أإآ]/g, 'ا') // توحيد الألف
      .replace(/[ىي]/g, 'ي') // توحيد الياء
      .replace(/ة/g, 'ه') // استبدال التاء المربوطة بالهاء
      .replace(/[ؤئ]/g, 'ء') // توحيد الهمزة
      .toLowerCase();
  };

  // دالة لتقسيم النص إلى كلمات للبحث المتقدم
  const getSearchTerms = (text: string): string[] => {
    const normalized = normalizeText(text);
    const words = normalized.split(' ').filter(word => word.length > 0);
    
    // إذا كان هناك كلمة واحدة فقط، نبحث بها إذا كانت 3 أحرف أو أكثر
    if (words.length === 1) {
      return words[0].length >= 3 ? [words[0]] : [];
    }
    
    // إذا كان هناك كلمتان أو أكثر، نأخذ أول كلمتين على الأقل
    if (words.length >= 2) {
      return words.slice(0, Math.max(2, words.length));
    }
    
    return words;
  };

  useEffect(() => {
    fetchTotalStudents();
  }, []);

  const fetchTotalStudents = async () => {
    try {
      const { count, error } = await supabase
        .from('reciters')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error fetching total students:', error);
        return;
      }

      setTotalStudents(count || 0);
    } catch (error) {
      console.error('Error fetching total students:', error);
    }
  };

  const handleSearch = async () => {
    // التحقق من أن الاسم يحتوي على 3 أحرف على الأقل
    const searchWords = getSearchTerms(searchTerm);
    
    // التحقق من وجود كلمتين على الأقل أو كلمة واحدة بطول 3 أحرف على الأقل
    if (searchWords.length === 0) {
      setSearchError('يجب كتابة الاسم الأول والثاني على الأقل أو اسم واحد بـ 3 أحرف على الأقل');
      setSearchResult(null);
      setSearchAttempted(false);
      return;
    }

    if (!searchTerm.trim()) {
      setSearchResult(null);
      setSearchAttempted(false);
      setSearchError('');
      return;
    }

    setSearchError('');
    setIsLoading(true);
    setSearchAttempted(false); // تأخير إظهار النتيجة حتى انتهاء البحث
    
    // إضافة تأخير أطول لضمان عدم إظهار النتيجة قبل انتهاء البحث
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // التحقق من وجود Supabase
      if (!supabase) {
        setSearchError('خدمة البحث غير متاحة حالياً');
        setSearchResult(null);
        return;
      }
      
      // البحث المتقدم: نبحث عن النتائج التي تحتوي على جميع الكلمات
      let query = supabase.from('reciters').select('*');
      
      // إضافة شروط البحث لكل كلمة
      searchWords.forEach((word, index) => {
        if (index === 0) {
          query = query.ilike('name', `%${word}%`);
        } else {
          query = query.ilike('name', `%${word}%`);
        }
      });
      
      const { data, error } = await query.limit(10); // نأخذ أول 10 نتائج للمطابقة

      if (error) {
        console.error('Search error:', error);
        setSearchResult(null);
        setSearchError('حدث خطأ أثناء البحث');
      } else {
        if (data && data.length > 0) {
          // البحث عن أفضل مطابقة
          let bestMatch = data[0];
          let bestScore = 0;
          
          // حساب نقاط المطابقة لكل نتيجة
          data.forEach(result => {
            const normalizedResultName = normalizeText(result.name);
            let score = 0;
            
            // نقاط للكلمات المطابقة
            searchWords.forEach(word => {
              if (normalizedResultName.includes(word)) {
                score += 10;
              }
            });
            
            // نقاط إضافية للمطابقة الكاملة
            if (normalizedResultName === normalizeText(searchTerm)) {
              score += 50;
            }
            
            // نقاط للمطابقة في بداية الاسم
            if (normalizedResultName.startsWith(searchWords[0])) {
              score += 20;
            }
            
            if (score > bestScore) {
              bestScore = score;
              bestMatch = result;
            }
          });
          
          setSearchResult(bestMatch);
        } else {
          setSearchResult(null);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResult(null);
      setSearchError('حدث خطأ أثناء البحث');
    } finally {
      setIsLoading(false);
      setSearchAttempted(true); // إظهار النتيجة فقط بعد انتهاء البحث
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // دالة للحصول على موعد الاختبار حسب الفئة
  const getExamScheduleForCategory = (category: string) => {
    const schedules: { [key: string]: { day: string; time: string; date: string; hijriDate: string } } = {
      "3": { 
        day: "الجمعة", 
        time: "٢:٠٠ ظهراً", 
        date: "الجمعة، ٨ أغسطس ٢٠٢٥ م",
        hijriDate: "الجمعة، ٦ صفر ١٤٤٧ هـ"
      },
      "5": { 
        day: "السبت", 
        time: "١:٣٠ ظهراً",
        date: "السبت، ٩ أغسطس ٢٠٢٥ م",
        hijriDate: "السبت، ٧ صفر ١٤٤٧ هـ"
      },
      "8": { 
        day: "السبت", 
        time: "١:٣٠ ظهراً", 
        date: "السبت، ٩ أغسطس ٢٠٢٥ م",
        hijriDate: "السبت، ٧ صفر ١٤٤٧ هـ"
      },
      "10": { 
        day: "الجمعة", 
        time: "٢:٠٠ ظهراً", 
        date: "الجمعة، ١٥ أغسطس ٢٠٢٥ م",
        hijriDate: "الجمعة، ١٣ صفر ١٤٤٧ هـ"
      },
      "15": { 
        day: "الجمعة", 
        time: "٢:٠٠ ظهراً", 
        date: "الجمعة، ١٥ أغسطس ٢٠٢٥ م",
        hijriDate: "الجمعة، ١٣ صفر ١٤٤٧ هـ"
      },
      "20": { 
        day: "الجمعة", 
        time: "٢:٠٠ ظهراً", 
        date: "الجمعة، ١٥ أغسطس ٢٠٢٥ م",
        hijriDate: "الجمعة، ١٣ صفر ١٤٤٧ هـ"
      },
      "25": { 
        day: "السبت", 
        time: "١:٣٠ ظهراً", 
        date: "السبت، ١٦ أغسطس ٢٠٢٥ م", 
        hijriDate: "السبت، ١٤ صفر ١٤٤٧ هـ"
      },
      "30": { 
        day: "السبت", 
        time: "١:٣٠ ظهراً", 
        date: "السبت، ١٦ أغسطس ٢٠٢٥ م",
        hijriDate: "السبت، ١٤ صفر ١٤٤٧ هـ"
      }
    };
    
    return schedules[category.toString()] || { day: "غير محدد", time: "غير محدد", date: "غير محدد", hijriDate: "غير محدد" };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <section className={`py-16 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-800 to-gray-700' 
        : 'bg-gradient-to-br from-blue-50 to-purple-50'
    }`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-slideInDown">
            <div className="flex justify-center items-center gap-3 mb-4">
              <UserCheck className="w-12 h-12 text-blue-600 animate-bounce-slow" />
              <h2 className={`text-4xl md:text-5xl font-bold ${isDarkMode ? 'text-gray-100' : 'gradient-text-animated'}`}>
                البحث عن التسجيل
              </h2>
              <Search className="w-12 h-12 text-purple-600 animate-pulse" />
            </div>
            <p className={`text-xl mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              ابحث عن اسمك للتأكد من التسجيل في المسابقة
            </p>
          </div>

          {/* Search Section */}
          <div className={`p-8 rounded-3xl shadow-2xl mb-8 transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-gray-700 to-gray-600 border-2 border-gray-600/50' 
              : 'bg-gradient-to-r from-white to-blue-50 border-2 border-blue-200'
          }`}>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className={`flex rounded-2xl overflow-hidden border-2 focus-within:border-blue-500 transition-all duration-300 shadow-lg ${
                  isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'
                }`}>
                  <div className={`px-6 py-4 flex items-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <User className={`w-6 h-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`} />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="ادخل اسم طالب القرآن للبحث..."
                    className={`flex-1 px-6 py-4 text-right focus:outline-none text-lg transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-800 text-gray-100 placeholder-gray-400' 
                        : 'bg-white text-gray-900 placeholder-gray-500'
                    }`}
                    dir="rtl"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className={`px-8 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 font-bold text-lg transform hover:scale-105 shadow-xl ${
                  isLoading
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl hover:shadow-blue-500/25'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري البحث...
                  </>
                ) : (
                  <>
                    <Search className="w-6 h-6" />
                    بحث
                  </>
                )}
              </button>
            </div>

            {/* Search Error */}
            {searchError && (
              <div className={`p-4 rounded-xl border-2 text-center animate-fadeIn mb-4 ${
                isDarkMode 
                  ? 'bg-red-900/30 border-red-600/50 text-red-300' 
                  : 'bg-red-100 border-red-300 text-red-700'
              }`}>
                <div className="flex items-center justify-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-semibold">{searchError}</span>
                </div>
              </div>
            )}
            
            {/* Search Tips */}
            <div className={`p-4 rounded-xl border transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-blue-900/20 border-blue-600/30 text-blue-200' 
                : 'bg-blue-50 border-blue-200 text-blue-700'
            }`}>
              <h4 className="font-semibold mb-2">نصائح للبحث:</h4>
              <ul className="text-sm space-y-1 text-right">
                <li>• اكتب الاسم الأول والثاني على الأقل</li>
                <li>• يمكن البحث بجزء من الاسم (مثل: أحمد محمد)</li>
                <li>• البحث يتجاهل الهمزات والمسافات الزائدة</li>
                <li>• يُفضل عرض الموقع من الكمبيوتر للأداء الأمثل</li>
              </ul>
            </div>

            {/* Search Results */}
            {searchAttempted && (
              <div className="animate-fadeIn">
                {searchResult ? (
                  /* Student Found */
                  <div className={`border-2 rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-green-900/30 via-emerald-900/30 to-green-900/30 border-green-600/70' 
                      : 'bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 border-green-300'
                  }`}>
                    {/* Background decorative elements */}
                    <div className={`absolute top-4 right-4 opacity-30 ${isDarkMode ? 'text-green-400' : 'text-green-200'}`}>
                      <CheckCircle className="w-16 h-16 animate-pulse" />
                    </div>
                    <div className={`absolute bottom-4 left-4 opacity-20 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-200'}`}>
                      <Calendar className="w-12 h-12 animate-bounce-slow" />
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-center items-center gap-3 mb-6">
                        <CheckCircle className={`w-12 h-12 animate-pulse ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                        <h3 className={`text-3xl md:text-4xl font-bold animate-fadeInScale ${isDarkMode ? 'text-green-200' : 'text-green-800'}`}>
                          تم العثور على التسجيل!
                        </h3>
                      </div>
                      
                      <div className={`backdrop-blur-sm rounded-2xl p-6 mb-6 border transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-800/70 border-green-600/30' 
                          : 'bg-white/70 border-green-200'
                      }`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <User className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                              <div>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>اسم طالب القرآن</p>
                                <p className={`text-xl font-bold ${isDarkMode ? 'text-green-200' : 'text-green-800'}`}>
                                  {searchResult.name}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <GraduationCap className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                              <div>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>الشيخ / المحفظ</p>
                                <p className={`text-lg font-semibold ${isDarkMode ? 'text-green-200' : 'text-green-700'}`}>
                                  {searchResult.teacher || 'غير محدد'}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <Calendar className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                              <div>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>الفئة</p>
                                <p className={`text-lg font-semibold ${isDarkMode ? 'text-green-200' : 'text-green-700'}`}>
                                  {searchResult.category}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <Clock className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                              <div>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>رقم الطالب</p>
                                <p className={`text-lg font-semibold ${isDarkMode ? 'text-green-200' : 'text-green-700'}`}>
                                  {searchResult.id}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* موعد الاختبار */}
                      <div className={`text-center p-6 rounded-2xl border-2 mb-4 transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-600/50' 
                          : 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300'
                      }`}>
                        <div className="flex justify-center items-center gap-3 mb-4">
                          <Clock className={`w-8 h-8 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} animate-tick`} />
                          <h4 className={`text-2xl font-bold ${isDarkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
                            موعد اختبارك
                          </h4>
                        </div>
                        {(() => {
                          const schedule = getExamScheduleForCategory(searchResult.category);
                          return (
                            <div className="space-y-2">
                              <p className={`text-xl font-bold ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                                {schedule.day} - {schedule.time}
                              </p>
                              <p className={`text-lg ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                                {schedule.hijriDate}
                              </p>
                              <p className={`text-lg ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                                {schedule.date}
                              </p>
                              <p className={`text-sm ${isDarkMode ? 'text-yellow-500' : 'text-yellow-500'}`}>
                                يرجى الحضور قبل الموعد بـ 15 دقيقة
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                      
                      {/* تعليمات الاختبار */}
                      <div className={`text-center p-6 rounded-2xl border-2 mb-4 transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-600/50' 
                          : 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-300'
                      }`}>
                        <div className="flex justify-center items-center gap-3 mb-4">
                          <GraduationCap className={`w-8 h-8 ${isDarkMode ? 'text-green-400' : 'text-green-600'} animate-bounce-slow`} />
                          <h4 className={`text-2xl font-bold ${isDarkMode ? 'text-green-200' : 'text-green-800'}`}>
                            تعليمات الاختبار
                          </h4>
                        </div>
                        <div className="space-y-3 text-right">
                          <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'}`}>
                            <p className={`text-lg font-semibold ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                              ✅ احضر قبل الموعد بـ 15 دقيقة على الأقل
                            </p>
                          </div>
                          <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'}`}>
                            <p className={`text-lg font-semibold ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                              📖 أحضر المصحف الشريف معك
                            </p>
                          </div>
                          <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'}`}>
                            <p className={`text-lg font-semibold ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                              🤲 ادع الله أن يوفقك في الاختبار
                            </p>
                          </div>
                          <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'}`}>
                            <p className={`text-lg font-semibold ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                              📱 في حالة وجود استفسار، تواصل مع إدارة المسابقة
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`text-center p-6 rounded-2xl border-2 transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-600/50' 
                          : 'bg-gradient-to-r from-blue-100 to-purple-100 border-blue-300'
                      }`}>
                        <div className="flex justify-center items-center gap-3 mb-4">
                          <Calendar className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} animate-bounce-slow`} />
                          <h4 className={`text-2xl font-bold ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                            تم تسجيلك بنجاح في المسابقة
                          </h4>
                        </div>
                        <p className={`text-lg ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                          استعد جيداً للاختبار وراجع الأجزاء المطلوبة
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Student Not Found */
                  <div className={`border-2 rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-red-900/30 via-orange-900/30 to-red-900/30 border-red-600/70' 
                      : 'bg-gradient-to-br from-red-50 via-orange-50 to-red-50 border-red-300'
                  }`}>
                    {/* Background decorative elements */}
                    <div className={`absolute top-4 right-4 opacity-30 ${isDarkMode ? 'text-red-400' : 'text-red-200'}`}>
                      <XCircle className="w-16 h-16 animate-pulse" />
                    </div>
                    <div className={`absolute bottom-4 left-4 opacity-20 ${isDarkMode ? 'text-orange-400' : 'text-orange-200'}`}>
                      <AlertTriangle className="w-12 h-12 animate-bounce-slow" />
                    </div>
                    
                    <div className="relative z-10 text-center">
                      <div className="flex justify-center items-center gap-3 mb-6">
                        <XCircle className={`w-12 h-12 animate-pulse ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                        <h3 className={`text-3xl md:text-4xl font-bold animate-fadeInScale ${isDarkMode ? 'text-red-200' : 'text-red-800'}`}>
                          لم يتم العثور على التسجيل
                        </h3>
                      </div>
                      
                      <div className={`backdrop-blur-sm rounded-2xl p-6 mb-6 border transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-800/70 border-red-600/30' 
                          : 'bg-white/70 border-red-200'
                      }`}>
                        <p className={`text-xl md:text-2xl leading-relaxed mb-4 ${isDarkMode ? 'text-red-200' : 'text-red-700'}`}>
                          يرجى التسجيل أولاً مع الشيخ أو المحفظ أو إدارة المسابقة
                        </p>
                        <p className={`text-lg ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
                          للتسجيل، يرجى التواصل مع أحد الشيوخ أو المحفظين المعتمدين أو إدارة دار المناسبات الشرقيه
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`p-4 rounded-xl border transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gradient-to-r from-blue-900/30 to-blue-800/30 border-blue-600/50' 
                            : 'bg-gradient-to-r from-blue-100 to-blue-200 border-blue-200'
                        }`}>
                          <UserCheck className={`w-8 h-8 mx-auto mb-2 animate-bounce-slow ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                          <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>التسجيل مع الشيخ/المحفظ</h4>
                          <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>تواصل مع شيخك أو محفظك المعتمد</p>
                        </div>
                        
                        <div className={`p-4 rounded-xl border transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gradient-to-r from-green-900/30 to-green-800/30 border-green-600/50' 
                            : 'bg-gradient-to-r from-green-100 to-green-200 border-green-200'
                        }`}>
                          <Phone className={`w-8 h-8 mx-auto mb-2 animate-pulse ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                          <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-green-200' : 'text-green-800'}`}>التواصل المباشر</h4>
                          <button
                            onClick={() => {
                              // التنقل إلى صفحة التواصل
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                              // يمكن إضافة منطق للتنقل إلى قسم التواصل في الفوتر
                              setTimeout(() => {
                                const contactSection = document.querySelector('.contact-section');
                                if (contactSection) {
                                  contactSection.scrollIntoView({ behavior: 'smooth' });
                                }
                              }, 500);
                            }}
                            className={`text-sm font-semibold hover:underline ${isDarkMode ? 'text-green-300 hover:text-green-200' : 'text-green-700 hover:text-green-600'}`}
                          >
                            اتصل بإدارة المسابقة
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className={`text-center p-6 rounded-2xl transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-600/50' 
              : 'bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200'
          }`}>
            <div className="flex justify-center items-center gap-3 mb-4">
              <UserCheck className={`w-8 h-8 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} animate-pulse`} />
              <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-purple-200' : 'text-purple-800'}`}>
                إحصائيات التسجيل
              </h3>
            </div>
            <p className={`text-lg ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
              إجمالي طلاب القرآن المسجلين: <span className="font-bold text-2xl">{totalStudents}</span> طالب
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};