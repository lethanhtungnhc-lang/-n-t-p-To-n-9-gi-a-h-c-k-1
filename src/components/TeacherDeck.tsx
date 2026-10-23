import React, { useState } from 'react';
import { Settings, Plus, Download, Upload, Shuffle, Check, X, BookOpen, Trash2, FileSpreadsheet } from 'lucide-react';
import { TeacherMatrixSetting, Question, DifficultyLevel, MathTopic } from '../types/mathGame';
import { MathView } from '../utils/katexHelper';
import { soundManager } from '../utils/audio';

interface TeacherDeckProps {
  isOpen: boolean;
  onClose: () => void;
  matrixSetting: TeacherMatrixSetting;
  onUpdateMatrix: (newSettings: TeacherMatrixSetting) => void;
  questions: Question[];
  onAddQuestion: (newQ: Question) => void;
  onDeleteQuestion: (id: string) => void;
  onShuffleQuestions: () => void;
  onOpenGradebook?: () => void;
}

export const TeacherDeck: React.FC<TeacherDeckProps> = ({
  isOpen,
  onClose,
  matrixSetting,
  onUpdateMatrix,
  questions,
  onAddQuestion,
  onDeleteQuestion,
  onShuffleQuestions,
  onOpenGradebook,
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'bank' | 'add'>('matrix');

  // Matrix form state
  const [nbRatio, setNbRatio] = useState(matrixSetting.nhanBietRatio);
  const [thRatio, setThRatio] = useState(matrixSetting.thongHieuRatio);
  const [vdRatio, setVdRatio] = useState(matrixSetting.vanDungRatio);
  const [vdcRatio, setVdcRatio] = useState(matrixSetting.vanDungCaoRatio);
  const [timerSec, setTimerSec] = useState(matrixSetting.timePerQuestion);

  // New Question form state
  const [newTopic, setNewTopic] = useState<MathTopic>('CAN_THUC');
  const [newLevel, setNewLevel] = useState<DifficultyLevel>('NHAN_BIET');
  const [newPrompt, setNewPrompt] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctIdx, setCorrectIdx] = useState(0);
  const [hint1, setHint1] = useState('');
  const [hint2, setHint2] = useState('');
  const [solutionStep, setSolutionStep] = useState('');
  const [misconception, setMisconception] = useState('');
  const [takeaway, setTakeaway] = useState('');

  if (!isOpen) return null;

  const totalMatrixRatio = nbRatio + thRatio + vdRatio + vdcRatio;

  const handleSaveMatrix = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    onUpdateMatrix({
      nhanBietRatio: nbRatio,
      thongHieuRatio: thRatio,
      vanDungRatio: vdRatio,
      vanDungCaoRatio: vdcRatio,
      timePerQuestion: timerSec,
      showHints: true,
      allowRetries: true,
    });
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrompt.trim() || !optA.trim() || !optB.trim()) return;

    soundManager.playClick();
    const created: Question = {
      id: `CUSTOM_${Date.now()}`,
      topic: newTopic,
      level: newLevel,
      type: 'MCQ',
      prompt: newPrompt,
      options: [optA, optB, optC, optD].filter(Boolean),
      correctOptionIndex: correctIdx,
      hint1: hint1 || 'Đọc kỹ các giả thiết và công thức liên quan.',
      hint2: hint2 || 'Áp dụng các định lý cơ bản trong SGK Toán 9.',
      stepByStepSolution: [solutionStep || 'Lời giải chi tiết do giáo viên bổ sung.'],
      commonMisconception: misconception || 'Học sinh chú ý biến đổi cẩn thận và kiểm tra điều kiện.',
      keyTakeaway: takeaway || 'Ghi nhớ trọng tâm kiến thức.',
      points: newLevel === 'VAN_DUNG_CAO' ? 250 : newLevel === 'VAN_DUNG' ? 180 : 120,
    };

    onAddQuestion(created);
    setNewPrompt('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setSolutionStep('');
    setActiveTab('bank');
  };

  const exportQuestionsJSON = () => {
    soundManager.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questions, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `ngan_hang_toan_9_giua_hk1_${Date.now()}.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl text-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Settings size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Bảng Điều Khiển Giáo Viên</h2>
              <p className="text-xs text-slate-400">
                Tùy biến Ma Trận Đề (TT 22 & CV 7991) · Bản quyền: Teacher Lê Thanh Tùng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2.5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors ${
                activeTab === 'matrix'
                  ? 'bg-cyan-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Ma Trận 4 Mức Độ
            </button>
            <button
              onClick={() => setActiveTab('bank')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors ${
                activeTab === 'bank'
                  ? 'bg-cyan-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Ngân Hàng ({questions.length} câu)
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors ${
                activeTab === 'add'
                  ? 'bg-cyan-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Thêm Câu Hỏi Mới
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onOpenGradebook && (
              <button
                onClick={() => {
                  onClose();
                  onOpenGradebook();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                title="Mở sổ điểm và danh sách học sinh làm bài"
              >
                <FileSpreadsheet size={13} />
                <span>Xem Sổ Điểm</span>
              </button>
            )}

            <button
              onClick={exportQuestionsJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              title="Xuất file JSON bộ câu hỏi"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Xuất JSON</span>
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: MA TRẬN */}
          {activeTab === 'matrix' && (
            <form onSubmit={handleSaveMatrix} className="max-w-xl mx-auto space-y-6">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1 text-xs text-slate-300">
                <span className="font-bold text-cyan-400">Định hướng TT22 & Công văn 7991:</span>
                <p>
                  Tỷ lệ tham khảo chuẩn: <strong>40% Nhận biết – 30% Thông hiểu – 20% Vận dụng – 10% Vận dụng cao</strong>.
                  Tổng 4 mức độ cần bằng 100%.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-cyan-400">1. Nhận biết (NB)</span>
                    <span className="font-mono">{nbRatio}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={nbRatio}
                    onChange={(e) => setNbRatio(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-blue-400">2. Thông hiểu (TH)</span>
                    <span className="font-mono">{thRatio}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={thRatio}
                    onChange={(e) => setThRatio(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-amber-400">3. Vận dụng (VD)</span>
                    <span className="font-mono">{vdRatio}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={vdRatio}
                    onChange={(e) => setVdRatio(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-rose-400">4. Vận dụng cao (VDC)</span>
                    <span className="font-mono">{vdcRatio}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={vdcRatio}
                    onChange={(e) => setVdcRatio(Number(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-mono font-bold">
                  <span>Tổng tỷ lệ:</span>
                  <span
                    className={
                      totalMatrixRatio === 100 ? 'text-emerald-400' : 'text-rose-400'
                    }
                  >
                    {totalMatrixRatio}% {totalMatrixRatio !== 100 && '(Cần đạt 100%)'}
                  </span>
                </div>
              </div>

              {/* Timer Config */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  Thời gian làm bài mỗi câu (Chế độ thi tính giờ):
                </label>
                <div className="flex items-center gap-3">
                  {[0, 30, 45, 60, 90].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setTimerSec(sec)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        timerSec === sec
                          ? 'bg-cyan-500 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {sec === 0 ? 'Không giới hạn' : `${sec}s`}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-all"
              >
                Lưu Cấu Hình Ma Trận Đề
              </button>
            </form>
          )}

          {/* TAB 2: NGÂN HÀNG CÂU HỎI */}
          {activeTab === 'bank' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                <span className="text-slate-400">Danh sách các câu hỏi trong hệ thống:</span>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onShuffleQuestions();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold transition-colors"
                >
                  <Shuffle size={13} />
                  <span>Xáo trộn thứ tự</span>
                </button>
              </div>

              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cyan-400">#{idx + 1}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-400">{q.topic}</span>
                        <span className="text-slate-400">·</span>
                        <span className="font-semibold text-slate-300">{q.level}</span>
                      </div>
                      <button
                        onClick={() => onDeleteQuestion(q.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                        title="Xóa câu hỏi"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="text-sm text-slate-200">
                      <MathView math={q.prompt} />
                    </div>

                    {q.options && (
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 pt-1">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`p-1.5 rounded-md ${
                              oIdx === q.correctOptionIndex
                                ? 'bg-emerald-950/50 text-emerald-300 font-medium border border-emerald-500/30'
                                : 'bg-slate-900/50'
                            }`}
                          >
                            <span className="font-mono mr-1">
                              {String.fromCharCode(65 + oIdx)}.
                            </span>
                            <MathView math={opt} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: THÊM CÂU HỎI MỚI */}
          {activeTab === 'add' && (
            <form onSubmit={handleCreateQuestion} className="space-y-4 max-w-2xl mx-auto">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Chủ đề:</label>
                  <select
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value as MathTopic)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-hidden focus:border-cyan-500"
                  >
                    <option value="CAN_THUC">Căn thức (Căn bậc hai & căn bậc ba)</option>
                    <option value="HE_PHUONG_TRINH">Hệ phương trình bậc nhất hai ẩn</option>
                    <option value="BAT_DANG_THUC">Bất đẳng thức & Bất phương trình</option>
                    <option value="HE_THUC_LUONG">Hệ thức lượng trong tam giác vuông</option>
                    <option value="TONG_HOP_GIUA_KY">Tổng hợp giữa học kỳ I</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Mức độ nhận thức:</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as DifficultyLevel)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-hidden focus:border-cyan-500"
                  >
                    <option value="NHAN_BIET">Nhận biết (40%)</option>
                    <option value="THONG_HIEU">Thông hiểu (30%)</option>
                    <option value="VAN_DUNG">Vận dụng (20%)</option>
                    <option value="VAN_DUNG_CAO">Vận dụng cao (10%)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nội dung câu hỏi (hỗ trợ công thức LaTeX $...$):
                </label>
                <textarea
                  rows={3}
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  placeholder="Ví dụ: Rút gọn biểu thức $A = \sqrt{12} - \sqrt{3}$..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                  required
                />
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  4 Phương án trắc nghiệm:
                </label>
                {[
                  { label: 'A', val: optA, set: setOptA },
                  { label: 'B', val: optB, set: setOptB },
                  { label: 'C', val: optC, set: setOptC },
                  { label: 'D', val: optD, set: setOptD },
                ].map((item, idx) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCorrectIdx(idx)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center font-mono ${
                        correctIdx === idx
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                      title="Chọn phương án đúng"
                    >
                      {item.label}
                    </button>
                    <input
                      type="text"
                      value={item.val}
                      onChange={(e) => item.set(e.target.value)}
                      placeholder={`Nội dung phương án ${item.label}...`}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                    />
                  </div>
                ))}
              </div>

              {/* Explanations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Gợi ý 1:</label>
                  <input
                    type="text"
                    value={hint1}
                    onChange={(e) => setHint1(e.target.value)}
                    placeholder="Gợi ý ban đầu..."
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Lời giải từng bước:</label>
                  <input
                    type="text"
                    value={solutionStep}
                    onChange={(e) => setSolutionStep(e.target.value)}
                    placeholder="Bước 1: Ta biến đổi..."
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Plus size={15} />
                <span>Thêm Câu Hỏi Vào Ngân Hàng</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
