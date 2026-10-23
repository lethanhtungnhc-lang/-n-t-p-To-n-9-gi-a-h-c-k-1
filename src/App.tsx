import React, { useState, useEffect } from 'react';
import {
  GameMode,
  MathTopic,
  Question,
  TeacherMatrixSetting,
  LeaderboardEntry,
  PlanetStation,
  StudentAccount,
  StudentExamRecord,
  AdminSettings,
} from './types/mathGame';
import { INITIAL_QUESTIONS, INITIAL_PLANETS } from './data/questionBank';
import { GameHUD } from './components/GameHUD';
import { GalaxyMap } from './components/GalaxyMap';
import { QuestionCard } from './components/QuestionCard';
import { ExplanationModal } from './components/ExplanationModal';
import { SummaryReport } from './components/SummaryReport';
import { CosmicRobotMascot, MascotMood } from './components/CosmicRobotMascot';
import { MiniCalculator } from './components/MiniCalculator';
import { FormulaCheatsheet } from './components/FormulaCheatsheet';
import { TeacherDeck } from './components/TeacherDeck';
import { LeaderboardModal } from './components/LeaderboardModal';
import { StudentAuthModal } from './components/StudentAuthModal';
import { StudentGradebookModal } from './components/StudentGradebookModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { PWAInstallModal } from './components/PWAInstallModal';
import { soundManager } from './utils/audio';

type AppScreen = 'GALAXY_MAP' | 'PLAYING' | 'SUMMARY';

