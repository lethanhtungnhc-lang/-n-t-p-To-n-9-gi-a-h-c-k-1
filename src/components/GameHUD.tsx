import React from 'react';
import { Volume2, VolumeX, Calculator, BookOpen, Clock, Flame, ChevronLeft, User, FileSpreadsheet, ShieldCheck, LogOut } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { StudentAccount } from '../types/mathGame';

interface GameHUDProps {
  score: number;
  streak: number;
  timeLeft: number;
  isTimed: boolean;
  isMuted: boolean;
  student: StudentAccount | null;
  isAdmin?: boolean;
  onToggleMute: () => void;
  onOpenCalculator: () => void;
  onOpenCheatsheet: () => void;
  onOpenAuth: () => void;
  onLogout?: () => void;
  onOpenGradebook: () => void;
  onOpenAdmin: () => void;
  onExitRound?: () => void;
  modeTitle?: string;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  streak,
  timeLeft,
  isTimed,
  isMuted,
  student,
  isAdmin = false,
  onToggleMute,
  onOpenCalculator,
  onOpenCheatsheet,
  onOpenAuth,
  onLogout,
  onOpenGradebook,
  onOpenAdmin,
  onExitRound,
  modeTitle = 'Vũ Trụ Toán 9',
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Exit/Back & Brand / Title */}
        <div className="flex items-center gap-3 shrink-0">
          {onExitRound && (
            <button
              onClick={onExitRound}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Về Bản đồ Vũ trụ"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          <div className="flex flex-col">
            <span className="font-extrabold text-white text-sm md:text-base tracking-tight whitespace-nowrap">
              Toán 9 Vũ Trụ
            </span>
            {modeTitle && (
              <span className="text-[11px] text-cyan-400 font-medium truncate max-w-[150px] md:max-w-xs">
                {modeTitle}
              </span>
            )}
          </div>
        </div>

        {/* Zone 2: Telemetry Stats (Score, Streak, Timer) */}
        <div className="flex items-center gap-4 md:gap-6 text-xs font-mono">
          {/* Score */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 hidden sm:inline">Điểm:</span>
            <span className="font-bold text-white text-sm md:text-base text-cyan-400 tabular-nums">
              {score}
            </span>
          </div>

          {/* Streak Combo Multiplier */}
          {streak > 1 && (
            <div className="flex items-center gap-1 text-amber-400 animate-pulse font-bold">
              <Flame size={14} />
              <span>x{streak} Combo</span>
            </div>
          )}

          {/* Optional Timer */}
          {isTimed && (
            <div
              className={`flex items-center gap-1 font-bold ${
                timeLeft <= 10 ? 'text-rose-400 animate-bounce' : 'text-slate-300'
              }`}
            >
              <Clock size={14} />
              <span className="tabular-nums">{timeLeft}s</span>
            </div>
          )}
        </div>

        {/* Zone 3: Functional Utilities (Student, Gradebook, Calculator, Cheatsheet, Sound) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Student Auth Button */}
          {student ? (
            <div className="flex items-center gap-1">
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-950/70 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/60 text-xs transition-colors"
                title="Hồ sơ cá nhân học sinh (Nhấp để xem hồ sơ và điểm số)"
              >
                <User size={13} className="text-cyan-400" />
                <span className="font-semibold truncate max-w-[90px] sm:max-w-none">
                  {student.fullName} ({student.className})
                </span>
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/60 hover:text-white text-xs transition-colors"
                  title="Thoát tài khoản học sinh"
                >
                  <LogOut size={13} />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors shadow-xs"
              title="Đăng ký hoặc đăng nhập tên học sinh"
            >
              <User size={13} />
              <span className="whitespace-nowrap">Đăng Nhập</span>
            </button>
          )}

          {/* Sổ Điểm Button */}
          <button
            onClick={onOpenGradebook}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 text-xs transition-colors"
            title="Sổ điểm & Nhật ký học sinh làm bài"
          >
            <FileSpreadsheet size={14} className="text-emerald-400" />
            <span className="hidden md:inline">Sổ Điểm</span>
          </button>

          {/* Admin Portal Button - Redesigned */}
          <button
            onClick={onOpenAdmin}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs ${
              isAdmin
                ? 'bg-gradient-to-r from-amber-500/25 via-amber-600/30 to-amber-500/20 border-amber-400 text-amber-300 shadow-amber-500/20 hover:border-amber-300'
                : 'bg-gradient-to-r from-amber-950/70 to-slate-900 border-amber-500/60 text-amber-300 hover:text-white hover:border-amber-400 hover:bg-amber-900/60'
            }`}
            title="Khu vực Người Quản Trị toàn quyền"
          >
            <ShieldCheck size={14} className={isAdmin ? 'text-amber-300' : 'text-amber-400'} />
            <span className="font-bold">Quản Trị</span>
            {isAdmin && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shadow-xs shadow-emerald-400" title="Đang ở chế độ Toàn quyền" />
            )}
          </button>

          <button
            onClick={onOpenCalculator}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 text-xs transition-colors"
            title="Mở máy tính bỏ túi"
          >
            <Calculator size={14} />
            <span className="hidden lg:inline">Máy tính</span>
          </button>

          <button
            onClick={onOpenCheatsheet}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 text-xs transition-colors"
            title="Tra cứu công thức"
          >
            <BookOpen size={14} />
            <span className="hidden lg:inline">Bí kíp</span>
          </button>

          <button
            onClick={() => {
              onToggleMute();
              soundManager.playClick();
            }}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        </div>
      </div>
    </header>
  );
};
