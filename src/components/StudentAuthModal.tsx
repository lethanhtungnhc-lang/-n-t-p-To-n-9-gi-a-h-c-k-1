import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  UserPlus,
  LogIn,
  LogOut,
  X,
  GraduationCap,
  CheckCircle2,
  Trophy,
  Clock,
  Calendar,
  Award,
  Sparkles,
  BookOpen,
  User,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { StudentAccount, StudentExamRecord } from '../types/mathGame';
import { soundManager } from '../utils/audio';

interface StudentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: StudentAccount[];
  currentStudent: StudentAccount | null;
  examRecords?: StudentExamRecord[];
  onLogin: (account: StudentAccount) => void;
  onRegister: (account: StudentAccount) => void;
  onLogout: () => void;
}

const DEFAULT_CLASSES = ['9A1', '9A2', '9A3', '9A4', '9A5', '9B', '9C', '9D'];

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  onClose,
  accounts,
  currentStudent,
  examRecords = [],
  onLogin,
  onRegister,
  onLogout,
}) => {
  const [tab, setTab] = useState<'profile' | 'login' | 'register'>(
    currentStudent ? 'profile' : accounts.length > 0 ? 'login' : 'register'
  );

  // Sync tab when currentStudent or isOpen changes
  useEffect(() => {
    if (isOpen) {
      if (currentStudent) {
        setTab('profile');
      } else if (accounts.length > 0) {
        setTab('login');
      } else {
        setTab('register');
      }
      setShowLogoutConfirm(false);
    }
  }, [isOpen, currentStudent, accounts.length]);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regClass, setRegClass] = useState('9A1');
  const [customClass, setCustomClass] = useState('');
  const [regCode, setRegCode] = useState('');

  // Login Form State
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    accounts[0]?.id || ''
  );

  // Logout confirmation state
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutNotice, setLogoutNotice] = useState<string | null>(null);

  // Keep selectedStudentId valid
  useEffect(() => {
    if (!selectedStudentId && accounts.length > 0) {
      setSelectedStudentId(accounts[0].id);
    }
  }, [accounts, selectedStudentId]);

  if (!isOpen) return null;

  const getNowFormatted = () => {
    const now = new Date();
    return now.toLocaleString('vi-VN', {
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = regName.trim();
    const finalClass = (regClass === 'other' ? customClass.trim() : regClass) || '9A';
    if (!finalName) return;

    soundManager.playClick();
    const now = getNowFormatted();
    const newAcc: StudentAccount = {
      id: `STD_${Date.now()}`,
      fullName: finalName,
      className: finalClass,
      studentCode: regCode.trim() || `SBD-${Math.floor(100 + Math.random() * 900)}`,
      registeredAt: now,
      lastLoginAt: now,
    };

    onRegister(newAcc);
    setLogoutNotice(null);
    setRegName('');
    setRegCode('');
    setCustomClass('');
    setTab('profile');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    const found = accounts.find((a) => a.id === selectedStudentId);
    if (found) {
      const updated: StudentAccount = {
        ...found,
        lastLoginAt: getNowFormatted(),
      };
      onLogin(updated);
      setLogoutNotice(null);
      setTab('profile');
    }
  };

  const handleConfirmLogout = () => {
    soundManager.playClick();
    const studentName = currentStudent?.fullName;
    onLogout();
    setShowLogoutConfirm(false);
    setLogoutNotice(`Đã đăng xuất tài khoản "${studentName}" thành công.`);
    setTab(accounts.length > 0 ? 'login' : 'register');
  };

  // Student specific records & statistics
  const myRecords = examRecords.filter(
    (r) =>
      (currentStudent && r.studentId === currentStudent.id) ||
      (currentStudent && r.studentName.toLowerCase() === currentStudent.fullName.toLowerCase())
  );

  const totalExams = myRecords.length;
  const totalScore = myRecords.reduce((acc, r) => acc + (r.score || 0), 0);
  const bestScore = myRecords.length > 0 ? Math.max(...myRecords.map((r) => r.score || 0)) : 0;
  const avgAccuracy =
    myRecords.length > 0
      ? Math.round(myRecords.reduce((acc, r) => acc + (r.accuracy || 0), 0) / myRecords.length)
      : 0;

  let overallGrade: 'Tốt' | 'Khá' | 'Đạt' | 'Chưa đạt' | 'Chưa xếp loại' = 'Chưa xếp loại';
  if (totalExams > 0) {
    if (avgAccuracy >= 85) overallGrade = 'Tốt';
    else if (avgAccuracy >= 70) overallGrade = 'Khá';
    else if (avgAccuracy >= 50) overallGrade = 'Đạt';
    else overallGrade = 'Chưa đạt';
  }

  const getAstronautRank = () => {
    if (totalExams >= 6 || totalScore >= 2000) return 'Chỉ Huy Trạm Vũ Trụ';
    if (totalExams >= 3 || totalScore >= 800) return 'Hoa Tiêu Ngân Hà';
    if (totalExams >= 1) return 'Phi Hành Gia Tập Sự';
    return 'Tân Binh Không Gian';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shadow-xs">
              {currentStudent ? <User size={20} /> : <GraduationCap size={20} />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                {currentStudent ? 'Hồ Sơ Cá Nhân Học Sinh' : 'Hồ Sơ Học Sinh Tham Gia'}
              </h2>
              <p className="text-xs text-slate-400">
                {currentStudent
                  ? 'Xem thông tin cá nhân, thống kê kết quả học tập & quản lý tài khoản'
                  : 'Đăng ký hoặc đăng nhập để lưu kết quả và xếp hạng'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 p-1.5 bg-slate-950/90 border-b border-slate-800 text-xs font-bold shrink-0">
          {currentStudent ? (
            <button
              onClick={() => {
                soundManager.playClick();
                setTab('profile');
              }}
              className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                tab === 'profile'
                  ? 'bg-slate-800 text-cyan-400 shadow-md border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User size={14} />
              <span>Hồ Sơ Cá Nhân</span>
            </button>
          ) : (
            <div className="hidden" />
          )}

          <button
            onClick={() => {
              soundManager.playClick();
              setTab('login');
            }}
            className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              tab === 'login'
                ? 'bg-slate-800 text-cyan-400 shadow-md border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn size={14} />
            <span>{currentStudent ? 'Đổi Tài Khoản' : 'Đăng Nhập'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setTab('register');
            }}
            className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              tab === 'register'
                ? 'bg-slate-800 text-cyan-400 shadow-md border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus size={14} />
            <span>Đăng Ký Mới</span>
          </button>
        </div>

        {/* Notice Message if any */}
        {logoutNotice && (
          <div className="px-6 py-2.5 bg-emerald-950/40 border-b border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
            <span>{logoutNotice}</span>
          </div>
        )}

        {/* Modal Body with smooth scrolling */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* TAB 1: HỒ SƠ CÁ NHÂN (PERSONAL PROFILE) */}
          {tab === 'profile' && currentStudent && (
            <div className="space-y-5">
              {/* Profile Card Header */}
              <div className="relative rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-cyan-500/30 p-5 shadow-lg overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-0.5 shadow-md flex items-center justify-center text-white">
                        <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center">
                          <User size={30} className="text-cyan-400" />
                        </div>
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center" title="Đang trực tuyến">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      </span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-lg sm:text-xl font-extrabold text-white">
                          {currentStudent.fullName}
                        </h3>
                        <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold">
                          Lớp {currentStudent.className}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                        <span className="text-slate-400">SBD:</span>
                        <span className="font-mono font-bold text-amber-300">
                          {currentStudent.studentCode || 'Chưa cập nhật'}
                        </span>
                        <span className="text-slate-600">|</span>
                        <span className="text-purple-300 font-medium flex items-center gap-1">
                          <Sparkles size={12} />
                          {getAstronautRank()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Thoát Tài Khoản Button */}
                  <div>
                    {!showLogoutConfirm ? (
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          setShowLogoutConfirm(true);
                        }}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 hover:border-rose-400 text-rose-300 hover:text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                        title="Đăng xuất khỏi tài khoản này"
                      >
                        <LogOut size={15} />
                        <span>Thoát Tài Khoản</span>
                      </button>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-center gap-2 p-2 rounded-xl bg-rose-950/80 border border-rose-500 text-xs animate-in zoom-in-95">
                        <span className="text-rose-200 font-semibold px-1">Xác nhận thoát?</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={handleConfirmLogout}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors"
                          >
                            Đồng ý
                          </button>
                          <button
                            onClick={() => setShowLogoutConfirm(false)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Details Footer */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-cyan-400" />
                    <span>Ngày đăng ký:</span>
                    <span className="text-slate-200 font-medium">{currentStudent.registeredAt || 'Gần đây'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} className="text-indigo-400" />
                    <span>Lần đăng nhập này:</span>
                    <span className="text-slate-200 font-medium">{currentStudent.lastLoginAt || 'Vừa xong'}</span>
                  </div>
                </div>
              </div>

              {/* Learning & Exam Statistics */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Trophy size={14} className="text-amber-400" />
                    <span>Thống Kê Quá Trình Làm Bài</span>
                  </h4>
                  <span className="text-xs text-slate-500">Chuẩn TT 22/2021/TT-BGDĐT</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                    <span className="text-[11px] text-slate-400">Số bài đã làm</span>
                    <div className="text-xl font-black text-white mt-1">
                      {totalExams} <span className="text-xs font-normal text-slate-400">lượt</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                    <span className="text-[11px] text-slate-400">Điểm cao nhất</span>
                    <div className="text-xl font-black text-amber-400 mt-1">
                      {bestScore} <span className="text-xs font-normal text-slate-400">đ</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                    <span className="text-[11px] text-slate-400">Độ chính xác TB</span>
                    <div className="text-xl font-black text-cyan-400 mt-1">
                      {avgAccuracy}%
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                    <span className="text-[11px] text-slate-400">Xếp loại TT22</span>
                    <div className="mt-1">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold ${
                          overallGrade === 'Tốt'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : overallGrade === 'Khá'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : overallGrade === 'Đạt'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : overallGrade === 'Chưa đạt'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {overallGrade}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Exams Table */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <BookOpen size={14} className="text-cyan-400" />
                    <span>Lịch Sử Bài Thi Gần Nhất ({myRecords.length})</span>
                  </h4>
                </div>

                {myRecords.length > 0 ? (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/50 overflow-hidden divide-y divide-slate-800/60 max-h-48 overflow-y-auto text-xs">
                    {myRecords.slice(0, 6).map((rec) => (
                      <div key={rec.id} className="p-3 flex items-center justify-between hover:bg-slate-900/60 transition-colors">
                        <div className="space-y-0.5">
                          <div className="font-bold text-white flex items-center gap-2">
                            <span>{rec.modeLabel}</span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                rec.tt22Grade === 'Tốt'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : rec.tt22Grade === 'Khá'
                                  ? 'bg-cyan-500/20 text-cyan-300'
                                  : rec.tt22Grade === 'Đạt'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-rose-500/20 text-rose-300'
                              }`}
                            >
                              {rec.tt22Grade}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2">
                            <span>{rec.examCompletedTime}</span>
                            <span>·</span>
                            <span>{Math.floor(rec.durationSeconds / 60)}p {rec.durationSeconds % 60}s</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-amber-400">{rec.score} đ</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            Đúng {rec.correctCount}/{rec.totalQuestions} ({rec.accuracy}%)
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl border border-dashed border-slate-800 bg-slate-950/30 text-center space-y-2">
                    <p className="text-xs text-slate-400">
                      Học sinh chưa có bài thi nào được ghi nhận. Hãy tham gia thử thách ngay!
                    </p>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-1.5"
                    >
                      <span>Vào Làm Bài Ngay</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setTab('login');
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <LogIn size={14} />
                  <span>Chuyển Sang Học Sinh Khác</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Tiếp Tục Ôn Luyện</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ĐĂNG NHẬP (LOGIN) */}
          {tab === 'login' && (
            <div className="space-y-4">
              {currentStudent && (
                <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400">Tài khoản đang mở:</span>
                    <div className="font-bold text-white text-sm">
                      {currentStudent.fullName} · Lớp {currentStudent.className}
                    </div>
                  </div>
                  <button
                    onClick={() => setTab('profile')}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-600/30 text-cyan-300 hover:bg-cyan-600/50 text-xs font-bold"
                  >
                    Xem Hồ Sơ
                  </button>
                </div>
              )}

              {accounts.length > 0 ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Chọn tài khoản học sinh đã đăng ký ({accounts.length} bạn):
                    </label>
                    <select
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-cyan-500"
                    >
                      {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.fullName} — Lớp {acc.className} {acc.studentCode ? `(SBD: ${acc.studentCode})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <UserCheck size={16} />
                      <span>Xác Nhận Đăng Nhập & Mở Hồ Sơ</span>
                    </button>

                    <div className="text-center pt-2">
                      <span className="text-xs text-slate-400">Bạn chưa có tên trong danh sách? </span>
                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          setTab('register');
                        }}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-bold underline ml-1"
                      >
                        Đăng ký học sinh mới
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                    <UserPlus size={24} />
                  </div>
                  <p className="text-xs text-slate-400">
                    Chưa có tài khoản học sinh nào đăng ký trên thiết bị này.
                  </p>
                  <button
                    onClick={() => setTab('register')}
                    className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md transition-all"
                  >
                    Đăng Ký Học Sinh Mới Ngay
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ĐĂNG KÝ (REGISTER) */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Họ và tên học sinh (*):
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Trần Quốc Tuấn..."
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Lớp học (*):
                  </label>
                  <select
                    value={regClass}
                    onChange={(e) => setRegClass(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-cyan-500"
                  >
                    {DEFAULT_CLASSES.map((cls) => (
                      <option key={cls} value={cls}>
                        Lớp {cls}
                      </option>
                    ))}
                    <option value="other">Lớp khác...</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Mã số / SBD (tùy chọn):
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 09 hoặc SBD-09..."
                    value={regCode}
                    onChange={(e) => setRegCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
              </div>

              {regClass === 'other' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Nhập tên lớp của bạn:
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 9A8..."
                    value={customClass}
                    onChange={(e) => setCustomClass(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                    required
                  />
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!regName.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus size={16} />
                  <span>Hoàn Tất Đăng Ký & Vào Hồ Sơ Cá Nhân</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between text-[11px] text-slate-400 shrink-0">
          <div className="text-cyan-400 font-semibold">
            Bản quyền: Teacher Lê Thanh Tùng
          </div>
          <div className="text-slate-500">
            Hệ thống quản lý học sinh Toán 9
          </div>
        </div>
      </div>
    </div>
  );
};
