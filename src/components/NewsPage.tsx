import React, { useState, useEffect } from 'react';
import { Bell, BellRing, Calendar, Clock, Megaphone, Star, AlertCircle, CheckCircle } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  content: string;
  date: Date;
  type: 'announcement' | 'update' | 'reminder';
  important: boolean;
}

interface NewsPageProps {
  isDarkMode?: boolean;
}

export const NewsPage: React.FC<NewsPageProps> = ({ isDarkMode = false }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check current notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        setNotificationsEnabled(permission === 'granted');
        
        if (permission === 'granted') {
          // Send a test notification
          new Notification('تم تفعيل الإشعارات بنجاح!', {
            body: 'ستصلك الآن جميع أخبار المسابقة',
            icon: '/vite.svg'
          });
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    }
  };

  // Sample news data
  const newsItems: NewsItem[] = [
    {
      id: 7,
      title: '🎊 تم تحديد موعد حفل تكريم الفائزين! 🎊',
      content: 'بحمد الله تم تحديد موعد حفل تكريم الفائزين في مسابقة المولد النبوي الشريف. سيقام الحفل يوم الخميس ١١ سبتمبر ٢٠٢٥ م الموافق ١٥ صفر ١٤٤٧ هـ بعد صلاة العشاء مباشرة في المسجد الشرقي بدار المناسبات الشرقيه. ندعو جميع الفائزين وأولياء الأمور والمهتمين لحضور هذا الحفل المبارك لتكريم حفظة كتاب الله العزيز وتوزيع الجوائز القيمة. الحضور مفتوح للجميع.',
      date: new Date(),
      type: 'announcement',
      important: true
    },
    {
      id: 6,
      title: '🎉 تم الإعلان عن جميع النتائج - ابحث عن نتيجتك الآن! 🎉',
      content: 'الحمد لله تم الانتهاء من تصحيح جميع الاختبارات وإعلان النتائج النهائية لمسابقة المولد النبوي الشريف. يمكن لجميع الطلاب المشاركين الآن البحث عن نتائجهم من خلال صفحة "عرض النتائج" عبر كتابة الاسم في خانة البحث. نتقدم بالتهاني الحارة لجميع الفائزين، ونشكر كل من شارك في هذه المسابقة المباركة. تذكروا أن كل خطوة في طريق حفظ القرآن الكريم لها أجر عظيم عند الله.',
      date: new Date(),
      type: 'announcement',
      important: true
    },
    {
      id: 5,
      title: 'تحديث: تم رفع المزيد من النتائج',
      content: 'تم رفع دفعة جديدة من النتائج للطلاب المشاركين في المسابقة. يمكن للطلاب البحث عن نتائجهم من خلال صفحة "عرض النتائج" عبر كتابة الاسم في خانة البحث. في حالة عدم ظهور النتيجة، يرجى التأكد من كتابة الاسم بشكل صحيح أو التواصل مع إدارة المسابقة.',
      date: new Date('2025-08-12'),
      type: 'announcement',
      important: false
    },
    {
      id: 4,
      title: 'تم إضافة بعض الطلاب المسجلين في المسابقة',
      content: 'تم إضافة قائمة بأسماء الطلاب المسجلين في مسابقة المولد النبوي الشريف. يرجى مراجعة اسمك في قسم "البحث عن التسجيل" وإن لم تجده عليك سرعة التسجيل مع المحفظ المعتمد أو التواصل مع إدارة المسابقة.',
      date: new Date('2025-08-10'),
      type: 'announcement',
      important: true
    },
    {
      id: 1,
      title: 'بدء التسجيل في مسابقة المولد النبوي الشريف',
      content: 'نعلن عن بدء التسجيل في مسابقة المولد النبوي الشريف للعام 2025. يمكن للطلاب بحد أقصى ثمانية عشر سنة التسجيل في الفئات المختلفة.',
      date: new Date('2025-06-15'),
      type: 'announcement',
      important: true
    },
    {
      id: 2,
      title: 'تحديث مواعيد الاختبارات',
      content: 'تم تحديث جدول مواعيد الاختبارات. يرجى مراجعة الجدول الجديد والتأكد من المواعيد.',
      date: new Date('2025-07-25'),
      type: 'update',
      important: false
    },
    {
      id: 3,
      title: 'تذكير: آخر موعد للتسجيل',
      content: 'ندعو جميع الراغبين في المشاركة إلى سرعة التسجيل من خلال المحفظين المعتمدين. وفي حالة عدم وجود محفظ، يمكنكم التواصل المباشر مع إدارة المسابقة لاستكمال إجراءات التسجيل والحصول على كافة المعلومات اللازمة.',
      date: new Date('2025-08-01'),
      type: 'reminder',
      important: true
    }
  ];

  const getNewsIcon = (type: string) => {
    switch (type) {
      case 'announcement':
        return <Megaphone className="w-6 h-6" />;
      case 'update':
        return <AlertCircle className="w-6 h-6" />;
      case 'reminder':
        return <Clock className="w-6 h-6" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  const getNewsColor = (type: string) => {
    switch (type) {
      case 'announcement':
        return isDarkMode 
          ? 'from-blue-900/30 to-blue-800/30 border-blue-600/50' 
          : 'from-blue-100 to-blue-200 border-blue-300';
      case 'update':
        return isDarkMode 
          ? 'from-green-900/30 to-green-800/30 border-green-600/50' 
          : 'from-green-100 to-green-200 border-green-300';
      case 'reminder':
        return isDarkMode 
          ? 'from-orange-900/30 to-orange-800/30 border-orange-600/50' 
          : 'from-orange-100 to-orange-200 border-orange-300';
      default:
        return isDarkMode 
          ? 'from-gray-900/30 to-gray-800/30 border-gray-600/50' 
          : 'from-gray-100 to-gray-200 border-gray-300';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <section className={`py-16 min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-700' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-slideInDown">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Megaphone className="w-12 h-12 text-blue-600 animate-bounce-slow" />
            <h1 className={`text-4xl md:text-5xl font-bold ${isDarkMode ? 'text-gray-100' : 'gradient-text-animated'}`}>
              آخر الأخبار
            </h1>
            <Bell className="w-12 h-12 text-purple-600 animate-ring" />
          </div>
          <p className={`text-xl mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            تابع آخر أخبار وتحديثات مسابقة المولد النبوي الشريف
          </p>
        </div>

        {/* Notification Settings */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className={`border rounded-2xl p-6 transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-600/50' 
              : 'bg-gradient-to-r from-purple-100 to-blue-100 border-purple-300'
          }`}>
            <div className="text-center">
              <div className="flex justify-center items-center gap-3 mb-4">
                {notificationsEnabled ? (
                  <BellRing className="w-8 h-8 text-green-500 animate-ring" />
                ) : (
                  <Bell className="w-8 h-8 text-gray-500" />
                )}
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  إشعارات الأخبار
                </h3>
              </div>
              
              {notificationsEnabled ? (
                <div className={`p-4 rounded-xl ${
                  isDarkMode 
                    ? 'bg-green-900/30 border border-green-600/50' 
                    : 'bg-green-100 border border-green-300'
                }`}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className={`font-semibold ${isDarkMode ? 'text-green-200' : 'text-green-800'}`}>
                      تم تفعيل الإشعارات بنجاح
                    </span>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                    ستصلك إشعارات فورية عند نشر أخبار جديدة
                  </p>
                </div>
              ) : (
                <div>
                  <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    فعل الإشعارات لتصلك آخر الأخبار والتحديثات فور نشرها
                  </p>
                  <button
                    onClick={requestNotificationPermission}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 mx-auto font-semibold transform hover:scale-105"
                    disabled={notificationPermission === 'denied'}
                  >
                    <Bell className="w-5 h-5" />
                    {notificationPermission === 'denied' ? 'الإشعارات محظورة' : 'تفعيل الإشعارات'}
                  </button>
                  {notificationPermission === 'denied' && (
                    <p className={`text-sm mt-2 ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
                      يرجى تفعيل الإشعارات من إعدادات المتصفح
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* News Items */}
        <div className="max-w-4xl mx-auto space-y-6">
          {newsItems.map((news, index) => (
            <div
              key={news.id}
              className={`rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden animate-slideInRight ${
                isDarkMode ? 'bg-gray-700' : 'bg-white'
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* News header */}
              <div className={`bg-gradient-to-r ${getNewsColor(news.type)} p-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'
                    }`}>
                      {getNewsIcon(news.type)}
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                        {news.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                          {formatDate(news.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {news.important && (
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                      مهم
                    </div>
                  )}
                </div>
              </div>

              {/* News content */}
              <div className="p-6">
                <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {news.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state if no news */}
        {newsItems.length === 0 && (
          <div className="text-center py-16">
            <Megaphone className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              لا توجد أخبار حالياً
            </h3>
            <p className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>
              ترقبوا آخر الأخبار والتحديثات قريباً
            </p>
          </div>
        )}
      </div>

      {/* Quran Verse */}
      <div className={`border-t py-6 mt-8 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-600/50' 
          : 'bg-gradient-to-r from-yellow-100/50 to-orange-100/50 border-yellow-300'
      }`}>
        <div className="container mx-auto px-4 text-center">
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
    </section>
  );
};