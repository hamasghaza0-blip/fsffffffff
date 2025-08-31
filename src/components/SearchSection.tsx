import React, { useState } from 'react';
import { Search, User, AlertTriangle } from 'lucide-react';
import { Result } from '../types';
import { supabase, isSupabaseConfigured, handleSupabaseError, testSupabaseConnection, executeSupabaseQuery } from '../utils/supabase';

interface SearchSectionProps {
  onSearch: (result: Result | null) => void;
  isDarkMode?: boolean;
}

export default function SearchSection({ onSearch, isDarkMode = false }: SearchSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

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
    
    // إذا كان هناك كلمة واحدة فقط، نبحث بها
    if (words.length === 1) {
      return [words[0]];
    }
    
    // إذا كان هناك كلمتان أو أكثر، نأخذ أول كلمتين على الأقل
    if (words.length >= 2) {
      return words.slice(0, Math.max(2, words.length));
    }
    
    return words;
  };

  // حساب الترتيب داخل الفئة
  const calculateRankInCategory = async (studentGrade: number, category: string) => {
    try {
      const { data, error } = await supabase
        .from('results')
        .select('grade')
        .eq('category', category)
        .gt('grade', studentGrade);
      
      if (error) {
        console.error('Error calculating rank:', error);
        return 1;
      }
      
      return (data?.length || 0) + 1;
    } catch (error) {
      console.error('Error calculating rank:', error);
      return 1;
    }
  };

  const handleSearch = async () => {
    // التحقق من أن الاسم يحتوي على 3 أحرف على الأقل
    const searchWords = getSearchTerms(searchTerm);
    
    // التحقق من وجود كلمتين على الأقل أو كلمة واحدة بطول 3 أحرف على الأقل
    if (searchWords.length === 0 || (searchWords.length === 1 && searchWords[0].length < 3)) {
      setSearchError('يجب كتابة الاسم الأول والثاني على الأقل أو اسم واحد بـ 3 أحرف على الأقل');
      onSearch(null);
      return;
    }

    if (!searchTerm.trim()) {
      onSearch(null);
      setSearchError('');
      return;
    }

    setSearchError('');
    setIsLoading(true);
    
    // Test connection first with enhanced error handling
    console.log('Starting search process...');
    const connectionOk = await testSupabaseConnection();
    if (!connectionOk) {
      setSearchError('لا يمكن الاتصال بقاعدة البيانات. تحقق من اتصال الإنترنت أو حاول مرة أخرى.');
      onSearch(null);
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('Searching for terms:', searchWords);
      
      // استخدام executeSupabaseQuery مع retry logic
      const { data, error } = await executeSupabaseQuery(async () => {
        // البحث المتقدم: نبحث عن النتائج التي تحتوي على جميع الكلمات
        let query = supabase!.from('results').select('*');
        
        // إضافة شروط البحث لكل كلمة
        searchWords.forEach((word, index) => {
          if (index === 0) {
            query = query.ilike('name', `%${word}%`);
          } else {
            query = query.ilike('name', `%${word}%`);
          }
        });
        
        return await query.limit(10); // نأخذ أول 10 نتائج للمطابقة
      });
      
      if (error) {
        const errorMessage = handleSupabaseError(error);
        console.error('Search error:', errorMessage);
        setSearchError(errorMessage);
        onSearch(null);
        return;
      }
      
      console.log('Search completed, results:', data);
      
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
        
        // حساب الترتيب داخل الفئة
        const { data: rankData } = await executeSupabaseQuery(async () => {
          return await supabase!
            .from('results')
            .select('grade')
            .eq('category', bestMatch.category)
            .gt('grade', bestMatch.grade);
        });
        
        const rank = (rankData?.length || 0) + 1;
        
        // تحويل بيانات Supabase إلى Result
        const result: Result = {
          id: bestMatch.no,
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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
              <Search className="w-12 h-12 text-blue-600 animate-bounce-slow" />
              <h2 className={`text-4xl md:text-5xl font-bold ${isDarkMode ? 'text-gray-100' : 'gradient-text-animated'}`}>
                البحث عن النتائج
              </h2>
              <Search className="w-12 h-12 text-purple-600 animate-pulse" />
            </div>
            <p className={`text-xl mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              ابحث عن اسمك لمعرفة نتيجتك في المسابقة
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
                    placeholder="ادخل اسم الطالب للبحث عن النتيجة..."
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
              <div className={`p-4 rounded-xl border-2 text-center animate-fadeIn ${
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
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}