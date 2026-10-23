import React from 'react';
import { Star, Lock, Play, Compass, ShieldAlert, Sparkles, GitBranch, Flame, Award, Trophy, Settings, FileSpreadsheet, User, UserCheck, ShieldCheck } from 'lucide-react';
import { PlanetStation, GameMode, MathTopic, StudentAccount } from '../types/mathGame';
import { soundManager } from '../utils/audio';

interface GalaxyMapProps {
  planets: PlanetStation[];
  onSelectStation: (topicId: MathTopic) => void;
  onSelectMode: (mode: GameMode) => void;
  onOpenTeacherDeck: () => void;
  onOpenLeaderboard: () => void;
  onOpenGradebook: () => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  isAdmin?: boolean;
  currentStudent: StudentAccount | null;
  totalScore: number;
}

const TOPIC_ICONS: Record<string, React.FC<{ size?: number; className?: string }>> = {
  Sparkles,
  GitBranch,
  ShieldAlert,
  Compass,
  Flame,
};

export const GalaxyMap: React.FC<GalaxyMapProps> = ({
  planets,
  onSelectStation,
  onSelectMode,
  onOpenTeacherDeck,
  onOpenLeaderboard,
  onOpenGradebook,
  onOpenAuth,
  onOpenAdmin,
  isAdmin = false,
  currentStudent,
  totalScore,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner with Cosmic Navigation Header */}
      <div className="relative rounded-3xl overflow-hidden p-6 md:p-10 border border-cyan-500/20 bg-gradient-to-b from-indigo-950/60 via-slate-900/80 to-slate-950/90 shadow-2xl">
        {/* Subtle Cosmic Background Orbits */}
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border border-cyan-400/40" />
          <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full border border-purple-500/30 border-dashed" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-widest">
              <span>Hệ Thống Huấn Luyện Vũ Trụ</span>
              <span aria-hidden="true">·</span>
              <span>Chuẩn GDPT 2018</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-300 font-bold normal-case">Bản quyền: Teacher Lê Thanh Tùng</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Chinh Phục Vũ Trụ Toán Học 9
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Hành trình ôn tập Giữa Học kỳ I theo Thông tư 22/2021/TT-BGDĐT và Công văn 7991. Rèn luyện tư duy
              phân tích, vượt chướng ngại vật thiên thạch và giải mã các hệ thức lượng ngân hà!
            </p>
          </div>

          {/* Quick Action Badges / Access */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Student Auth / Profile Button */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenAuth();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-950/70 border border-cyan-500/50 hover:bg-cyan-900/60 text-cyan-300 text-xs font-bold transition-all shadow-md"
              title={currentStudent ? `Xem hồ sơ cá nhân của ${currentStudent.fullName} và quản lý tài khoản` : 'Đăng ký hoặc đăng nhập tài khoản học sinh'}
            >
              {currentStudent ? <UserCheck size={16} className="text-cyan-400" /> : <User size={16} />}
              <span>
                {currentStudent ? `Hồ Sơ: ${currentStudent.fullName} (${currentStudent.className})` : 'Đăng Ký / Đăng Nhập'}
              </span>
            </button>

            {/* Sổ Điểm & Tải DS Làm Bài */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenGradebook();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/50 hover:bg-emerald-900/50 text-emerald-300 text-xs font-bold transition-all shadow-md"
            >
              <FileSpreadsheet size={16} className="text-emerald-400" />
              <span>Sổ Điểm & Tải DS Điểm</span>
            </button>

            {/* Người Quản Trị Toàn Quyền - Redesigned Button */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenAdmin();
              }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all shadow-lg active:scale-95 ${
                isAdmin
                  ? 'bg-gradient-to-r from-amber-500/25 via-amber-600/30 to-slate-900 border-amber-400 text-amber-200 shadow-amber-500/20 hover:border-amber-300'
                  : 'bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-950 border-amber-500/70 hover:border-amber-400 text-amber-300 hover:text-white shadow-amber-950/50 hover:shadow-amber-500/20'
              }`}
              title="Khu vực Người Quản Trị toàn quyền"
            >
              <div className="relative">
                <ShieldCheck size={17} className={isAdmin ? 'text-amber-300' : 'text-amber-400'} />
                {isAdmin && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 shadow-xs shadow-emerald-400 animate-pulse" />
                )}
              </div>
              <span className="flex items-center gap-1.5">
                <span>Người Quản Trị</span>
                {isAdmin ? (
                  <span className="px-1.5 py-0.5 rounded-md bg-amber-500/30 text-[10px] text-amber-200 font-extrabold border border-amber-400/40">
                    Toàn Quyền
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-400 border border-slate-700">
                    Admin
                  </span>
                )}
              </span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onOpenLeaderboard();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-amber-400/60 text-amber-300 text-xs font-bold transition-all shadow-md"
            >
              <Trophy size={16} />
              <span>Bảng Vinh Danh</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onOpenTeacherDeck();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-cyan-400/60 text-cyan-300 text-xs font-bold transition-all shadow-md"
            >
              <Settings size={16} />
              <span>Góc Giáo Viên (Ma trận TT22)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Specialized Game Modes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
            4 Chế Độ Huấn Luyện Vũ Trụ
          </h2>
          <span className="text-xs text-slate-400 font-medium">Chọn phương thức trải nghiệm</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Mode 1: Khởi Động */}
          <button
            onClick={() => {
              soundManager.playClick();
              onSelectMode('WARM_UP');
            }}
            className="group p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-cyan-500/50 text-left transition-all hover:-translate-y-1 shadow-lg flex flex-col justify-between h-48"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Sparkles size={20} />
              </div>
              <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                1. Khởi Động
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Tăng tốc phi thuyền với các câu Nhận biết & Thông hiểu nhanh, củng cố nền tảng.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-cyan-400 font-semibold pt-2 border-t border-slate-900">
              <span>Bắt đầu ngay</span>
              <Play size={13} className="fill-current" />
            </div>
          </button>

          {/* Mode 2: Vượt Chướng Ngại Vật */}
          <button
            onClick={() => {
              soundManager.playClick();
              onSelectMode('OBSTACLE_DASH');
            }}
            className="group p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-amber-500/50 text-left transition-all hover:-translate-y-1 shadow-lg flex flex-col justify-between h-48"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ShieldAlert size={20} />
              </div>
              <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                2. Vượt Chướng Ngại Vật
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Tránh thiên thạch tính giờ! Nhân điểm thưởng chuỗi liên tiếp x1.5, x2, x3.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-amber-400 font-semibold pt-2 border-t border-slate-900">
              <span>Thách thức thời gian</span>
              <Play size={13} className="fill-current" />
            </div>
          </button>

          {/* Mode 3: Thử Thách Tư Duy */}
          <button
            onClick={() => {
              soundManager.playClick();
              onSelectMode('COGNITIVE_LAB');
            }}
            className="group p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-purple-500/50 text-left transition-all hover:-translate-y-1 shadow-lg flex flex-col justify-between h-48"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <GitBranch size={20} />
              </div>
              <h3 className="font-bold text-base text-white group-hover:text-purple-300 transition-colors">
                3. Thử Thách Tư Duy
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Ghép nối công thức, điền khuyết đáp số và phân tích các mệnh đề Đúng/Sai.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-purple-400 font-semibold pt-2 border-t border-slate-900">
              <span>Rèn luyện logic</span>
              <Play size={13} className="fill-current" />
            </div>
          </button>

          {/* Mode 4: Chinh Phục Đỉnh Cao */}
          <button
            onClick={() => {
              soundManager.playClick();
              onSelectMode('BOSS_CAMPAIGN');
            }}
            className="group p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-rose-500/30 hover:border-rose-400 text-left transition-all hover:-translate-y-1 shadow-lg flex flex-col justify-between h-48 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/10 rounded-bl-full pointer-events-none" />
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Flame size={20} />
              </div>
              <h3 className="font-bold text-base text-white group-hover:text-rose-300 transition-colors">
                4. Chinh Phục Đỉnh Cao
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Chiến dịch ma trận chuẩn Thông tư 22 (40-30-20-10). Đánh giá năng lực toàn diện!
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-rose-400 font-semibold pt-2 border-t border-slate-900">
              <span>Chiến dịch Boss</span>
              <Play size={13} className="fill-current" />
            </div>
          </button>
        </div>
      </div>

      {/* Galaxy Map Stations (Hành Tinh Chủ Đề) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
              Bản Đồ Trạm Vũ Trụ Theo Chủ Đề
            </h2>
            <p className="text-xs text-slate-400">
              Hoàn thành các trạm để thu thập Ngôi Sao Tri Thức và mở khóa trạm tiếp theo
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-500/30">
            <Star size={14} className="fill-current" />
            <span>
              {planets.reduce((acc, p) => acc + p.stars, 0)} / {planets.length * 3} Sao
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {planets.map((station, idx) => {
            const IconComp = TOPIC_ICONS[station.iconName] || Sparkles;
            return (
              <div
                key={station.id}
                className={`relative rounded-2xl border p-5 transition-all duration-300 flex flex-col justify-between ${
                  station.unlocked
                    ? 'bg-slate-900/90 border-slate-700/80 hover:border-cyan-500/60 shadow-xl'
                    : 'bg-slate-950/40 border-slate-900 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${station.color} text-white shadow-md`}
                    >
                      <IconComp size={24} />
                    </div>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((starIdx) => (
                        <Star
                          key={starIdx}
                          size={15}
                          className={
                            starIdx <= station.stars
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-700'
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-slate-400 mb-1">
                    Trạm {idx + 1}
                  </div>
                  <h3 className="font-bold text-base text-white">{station.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {station.subtitle}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">
                    {station.questionCount} thử thách
                  </span>

                  {station.unlocked ? (
                    <button
                      onClick={() => {
                        soundManager.playWarp();
                        onSelectStation(station.id);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      <span>Khám phá</span>
                      <Play size={12} className="fill-current" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Lock size={13} />
                      <span>Chưa mở</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
