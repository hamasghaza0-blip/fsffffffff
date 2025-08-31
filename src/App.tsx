import React, { useState, useRef, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Header } from "./components/Header";
import { MainPage } from "./components/MainPage";
import { NavigationDropdown } from "./components/NavigationDropdown";
import { ExamSchedule } from "./components/ExamSchedule";
import { NewsPage } from "./components/NewsPage";
import { DonationSection } from "./components/DonationSection";
import SearchSection from "./components/SearchSection";
import { ResultCard } from "./components/ResultCard";
import { StatsSection } from "./components/StatsSection";
import { AllResultsSection } from "./components/AllResultsSection";
import { Footer } from "./components/Footer";
import { FloatingDonationButton } from "./components/FloatingDonationButton";
import { VisitorStats } from "./components/VisitorStats";
import { RegistrationPage } from "./components/RegistrationPage";
import { Clock, AlertCircle, BookOpen } from "lucide-react";
import { rankedStudents } from "./data/students";
import { Student, Result } from "./types";

function App() {
  const [searchResult, setSearchResult] = useState<Result | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [currentPage, setCurrentPage] = useState<
    "main" | "registration" | "results" | "schedule" | "news" | "donation"
  >("main");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Set dark mode as default on component mount
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Stop audio when leaving main page
  useEffect(() => {
    if (currentPage !== "main" && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [currentPage]);

  const handleSearchResult = (result: Result | null) => {
    setSearchResult(result);
    setSearchAttempted(true);
  };

  const handleNavigation = (
    page: "registration" | "results" | "schedule" | "news" | "donation"
  ) => {
    setCurrentPage(page);
  };

  const handleFullNavigation = (
    page: "main" | "registration" | "results" | "schedule" | "news" | "donation"
  ) => {
    setCurrentPage(page);

    // Stop audio when navigating away from main page
    if (page !== "main" && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Reset search when navigating
    if (page !== "results" && page !== "registration") {
      setSearchResult(null);
      setSearchAttempted(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
      dir="rtl"
    >
      {/* Global audio reference for main page */}
      <audio ref={audioRef} style={{ display: "none" }} />

      {/* Floating Donation Button - Show on all pages except main and donation */}
      {currentPage !== "main" && currentPage !== "donation" && (
        <FloatingDonationButton
          onNavigate={handleFullNavigation}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Visitor Stats - Show on all pages */}
      <VisitorStats isDarkMode={isDarkMode} />

      {/* Dark Mode Toggle - Fixed position */}
      <button
        onClick={toggleDarkMode}
        className={`fixed top-4 left-4 z-50 p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-2xl ${
          isDarkMode
            ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 hover:from-yellow-300 hover:to-orange-300 shadow-yellow-400/50"
            : "bg-gradient-to-r from-gray-800 to-gray-900 text-yellow-400 hover:from-gray-700 hover:to-gray-800 shadow-gray-800/50"
        } hover:shadow-2xl hover:-translate-y-1`}
        aria-label="تبديل الوضع الليلي"
      >
        {isDarkMode ? (
          <Sun className="w-6 h-6 animate-spin-slow drop-shadow-lg" />
        ) : (
          <Moon className="w-6 h-6 animate-pulse drop-shadow-lg" />
        )}
      </button>

      {currentPage === "main" ? (
        <MainPage
          onNavigate={(page) => handleFullNavigation(page)}
          isDarkMode={isDarkMode}
        />
      ) : (
        <>
          <Header isDarkMode={isDarkMode} />

          <NavigationDropdown
            currentPage={currentPage}
            onNavigate={handleFullNavigation}
            isDarkMode={isDarkMode}
          />

          {currentPage === "results" && (
            <>
              <SearchSection
                onSearch={handleSearchResult}
                isDarkMode={isDarkMode}
              />

              {/* Search Results */}
              {searchAttempted && (
                <section
                  className={`py-12 transition-colors duration-300 ${
                    isDarkMode ? "bg-gray-800" : "bg-gray-50"
                  }`}
                >
                  <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto">
                      {searchResult ? (
                        <ResultCard student={searchResult} isDarkMode={isDarkMode} />
                      ) : (
                        <div
                          className={`border-2 rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-colors duration-300 ${
                            isDarkMode
                              ? "bg-gradient-to-br from-orange-900/20 via-yellow-900/20 to-amber-900/20 border-orange-600/50"
                              : "bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 border-orange-200"
                          }`}
                        >
                          {/* Background decorative elements */}
                          <div
                            className={`absolute top-4 right-4 opacity-30 ${
                              isDarkMode ? "text-orange-400" : "text-orange-200"
                            }`}
                          >
                            <Clock className="w-16 h-16 animate-spin-slow" />
                          </div>
                          <div
                            className={`absolute bottom-4 left-4 opacity-20 ${
                              isDarkMode ? "text-yellow-400" : "text-yellow-200"
                            }`}
                          >
                            <BookOpen className="w-12 h-12 animate-bounce-slow" />
                          </div>

                          <div className="text-center relative z-10">
                            <div className="flex justify-center items-center gap-3 mb-6">
                              <AlertCircle
                                className={`w-12 h-12 animate-pulse ${
                                  isDarkMode
                                    ? "text-orange-400"
                                    : "text-orange-500"
                                }`}
                              />
                              <Clock
                                className={`w-12 h-12 animate-tick ${
                                  isDarkMode ? "text-amber-400" : "text-amber-500"
                                }`}
                              />
                            </div>

                            <h3
                              className={`text-3xl md:text-4xl font-bold mb-4 animate-fadeInScale ${
                                isDarkMode ? "text-orange-200" : "text-orange-800"
                              }`}
                            >
                              لم يتم العثور على النتيجة
                            </h3>

                            <div
                              className={`backdrop-blur-sm rounded-2xl p-6 mb-6 border transition-colors duration-300 ${
                                isDarkMode
                                  ? "bg-gray-800/70 border-orange-600/30"
                                  : "bg-white/70 border-orange-100"
                              }`}
                            >
                              <p
                                className={`text-lg md:text-xl leading-relaxed mb-4 ${
                                  isDarkMode
                                    ? "text-orange-200"
                                    : "text-orange-700"
                                }`}
                              >
                                تأكد من كتابة الاسم بشكل صحيح أو قد تكون النتائج لم تُنشر بعد
                              </p>
                              <p
                                className={`font-semibold ${
                                  isDarkMode
                                    ? "text-orange-300"
                                    : "text-orange-600"
                                }`}
                              >
                                جرب البحث مرة أخرى أو تواصل مع إدارة المسابقة
                              </p>
                            </div>

                            <div className="text-center">
                              <div
                                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border transition-colors duration-300 ${
                                  isDarkMode
                                    ? "bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-amber-600/50"
                                    : "bg-gradient-to-r from-amber-100 to-orange-100 border-amber-200"
                                }`}
                              >
                                <Clock
                                  className={`w-5 h-5 animate-tick ${
                                    isDarkMode
                                      ? "text-amber-400"
                                      : "text-amber-600"
                                  }`}
                                />
                                <span
                                  className={`font-semibold ${
                                    isDarkMode
                                      ? "text-amber-200"
                                      : "text-amber-800"
                                  }`}
                                >
                                  النتائج متاحة للطلاب المشاركين فقط
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}

              <StatsSection isDarkMode={isDarkMode} />
              <AllResultsSection
                isDarkMode={isDarkMode}
              />
            </>
          )}

          {currentPage === "registration" && (
            <RegistrationPage isDarkMode={isDarkMode} />
          )}

          {currentPage === "schedule" && (
            <ExamSchedule isDarkMode={isDarkMode} />
          )}

          {currentPage === "news" && <NewsPage isDarkMode={isDarkMode} />}

          {currentPage === "donation" && (
            <DonationSection isDarkMode={isDarkMode} />
          )}

          <Footer isDarkMode={isDarkMode} />
        </>
      )}
    </div>
  );
}

export default App;