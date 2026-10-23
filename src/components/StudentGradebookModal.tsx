import React, { useState } from 'react';
import { Download, Printer, Search, Filter, Trash2, X, FileSpreadsheet, Award, CheckCircle, Clock } from 'lucide-react';
import { StudentExamRecord } from '../types/mathGame';
import { soundManager } from '../utils/audio';

interface StudentGradebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: StudentExamRecord[];
  onClearRecords: () => void;
}

export const StudentGradebookModal: React.FC<StudentGradebookModalProps> = ({
  isOpen,
  onClose,
  records,
  onClearRecords,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');

  if (!isOpen) return null;

  // Extract unique classes
  const classesList = Array.from(new Set(records.map((r) => r.className))).filter(Boolean);

  // Filter records
  const filteredRecords = records.filter((r) => {
    const matchName = r.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchClass = selectedClass === 'all' || r.className === selectedClass;
    const matchGrade = selectedGrade === 'all' || r.tt22Grade === selectedGrade;
    return matchName && matchClass && matchGrade;
  });

  // Calculate statistics
  const totalSubmissions = records.length;
  const uniqueStudents = new Set(records.map((r) => `${r.studentName}_${r.className}`)).size;
  const avgScore = totalSubmissions > 0
    ? Math.round(records.reduce((acc, r) => acc + r.score, 0) / totalSubmissions)
    : 0;

  const countTot = records.filter((r) => r.tt22Grade === 'Tốt').length;
  const countKha = records.filter((r) => r.tt22Grade === 'Khá').length;
  const countDat = records.filter((r) => r.tt22Grade === 'Đạt').length;
  const countChuaDat = records.filter((r) => r.tt22Grade === 'Chưa đạt').length;

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}p ${s < 10 ? '0' : ''}${s}s`;
  };

  // Export CSV (Excel Compatible with UTF-8 BOM)
  const handleExportCSV = () => {
    soundManager.playClick();
    if (records.length === 0) return;

    // Headers
    const headers = [
      'STT',
      'Họ và Tên Học Sinh',
      'Lớp',
      'Ngày Giờ Đăng Nhập',
      'Ngày Giờ Bắt Đầu',
      'Ngày Giờ Nộp Bài',
      'Thời Gian Làm Bài',
      'Chế Độ Làm Bài',
      'Điểm Đạt Được',
      'Số Câu Đúng',
      'Tổng Số Câu',
      'Tỉ Lệ Chính Xác (%)',
      'Xếp Loại Theo TT22'
    ];

    const rows = filteredRecords.map((r, idx) => [
      idx + 1,
      `"${r.studentName.replace(/"/g, '""')}"`,
      `"${r.className}"`,
      `"${r.loginTime}"`,
      `"${r.examStartTime}"`,
      `"${r.examCompletedTime}"`,
      `"${formatDuration(r.durationSeconds)}"`,
      `"${r.modeLabel}"`,
      r.score,
      r.correctCount,
      r.totalQuestions,
      `${r.accuracy}%`,
      `"${r.tt22Grade}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `danh_sach_diem_toan_9_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON
  const handleExportJSON = () => {
    soundManager.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `nhat_ky_lam_bai_toan9_${Date.now()}.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl text-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Sổ Điểm & Nhật Ký Học Sinh Tham Gia
              </h2>
              <p className="text-xs text-slate-400">
                Thống kê ngày giờ đăng nhập, thời gian làm bài & xuất danh sách điểm (TT 22 & CV 7991)
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

        {/* Statistical Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950/40 border-b border-slate-800 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400">Tổng lượt làm bài</span>
            <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5 tabular-nums">
              {totalSubmissions}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400">Số học sinh</span>
            <div className="text-xl font-bold font-mono text-white mt-0.5 tabular-nums">
              {uniqueStudents}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400">Điểm trung bình</span>
            <div className="text-xl font-bold font-mono text-amber-400 mt-0.5 tabular-nums">
              {avgScore} đ
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400">Phổ điểm TT22</span>
            <div className="text-[11px] font-semibold text-slate-300 mt-1 flex items-center gap-1.5 flex-wrap">
              <span className="text-emerald-400">Tốt: {countTot}</span>
              <span className="text-cyan-400">Khá: {countKha}</span>
              <span className="text-amber-400">Đạt: {countDat}</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Filters Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="relative min-w-[160px] flex-1 sm:flex-initial">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input
                type="text"
                placeholder="Tìm tên học sinh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-hidden focus:border-cyan-500"
            >
              <option value="all">Tất cả lớp ({records.length})</option>
              {classesList.map((cls) => (
                <option key={cls} value={cls}>
                  Lớp {cls}
                </option>
              ))}
            </select>

            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-hidden focus:border-cyan-500"
            >
              <option value="all">Tất cả xếp loại</option>
              <option value="Tốt">Mức Tốt</option>
              <option value="Khá">Mức Khá</option>
              <option value="Đạt">Mức Đạt</option>
              <option value="Chưa đạt">Chưa đạt</option>
            </select>
          </div>

          {/* Action Buttons: Export CSV / JSON / Print */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              disabled={records.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold transition-colors shadow-sm"
              title="Xuất file Excel CSV có dấu tiếng Việt"
            >
              <Download size={14} />
              <span>Tải Excel / CSV</span>
            </button>

            <button
              onClick={handleExportJSON}
              disabled={records.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 font-medium transition-colors"
              title="Xuất file JSON sao lưu"
            >
              <Download size={14} />
              <span className="hidden sm:inline">JSON</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                window.print();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
              title="In danh sách điểm"
            >
              <Printer size={14} />
              <span className="hidden sm:inline">In</span>
            </button>

            {records.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Thầy/Cô có chắc chắn muốn xóa toàn bộ lịch sử làm bài không?')) {
                    soundManager.playClick();
                    onClearRecords();
                  }
                }}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                title="Xóa toàn bộ lịch sử"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Detailed Table */}
        <div className="flex-1 overflow-auto">
          {filteredRecords.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-950/80 text-slate-400 sticky top-0 border-b border-slate-800 font-semibold">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">STT</th>
                  <th className="py-2.5 px-3">Học Sinh</th>
                  <th className="py-2.5 px-3 w-16">Lớp</th>
                  <th className="py-2.5 px-3">Ngày Giờ Đăng Nhập</th>
                  <th className="py-2.5 px-3">Thời Gian Làm Bài</th>
                  <th className="py-2.5 px-3">Chế Độ</th>
                  <th className="py-2.5 px-3 text-right">Điểm Số</th>
                  <th className="py-2.5 px-3 text-center">Đúng / Tổng</th>
                  <th className="py-2.5 px-3 text-center">Xếp Loại TT22</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-normal text-slate-300">
                {filteredRecords.map((r, index) => {
                  const gradeBadge =
                    r.tt22Grade === 'Tốt'
                      ? 'text-emerald-400'
                      : r.tt22Grade === 'Khá'
                      ? 'text-cyan-400'
                      : r.tt22Grade === 'Đạt'
                      ? 'text-amber-400'
                      : 'text-rose-400';

                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-2.5 px-3 text-center text-slate-500 font-mono">
                        {index + 1}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-white">
                        {r.studentName}
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 font-mono">
                        {r.className}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                        {r.loginTime}
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 font-mono">
                        <div>{formatDuration(r.durationSeconds)}</div>
                        <div className="text-[10px] text-slate-500">{r.examCompletedTime}</div>
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
                        <span className={gradeBadge}>{r.tt22Grade}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs space-y-2">
              <FileSpreadsheet className="mx-auto text-slate-600" size={32} />
              <p>Chưa có lượt làm bài nào phù hợp với bộ lọc.</p>
              <p className="text-slate-600">
                Khi học sinh hoàn thành bài thi, kết quả sẽ tự động lưu vào Sổ Điểm này.
              </p>
            </div>
          )}
        </div>

        {/* Footer Credit */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <span>Hệ thống Quản lý Sổ Điểm · Bản quyền: Teacher Lê Thanh Tùng</span>
          <span className="font-mono">{filteredRecords.length} / {records.length} bản ghi</span>
        </div>
      </div>
    </div>
  );
};
