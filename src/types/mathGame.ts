export type DifficultyLevel = 'NHAN_BIET' | 'THONG_HIEU' | 'VAN_DUNG' | 'VAN_DUNG_CAO';

export type QuestionType = 'MCQ' | 'TRUE_FALSE' | 'FILL_IN' | 'MATCHING' | 'SHORT_ESSAY';

export type MathTopic = 
  | 'HE_PHUONG_TRINH'      // Chương I: Phương trình và hệ hai phương trình bậc nhất hai ẩn
  | 'BAT_DANG_THUC'        // Chương II: Bất đẳng thức. Bất phương trình bậc nhất một ẩn
  | 'CAN_THUC'             // Chương III: Căn bậc hai và căn bậc ba
  | 'HE_THUC_LUONG'        // Chương IV: Hệ thức lượng trong tam giác vuông
  | 'TONG_HOP_GIUA_KY';    // Vận dụng tổng hợp & toán thực tế

export interface MatchingPair {
  id: string;
  left: string;   // Math expression or prompt (KaTeX)
  right: string;  // Matching item or answer (KaTeX)
}

export interface TrueFalseItem {
  id: string;
  statement: string; // KaTeX supported
  isCorrect: boolean;
  explanation: string;
}

export interface RubricItem {
  criterion: string;
  points: number;
}

export interface Question {
  id: string;
  topic: MathTopic;
  level: DifficultyLevel;
  type: QuestionType;
  prompt: string; // Markdown / KaTeX prompt
  latexFormula?: string;
  options?: string[]; // For MCQ (array of 4 strings with KaTeX)
  correctOptionIndex?: number; // 0..3 for MCQ
  trueFalseItems?: TrueFalseItem[]; // For True/False
  fillInAnswer?: string | string[]; // Accepted values for Fill-in (e.g. ["2", "x=2", "2.0"])
  matchingPairs?: MatchingPair[]; // For Matching
  rubric?: RubricItem[]; // For Short Essay
  
  hint1: string; // Light hint
  hint2: string; // Detailed hint
  stepByStepSolution: string[]; // Step 1, Step 2, Step 3
  commonMisconception: string; // Sai lầm học sinh thường gặp (kinh nghiệm 20 năm GV)
  keyTakeaway: string; // Ghi nhớ cốt lõi
  points: number; // Base points (e.g. 100)
}

export type GameMode = 
  | 'MAP_EXPLORATION'    // Bản đồ hành trình vũ trụ
  | 'WARM_UP'            // Khởi động (Tăng tốc phi thuyền)
  | 'OBSTACLE_DASH'      // Vượt chướng ngại vật (Tránh thiên thạch - tính giờ)
  | 'COGNITIVE_LAB'      // Thử thách tư duy (Ghép nối, Điền khuyết, Bắt lỗi)
  | 'BOSS_CAMPAIGN';     // Chinh phục đỉnh cao (Đề thi thử chuẩn TT22 ma trận 40-30-20-10)

export interface PlanetStation {
  id: MathTopic;
  name: string;
  subtitle: string;
  iconName: string;
  color: string;
  glowColor: string;
  questionCount: number;
  unlocked: boolean;
  stars: number; // 0 to 3
  bestScore: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'accuracy' | 'streak' | 'topic' | 'mastery';
  unlockedAt?: string;
}

export interface PlayerStats {
  playerName: string;
  playerRole: 'solo' | 'team';
  teamName?: string;
  totalScore: number;
  questionsAnswered: number;
  correctAnswers: number;
  currentStreak: number;
  bestStreak: number;
  levelBreakdown: Record<DifficultyLevel, { total: number; correct: number }>;
  topicBreakdown: Record<MathTopic, { total: number; correct: number }>;
  timeSpentSeconds: number;
  hintsUsedCount: number;
  badges: string[]; // Badge IDs
}

export interface TeacherMatrixSetting {
  nhanBietRatio: number;   // default 40
  thongHieuRatio: number;  // default 30
  vanDungRatio: number;    // default 20
  vanDungCaoRatio: number; // default 10
  timePerQuestion: number; // in seconds (0 = untimed)
  showHints: boolean;
  allowRetries: boolean;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  team?: string;
  score: number;
  accuracy: number;
  timestamp: string;
  mode: GameMode;
}

export interface StudentAccount {
  id: string;
  fullName: string;
  className: string;
  studentCode?: string;
  registeredAt: string;
  lastLoginAt: string;
}

export interface StudentExamRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  loginTime: string;          // Ngày giờ đăng nhập (DD/MM/YYYY HH:mm:ss)
  examStartTime: string;      // Ngày giờ bắt đầu làm bài (DD/MM/YYYY HH:mm:ss)
  examCompletedTime: string;  // Ngày giờ nộp bài (DD/MM/YYYY HH:mm:ss)
  durationSeconds: number;    // Thời gian làm bài (tính bằng giây)
  mode: GameMode;
  modeLabel: string;
  topic?: MathTopic;
  score: number;
  maxScore: number;
  correctCount: number;
  totalQuestions: number;
  accuracy: number;           // % chính xác
  tt22Grade: 'Tốt' | 'Khá' | 'Đạt' | 'Chưa đạt';
}

export interface AdminSettings {
  adminPasscode: string;       // default: "admin@12345"
  isExamStrictMode: boolean;   // default: false (if true, locks hints during exam)
  allPlanetsUnlocked: boolean; // default: false
}

