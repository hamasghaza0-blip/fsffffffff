import React from "react";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

interface FooterProps {
  isDarkMode?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isDarkMode = false }) => {
  return (
    <footer
      className={`text-white py-16 relative overflow-hidden transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-black via-gray-900 to-gray-800"
          : "bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
      }`}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 text-blue-300 opacity-20">
          <Heart className="w-16 h-16 animate-pulse" />
        </div>
        <div className="absolute bottom-10 left-10 text-purple-300 opacity-15">
          <Mail className="w-12 h-12 animate-bounce-slow" />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white opacity-5">
          <div className="w-64 h-64 rounded-full border-2 border-current animate-spin-slow"></div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
          <div className="text-center md:text-right animate-fadeInScale">
            <div
              className={`backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 ${
                isDarkMode
                  ? "bg-gray-800/50 border-gray-600/30 hover:bg-gray-700/60"
                  : "bg-white/10 border-white/20 hover:bg-white/15"
              }`}
            >
              <h3 className="text-2xl font-bold mb-4 text-yellow-300 glowing-text">
                مسابقه المولد النبوي الشريف
              </h3>
              <p className="text-blue-100 mb-4 leading-relaxed">
                نسعى لتشجيع الطلاب على حفظ وتلاوة القرآن الكريم وتعلم تعاليم
                الدين الإسلامي
              </p>
              <div className="flex items-center justify-center md:justify-start gap-2 text-pink-300">
                <Heart className="w-5 h-5 animate-pulse" />
                <span className="text-sm font-semibold">
                  صنع بحب لطلاب القرآن الكريم
                </span>
              </div>
            </div>
          </div>

          <div
            className="text-center animate-fadeInScale contact-section"
            style={{ animationDelay: "0.2s" }}
          >
            <div
              className={`backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 ${
                isDarkMode
                  ? "bg-gray-800/50 border-gray-600/30 hover:bg-gray-700/60"
                  : "bg-white/10 border-white/20 hover:bg-white/15"
              }`}
            >
              <h4 className="text-xl font-semibold mb-6 text-green-300 glowing-text">
                تواصل معنا
              </h4>
              <div className="space-y-4">
                {/* الشيخ مصباح عبدالمنجي الدكاني */}
                <div
                  className={`backdrop-blur-sm rounded-2xl p-4 border transition-all duration-300 hover:scale-105 ${
                    isDarkMode
                      ? "bg-gray-700/50 border-gray-500/30 hover:bg-gray-600/60"
                      : "bg-white/10 border-white/20 hover:bg-white/15"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src="https://www.mediafire.com/convkey/8b5a/uakbupoy7z7dwjxzg.jpg"
                      alt="الشيخ مصباح عبدالمنجي الدكاني"
                      className="w-12 h-12 rounded-full object-cover border-2 border-yellow-300 shadow-lg"
                    />
                    <div className="flex-1">
                      <button
                        onClick={() => {
                          const modal = document.createElement("div");
                          modal.className =
                            "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4";
                          modal.innerHTML = `
                            <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full text-center">
                              <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">تواصل مع الشيخ مصباح عبدالمنجي الدكاني</h3>
                              <div class="space-y-4">
                                <a href="https://wa.me/201220536204" target="_blank" rel="noopener noreferrer" class="block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                                  واتساب
                                </a>
                                <a href="https://www.facebook.com/mesbah.eldokany" target="_blank" rel="noopener noreferrer" class="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                                  فيسبوك
                                </a>
                              </div>
                              <button onclick="this.parentElement.parentElement.remove()" class="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                                إغلاق
                              </button>
                            </div>
                          `;
                          document.body.appendChild(modal);
                          modal.onclick = (e) => {
                            if (e.target === modal) modal.remove();
                          };
                        }}
                        className="text-white hover:text-yellow-300 transition-colors font-bold text-lg block glowing-text"
                      >
                        الشيخ مصباح عبدالمنجي الدكاني
                      </button>
                      <p className="text-blue-200 text-sm">
                        للتواصل عبر الواتساب والفيسبوك
                      </p>
                    </div>
                  </div>
                </div>

                {/* الاستاذ اسلام سعيد الشقيدي */}
                <div
                  className={`backdrop-blur-sm rounded-2xl p-4 border transition-all duration-300 hover:scale-105 ${
                    isDarkMode
                      ? "bg-gray-700/50 border-gray-500/30 hover:bg-gray-600/60"
                      : "bg-white/10 border-white/20 hover:bg-white/15"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src="https://www.mediafire.com/convkey/c5b8/xomyambcahs3tfdzg.jpg"
                      alt="الاستاذ اسلام سعيد الشقيدي"
                      className="w-12 h-12 rounded-full object-cover border-2 border-green-300 shadow-lg"
                    />
                    <div className="flex-1">
                      <button
                        onClick={() => {
                          const modal = document.createElement("div");
                          modal.className =
                            "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4";
                          modal.innerHTML = `
                            <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full text-center">
                              <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">تواصل مع الاستاذ اسلام سعيد الشقيدي</h3>
                              <div class="space-y-4">
                                <a href="https://wa.me/201276099675" target="_blank" rel="noopener noreferrer" class="block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                                  واتساب
                                </a>
                                <a href="https://www.facebook.com/Islam.saeed.1966" target="_blank" rel="noopener noreferrer" class="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                                  فيسبوك
                                </a>
                              </div>
                              <button onclick="this.parentElement.parentElement.remove()" class="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                                إغلاق
                              </button>
                            </div>
                          `;
                          document.body.appendChild(modal);
                          modal.onclick = (e) => {
                            if (e.target === modal) modal.remove();
                          };
                        }}
                        className="text-white hover:text-yellow-300 transition-colors font-bold text-lg block glowing-text"
                      >
                        الاستاذ اسلام سعيد الشقيدي
                      </button>
                      <p className="text-blue-200 text-sm">
                        للتواصل عبر الواتساب والفيسبوك
                      </p>
                    </div>
                  </div>
                </div>

                {/* احمد طارق عبدالهادي علي الدين */}
                <div
                  className={`backdrop-blur-sm rounded-2xl p-4 border transition-all duration-300 hover:scale-105 ${
                    isDarkMode
                      ? "bg-gray-700/50 border-gray-500/30 hover:bg-gray-600/60"
                      : "bg-white/10 border-white/20 hover:bg-white/15"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src="https://www.mediafire.com/convkey/b8c8/gfbsdvor275i0lnzg.jpg"
                      alt="البشمهندس احمد طارق علي الدين"
                      className="w-12 h-12 rounded-full object-cover border-2 border-purple-300 shadow-lg"
                    />
                    <div className="flex-1">
                      <button
                        onClick={() => {
                          const modal = document.createElement("div");
                          modal.className =
                            "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4";
                          modal.innerHTML = `
                            <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full text-center">
                              <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">تواصل مع المهندس احمد طارق علي الدين</h3>
                              <div class="space-y-4">
                                <a href="https://wa.me/201559181558" target="_blank" rel="noopener noreferrer" class="block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                                  واتساب
                                </a>
                                <a href="https://www.facebook.com/palestine7102023y/" target="_blank" rel="noopener noreferrer" class="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                                  فيسبوك
                                </a>
                              </div>
                              <button onclick="this.parentElement.parentElement.remove()" class="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                                إغلاق
                              </button>
                            </div>
                          `;
                          document.body.appendChild(modal);
                          modal.onclick = (e) => {
                            if (e.target === modal) modal.remove();
                          };
                        }}
                        className="text-white hover:text-yellow-300 transition-colors font-bold text-lg block glowing-text"
                      >
                        المهندس احمد طارق علي الدين
                      </button>
                      <p className="text-blue-200 text-sm">
                        للتواصل عبر الواتساب والفيسبوك
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`flex items-center justify-center gap-3 rounded-xl p-3 transition-all ${
                    isDarkMode
                      ? "bg-gray-700/30 hover:bg-gray-600/40"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="bg-red-500 p-2 rounded-full">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <a
                    href="https://maps.app.goo.gl/BA3xbuvekc8kgKaMA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-100 hover:text-white transition-colors font-medium"
                  >
                    دار المناسبات الشرقيه، دمليج، منوف، المنوفية
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div
            className="text-center md:text-left animate-fadeInScale"
            style={{ animationDelay: "0.4s" }}
          >
            <div
              className={`backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 ${
                isDarkMode
                  ? "bg-gray-800/50 border-gray-600/30 hover:bg-gray-700/60"
                  : "bg-white/10 border-white/20 hover:bg-white/15"
              }`}
            >
              <h4 className="text-xl font-semibold mb-6 text-purple-300 glowing-text">
                روابط مهمة
              </h4>
              <div className="space-y-3">
                <div
                  className={`rounded-xl p-3 transition-all ${
                    isDarkMode
                      ? "bg-gray-700/30 hover:bg-gray-600/40"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <button
                    onClick={() => {
                      const modal = document.createElement("div");
                      modal.className =
                        "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4";
                      modal.innerHTML = `
                        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
                          <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">قوانين المسابقة</h3>
                          <ul class="space-y-3 text-gray-700 dark:text-gray-300">
                            <li class="flex items-start gap-2">
                              <span class="text-blue-600">•</span>
                              <span>أن يكون المتسابق من أبناء قرية دمليج</span>
                            </li>
                            <li class="flex items-start gap-2">
                              <span class="text-blue-600">•</span>
                              <span>ألا يزيد سن المتسابق عن ثمانية عشر سنة</span>
                            </li>
                          </ul>
                          <button onclick="this.parentElement.parentElement.remove()" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            إغلاق
                          </button>
                        </div>
                      `;
                      document.body.appendChild(modal);
                      modal.onclick = (e) => {
                        if (e.target === modal) modal.remove();
                      };
                    }}
                    className="text-blue-100 hover:text-white transition-colors font-medium flex items-center gap-2 w-full text-right"
                  >
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    قوانين المسابقة
                  </button>
                </div>
                <div
                  className={`rounded-xl p-3 transition-all ${
                    isDarkMode
                      ? "bg-gray-700/30 hover:bg-gray-600/40"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <button
                    onClick={() => {
                      const modal = document.createElement("div");
                      modal.className =
                        "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4";
                      modal.innerHTML = `
                        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
                          <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">الأسئلة الشائعة</h3>
                          <div class="text-gray-700 dark:text-gray-300 space-y-3">
                            <p><strong>كيف يتم التسجيل؟</strong></p>
                            <p>تسجيل بيانات الحفظة يتم من خلال المحفظين، ومن يحفظ مع ولي أمره عليه التواصل مع إدارة دار المناسبات الشرقيه</p>
                            <a href="#contact" onclick="this.parentElement.parentElement.parentElement.remove(); document.querySelector('.contact-section')?.scrollIntoView({behavior: 'smooth'})" class="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mt-2">
                              للتواصل
                            </a>
                          </div>
                          <button onclick="this.parentElement.parentElement.remove()" class="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                            إغلاق
                          </button>
                        </div>
                      `;
                      document.body.appendChild(modal);
                      modal.onclick = (e) => {
                        if (e.target === modal) modal.remove();
                      };
                    }}
                    className="text-blue-100 hover:text-white transition-colors font-medium flex items-center gap-2 w-full text-right"
                  >
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    الأسئلة الشائعة
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center relative z-10">
          {/* Quran Verse */}
          <div
            className={`backdrop-blur-sm rounded-2xl p-6 border mb-6 transition-colors duration-300 ${
              isDarkMode
                ? "bg-gray-800/30 border-gray-600/20"
                : "bg-white/5 border-white/10"
            }`}
          >
            <p className="text-xl md:text-2xl text-yellow-200 font-bold glowing-text-main mb-2">
              "وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا"
            </p>
            <p className="text-yellow-300/80 text-sm">
              صدق الله العظيم - سورة المزمل
            </p>
          </div>

          <div
            className={`backdrop-blur-sm rounded-2xl p-6 border transition-colors duration-300 ${
              isDarkMode
                ? "bg-gray-800/30 border-gray-600/20"
                : "bg-white/5 border-white/10"
            }`}
          >
            <p className="text-blue-200 text-lg font-semibold mb-2">
              &copy; 2025 مسابقه المولد النبوي الشريف بدار المناسبات الشرقيه.
              جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center justify-center gap-2 text-purple-300">
              <Heart className="w-4 h-4 animate-pulse" />
              <button
                onClick={() => {
                  const modal = document.createElement("div");
                  modal.className =
                    "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4";
                  modal.innerHTML = `
                    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full text-center">
                      <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">تواصل مع المطور</h3>
                      <div class="space-y-4">
                        <a href="https://www.facebook.com/palestine7102023y/" target="_blank" rel="noopener noreferrer" class="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                          فيسبوك
                        </a>
                        <a href="https://wa.me/201559181558" target="_blank" rel="noopener noreferrer" class="block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                          واتساب
                        </a>
                      </div>
                      <button onclick="this.parentElement.parentElement.remove()" class="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                        إغلاق
                      </button>
                    </div>
                  `;
                  document.body.appendChild(modal);
                  modal.onclick = (e) => {
                    if (e.target === modal) modal.remove();
                  };
                }}
                className="text-sm hover:text-white transition-colors"
              >
                Created by Ahmed Tareq - تم التطوير بحب وإخلاص لخدمة كتاب الله
              </button>
              <Heart className="w-4 h-4 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
