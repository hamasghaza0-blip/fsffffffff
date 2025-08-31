import { Student } from '../types';

export const studentsData: Student[] = [
  { id: 1001, name: "أحمد محمد علي", category: "ثلاثة أجزاء", grade: 95 },
  { id: 1002, name: "فاطمة إبراهيم", category: "خمسة أجزاء", grade: 88 },
  { id: 1003, name: "عمر حسن", category: "ثمانية أجزاء", grade: 92 },
  { id: 1004, name: "نور الدين محمود", category: "عشرة أجزاء", grade: 85 },
  
  { id: 2001, name: "يوسف الأحمد", category: "خمسة عشر جزءا", grade: 97 },
  { id: 2002, name: "مريم سالم", category: "عشرون جزءا", grade: 89 },
  { id: 2003, name: "حسام النجار", category: "خمسة وعشرون جزءا", grade: 94 },
  { id: 2004, name: "ليلى الخطيب", category: "ثلاثون جزءا", grade: 91 }
];

// Add ranks to students based on their grades
export const rankedStudents = studentsData
  .sort((a, b) => b.grade - a.grade)
  .map((student, index) => ({
    ...student,
    rank: index + 1
  }));