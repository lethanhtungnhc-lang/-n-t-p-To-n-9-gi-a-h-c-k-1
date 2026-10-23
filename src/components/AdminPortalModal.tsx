import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Download,
  Key,
  Users,
  FileSpreadsheet,
  Settings,
  Lock,
  Unlock,
  Trash2,
  Edit3,
  X,
  Check,
  Search,
  Plus,
  RefreshCw,
  LogOut,
  AlertTriangle,
  GraduationCap,
  User,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  StudentAccount,
  StudentExamRecord,
  AdminSettings,
  TeacherMatrixSetting,
  PlanetStation,
} from '../types/mathGame';
import { soundManager } from '../utils/audio';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  onAdminLogin: (username: string, pass: string) => boolean;
  onAdminLogout: () => void;
  adminSettings: AdminSettings;
  onUpdateAdminSettings: (newSet: AdminSettings) => void;
  studentAccounts: StudentAccount[];
  onAddStudent: (acc: StudentAccount) => void;
  onDeleteStudent: (id: string) => void;
  examRecords: StudentExamRecord[];
  onDeleteRecord: (id: string) => void;
  onClearAllRecords: () => void;
  onUnlockAllPlanets: () => void;
  planets: PlanetStation[];
  matrixSetting: TeacherMatrixSetting;
  onUpdateMatrix: (newSet: TeacherMatrixSetting) => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  isAdmin,
  onAdminLogin,
  onAdminLogout,
  adminSettings,
  onUpdateAdminSettings,
  studentAccounts,
  onAddStudent,
  onDeleteStudent,
  examRecords,
  onDeleteRecord,
  onClearAllRecords,
  onUnlockAllPlanets,
  planets,
  matrixSetting,
  onUpdateMatrix,
}) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'records' | 'students' | 'control' | 'security'>('records');

  // Filter state for records
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');

  // New Student state
  const [newStdName, setNewStdName] = useState('');
  const [newStdClass, setNewStdClass] = useState('9A1');
  const [newStdCode, setNewStdCode] = useState('');

  // Change password state
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passChangeSuccess, setPassChangeSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    const success = onAdminLogin(usernameInput.trim(), passInput);
    if (success) {
      setLoginError('');
      setUsernameInput('');
      setPassInput('');
    } else {
      setLoginError('Tên đăng nhập hoặc mật khẩu quản trị không chính xác. Vui lòng thử lại!');
    }
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}p ${s < 10 ? '0' : ''}${s}s`;
  };

  // Full Admin Export CSV with UTF-8 BOM
  const handleExportFullAdminCSV = () => {
    soundManager.playClick();
    if (examRecords.length === 0) return;

    const headers = [
      'STT',
      'Mã Bản Ghi',
      'Mã Số Học Sinh (SBD)',
      'Họ và Tên Học Sinh',
      'Lớp Học',
      'Thời Điểm Đăng Nhập',
      'Thời Điểm Bắt Đầu Làm Bài',
      'Thời Điểm Nộp Bài',
      'Thời Gian Làm Bài (Giây)',
      'Thời Gian Làm Bài (Phút:Giây)',
      'Chế Độ Làm Bài',
      'Điểm Đạt Được',
      'Điểm Tối Đa',
      'Số Câu Đúng',
      'Tổng Số Câu',
      'Tỉ Lệ Chính Xác (%)',
      'Xếp Loại Theo Thông Tư 22',
      'Ghi Chú Đánh Giá'
    ];

    const rows = examRecords.map((r, idx) => {
      let pedagogicalNote = 'Cần gia cố kiến thức';
      if (r.tt22Grade === 'Tốt') pedagogicalNote = 'Nắm vững kiến thức xuất sắc';
      else if (r.tt22Grade === 'Khá') pedagogicalNote = 'Kỹ năng làm bài tốt';
      else if (r.tt22Grade === 'Đạt') pedagogicalNote = 'Đạt chuẩn yêu cầu cần đạt';

      return [
        idx + 1,
        `"${r.id}"`,
        `"${r.studentId}"`,
        `"${r.studentName.replace(/"/g, '""')}"`,
        `"${r.className}"`,
        `"${r.loginTime}"`,
        `"${r.examStartTime}"`,
        `"${r.examCompletedTime}"`,
        r.durationSeconds,
        `"${formatDuration(r.durationSeconds)}"`,
        `"${r.modeLabel}"`,
        r.score,
        r.maxScore,
        r.correctCount,
        r.totalQuestions,
        `${r.accuracy}%`,
        `"${r.tt22Grade}"`,
        `"${pedagogicalNote}"`
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `BAO_CAO_QUAN_TRI_DANH_SACH_LAM_BAI_TOAN9_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Class Summary Report CSV
  const handleExportClassSummaryCSV = () => {
    soundManager.playClick();
    if (examRecords.length === 0) return;

    const classStats: Record<
      string,
      { count: number; totalScore: number; maxScore: number; tot: number; kha: number; dat: number; chuaDat: number }
    > = {};

    examRecords.forEach((r) => {
      const cls = r.className || 'Chưa phân lớp';
      if (!classStats[cls]) {
        classStats[cls] = { count: 0, totalScore: 0, maxScore: 0, tot: 0, kha: 0, dat: 0, chuaDat: 0 };
      }
      classStats[cls].count += 1;
      classStats[cls].totalScore += r.score;
      if (r.score > classStats[cls].maxScore) classStats[cls].maxScore = r.score;

      if (r.tt22Grade === 'Tốt') classStats[cls].tot += 1;
      else if (r.tt22Grade === 'Khá') classStats[cls].kha += 1;
      else if (r.tt22Grade === 'Đạt') classStats[cls].dat += 1;
      else classStats[cls].chuaDat += 1;
    });

    const headers = [
      'Lớp',
      'Số Lượt Nộp Bài',
      'Điểm Trung Bình',
      'Điểm Cao Nhất',
      'Số Lượng Mức Tốt',
      'Số Lượng Mức Khá',
      'Số Lượng Mức Đạt',
      'Số Lượng Chưa Đạt',
      'Tỉ Lệ Đạt Trở Lên (%)'
    ];

    const rows = Object.entries(classStats).map(([cls, stat]) => {
      const avg = Math.round(stat.totalScore / (stat.count || 1));
      const passedCount = stat.tot + stat.kha + stat.dat;
      const passRate = Math.round((passedCount / (stat.count || 1)) * 100);

      return [
        `"${cls}"`,
        stat.count,
        avg,
        stat.maxScore,
        stat.tot,
        stat.kha,
        stat.dat,
        stat.chuaDat,
        `${passRate}%`
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `THONG_KE_TONG_HOP_THEO_LOP_TOAN9_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Full JSON System Backup
  const handleExportSystemJSON = () => {
    soundManager.playClick();
    const backupData = {
      systemTitle: 'Chinh Phục Vũ Trụ Toán Học 9',
      author: 'Bản quyền: Teacher Lê Thanh Tùng',
      exportedAt: new Date().toISOString(),
      studentAccounts,
      examRecords,
      adminSettings,
      matrixSetting,
      planets,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `SAO_LUU_TOAN_BO_HE_THONG_TOAN9_${Date.now()}.json`);
    dlAnchorElem.click();
  };

  // Add Student Handler
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStdName.trim()) return;
    soundManager.playClick();
    const now = new Date().toLocaleString('vi-VN', {
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const newAcc: StudentAccount = {
      id: `STD_${Date.now()}`,
      fullName: newStdName.trim(),
      className: newStdClass.trim(),
      studentCode: newStdCode.trim() || `SBD-${Math.floor(100 + Math.random() * 900)}`,
      registeredAt: now,
      lastLoginAt: 'Chưa đăng nhập',
    };

    onAddStudent(newAcc);
    setNewStdName('');
    setNewStdCode('');
  };

  // Change Password Handler
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass || newPass !== confirmPass) return;
    soundManager.playClick();
    onUpdateAdminSettings({
      ...adminSettings,
      adminPasscode: newPass,
    });
    setPassChangeSuccess(true);
    setNewPass('');
    setConfirmPass('');
    setTimeout(() => setPassChangeSuccess(false), 3000);
  };

  const classesList = Array.from(new Set(examRecords.map((r) => r.className))).filter(Boolean);

  const filteredRecords = examRecords.filter((r) => {
    const matchName = r.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchClass = selectedClass === 'all' || r.className === selectedClass;
    const matchGrade = selectedGrade === 'all' || r.tt22Grade === selectedGrade;
    return matchName && matchClass && matchGrade;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl text-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  Trung Tâm Người Quản Trị Toàn Quyền
                </h2>
                {isAdmin && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                    SUPER ADMIN
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Toàn quyền quản lý học sinh, cấu hình đề thi & xuất danh sách làm bài (Bản quyền: Teacher Lê Thanh Tùng)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onAdminLogout();
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
                title="Đăng xuất quyền quản trị"
              >
                <LogOut size={13} />
                <span>Thoát Quyền Admin</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* AUTHENTICATION GATE IF NOT LOGGED IN AS ADMIN */}
        {!isAdmin ? (
          <div className="p-8 max-w-md mx-auto my-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-transparent border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/10">
              <ShieldCheck size={34} />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-white tracking-tight">Xác Thực Quyền Người Quản Trị</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                Khu vực dành riêng cho Thầy Cô và Quản Trị Viên toàn quyền quản lý học sinh, đề thi và tải dữ liệu.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              {/* Tên Đăng Nhập */}
              <div className="space-y-1 text-left">
                <label className="block text-xs font-semibold text-slate-300">
                  Tên đăng nhập quản trị:
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type="text"
                    placeholder="Nhập tên đăng nhập (admin)..."
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium"
                    autoFocus
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Mật Khẩu */}
              <div className="space-y-1 text-left">
                <label className="block text-xs font-semibold text-slate-300">
                  Mật khẩu bảo mật:
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu quản trị..."
                    value={passInput}
                    onChange={(e) => setPassInput(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded transition-colors"
                    title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 font-semibold flex items-center justify-center gap-1.5 text-center">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Unlock size={15} />
                <span>Mở Khóa Toàn Quyền Quản Trị</span>
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED SUPER ADMIN CONTENT */
          <>
            {/* Primary Action Banner: Download All Submissions (Mandated Requirement) */}
            <div className="p-4 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border-b border-amber-500/20 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Download size={14} />
                  <span>Khu Vực Tải Dữ Liệu Dành Riêng Cho Người Quản Trị:</span>
                </span>
                <p className="text-[11px] text-slate-400">
                  Xuất đầy đủ tất cả các trường dữ liệu, lịch sử bài làm, thời gian, điểm số và xếp loại TT22
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleExportFullAdminCSV}
                  disabled={examRecords.length === 0}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all"
                  title="Tải bảng điểm chi tiết toàn bộ học sinh (Excel/CSV)"
                >
                  <FileSpreadsheet size={15} />
                  <span>Tải DS Làm Bài (Excel/CSV)</span>
                </button>

                <button
                  onClick={handleExportClassSummaryCSV}
                  disabled={examRecords.length === 0}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-amber-300 font-bold text-xs transition-colors border border-amber-500/30"
                  title="Tải báo cáo thống kê theo lớp học"
                >
                  <Download size={14} />
                  <span>Báo Cáo Theo Lớp</span>
                </button>

                <button
                  onClick={handleExportSystemJSON}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                  title="Sao lưu toàn bộ cơ sở dữ liệu hệ thống (JSON)"
                >
                  <Download size={14} />
                  <span>Sao Lưu JSON</span>
                </button>
              </div>
            </div>

            {/* Admin Tabs Bar */}
            <div className="px-6 py-2.5 border-b border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('records')}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors ${
                    activeTab === 'records'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Nhật Ký Làm Bài ({examRecords.length})
                </button>
                <button
                  onClick={() => setActiveTab('students')}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors ${
                    activeTab === 'students'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Quản Lý Học Sinh ({studentAccounts.length})
                </button>
                <button
                  onClick={() => setActiveTab('control')}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors ${
                    activeTab === 'control'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Toàn Quyền Trạm & Kỳ Thi
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors ${
                    activeTab === 'security'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Bảo Mật Quản Trị
                </button>
              </div>

              {activeTab === 'records' && examRecords.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('CẢNH BÁO: Thầy/Cô có chắc chắn muốn xóa TOÀN BỘ dữ liệu lịch sử làm bài không? Hành động này không thể hoàn tác!')) {
                      soundManager.playClick();
                      onClearAllRecords();
                    }
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 text-[11px] transition-colors"
                >
                  <Trash2 size={13} />
                  <span>Xóa Hết Lịch Sử</span>
                </button>
              )}
            </div>

            {/* TAB CONTENTS */}
            <div className="flex-1 overflow-auto p-4 sm:p-6">
              {/* TAB 1: ALL EXAM RECORDS MANAGEMENT */}
              {activeTab === 'records' && (
                <div className="space-y-4">
                  {/* Filters */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-2 flex-1">
                      <div className="relative min-w-[180px]">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                        <input
                          type="text"
                          placeholder="Tìm theo tên học sinh..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
                        />
                      </div>

                      <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-hidden focus:border-amber-500"
                      >
                        <option value="all">Tất cả lớp ({examRecords.length})</option>
                        {classesList.map((cls) => (
                          <option key={cls} value={cls}>
                            Lớp {cls}
                          </option>
                        ))}
                      </select>

                      <select
                        value={selectedGrade}
                        onChange={(e) => setSelectedGrade(e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-hidden focus:border-amber-500"
                      >
                        <option value="all">Tất cả xếp loại</option>
                        <option value="Tốt">Mức Tốt</option>
                        <option value="Khá">Mức Khá</option>
                        <option value="Đạt">Mức Đạt</option>
                        <option value="Chưa đạt">Chưa đạt</option>
                      </select>
                    </div>

                    <span className="text-slate-400 font-mono text-xs">
                      Hiển thị {filteredRecords.length} / {examRecords.length} bài thi
                    </span>
                  </div>

                  {/* Table */}
                  <div className="rounded-2xl border border-slate-800 overflow-x-auto bg-slate-950/60">
                    {filteredRecords.length > 0 ? (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold">
                          <tr>
                            <th className="py-2.5 px-3 w-10 text-center">STT</th>
                            <th className="py-2.5 px-3">Học Sinh</th>
                            <th className="py-2.5 px-3 w-14">Lớp</th>
                            <th className="py-2.5 px-3">Thời Điểm Làm Bài</th>
                            <th className="py-2.5 px-3">Thời Lượng</th>
                            <th className="py-2.5 px-3">Chế Độ</th>
                            <th className="py-2.5 px-3 text-right">Điểm</th>
                            <th className="py-2.5 px-3 text-center">Đúng</th>
                            <th className="py-2.5 px-3 text-center">Xếp Loại TT22</th>
                            <th className="py-2.5 px-3 text-center w-12">Thao Tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-300">
                          {filteredRecords.map((r, idx) => (
                            <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                              <td className="py-2.5 px-3 text-center text-slate-500 font-mono">
                                {idx + 1}
                              </td>
                              <td className="py-2.5 px-3 font-semibold text-white">
                                {r.studentName}
                              </td>
                              <td className="py-2.5 px-3 text-slate-300 font-mono">
                                {r.className}
                              </td>
                              <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                                <div>Nộp: {r.examCompletedTime}</div>
                                <div className="text-[10px] text-slate-500">Đăng nhập: {r.loginTime}</div>
                              </td>
                              <td className="py-2.5 px-3 text-slate-300 font-mono">
                                {formatDuration(r.durationSeconds)}
                              </td>
                              <td className="py-2.5 px-3 text-slate-400">
                                {r.modeLabel}
                              </td>
                              <td className="py-2.5 px-3 text-right font-bold font-mono text-cyan-400 tabular-nums">
                                {r.score}
                              </td>
                              <td className="py-2.5 px-3 text-center font-mono">
                                {r.correctCount}/{r.totalQuestions} ({r.accuracy}%)
                              </td>
                              <td className="py-2.5 px-3 text-center font-bold">
                                <span
                                  className={
                                    r.tt22Grade === 'Tốt'
                                      ? 'text-emerald-400'
                                      : r.tt22Grade === 'Khá'
                                      ? 'text-cyan-400'
                                      : r.tt22Grade === 'Đạt'
                                      ? 'text-amber-400'
                                      : 'text-rose-400'
                                  }
                                >
                                  {r.tt22Grade}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <button
                                  onClick={() => {
                                    if (confirm(`Xóa bản ghi làm bài của học sinh ${r.studentName}?`)) {
                                      soundManager.playClick();
                                      onDeleteRecord(r.id);
                                    }
                                  }}
                                  className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                                  title="Xóa bản ghi này"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="p-8 text-center text-slate-500 text-xs">
                        Không có bản ghi làm bài nào phù hợp.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: STUDENT ACCOUNTS MANAGEMENT */}
              {activeTab === 'students' && (
                <div className="space-y-6">
                  {/* Create New Student Form */}
                  <form onSubmit={handleCreateStudent} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Plus size={14} />
                      <span>Thêm Học Sinh Mới Vào Danh Sách:</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">Họ và tên học sinh:</label>
                        <input
                          type="text"
                          placeholder="Ví dụ: Hoàng Đình Nam..."
                          value={newStdName}
                          onChange={(e) => setNewStdName(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-hidden focus:border-amber-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Lớp:</label>
                        <input
                          type="text"
                          placeholder="Ví dụ: 9A1..."
                          value={newStdClass}
                          onChange={(e) => setNewStdClass(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-hidden focus:border-amber-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Mã số / SBD (tùy chọn):</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Ví dụ: SBD-09..."
                            value={newStdCode}
                            onChange={(e) => setNewStdCode(e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-hidden focus:border-amber-500"
                          />
                          <button
                            type="submit"
                            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-xs shrink-0"
                          >
                            Thêm
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>

                  {/* Student List */}
                  <div className="rounded-2xl border border-slate-800 overflow-x-auto bg-slate-950/60">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold">
                        <tr>
                          <th className="py-2.5 px-3 w-10 text-center">STT</th>
                          <th className="py-2.5 px-3">Họ và Tên</th>
                          <th className="py-2.5 px-3 w-20">Lớp</th>
                          <th className="py-2.5 px-3 w-28">Mã SBD</th>
                          <th className="py-2.5 px-3">Ngày Đăng Ký</th>
                          <th className="py-2.5 px-3">Lần Đăng Nhập Gần Nhất</th>
                          <th className="py-2.5 px-3 text-center w-12">Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {studentAccounts.map((std, idx) => (
                          <tr key={std.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-2.5 px-3 text-center text-slate-500 font-mono">
                              {idx + 1}
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-white">
                              {std.fullName}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-cyan-300">
                              {std.className}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-slate-400">
                              {std.studentCode || '—'}
                            </td>
                            <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                              {std.registeredAt}
                            </td>
                            <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                              {std.lastLoginAt}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <button
                                onClick={() => {
                                  if (confirm(`Xóa tài khoản của học sinh ${std.fullName}?`)) {
                                    soundManager.playClick();
                                    onDeleteStudent(std.id);
                                  }
                                }}
                                className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                                title="Xóa học sinh này"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: SUPER ADMIN OVERRIDES & CONTROLS */}
              {activeTab === 'control' && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  {/* Unlock All Stations Button */}
                  <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                          <Unlock className="text-amber-400" size={16} />
                          <span>Toàn Quyền Mở Khóa Tất Cả Trạm Vũ Trụ</span>
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Mở khóa đồng loạt cả 5 hành tinh cho học sinh ôn luyện không cần đợi qua từng màn.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          soundManager.playVictory();
                          onUnlockAllPlanets();
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shrink-0"
                      >
                        Mở Khóa Toàn Bộ
                      </button>
                    </div>
                  </div>

                  {/* Strict Exam Mode Toggle */}
                  <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                          <ShieldAlert className="text-cyan-400" size={16} />
                          <span>Chế Độ Thi Nghiêm Ngặt Trên Lớp</span>
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {adminSettings.isExamStrictMode
                            ? 'Đang BẬT: Khóa nút gợi ý để tổ chức kiểm tra nghiêm túc trên lớp.'
                            : 'Đang TẮT: Học sinh được phép xem gợi ý khi gặp câu hỏi khó.'}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          soundManager.playClick();
                          onUpdateAdminSettings({
                            ...adminSettings,
                            isExamStrictMode: !adminSettings.isExamStrictMode,
                          });
                        }}
                        className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                          adminSettings.isExamStrictMode
                            ? 'bg-rose-600 text-white shadow-md'
                            : 'bg-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        {adminSettings.isExamStrictMode ? 'Đang Khóa Gợi Ý' : 'Cho Phép Gợi Ý'}
                      </button>
                    </div>
                  </div>

                  {/* Quick TT22 Matrix Configuration */}
                  <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <GraduationCap className="text-cyan-400" size={16} />
                      <span>Cài Đặt Nhanh Ma Trận Thông Tư 22</span>
                    </h4>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="text-slate-400">Nhận biết</div>
                        <div className="font-bold text-cyan-400 mt-1">{matrixSetting.nhanBietRatio}%</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="text-slate-400">Thông hiểu</div>
                        <div className="font-bold text-blue-400 mt-1">{matrixSetting.thongHieuRatio}%</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="text-slate-400">Vận dụng</div>
                        <div className="font-bold text-amber-400 mt-1">{matrixSetting.vanDungRatio}%</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="text-slate-400">Vận dụng cao</div>
                        <div className="font-bold text-rose-400 mt-1">{matrixSetting.vanDungCaoRatio}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SECURITY & CREDENTIALS */}
              {activeTab === 'security' && (
                <div className="space-y-6 max-w-md mx-auto">
                  <form onSubmit={handleChangePassword} className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Key className="text-amber-400" size={16} />
                      <span>Đổi Mật Khẩu Quản Trị Viên</span>
                    </h4>

                    <div className="space-y-2 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">Mật khẩu mới:</label>
                        <input
                          type="password"
                          value={newPass}
                          onChange={(e) => setNewPass(e.target.value)}
                          placeholder="Nhập mật khẩu mới..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-hidden focus:border-amber-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Xác nhận mật khẩu mới:</label>
                        <input
                          type="password"
                          value={confirmPass}
                          onChange={(e) => setConfirmPass(e.target.value)}
                          placeholder="Nhập lại mật khẩu mới..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-hidden focus:border-amber-500"
                          required
                        />
                      </div>
                    </div>

                    {passChangeSuccess && (
                      <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <Check size={14} />
                        <span>Đã cập nhật mật khẩu quản trị mới thành công!</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={!newPass || newPass !== confirmPass}
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition-all"
                    >
                      Lưu Mật Khẩu Quản Trị Mới
                    </button>
                  </form>
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <span>Trung Tâm Quản Trị · Bản quyền: Teacher Lê Thanh Tùng</span>
          <span className="font-mono">Phiên bản Quản Trị v2.0 · GDPT 2018</span>
        </div>
      </div>
    </div>
  );
};
