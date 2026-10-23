import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Compass, Award, AlertCircle, CheckCircle, Printer, ArrowRight, Star } from 'lucide-react';
import { DifficultyLevel, MathTopic, Question } from '../types/mathGame';
import { soundManager } from '../utils/audio';

interface SummaryReportProps {
  score: number;
  totalPossibleScore: number;
  correctCount: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  answeredQuestions: { question: Question; isCorrect: boolean }[];
  onPlayAgain: () => void;
  onBackToMap: () => void;
  playerName: string;
}

export const SummaryReport: React.FC<SummaryReportProps> = ({
  score,
  totalPossibleScore,
  correctCount,
  totalQuestions,
  timeSpentSeconds,
  answeredQuestions,
  onPlayAgain,
  onBackToMap,
  playerName,
}) => {
  const accuracy = Math.round((correctCount / (totalQuestions || 1)) * 100);

  // Circular 22 Evaluation Grade
  let grade = 'Chưa Đạt';
  let gradeColor = 'text-rose-400 bg-rose-950/40 border-rose-500/40';
  let gradeFeedback = 'Bạn cần ôn tập thêm các định nghĩa và công thức cơ bản trước khi bay tiếp!';

  if (accuracy >= 85) {
    grade = 'Mức TỐT';
    gradeColor = 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40';
    gradeFeedback = 'Xuất sắc! Nắm vững toàn bộ kiến thức Giữa Học kỳ I theo chuẩn GDPT 2018!';
  } else if (accuracy >= 70) {
    grade = 'Mức KHÁ';
    gradeColor = 'text-cyan-400 bg-cyan-950/40 border-cyan-500/40';
    gradeFeedback = 'Rất tốt! Khả năng vận dụng kiến thức tốt, chỉ cần chú ý thêm vài sai lầm nhỏ.';
  } else if (accuracy >= 50) {
    grade = 'Mức ĐẠT';
    gradeColor = 'text-amber-400 bg-amber-950/40 border-amber-500/40';
    gradeFeedback = 'Đạt chuẩn! Hãy xem lại phần giải thích chi tiết các câu vận dụng để nâng cao điểm số.';
  }

  // Trigger celebration confetti if score is high
  useEffect(() => {
    soundManager.playVictory();
    if (accuracy >= 60) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#818cf8', '#facc15', '#4ade80'],
        });
      } catch {
        // fallback silently
      }
    }
  }, [accuracy]);

  // Breakdowns by Difficulty Level
  const levelStats: Record<DifficultyLevel, { total: number; correct: number }> = {
    NHAN_BIET: { total: 0, correct: 0 },
    THONG_HIEU: { total: 0, correct: 0 },
    VAN_DUNG: { total: 0, correct: 0 },
    VAN_DUNG_CAO: { total: 0, correct: 0 },
  };

  // Breakdowns by Topic for diagnostics
  const topicStats: Record<string, { total: number; correct: number }> = {};

  answeredQuestions.forEach(({ question, isCorrect }) => {
    if (levelStats[question.level]) {
      levelStats[question.level].total += 1;
      if (isCorrect) levelStats[question.level].correct += 1;
    }

    if (!topicStats[question.topic]) {
      topicStats[question.topic] = { total: 0, correct: 0 };
    }
    topicStats[question.topic].total += 1;
    if (isCorrect) topicStats[question.topic].correct += 1;
  });

  // Weak topics detection
  const TOPIC_NAMES: Record<string, string> = {
    CAN_THUC: 'Căn bậc hai & Căn thức',
    HE_PHUONG_TRINH: 'Hệ phương trình bậc nhất hai ẩn',
    BAT_DANG_THUC: 'Bất đẳng thức & Bất phương trình',
    HE_THUC_LUONG: 'Hệ thức lượng trong tam giác vuông',
    TONG_HOP_GIUA_KY: 'Bài toán tổng hợp & thực tế',
  };

  const weakTopics = Object.entries(topicStats)
    .filter(([_, stat]) => stat.total > 0 && stat.correct / stat.total < 0.7)
    .map(([topic]) => TOPIC_NAMES[topic] || topic);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl p-6 md:p-9 text-slate-100 space-y-7 animate-in fade-in zoom-in duration-300">
      {/* Top Banner */}
      <div className="text-center space-y-2 pb-4 border-b border-slate-800">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 uppercase tracking-widest">
          <Trophy size={16} />
          <span>Báo Cáo Tổng Kết Đánh Giá Theo Thông Tư 22/2021</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Chiến Dịch Hoàn Thành!
        </h2>
        <p className="text-sm text-slate-300">
          Nhà du hành: <strong className="text-cyan-300">{playerName || 'Thí sinh Toán 9'}</strong> · Thời gian: {formatTime(timeSpentSeconds)}
        </p>
        <div className="text-xs text-amber-300 font-medium">
          Hệ thống Ôn tập Giữa HK1 · Bản quyền: Teacher Lê Thanh Tùng
        </div>
      </div>

      {/* Main Score KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
          <div className="text-xs text-slate-400">Tổng Điểm</div>
          <div className="text-2xl md:text-3xl font-extrabold font-mono text-cyan-400 mt-1 tabular-nums">
            {score}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
          <div className="text-xs text-slate-400">Độ Chính Xác</div>
          <div className="text-2xl md:text-3xl font-extrabold font-mono text-white mt-1 tabular-nums">
            {accuracy}%
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
          <div className="text-xs text-slate-400">Số Câu Đúng</div>
          <div className="text-2xl md:text-3xl font-extrabold font-mono text-emerald-400 mt-1 tabular-nums">
            {correctCount}/{totalQuestions}
          </div>
        </div>

        <div className={`p-4 rounded-2xl border text-center ${gradeColor}`}>
          <div className="text-xs text-slate-300">Xếp Loại TT22</div>
          <div className="text-lg md:text-xl font-extrabold mt-1">
            {grade}
          </div>
        </div>
      </div>

      {/* Level Breakdown according to Circular 22 (Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao) */}
      <div className="space-y-3 p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
        <h3 className="text-sm font-bold text-white flex items-center justify-between">
          <span>Phân Hóa 4 Mức Độ Nhận Thức</span>
          <span className="text-xs text-slate-400 font-normal">Ma trận 40% - 30% - 20% - 10%</span>
        </h3>

        <div className="space-y-3 pt-2 text-xs">
          {[
            { key: 'NHAN_BIET' as DifficultyLevel, label: 'Nhận biết (Mục tiêu 40%)', color: 'bg-cyan-500' },
            { key: 'THONG_HIEU' as DifficultyLevel, label: 'Thông hiểu (Mục tiêu 30%)', color: 'bg-blue-500' },
            { key: 'VAN_DUNG' as DifficultyLevel, label: 'Vận dụng (Mục tiêu 20%)', color: 'bg-amber-500' },
            { key: 'VAN_DUNG_CAO' as DifficultyLevel, label: 'Vận dụng cao (Mục tiêu 10%)', color: 'bg-rose-500' },
          ].map(({ key, label, color }) => {
            const stat = levelStats[key];
            const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
            return (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-slate-300">
                  <span>{label}</span>
                  <span className="font-mono font-semibold">
                    {stat.correct}/{stat.total} câu ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${color} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Diagnostic & Remedial Recommendations */}
      <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-sm font-bold text-cyan-400">
          <AlertCircle size={16} />
          <span>Chẩn Đoán Năng Lực & Kế Hoạch Ôn Luyện Tiếp Theo</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {gradeFeedback}
        </p>

        {weakTopics.length > 0 ? (
          <div className="pt-2 border-t border-slate-800 text-xs text-amber-200">
            <span className="font-semibold text-amber-400">Kiến thức cần lưu ý củng cố: </span>
            <span>{weakTopics.join(', ')}. Hãy tra cứu lại công thức trong Sổ tay Bí Kíp và luyện thêm câu hỏi Thông hiểu của phần này!</span>
          </div>
        ) : (
          <div className="pt-2 border-t border-slate-800 text-xs text-emerald-300 flex items-center gap-1.5">
            <CheckCircle size={14} />
            <span>Bạn đã làm chủ rất đều tất cả các mảng kiến thức Đại số và Hình học!</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
        <button
          onClick={() => {
            soundManager.playClick();
            window.print();
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
        >
          <Printer size={15} />
          <span>In / Lưu Báo Cáo</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onPlayAgain();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
          >
            <RotateCcw size={15} />
            <span>Thử Thách Lại</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onBackToMap();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all"
          >
            <span>Về Bản Đồ Vũ Trụ</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
