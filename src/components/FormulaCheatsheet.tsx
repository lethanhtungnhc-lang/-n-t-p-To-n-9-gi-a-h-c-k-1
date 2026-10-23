import React, { useState } from 'react';
import { X, BookOpen, Search } from 'lucide-react';
import { MathView } from '../utils/katexHelper';

interface FormulaCheatsheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaCheatsheet: React.FC<FormulaCheatsheetProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'root' | 'linear' | 'trig' | 'inequality'>('all');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const sections = [
    {
      id: 'root',
      title: '1. Căn Bậc Hai & Căn Bậc Ba',
      color: 'border-cyan-500/40 text-cyan-400',
      items: [
        {
          name: 'Điều kiện xác định',
          formula: '$\\sqrt{A} \\text{ có nghĩa } \\iff A \\ge 0$',
          desc: 'Biểu thức dưới dấu căn bắt buộc phải không âm. Nếu nằm ở mẫu $\\frac{1}{\\sqrt{A}}$ thì $A > 0$.',
        },
        {
          name: 'Hằng đẳng thức căn thức',
          formula: '$\\sqrt{A^2} = |A| = \\begin{cases} A & \\text{khi } A \\ge 0 \\\\ -A & \\text{khi } A < 0 \\end{cases}$',
          desc: 'Lưu ý: Luôn phá dấu giá trị tuyệt đối dựa vào dấu của biểu thức bên trong!',
        },
        {
          name: 'Khai căn một tích & một thương',
          formula: '$\\sqrt{A \\cdot B} = \\sqrt{A} \\cdot \\sqrt{B} \\quad (A, B \\ge 0) \\\\ \\sqrt{\\frac{A}{B}} = \\frac{\\sqrt{A}}{\\sqrt{B}} \\quad (A \\ge 0, B > 0)$',
          desc: 'Không áp dụng tính chất này cho phép cộng hay phép trừ: $\\sqrt{A + B} \\ne \\sqrt{A} + \\sqrt{B}$.',
        },
        {
          name: 'Trục căn thức ở mẫu',
          formula: '$\\frac{C}{\\sqrt{A} \\pm \\sqrt{B}} = \\frac{C(\\sqrt{A} \\mp \\sqrt{B})}{A - B} \\quad (A \\ne B, A, B \\ge 0)$',
          desc: 'Nhân cả tử và mẫu với biểu thức liên hợp đổi dấu ở giữa.',
        },
      ],
    },
    {
      id: 'linear',
      title: '2. Phương Trình & Hệ PT Bậc Nhất Hai Ẩn',
      color: 'border-indigo-500/40 text-indigo-400',
      items: [
        {
          name: 'Phương trình bậc nhất hai ẩn',
          formula: '$ax + by = c \\quad (a^2 + b^2 \\ne 0)$',
          desc: 'Luôn có vô số nghiệm. Tập nghiệm được biểu diễn hình học bởi một đường thẳng trong mặt phẳng tọa độ.',
        },
        {
          name: 'Điều kiện số nghiệm của Hệ PT',
          formula: '$\\text{Hệ: } \\begin{cases} a_1 x + b_1 y = c_1 \\\\ a_2 x + b_2 y = c_2 \\end{cases} \\\\ \\bullet \\text{ Nghiệm duy nhất: } \\frac{a_1}{a_2} \\ne \\frac{b_1}{b_2} \\\\ \\bullet \\text{ Vô nghiệm: } \\frac{a_1}{a_2} = \\frac{b_1}{b_2} \\ne \\frac{c_1}{c_2} \\\\ \\bullet \\text{ Vô số nghiệm: } \\frac{a_1}{a_2} = \\frac{b_1}{b_2} = \\frac{c_1}{c_2}$',
          desc: 'Hai đường thẳng cắt nhau (1 nghiệm), song song (vô nghiệm), hoặc trùng nhau (vô số nghiệm).',
        },
        {
          name: 'Phương pháp giải hệ phương trình',
          formula: '$\\text{PP Thế: Rút } x \\text{ (hoặc } y\\text{)} \\to \\text{PP Cộng đại số: Nhân tạo hệ số đối/bằng nhau}$',
          desc: 'Ưu tiên cộng đại số khi các hệ số đẹp, ưu tiên thế khi có hệ số bằng 1 hoặc -1.',
        },
      ],
    },
    {
      id: 'inequality',
      title: '3. Bất Đẳng Thức & Bất Phương Trình',
      color: 'border-amber-500/40 text-amber-400',
      items: [
        {
          name: 'Quy tắc nhân với số âm',
          formula: '$a < b \\text{ và } c < 0 \\implies a \\cdot c > b \\cdot c$',
          desc: 'QUAN TRỌNG: Nhân hoặc chia hai vế của bất đẳng thức với một số âm PHẢI ĐỔI CHIỀU bất đẳng thức!',
        },
        {
          name: 'Bất phương trình bậc nhất một ẩn',
          formula: '$ax + b > 0 \\quad (a \\ne 0)$',
          desc: 'Nếu $a > 0 \\implies x > -\\frac{b}{a}$. Nếu $a < 0 \\implies x < -\\frac{b}{a}$ (đổi chiều).',
        },
      ],
    },
    {
      id: 'trig',
      title: '4. Hệ Thức Lượng & Tỉ Số Lượng Giác',
      color: 'border-emerald-500/40 text-emerald-400',
      items: [
        {
          name: 'Hệ thức trong tam giác vuông (vuông tại A, đường cao AH)',
          formula: '$\\bullet \\; b^2 = a \\cdot b\' \\quad \\bullet \\; c^2 = a \\cdot c\' \\\\ \\bullet \\; h^2 = b\' \\cdot c\' \\quad \\bullet \\; a \\cdot h = b \\cdot c \\\\ \\bullet \\; \\frac{1}{h^2} = \\frac{1}{b^2} + \\frac{1}{c^2}$',
          desc: 'Trong đó $a$ là cạnh huyền, $b, c$ là cạnh góc vuông, $b\', c\'$ là hình chiếu tương ứng, $h$ là đường cao.',
        },
        {
          name: 'Tỉ số lượng giác góc nhọn',
          formula: '$\\sin\\alpha = \\frac{\\text{Đối}}{\\text{Huyền}}, \\; \\cos\\alpha = \\frac{\\text{Kề}}{\\text{Huyền}}, \\; \\tan\\alpha = \\frac{\\text{Đối}}{\\text{Kề}}, \\; \\cot\\alpha = \\frac{\\text{Kề}}{\\text{Đối}}$',
          desc: 'Mẹo nhớ: Sin đi học, Cos khóc hoài, Thôi đừng khóc, Có kẹo đây.',
        },
        {
          name: 'Bảng giá trị lượng giác góc đặc biệt',
          formula: '$\\begin{array}{|c|c|c|c|} \\hline \\alpha & 30^\\circ & 45^\\circ & 60^\\circ \\\\ \\hline \\sin\\alpha & \\frac{1}{2} & \\frac{\\sqrt{2}}{2} & \\frac{\\sqrt{3}}{2} \\\\ \\hline \\cos\\alpha & \\frac{\\sqrt{3}}{2} & \\frac{\\sqrt{2}}{2} & \\frac{1}{2} \\\\ \\hline \\tan\\alpha & \\frac{\\sqrt{3}}{3} & 1 & \\sqrt{3} \\\\ \\hline \\end{array}$',
          desc: 'Hai góc phụ nhau $(\\alpha + \\beta = 90^\\circ) \\implies \\sin\\alpha = \\cos\\beta, \\tan\\alpha = \\cot\\beta$.',
        },
      ],
    },
  ];

  const filteredSections = sections
    .filter((sec) => activeTab === 'all' || sec.id === activeTab)
    .map((sec) => ({
      ...sec,
      items: sec.items.filter(
        (it) =>
          it.name.toLowerCase().includes(search.toLowerCase()) ||
          it.desc.toLowerCase().includes(search.toLowerCase()) ||
          it.formula.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((sec) => sec.items.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl text-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <BookOpen className="text-cyan-400" size={20} />
            <div>
              <h2 className="text-base font-bold text-white">Sổ Tay Bí Kíp Toán 9 Vũ Trụ</h2>
              <p className="text-xs text-slate-400">Trọng tâm kiến thức Giữa Học Kỳ I (GDPT 2018)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter bar & Search */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'root', label: 'Căn thức' },
              { id: 'linear', label: 'Hệ phương trình' },
              { id: 'inequality', label: 'Bất phương trình' },
              { id: 'trig', label: 'Hệ thức lượng' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-cyan-500 text-white font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input
              type="text"
              placeholder="Tìm công thức..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1 text-xs rounded-lg bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {filteredSections.map((sec) => (
            <div key={sec.id} className="space-y-3">
              <h3 className={`text-sm font-bold pb-1 border-b ${sec.color}`}>{sec.title}</h3>
              <div className="grid grid-cols-1 gap-3">
                {sec.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300">{item.name}</span>
                    </div>
                    <div className="py-1 px-3 rounded-lg bg-slate-900 border border-slate-800 overflow-x-auto text-sm text-cyan-200">
                      <MathView math={item.formula} block />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filteredSections.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-sm">
              Không tìm thấy công thức phù hợp với từ khóa "{search}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
