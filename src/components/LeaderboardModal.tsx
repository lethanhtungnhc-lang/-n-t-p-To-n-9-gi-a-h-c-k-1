import React, { useState } from 'react';
import { Trophy, Medal, Users, User, X, Plus } from 'lucide-react';
import { LeaderboardEntry } from '../types/mathGame';
import { soundManager } from '../utils/audio';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LeaderboardEntry[];
  currentName: string;
  onUpdateName: (name: string, isTeam: boolean, teamName?: string) => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  entries,
  currentName,
  onUpdateName,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'solo' | 'team'>('all');
  const [inputName, setInputName] = useState(currentName || '');
  const [isTeamMode, setIsTeamMode] = useState(false);
  const [teamName, setTeamName] = useState('');

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    onUpdateName(inputName.trim() || 'Nhà Du Hành 9', isTeamMode, teamName.trim());
  };

  // Sort entries descending by score
  const sortedEntries = [...entries].sort((a, b) => b.score - a.score);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-lg max-h-[85vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl text-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Trophy className="text-amber-400" size={20} />
            <div>
              <h2 className="text-base font-bold text-white">Bảng Vinh Danh Vũ Trụ</h2>
              <p className="text-xs text-slate-400">Thi đua cá nhân & Đội nhóm / Lớp học</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile / Nickname Editor */}
        <div className="p-4 bg-slate-950/40 border-b border-slate-800">
          <form onSubmit={handleSaveProfile} className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300">Hồ sơ thi đấu của bạn:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsTeamMode(false)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                    !isTeamMode
                      ? 'bg-cyan-500 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <User size={12} />
                  <span>Cá nhân</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsTeamMode(true)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                    isTeamMode
                      ? 'bg-cyan-500 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users size={12} />
                  <span>Đội / Lớp</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Nhập biệt danh du hành..."
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
              />
              {isTeamMode && (
                <input
                  type="text"
                  placeholder="Tên đội / Lớp (ví dụ: Tổ 1 - 9A)..."
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                />
              )}
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors shrink-0"
              >
                Lưu
              </button>
            </div>
          </form>
        </div>

        {/* Entries List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sortedEntries.length > 0 ? (
            sortedEntries.map((entry, index) => {
              const isTop1 = index === 0;
              const isTop2 = index === 1;
              const isTop3 = index === 2;

              return (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                    isTop1
                      ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                      : isTop2
                      ? 'bg-slate-800/60 border-slate-600/40 text-slate-200'
                      : isTop3
                      ? 'bg-amber-950/10 border-amber-700/30 text-amber-300'
                      : 'bg-slate-950/40 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold font-mono ${
                        isTop1
                          ? 'bg-amber-500 text-slate-950'
                          : isTop2
                          ? 'bg-slate-400 text-slate-950'
                          : isTop3
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {index + 1}
                    </span>

                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{entry.name}</span>
                        {entry.team && (
                          <span className="text-[10px] text-cyan-400 font-normal">
                            ({entry.team})
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Chính xác: {entry.accuracy}% · {entry.timestamp}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold font-mono text-cyan-400 text-sm">
                      {entry.score} đ
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-slate-500 text-xs">
              Chưa có kỷ lục nào được ghi nhận. Hãy là người đầu tiên hoàn thành thử thách!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