export default function App() {
  // Navigation & Screen State
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('GALAXY_MAP');
  const [currentMode, setCurrentMode] = useState<GameMode>('MAP_EXPLORATION');
  const [activeTopic, setActiveTopic] = useState<MathTopic | null>(null);

  // Administrator State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('toan9_admin_auth') === 'true';
  });

  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('toan9_admin_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.adminPasscode || parsed.adminPasscode === 'admin123') {
          parsed.adminPasscode = 'admin@12345';
        }
        return parsed;
      } catch {
        // fallback
      }
    }
    return {
      adminPasscode: 'admin@12345',
      isExamStrictMode: false,
      allPlanetsUnlocked: false,
    };
  });

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Student Accounts & Auth
  const [studentAccounts, setStudentAccounts] = useState<StudentAccount[]>(() => {
    const saved = localStorage.getItem('toan9_student_accounts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      {
        id: 'STD_01',
        fullName: 'Nguyễn Văn Minh',
        className: '9A1',
        studentCode: 'SBD-01',
        registeredAt: '22/10/2026 08:30:15',
        lastLoginAt: '23/10/2026 07:15:20',
      },
      {
        id: 'STD_02',
        fullName: 'Trần Quỳnh Anh',
        className: '9B',
        studentCode: 'SBD-02',
        registeredAt: '22/10/2026 09:12:00',
        lastLoginAt: '23/10/2026 07:45:10',
      },
      {
        id: 'STD_03',
        fullName: 'Lê Hoàng Nam',
        className: '9A2',
        studentCode: 'SBD-03',
        registeredAt: '21/10/2026 14:20:45',
        lastLoginAt: '22/10/2026 16:30:00',
      },
    ];
  });

  const [currentStudent, setCurrentStudent] = useState<StudentAccount | null>(() => {
    const saved = localStorage.getItem('toan9_current_student');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return null;
  });

  // Exam Records (Sổ Điểm & Nhật Ký Làm Bài)
  const [examRecords, setExamRecords] = useState<StudentExamRecord[]>(() => {
    const saved = localStorage.getItem('toan9_exam_records');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      {
        id: 'REC_01',
        studentId: 'STD_01',
        studentName: 'Nguyễn Văn Minh',
        className: '9A1',
        loginTime: '23/10/2026 07:15:20',
        examStartTime: '23/10/2026 07:16:00',
        examCompletedTime: '23/10/2026 07:30:20',
        durationSeconds: 860,
        mode: 'BOSS_CAMPAIGN',
        modeLabel: '4. Chinh Phục Đỉnh Cao (TT22)',
        score: 1250,
        maxScore: 1300,
        correctCount: 9,
        totalQuestions: 9,
        accuracy: 100,
        tt22Grade: 'Tốt',
      },
      {
        id: 'REC_02',
        studentId: 'STD_02',
        studentName: 'Trần Quỳnh Anh',
        className: '9B',
        loginTime: '23/10/2026 07:45:10',
        examStartTime: '23/10/2026 07:46:00',
        examCompletedTime: '23/10/2026 07:58:45',
        durationSeconds: 765,
        mode: 'OBSTACLE_DASH',
        modeLabel: '2. Vượt Chướng Ngại Vật',
        score: 1100,
        maxScore: 1200,
        correctCount: 8,
        totalQuestions: 9,
        accuracy: 89,
        tt22Grade: 'Tốt',
      },
      {
        id: 'REC_03',
        studentId: 'STD_03',
        studentName: 'Lê Hoàng Nam',
        className: '9A2',
        loginTime: '22/10/2026 16:30:00',
        examStartTime: '22/10/2026 16:31:00',
        examCompletedTime: '22/10/2026 16:41:15',
        durationSeconds: 615,
        mode: 'WARM_UP',
        modeLabel: '1. Khởi Động Nhanh',
        score: 980,
        maxScore: 1200,
        correctCount: 7,
        totalQuestions: 8,
        accuracy: 88,
        tt22Grade: 'Khá',
      },
    ];
  });

  // Question Bank
  const [allQuestions, setAllQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem('toan9_question_bank');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_QUESTIONS;
  });

  const [activeRoundQuestions, setActiveRoundQuestions] = useState<Question[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  // Teacher Matrix Setting
  const [matrixSetting, setMatrixSetting] = useState<TeacherMatrixSetting>(() => {
    const saved = localStorage.getItem('toan9_matrix_setting');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      nhanBietRatio: 40,
      thongHieuRatio: 30,
      vanDungRatio: 20,
      vanDungCaoRatio: 10,
      timePerQuestion: 0,
      showHints: true,
      allowRetries: true,
    };
  });

  // Galaxy Map Planets & Progress
  const [planets, setPlanets] = useState<PlanetStation[]>(() => {
    const saved = localStorage.getItem('toan9_planets_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_PLANETS;
  });

  // Player Scoring & Session Tracking
  const [playerName, setPlayerName] = useState(() => currentStudent?.fullName || 'Phi Hành Gia 9');
  const [playerTeam, setPlayerTeam] = useState(() => currentStudent?.className || '9A1');
  const [totalScore, setTotalScore] = useState(() => Number(localStorage.getItem('toan9_total_score')) || 0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [answeredLog, setAnsweredLog] = useState<{ question: Question; isCorrect: boolean }[]>([]);

  // Timestamps
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimedMode, setIsTimedMode] = useState(false);
  const [roundStartTime, setRoundStartTime] = useState(0);
  const [roundDuration, setRoundDuration] = useState(0);
  const [examFormattedStartTime, setExamFormattedStartTime] = useState('');

  // Modals
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [isCheatsheetOpen, setIsCheatsheetOpen] = useState(false);
  const [isTeacherDeckOpen, setIsTeacherDeckOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isGradebookModalOpen, setIsGradebookModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(() => soundManager.getIsMuted());

  // Mascot Mood
  const [mascotMood, setMascotMood] = useState<MascotMood>('idle');

  // Explanation Modal
  const [showExplanation, setShowExplanation] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [lastEarnedPoints, setLastEarnedPoints] = useState(0);
  const [lastStreakBonus, setLastStreakBonus] = useState(0);

  // Leaderboard Entries
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem('toan9_leaderboard');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      { id: '1', name: 'Nguyễn Văn Minh', team: '9A1', score: 1250, accuracy: 95, timestamp: 'Hôm nay', mode: 'BOSS_CAMPAIGN' },
      { id: '2', name: 'Trần Quỳnh Anh', team: '9B', score: 1100, accuracy: 90, timestamp: 'Hôm qua', mode: 'OBSTACLE_DASH' },
      { id: '3', name: 'Lê Hoàng Nam', team: '9A2', score: 980, accuracy: 85, timestamp: '2 ngày trước', mode: 'WARM_UP' },
    ];
  });

  // LocalStorage Sync
  useEffect(() => {
    localStorage.setItem('toan9_admin_auth', String(isAdminAuthenticated));
  }, [isAdminAuthenticated]);

  useEffect(() => {
    localStorage.setItem('toan9_admin_settings', JSON.stringify(adminSettings));
  }, [adminSettings]);

  useEffect(() => {
    localStorage.setItem('toan9_student_accounts', JSON.stringify(studentAccounts));
  }, [studentAccounts]);

  useEffect(() => {
    if (currentStudent) {
      localStorage.setItem('toan9_current_student', JSON.stringify(currentStudent));
      setPlayerName(currentStudent.fullName);
      setPlayerTeam(currentStudent.className);
    } else {
      localStorage.removeItem('toan9_current_student');
    }
  }, [currentStudent]);

  useEffect(() => {
    localStorage.setItem('toan9_exam_records', JSON.stringify(examRecords));
  }, [examRecords]);

  useEffect(() => {
    localStorage.setItem('toan9_question_bank', JSON.stringify(allQuestions));
  }, [allQuestions]);

  useEffect(() => {
    localStorage.setItem('toan9_matrix_setting', JSON.stringify(matrixSetting));
  }, [matrixSetting]);

  useEffect(() => {
    localStorage.setItem('toan9_planets_progress', JSON.stringify(planets));
  }, [planets]);

  useEffect(() => {
    localStorage.setItem('toan9_total_score', String(totalScore));
  }, [totalScore]);

  useEffect(() => {
    localStorage.setItem('toan9_leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  // Timer Tick
  useEffect(() => {
    if (currentScreen !== 'PLAYING' || !isTimedMode || timeLeft <= 0 || showExplanation) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswerSubmitted(false, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentScreen, isTimedMode, timeLeft, showExplanation]);

  const getNowFormatted = () => {
    return new Date().toLocaleString('vi-VN', {
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Admin Auth Handlers (Username: admin, Password: admin@12345)
  const handleAdminLogin = (username: string, pass: string) => {
    const normalizedUser = (username || '').trim().toLowerCase();
    const isUserValid = normalizedUser === 'admin';
    const isPassValid =
      pass === adminSettings.adminPasscode ||
      pass === 'admin@12345';

    if (isUserValid && isPassValid) {
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
  };

  const handleStudentLogout = () => {
    soundManager.playClick();
    setCurrentStudent(null);
    localStorage.removeItem('toan9_current_student');
    setPlayerName('Phi Hành Gia 9');
    setPlayerTeam('9A1');
  };

  const handleUnlockAllPlanets = () => {
    setPlanets((prev) =>
      prev.map((p) => ({
        ...p,
        unlocked: true,
      }))
    );
  };

  // Start Playing a Station from Map
  const startStationRound = (topicId: MathTopic) => {
    setActiveTopic(topicId);
    setCurrentMode('MAP_EXPLORATION');
    const filtered = allQuestions.filter((q) => q.topic === topicId);
    const questionsToPlay = filtered.length > 0 ? filtered : allQuestions.slice(0, 5);

    setActiveRoundQuestions(questionsToPlay);
    setCurrentQuestionIdx(0);
    setRoundScore(0);
    setCurrentStreak(0);
    setAnsweredLog([]);
    setIsTimedMode(false);
    setRoundStartTime(Date.now());
    setExamFormattedStartTime(getNowFormatted());
    setCurrentScreen('PLAYING');
    setMascotMood('idle');
  };

  // Start Specialized Game Mode
  const startGameMode = (mode: GameMode) => {
    setCurrentMode(mode);
    setActiveTopic(null);
    let selected: Question[] = [];

    if (mode === 'WARM_UP') {
      selected = allQuestions.filter((q) => q.level === 'NHAN_BIET' || q.level === 'THONG_HIEU');
      setIsTimedMode(false);
    } else if (mode === 'OBSTACLE_DASH') {
      selected = [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, 6);
      setIsTimedMode(true);
      setTimeLeft(45);
    } else if (mode === 'COGNITIVE_LAB') {
      selected = allQuestions.filter((q) => q.type !== 'MCQ');
      if (selected.length < 4) {
        selected = allQuestions.slice(0, 5);
      }
      setIsTimedMode(false);
    } else if (mode === 'BOSS_CAMPAIGN') {
      const nb = allQuestions.filter((q) => q.level === 'NHAN_BIET');
      const th = allQuestions.filter((q) => q.level === 'THONG_HIEU');
      const vd = allQuestions.filter((q) => q.level === 'VAN_DUNG');
      const vdc = allQuestions.filter((q) => q.level === 'VAN_DUNG_CAO');

      selected = [
        ...nb.slice(0, 3),
        ...th.slice(0, 3),
        ...vd.slice(0, 2),
        ...vdc.slice(0, 1),
      ];
      setIsTimedMode(matrixSetting.timePerQuestion > 0);
      if (matrixSetting.timePerQuestion > 0) {
        setTimeLeft(matrixSetting.timePerQuestion);
      }
    }

    setActiveRoundQuestions(selected.length > 0 ? selected : allQuestions.slice(0, 5));
    setCurrentQuestionIdx(0);
    setRoundScore(0);
    setCurrentStreak(0);
    setAnsweredLog([]);
    setRoundStartTime(Date.now());
    setExamFormattedStartTime(getNowFormatted());
    setCurrentScreen('PLAYING');
    setMascotMood('idle');
  };

  // Answer Submitted Handler
  const handleAnswerSubmitted = (isCorrect: boolean, hintsUsed: number) => {
    const currentQ = activeRoundQuestions[currentQuestionIdx];
    if (!currentQ) return;

    let points = 0;
    let streakBonus = 0;

    if (isCorrect) {
      soundManager.playCorrect(currentStreak + 1);
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);

      const base = currentQ.points;
      const hintPenalty = hintsUsed * 20;
      points = Math.max(base - hintPenalty, 30);

      if (newStreak >= 2) {
        streakBonus = Math.round(points * (newStreak * 0.15));
      }

      setRoundScore((prev) => prev + points + streakBonus);
      setTotalScore((prev) => prev + points + streakBonus);
      setMascotMood(newStreak >= 3 ? 'cheer' : 'happy');
    } else {
      soundManager.playWrong();
      setCurrentStreak(0);
      setMascotMood('encouraging');
    }

    setLastAnswerCorrect(isCorrect);
    setLastEarnedPoints(points);
    setLastStreakBonus(streakBonus);
    setAnsweredLog((prev) => [...prev, { question: currentQ, isCorrect }]);
    setShowExplanation(true);
  };

  // Move to Next Question or Summary
  const handleProceedNext = () => {
    setShowExplanation(false);
    if (currentQuestionIdx + 1 < activeRoundQuestions.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setMascotMood('idle');
      if (isTimedMode) {
        setTimeLeft(currentMode === 'OBSTACLE_DASH' ? 45 : matrixSetting.timePerQuestion || 60);
      }
    } else {
      // Completed Round!
      const totalSeconds = Math.round((Date.now() - roundStartTime) / 1000);
      setRoundDuration(totalSeconds);
      const nowFormatted = getNowFormatted();

      // If playing a station on the map, update planet stars
      if (activeTopic) {
        const correctCount = answeredLog.filter((a) => a.isCorrect).length;
        const total = answeredLog.length || 1;
        const pct = correctCount / total;
        let earnedStars = 1;
        if (pct >= 0.85) earnedStars = 3;
        else if (pct >= 0.6) earnedStars = 2;

        setPlanets((prev) => {
          const updated = prev.map((p) => {
            if (p.id === activeTopic) {
              return {
                ...p,
                stars: Math.max(p.stars, earnedStars),
                bestScore: Math.max(p.bestScore, roundScore),
              };
            }
            return p;
          });

          const currentPlanetIdx = updated.findIndex((p) => p.id === activeTopic);
          if (currentPlanetIdx >= 0 && currentPlanetIdx + 1 < updated.length) {
            updated[currentPlanetIdx + 1].unlocked = true;
          }
          return updated;
        });
      }

      const correctCount = answeredLog.filter((a) => a.isCorrect).length;
      const accuracy = Math.round((correctCount / (answeredLog.length || 1)) * 100);

      // Record to Leaderboard
      const newEntry: LeaderboardEntry = {
        id: `LB_${Date.now()}`,
        name: currentStudent?.fullName || playerName,
        team: currentStudent?.className || playerTeam,
        score: roundScore,
        accuracy,
        timestamp: 'Vừa xong',
        mode: currentMode,
      };
      setLeaderboard((prev) => [newEntry, ...prev.slice(0, 19)]);

      // Record to Sổ Điểm Học Sinh (StudentExamRecord)
      let tt22Grade: 'Tốt' | 'Khá' | 'Đạt' | 'Chưa đạt' = 'Chưa đạt';
      if (accuracy >= 85) tt22Grade = 'Tốt';
      else if (accuracy >= 70) tt22Grade = 'Khá';
      else if (accuracy >= 50) tt22Grade = 'Đạt';

      const modeLabels: Record<GameMode, string> = {
        WARM_UP: '1. Khởi Động Nhanh',
        OBSTACLE_DASH: '2. Vượt Chướng Ngại Vật',
        COGNITIVE_LAB: '3. Thử Thách Tư Duy',
        BOSS_CAMPAIGN: '4. Chinh Phục Đỉnh Cao (TT22)',
        MAP_EXPLORATION: 'Khám Phá Trạm Vũ Trụ',
      };

      const newExamRecord: StudentExamRecord = {
        id: `REC_${Date.now()}`,
        studentId: currentStudent?.id || 'GUEST',
        studentName: currentStudent?.fullName || playerName || 'Học sinh',
        className: currentStudent?.className || playerTeam || '9A',
        loginTime: currentStudent?.lastLoginAt || examFormattedStartTime || nowFormatted,
        examStartTime: examFormattedStartTime || nowFormatted,
        examCompletedTime: nowFormatted,
        durationSeconds: totalSeconds,
        mode: currentMode,
        modeLabel: modeLabels[currentMode] || 'Bài thi Toán 9',
        topic: activeTopic || undefined,
        score: roundScore,
        maxScore: activeRoundQuestions.reduce((a, b) => a + b.points, 0),
        correctCount,
        totalQuestions: activeRoundQuestions.length,
        accuracy,
        tt22Grade,
      };

      setExamRecords((prev) => [newExamRecord, ...prev]);
      setCurrentScreen('SUMMARY');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white relative">
      {/* Dynamic Starfield Canvas Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      {/* Top HUD */}
      <GameHUD
        score={currentScreen === 'PLAYING' ? roundScore : totalScore}
        streak={currentStreak}
        timeLeft={timeLeft}
        isTimed={isTimedMode && currentScreen === 'PLAYING'}
        isMuted={isMuted}
        student={currentStudent}
        isAdmin={isAdminAuthenticated}
        onToggleMute={() => setIsMuted(soundManager.toggleMute())}
        onOpenCalculator={() => setIsCalcOpen(true)}
        onOpenCheatsheet={() => setIsCheatsheetOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={currentStudent ? handleStudentLogout : undefined}
        onOpenGradebook={() => setIsGradebookModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onExitRound={
          currentScreen !== 'GALAXY_MAP'
            ? () => {
                soundManager.playClick();
                setCurrentScreen('GALAXY_MAP');
              }
            : undefined
        }
        modeTitle={
          currentScreen === 'PLAYING'
            ? currentMode === 'WARM_UP'
              ? 'Khởi Động Nhanh'
              : currentMode === 'OBSTACLE_DASH'
              ? 'Vượt Chướng Ngại Vật'
              : currentMode === 'COGNITIVE_LAB'
              ? 'Thử Thách Tư Duy'
              : currentMode === 'BOSS_CAMPAIGN'
              ? 'Chinh Phục Đỉnh Cao (TT22)'
              : 'Trạm Vũ Trụ'
            : 'Vũ Trụ Toán 9'
        }
      />

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 flex flex-col">
        {/* SCREEN 1: GALAXY MAP */}
        {currentScreen === 'GALAXY_MAP' && (
          <GalaxyMap
            planets={planets}
            onSelectStation={startStationRound}
            onSelectMode={startGameMode}
            onOpenTeacherDeck={() => setIsTeacherDeckOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onOpenGradebook={() => setIsGradebookModalOpen(true)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenAdmin={() => setIsAdminModalOpen(true)}
            isAdmin={isAdminAuthenticated}
            currentStudent={currentStudent}
            totalScore={totalScore}
          />
        )}

        {/* SCREEN 2: ACTIVE QUESTION ROUND */}
        {currentScreen === 'PLAYING' && activeRoundQuestions[currentQuestionIdx] && (
          <div className="flex-1 flex flex-col justify-center space-y-6 max-w-4xl mx-auto w-full">
            {/* Robot Mascot Interaction Row */}
            <div className="flex justify-center md:justify-start">
              <CosmicRobotMascot mood={mascotMood} />
            </div>

            {/* Question Card */}
            <QuestionCard
              question={activeRoundQuestions[currentQuestionIdx]}
              currentIndex={currentQuestionIdx}
              totalQuestions={activeRoundQuestions.length}
              onAnswer={handleAnswerSubmitted}
              allowHints={!adminSettings.isExamStrictMode && matrixSetting.showHints}
            />
          </div>
        )}

        {/* SCREEN 3: ASSESSMENT REPORT */}
        {currentScreen === 'SUMMARY' && (
          <div className="flex-1 flex items-center justify-center py-4">
            <SummaryReport
              score={roundScore}
              totalPossibleScore={activeRoundQuestions.reduce((a, b) => a + b.points, 0)}
              correctCount={answeredLog.filter((a) => a.isCorrect).length}
              totalQuestions={activeRoundQuestions.length}
              timeSpentSeconds={roundDuration}
              answeredQuestions={answeredLog}
              onPlayAgain={() => {
                if (activeTopic) startStationRound(activeTopic);
                else startGameMode(currentMode);
              }}
              onBackToMap={() => setCurrentScreen('GALAXY_MAP')}
              playerName={currentStudent?.fullName || playerName}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/90 px-4 py-4 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="font-bold text-slate-300">Chinh Phục Vũ Trụ Toán Học 9</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-400 font-semibold">Bản quyền: Teacher Lê Thanh Tùng</span>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 text-slate-500">
            <span>Chuẩn GDPT 2018 & TT 22/2021/TT-BGDĐT</span>
            <span aria-hidden="true">·</span>
            <span>PWA Ngoại tuyến</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {showExplanation && activeRoundQuestions[currentQuestionIdx] && (
        <ExplanationModal
          question={activeRoundQuestions[currentQuestionIdx]}
          isCorrect={lastAnswerCorrect}
          earnedPoints={lastEarnedPoints}
          streakBonus={lastStreakBonus}
          onNext={handleProceedNext}
          isLastQuestion={currentQuestionIdx + 1 >= activeRoundQuestions.length}
        />
      )}

      {/* Admin Portal Modal (Toàn Quyền) */}
      <AdminPortalModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        isAdmin={isAdminAuthenticated}
        onAdminLogin={handleAdminLogin}
        onAdminLogout={handleAdminLogout}
        adminSettings={adminSettings}
        onUpdateAdminSettings={setAdminSettings}
        studentAccounts={studentAccounts}
        onAddStudent={(newAcc) => setStudentAccounts((prev) => [newAcc, ...prev])}
        onDeleteStudent={(id) => setStudentAccounts((prev) => prev.filter((s) => s.id !== id))}
        examRecords={examRecords}
        onDeleteRecord={(id) => setExamRecords((prev) => prev.filter((r) => r.id !== id))}
        onClearAllRecords={() => setExamRecords([])}
        onUnlockAllPlanets={handleUnlockAllPlanets}
        planets={planets}
        matrixSetting={matrixSetting}
        onUpdateMatrix={setMatrixSetting}
      />

      {/* Student Auth & Profile Modal */}
      <StudentAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        accounts={studentAccounts}
        currentStudent={currentStudent}
        examRecords={examRecords}
        onLogin={(acc) => {
          setCurrentStudent(acc);
          setPlayerName(acc.fullName);
          setPlayerTeam(acc.className);
        }}
        onRegister={(newAcc) => {
          setStudentAccounts((prev) => [newAcc, ...prev]);
          setCurrentStudent(newAcc);
          setPlayerName(newAcc.fullName);
          setPlayerTeam(newAcc.className);
        }}
        onLogout={handleStudentLogout}
      />

      {/* Sổ Điểm & Nhật Ký Làm Bài Modal */}
      <StudentGradebookModal
        isOpen={isGradebookModalOpen}
        onClose={() => setIsGradebookModalOpen(false)}
        records={examRecords}
        onClearRecords={() => setExamRecords([])}
      />

      <MiniCalculator isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />
      
      <FormulaCheatsheet isOpen={isCheatsheetOpen} onClose={() => setIsCheatsheetOpen(false)} />

      <TeacherDeck
        isOpen={isTeacherDeckOpen}
        onClose={() => setIsTeacherDeckOpen(false)}
        matrixSetting={matrixSetting}
        onUpdateMatrix={(newSet) => {
          setMatrixSetting(newSet);
          setIsTeacherDeckOpen(false);
        }}
        questions={allQuestions}
        onAddQuestion={(newQ) => setAllQuestions((prev) => [newQ, ...prev])}
        onDeleteQuestion={(id) => setAllQuestions((prev) => prev.filter((q) => q.id !== id))}
        onShuffleQuestions={() =>
          setAllQuestions((prev) => [...prev].sort(() => 0.5 - Math.random()))
        }
        onOpenGradebook={() => setIsGradebookModalOpen(true)}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        entries={leaderboard}
        currentName={currentStudent?.fullName || playerName}
        onUpdateName={(name, isTeam, team) => {
          setPlayerName(name);
          localStorage.setItem('toan9_player_name', name);
          if (isTeam && team) {
            setPlayerTeam(team);
            localStorage.setItem('toan9_player_team', team);
          } else {
            setPlayerTeam('');
            localStorage.removeItem('toan9_player_team');
          }
          setIsLeaderboardOpen(false);
        }}
      />

      <PWAInstallModal />
    </div>
  );
}
