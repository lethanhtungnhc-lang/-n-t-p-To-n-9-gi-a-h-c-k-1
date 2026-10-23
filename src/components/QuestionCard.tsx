import React, { useState } from 'react';
import { Lightbulb, Send, Check, Shuffle } from 'lucide-react';
import { Question, DifficultyLevel } from '../types/mathGame';
import { MathView } from '../utils/katexHelper';
import { soundManager } from '../utils/audio';

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean, hintsUsed: number) => void;
  allowHints?: boolean;
}

const LEVEL_LABELS: Record<DifficultyLevel, { text: string; color: string }> = {
  NHAN_BIET: { text: 'Nhận biết (40%)', color: 'text-cyan-400' },
  THONG_HIEU: { text: 'Thông hiểu (30%)', color: 'text-blue-400' },
  VAN_DUNG: { text: 'Vận dụng (20%)', color: 'text-amber-400' },
  VAN_DUNG_CAO: { text: 'Vận dụng cao (10%)', color: 'text-rose-400' },
};

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  onAnswer,
  allowHints = true,
}) => {
  // State for MCQ
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // State for True/False (record choices: id -> boolean)
  const [tfChoices, setTfChoices] = useState<Record<string, boolean>>({});

  // State for Fill-in
  const [fillInput, setFillInput] = useState('');

  // State for Matching
  const [matchingConnections, setMatchingConnections] = useState<Record<string, string>>({});
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);

  // State for Essay Rubric
  const [rubricScores, setRubricScores] = useState<Record<number, boolean>>({});

  // Hints
  const [hintLevel, setHintLevel] = useState<number>(0);

  const handleUseHint = () => {
    soundManager.playHint();
    setHintLevel((prev) => Math.min(prev + 1, 2));
  };

  // Submission Handlers
  const handleMcqSubmit = (idx: number) => {
    setSelectedOption(idx);
    soundManager.playClick();
    const isCorrect = idx === question.correctOptionIndex;
    onAnswer(isCorrect, hintLevel);
  };

  const handleTfSubmit = () => {
    soundManager.playClick();
    if (!question.trueFalseItems) return;
    // Check all items
    const allCorrect = question.trueFalseItems.every(
      (item) => tfChoices[item.id] === item.isCorrect
    );
    onAnswer(allCorrect, hintLevel);
  };

  const handleFillInSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    soundManager.playClick();
    const cleanUser = fillInput.trim().toLowerCase().replace(/\s+/g, '');
    const validAnswers = Array.isArray(question.fillInAnswer)
      ? question.fillInAnswer.map((a) => a.toLowerCase().replace(/\s+/g, ''))
      : [String(question.fillInAnswer).toLowerCase().replace(/\s+/g, '')];

    const isCorrect = validAnswers.includes(cleanUser);
    onAnswer(isCorrect, hintLevel);
  };

  const handleMatchingLeftClick = (id: string) => {
    soundManager.playClick();
    setSelectedLeftId(id);
  };

  const handleMatchingRightClick = (rightText: string) => {
    if (!selectedLeftId) return;
    soundManager.playClick();
    setMatchingConnections((prev) => ({
      ...prev,
      [selectedLeftId]: rightText,
    }));
    setSelectedLeftId(null);
  };

  const handleMatchingSubmit = () => {
    soundManager.playClick();
    if (!question.matchingPairs) return;
    const allMatchedCorrectly = question.matchingPairs.every(
      (pair) => matchingConnections[pair.id] === pair.right
    );
    onAnswer(allMatchedCorrectly, hintLevel);
  };

  const handleEssaySubmit = () => {
    soundManager.playClick();
    if (!question.rubric) return;
    // If student verified all rubric criteria
    const allChecked = question.rubric.every((_, idx) => rubricScores[idx]);
    onAnswer(allChecked, hintLevel);
  };

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl p-5 md:p-7 text-slate-100 flex flex-col justify-between min-h-[460px]">
      {/* Question Header & Metadata */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-800 text-xs">
          {/* Question Index & Level without pills */}
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-bold text-white text-sm">
              Câu {currentIndex + 1} / {totalQuestions}
            </span>
            <span aria-hidden="true">·</span>
            <span className={`font-semibold ${LEVEL_LABELS[question.level].color}`}>
              {LEVEL_LABELS[question.level].text}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-cyan-400">{question.points} điểm</span>
          </div>

          {/* Hint Trigger */}
          {allowHints && (
            <button
              onClick={handleUseHint}
              disabled={hintLevel >= 2}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                hintLevel >= 2
                  ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-950/60 text-amber-300 hover:bg-amber-900/60 border border-amber-900/60'
              }`}
            >
              <Lightbulb size={14} className={hintLevel > 0 ? 'text-amber-400' : ''} />
              <span>Gợi ý ({hintLevel}/2)</span>
            </button>
          )}
        </div>

        {/* Revealed Hints */}
        {hintLevel >= 1 && (
          <div className="mb-4 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 space-y-1.5 animate-in fade-in duration-200">
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <Lightbulb size={13} />
              <span>Gợi ý 1:</span>
            </div>
            <p className="leading-relaxed"><MathView math={question.hint1} /></p>
            {hintLevel >= 2 && (
              <div className="pt-2 border-t border-amber-900/50">
                <span className="font-bold text-amber-400">Gợi ý 2: </span>
                <span className="leading-relaxed"><MathView math={question.hint2} /></span>
              </div>
            )}
          </div>
        )}

        {/* Question Prompt */}
        <div className="text-base md:text-lg font-medium text-slate-100 leading-relaxed mb-6">
          <MathView math={question.prompt} />
        </div>

        {/* Interactive Answer Zones by Type */}

        {/* 1. MCQ (Multiple Choice) */}
        {question.type === 'MCQ' && question.options && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx); // A, B, C, D
              return (
                <button
                  key={idx}
                  onClick={() => handleMcqSubmit(idx)}
                  className={`group relative p-4 rounded-xl border text-left transition-all duration-200 flex items-start gap-3 ${
                    selectedOption === idx
                      ? 'bg-cyan-950/60 border-cyan-500 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950/60 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/60'
                  }`}
                >
                  <span className="shrink-0 w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 group-hover:border-cyan-400 text-cyan-300 font-bold text-xs flex items-center justify-center font-mono">
                    {letter}
                  </span>
                  <div className="text-sm text-slate-200 leading-normal pt-0.5">
                    <MathView math={opt} />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* 2. TRUE_FALSE (Format Đánh Giá Năng Lực 4 Ý GDPT 2018) */}
        {question.type === 'TRUE_FALSE' && question.trueFalseItems && (
          <div className="space-y-3">
            {question.trueFalseItems.map((item, idx) => {
              const currentChoice = tfChoices[item.id];
              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="text-sm text-slate-200 leading-relaxed flex-1">
                    <span className="font-bold text-cyan-400 mr-2">Ý {idx + 1}:</span>
                    <MathView math={item.statement} />
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() =>
                        setTfChoices((prev) => ({ ...prev, [item.id]: true }))
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        currentChoice === true
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      ĐÚNG
                    </button>
                    <button
                      onClick={() =>
                        setTfChoices((prev) => ({ ...prev, [item.id]: false }))
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        currentChoice === false
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      SAI
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleTfSubmit}
                disabled={
                  Object.keys(tfChoices).length < question.trueFalseItems.length
                }
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-xs transition-colors"
              >
                <Send size={14} />
                <span>Xác Nhận Đánh Giá</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. FILL_IN (Điền đáp án số hoặc biểu thức ngắn) */}
        {question.type === 'FILL_IN' && (
          <form onSubmit={handleFillInSubmit} className="space-y-4 max-w-md">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Nhập giá trị đáp số (ví dụ: 5)..."
                value={fillInput}
                onChange={(e) => setFillInput(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-base placeholder-slate-500 focus:outline-hidden focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                autoFocus
              />
              <button
                type="submit"
                disabled={!fillInput.trim()}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <Send size={15} />
                <span>Nộp</span>
              </button>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <span>Mẹo nhập nhanh:</span>
              <button
                type="button"
                onClick={() => setFillInput((p) => p + '√')}
                className="px-2 py-0.5 rounded-sm bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono"
              >
                √
              </button>
              <button
                type="button"
                onClick={() => setFillInput((p) => p + '-')}
                className="px-2 py-0.5 rounded-sm bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono"
              >
                -
              </button>
            </div>
          </form>
        )}

        {/* 4. MATCHING (Ghép nối cặp tương ứng) */}
        {question.type === 'MATCHING' && question.matchingPairs && (
          <div className="space-y-4">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Shuffle size={14} className="text-cyan-400" />
              <span>Nhấp chọn 1 ô ở Cột Trái rồi nhấp chọn 1 ô tương ứng ở Cột Phải để ghép cặp:</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cột Biểu Thức</div>
                {question.matchingPairs.map((pair) => {
                  const isSelected = selectedLeftId === pair.id;
                  const matchedRight = matchingConnections[pair.id];
                  return (
                    <button
                      key={pair.id}
                      onClick={() => handleMatchingLeftClick(pair.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-colors flex items-center justify-between text-sm ${
                        isSelected
                          ? 'bg-cyan-950/80 border-cyan-400 text-white ring-1 ring-cyan-400'
                          : matchedRight
                          ? 'bg-slate-900 border-emerald-500/50 text-slate-200'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <MathView math={pair.left} />
                      {matchedRight && (
                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                          <Check size={13} />
                          Đã ghép
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Right Column */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cột Điều Kiện / Công Thức</div>
                {question.matchingPairs.map((pair) => {
                  const isUsed = Object.values(matchingConnections).includes(pair.right);
                  return (
                    <button
                      key={pair.right}
                      onClick={() => handleMatchingRightClick(pair.right)}
                      className={`w-full p-3 rounded-xl border text-left transition-colors text-sm ${
                        isUsed
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-cyan-400 hover:bg-slate-900'
                      }`}
                    >
                      <MathView math={pair.right} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleMatchingSubmit}
                disabled={
                  Object.keys(matchingConnections).length < question.matchingPairs.length
                }
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-xs transition-colors"
              >
                <Send size={14} />
                <span>Nộp Kết Quả Ghép Nối</span>
              </button>
            </div>
          </div>
        )}

        {/* 5. SHORT_ESSAY (Tự luận ngắn kèm rubric tự đánh giá) */}
        {question.type === 'SHORT_ESSAY' && question.rubric && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 leading-relaxed">
              Dạng bài tự luận: Học sinh giải nháp ra giấy, sau đó đối chiếu các tiêu chuẩn rubric dưới đây để tự đánh giá mức độ hoàn thành các bước:
            </div>

            <div className="space-y-2">
              {question.rubric.map((item, idx) => (
                <label
                  key={idx}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    rubricScores[idx]
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!rubricScores[idx]}
                    onChange={(e) =>
                      setRubricScores((prev) => ({ ...prev, [idx]: e.target.checked }))
                    }
                    className="mt-1 h-4 w-4 rounded-sm border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <div className="flex-1 text-xs leading-relaxed">
                    <span className="font-semibold text-white mr-2">Bước {idx + 1}:</span>
                    {item.criterion}
                  </div>
                  <span className="text-xs font-mono text-cyan-400 shrink-0 font-bold">
                    +{item.points}đ
                  </span>
                </label>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleEssaySubmit}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs transition-colors"
              >
                <Send size={14} />
                <span>Hoàn Tất Tự Chấm & Xem Lời Giải Chi Tiết</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
