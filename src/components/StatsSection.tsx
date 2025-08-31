import React from 'react';
import { Users, Trophy, TrendingUp, Award, Star } from 'lucide-react';
import { ContestStats } from '../types';
import { supabase } from '../utils/supabase';

interface StatsSectionProps {
  isDarkMode?: boolean;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ isDarkMode = false }) => {
  const [stats, setStats] = React.useState<ContestStats>({
    totalStudents: 0,
    categories: [],
    averageGrade: 0,
    topGrade: 0,
    categoriesCount: {}
  });
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // التحقق من وجود Supabase
      if (!supabase) {
        console.error('Supabase not configured');
        return;
      }
      
      // جلب إحصائيات النتائج
      const { data: resultsData, error: resultsError } = await supabase
        .from('results')
        .select('category, grade');

      if (resultsError) {
        console.error('Error fetching results stats:', resultsError);
        return;
      }

      // جلب إحصائيات المسجلين
      const { count: totalRegistered, error: registeredError } = await supabase
        .from('reciters')
        .select('*', { count: 'exact', head: true });

      if (registeredError) {
        console.error('Error fetching registered stats:', registeredError);
      }

      // حساب الإحصائيات
      const results = resultsData || [];
      const grades = results.map(r => r.grade).filter(g => g > 0);
      const categories = [...new Set(results.map(r => r.category?.toString()))].filter(Boolean);
      
      const categoriesCount: { [key: string]: number } = {};
      results.forEach(result => {
        const category = result.category?.toString() || 'غير محدد';
        categoriesCount[category] = (categoriesCount[category] || 0) + 1;
      });

      setStats({
        totalStudents: totalRegistered || 0,
        categories,
        averageGrade: grades.length > 0 ? Math.round(grades.reduce((sum, grade) => sum + grade, 0) / grades.length) : 0,
        topGrade: grades.length > 0 ? Math.max(...grades) : 0,
        categoriesCount
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className={`py-16 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-800 to-gray-700' 
          : 'bg-gradient-to-br from-blue-50 to-purple-50'
      }`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>جاري تحميل الإحصائيات...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-800 to-gray-700' 
        : 'bg-gradient-to-br from-blue-50 to-purple-50'
    }`}>
      <div className="container mx-auto px-4">
        <div className={`p-8 rounded-2xl shadow-lg transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-700' : 'bg-white'
        }`}>
          <h3 className={`text-2xl font-bold text-center mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>الفئات المشاركة</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {Object.entries(stats.categoriesCount)
              .filter(([category]) => category !== '2' && category !== 'غير محدد')
              .map(([category, count]) => (
              <div key={category} className={`p-4 rounded-xl text-center hover:shadow-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 hover:from-green-800/40 hover:to-emerald-800/40' 
                  : 'bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200'
              }`}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                  <p className={`font-bold ${isDarkMode ? 'text-green-200' : 'text-green-800'}`}>
                    {category === '3' ? 'ثلاثة أجزاء' :
                     category === '5' ? 'خمسة أجزاء' :
                     category === '8' ? 'ثمانية أجزاء' :
                     category === '10' ? 'عشرة أجزاء' :
                     category === '15' ? 'خمسة عشر جزءا' :
                     category === '20' ? 'عشرون جزءا' :
                     category === '25' ? 'خمسة وعشرون جزءا' :
                     category === '30' ? 'ثلاثون جزءا' :
                     `فئة ${category}`}
                  </p>
                </div>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                  {count}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  طالب
                </p>
              </div>
            ))}
            
            {Object.keys(stats.categoriesCount).filter(category => category !== '2' && category !== 'غير محدد').length === 0 && (
            <div className={`p-4 rounded-xl text-center hover:shadow-lg transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 hover:from-green-800/40 hover:to-emerald-800/40' 
                : 'bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200'
            }`}>
              <p className={`font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>لا توجد نتائج بعد</p>
            </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};