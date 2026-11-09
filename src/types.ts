export interface OptionItem {
  id: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
}

export interface QuestionClient {
  id: number;
  question: string;
  formula?: string;
  targetFunction: 'СУММ' | 'ABS' | 'КОРЕНЬ' | 'СТЕПЕНЬ' | 'СУММЕСЛИ';
  spreadsheetData?: {
    columns: string[];
    rows: { rowNum: number; cells: Record<string, string | number> }[];
    highlightRange?: string;
  };
  options: OptionItem[];
}

export interface QuestionServerItem extends QuestionClient {
  correctAnswer: string; // 'A', 'B', 'C', 'D'
  explanation: string;
}

export interface QuestionReviewItem {
  id: number;
  question: string;
  formula?: string;
  targetFunction: string;
  options: OptionItem[];
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  spreadsheetData?: QuestionClient['spreadsheetData'];
}

export interface SubmitQuizResponse {
  score: number;
  maxScore: number;
  studentName: string;
  studentClass: string;
  sessionId: string;
  createdAt: string;
  savedToDatabase: boolean;
  results: QuestionReviewItem[];
}

export interface LeaderboardEntry {
  rank: number;
  studentName: string;
  studentClass: string;
  score: number;
  maxScore: number;
  createdAt: string;
  formattedDate: string;
  attemptsCount?: number;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  totalSubmissions: number;
  classes: string[];
  lastUpdated: string;
}
