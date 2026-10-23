import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Lightbulb, ArrowRight, Sparkles } from 'lucide-react';
import { Question } from '../types/mathGame';
import { MathView } from '../utils/katexHelper';

interface ExplanationModalProps {
  question: Question;
  isCorrect: boolean;
  earnedPoints: number;
  streakBonus: number;
  onNext: () => void;
  isLastQuestion?: boolean;
}

export const ExplanationModal: React.FC<ExplanationModalProps> = ({
  question,
  isCorrect,
  earnedPoints,
  streakBonus,
  onNext,
  isLastQuestion = false,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100 my-auto animate-in fade-in zoom-in duration-200">
        {/* Result Header Banner */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          {isCorrect ? (
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 size={28} />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
              <XCircle size={28} />
            </div>
          )}

          <div className="flex-1">
            <h3 className={`text-lg font-bold ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isCorrect ? 'Chính xác! Xuất sắc lắm!' : 'Chưa chính xác! Cùng ôn lại nhé!'}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>Điểm nhận: +{earnedPoints}</span>
              {streakBonus > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <Sparkles size={12} />
                    Thưởng chuỗi: +{streakBonus}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="my-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* Step-by-Step Solution */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <span>Lời Giải Từng Bước</span>
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-sm text-slate-300">
              {question.stepByStepSolution.map((step, idx) => (
                <div key={idx} className="leading-relaxed">
                  <MathView math={step} />
                </div>
              ))}
            </div>
          </div>

          {/* Teacher's Insight: Common Misconception */}
          {question.commonMisconception && (
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-600/40 space-y-1.5 text-xs text-amber-200">
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <AlertTriangle size={15} />
                <span>Góc Nhìn Giáo Viên · Sai Lầm Thường Gặp</span>
              </div>
              <p className="leading-relaxed text-amber-100/90">{question.commonMisconception}</p>
            </div>
          )}

          {/* Key Takeaway */}
          {question.keyTakeaway && (
            <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1.5 text-xs text-cyan-200">
              <div className="flex items-center gap-1.5 font-bold text-cyan-400">
                <Lightbulb size={15} />
                <span>Bí Kíp Cần Nhớ</span>
              </div>
              <p className="leading-relaxed text-cyan-100/90">{question.keyTakeaway}</p>
            </div>
          )}
        </div>

        {/* Footer Next Button */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all"
          >
            <span>{isLastQuestion ? 'Xem Báo Cáo Tổng Kết' : 'Câu Tiếp Theo'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
