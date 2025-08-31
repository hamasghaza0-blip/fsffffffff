import { Student, ContestStats } from '../types';

export const calculateStats = (students: Student[]): ContestStats => {
  if (!students || students.length === 0) {
    return {
      totalStudents: 0,
      categories: [],
      averageGrade: 0,
      topGrade: 0,
      categoriesCount: {}
    };
  }

  const totalStudents = students.length;
  const categories = [...new Set(students.map(s => s.category))];
  const grades = students.map(s => s.grade).filter(g => g > 0);
  const averageGrade = grades.length > 0 ? Math.round(grades.reduce((sum, grade) => sum + grade, 0) / grades.length) : 0;
  const topGrade = grades.length > 0 ? Math.max(...grades) : 0;
  
  const categoriesCount: { [key: string]: number } = {};
  students.forEach(student => {
    const category = student.category;
    categoriesCount[category] = (categoriesCount[category] || 0) + 1;
  });

  return {
    totalStudents,
    categories,
    averageGrade,
    topGrade,
    categoriesCount
  };
};

export const getCategoryColor = (category: string, isDarkMode: boolean = false) => {
  const colors: { [key: string]: { light: string; dark: string } } = {
    '3': { 
      light: 'bg-green-100 text-green-800 border-green-200', 
      dark: 'bg-green-900/50 text-green-200 border-green-600/50' 
    },
    '5': { 
      light: 'bg-blue-100 text-blue-800 border-blue-200', 
      dark: 'bg-blue-900/50 text-blue-200 border-blue-600/50' 
    },
    '8': { 
      light: 'bg-purple-100 text-purple-800 border-purple-200', 
      dark: 'bg-purple-900/50 text-purple-200 border-purple-600/50' 
    },
    '10': { 
      light: 'bg-orange-100 text-orange-800 border-orange-200', 
      dark: 'bg-orange-900/50 text-orange-200 border-orange-600/50' 
    },
    '15': { 
      light: 'bg-teal-100 text-teal-800 border-teal-200', 
      dark: 'bg-teal-900/50 text-teal-200 border-teal-600/50' 
    },
    '20': { 
      light: 'bg-indigo-100 text-indigo-800 border-indigo-200', 
      dark: 'bg-indigo-900/50 text-indigo-200 border-indigo-600/50' 
    },
    '25': { 
      light: 'bg-rose-100 text-rose-800 border-rose-200', 
      dark: 'bg-rose-900/50 text-rose-200 border-rose-600/50' 
    },
    '30': { 
      light: 'bg-amber-100 text-amber-800 border-amber-200', 
      dark: 'bg-amber-900/50 text-amber-200 border-amber-600/50' 
    }
  };

  const categoryKey = category.toString();
  const colorSet = colors[categoryKey] || { 
    light: 'bg-gray-100 text-gray-800 border-gray-200', 
    dark: 'bg-gray-700/50 text-gray-200 border-gray-500/50' 
  };
  
  return isDarkMode ? colorSet.dark : colorSet.light;
};

export const getGradeColor = (grade: number, isDarkMode: boolean = false) => {
  if (grade >= 95) {
    return isDarkMode 
      ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-yellow-100' 
      : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900';
  } else if (grade >= 90) {
    return isDarkMode 
      ? 'bg-gradient-to-r from-green-600 to-green-500 text-green-100' 
      : 'bg-gradient-to-r from-green-400 to-green-500 text-green-900';
  } else if (grade >= 80) {
    return isDarkMode 
      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-blue-100' 
      : 'bg-gradient-to-r from-blue-400 to-blue-500 text-blue-900';
  } else if (grade >= 70) {
    return isDarkMode 
      ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-orange-100' 
      : 'bg-gradient-to-r from-orange-400 to-orange-500 text-orange-900';
  } else if (grade >= 60) {
    return isDarkMode 
      ? 'bg-gradient-to-r from-yellow-700 to-yellow-600 text-yellow-100' 
      : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-yellow-900';
  } else {
    return isDarkMode 
      ? 'bg-gradient-to-r from-red-600 to-red-500 text-red-100' 
      : 'bg-gradient-to-r from-red-400 to-red-500 text-red-900';
  }
};