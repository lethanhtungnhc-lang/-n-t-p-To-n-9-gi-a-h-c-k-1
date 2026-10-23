import React, { useState } from 'react';
import { X, Delete, RotateCcw } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface MiniCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MiniCalculator: React.FC<MiniCalculatorProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState('');

  if (!isOpen) return null;

  const handleNum = (num: string) => {
    soundManager.playClick();
    setDisplay((prev) => (prev === '0' ? num : prev + num));
  };

  const handleOp = (op: string) => {
    soundManager.playClick();
    setDisplay((prev) => prev + ' ' + op + ' ');
  };

  const handleClear = () => {
    soundManager.playClick();
    setDisplay('0');
    setHistory('');
  };

  const handleDelete = () => {
    soundManager.playClick();
    setDisplay((prev) => {
      if (prev.length <= 1) return '0';
      return prev.trimEnd().slice(0, -1).trimEnd() || '0';
    });
  };

  const handleSqrt = () => {
    soundManager.playClick();
    try {
      const val = parseFloat(display);
      if (isNaN(val) || val < 0) {
        setDisplay('Lỗi: Căn số âm!');
      } else {
        const res = Math.sqrt(val);
        setHistory(`√(${display})`);
        setDisplay(String(Number(res.toFixed(6))));
      }
    } catch {
      setDisplay('Lỗi cú pháp');
    }
  };

  const handleTrig = (type: 'sin' | 'cos' | 'tan') => {
    soundManager.playClick();
    try {
      const deg = parseFloat(display);
      if (isNaN(deg)) {
        setDisplay('Lỗi cú pháp');
        return;
      }
      const rad = (deg * Math.PI) / 180;
      let res = 0;
      if (type === 'sin') res = Math.sin(rad);
      if (type === 'cos') res = Math.cos(rad);
      if (type === 'tan') {
        if (Math.abs(Math.cos(rad)) < 1e-10) {
          setDisplay('Không xác định');
          return;
        }
        res = Math.tan(rad);
      }
      setHistory(`${type}(${deg}°)`);
      setDisplay(String(Number(res.toFixed(6))));
    } catch {
      setDisplay('Lỗi cú pháp');
    }
  };

  const handleSquare = () => {
    soundManager.playClick();
    try {
      const val = parseFloat(display);
      if (isNaN(val)) return;
      setHistory(`(${display})²`);
      setDisplay(String(Number((val * val).toFixed(6))));
    } catch {
      setDisplay('Lỗi');
    }
  };

  const handleEquals = () => {
    soundManager.playClick();
    try {
      // Clean up expression
      let expr = display.replace(/×/g, '*').replace(/÷/g, '/');
      // Evaluate safely with standard math operators
      // Only allow safe math tokens
      if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
        setDisplay('Lỗi cú pháp');
        return;
      }
      // Simple safe evaluation
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${expr})`)();
      setHistory(display + ' =');
      setDisplay(String(Number(result.toFixed(6))));
    } catch {
      setDisplay('Lỗi cú pháp');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-xs rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-4 text-slate-100 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold text-sm tracking-wide">Máy Tính Bỏ Túi Toán 9</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Display Screen */}
        <div className="my-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-right">
          <div className="text-xs text-slate-400 h-4 font-mono truncate">{history}</div>
          <div className="text-2xl font-bold font-mono tracking-wider text-cyan-300 truncate">
            {display}
          </div>
        </div>

        {/* Keypad Grid */}
        <div className="grid grid-cols-4 gap-1.5 text-xs font-semibold">
          {/* Row 1: Trig & Sqrt */}
          <button
            onClick={() => handleTrig('sin')}
            className="p-2.5 rounded-lg bg-indigo-950/60 text-indigo-300 hover:bg-indigo-900/60 border border-indigo-900/50"
          >
            sin(°)
          </button>
          <button
            onClick={() => handleTrig('cos')}
            className="p-2.5 rounded-lg bg-indigo-950/60 text-indigo-300 hover:bg-indigo-900/60 border border-indigo-900/50"
          >
            cos(°)
          </button>
          <button
            onClick={() => handleTrig('tan')}
            className="p-2.5 rounded-lg bg-indigo-950/60 text-indigo-300 hover:bg-indigo-900/60 border border-indigo-900/50"
          >
            tan(°)
          </button>
          <button
            onClick={handleSqrt}
            className="p-2.5 rounded-lg bg-cyan-950/60 text-cyan-300 hover:bg-cyan-900/60 border border-cyan-900/50 font-bold"
          >
            √x
          </button>

          {/* Row 2 */}
          <button
            onClick={handleSquare}
            className="p-2.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            x²
          </button>
          <button
            onClick={() => handleNum('(')}
            className="p-2.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            (
          </button>
          <button
            onClick={() => handleNum(')')}
            className="p-2.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            )
          </button>
          <button
            onClick={handleClear}
            className="p-2.5 rounded-lg bg-rose-950/60 text-rose-300 hover:bg-rose-900/60 border border-rose-900/50 flex items-center justify-center"
          >
            <RotateCcw size={14} />
          </button>

          {/* Row 3 */}
          <button onClick={() => handleNum('7')} className="p-2.5 rounded-lg bg-slate-800/80 text-white hover:bg-slate-700 text-sm">7</button>
          <button onClick={() => handleNum('8')} className="p-2.5 rounded-lg bg-slate-800/80 text-white hover:bg-slate-700 text-sm">8</button>
          <button onClick={() => handleNum('9')} className="p-2.5 rounded-lg bg-slate-800/80 text-white hover:bg-slate-700 text-sm">9</button>
          <button onClick={() => handleOp('÷')} className="p-2.5 rounded-lg bg-amber-950/50 text-amber-300 hover:bg-amber-900/50 text-base">÷</button>

          {/* Row 4 */}
          <button onClick={() => handleNum('4')} className="p-2.5 rounded-lg bg-slate-800/80 text-white hover:bg-slate-700 text-sm">4</button>
          <button onClick={() => handleNum('5')} className="p-2.5 rounded-lg bg-slate-800/80 text-white hover:bg-slate-700 text-sm">5</button>
          <button onClick={() => handleNum('6')} className="p-2.5 rounded-lg bg-slate-800/80 text-white hover:bg-slate-700 text-sm">6</button>
          <button onClick={() => handleOp('×')} className="p-2.5 rounded-lg bg-amber-950/50 text-amber-300 hover:bg-amber-900/50 text-base">×</button>

          {/* Row 5 */}
          <button onClick={() => handleNum('1')} className="p-2.5 rounded-lg bg-slate-800/80 text-white hover:bg-slate-700 text-sm">1</button>
          <button onClick={() => handleNum('2')} className="p-2.5 rounded-lg bg-slate-800/80 text-white hover:bg-slate-700 text-sm">2</button>
          <button onClick={() => handleNum('3')} className="p-2.5 rounded-lg bg-slate-800/80 text-white hover:bg-slate-700 text-sm">3</button>
          <button onClick={() => handleOp('-')} className="p-2.5 rounded-lg bg-amber-950/50 text-amber-300 hover:bg-amber-900/50 text-base">-</button>

          {/* Row 6 */}
          <button onClick={() => handleNum('0')} className="p-2.5 rounded-lg bg-slate-800/80 text-white hover:bg-slate-700 text-sm">0</button>
          <button onClick={() => handleNum('.')} className="p-2.5 rounded-lg bg-slate-800/80 text-white hover:bg-slate-700 text-sm">.</button>
          <button onClick={handleDelete} className="p-2.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center">
            <Delete size={14} />
          </button>
          <button onClick={() => handleOp('+')} className="p-2.5 rounded-lg bg-amber-950/50 text-amber-300 hover:bg-amber-900/50 text-base">+</button>
        </div>

        {/* Equals Row */}
        <button
          onClick={handleEquals}
          className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-base shadow-lg shadow-cyan-500/25 transition-all"
        >
          =
        </button>
      </div>
    </div>
  );
};
