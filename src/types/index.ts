export interface Student {
  id: number;
  name: string;
  category: string;
  grade: number;
  rank?: number;
}

export interface ContestStats {
  totalStudents: number;
  categories: string[];
  averageGrade: number;
  topGrade: number;
  categoriesCount: { [key: string]: number };
}

export interface RegisteredStudent {
  id: string;
  name: string;
  category: string;
  teacher: string;
}

export interface Reciter {
  id: number;
  name: string;
  category: string;
  teacher: string;
}

export interface Result {
  id: number;
  name: string;
  category: string;
  grade: number;
  rank?: number;
  teacher?: string;
}