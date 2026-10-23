import React, { useState, useEffect } from 'react';

export type MascotMood = 'idle' | 'happy' | 'cheer' | 'thinking' | 'encouraging';

interface MascotProps {
  mood?: MascotMood;
  message?: string;
  className?: string;
  compact?: boolean;
}

export const CosmicRobotMascot: React.FC<MascotProps> = ({
  mood = 'idle',
  message,
  className = '',
  compact = false,
}) => {
  const [blink, setBlink] = useState(false);

  // Natural blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const defaultMessages: Record<MascotMood, string> = {
    idle: 'Chào nhà du hành! Hãy chuẩn bị nạp năng lượng toán học!',
    happy: 'Tuyệt đỉnh vũ trụ! Tư duy rất logic và chuẩn xác!',
    cheer: 'Chúc mừng! Bạn vừa ghi thêm điểm số ấn tượng!',
    thinking: 'Đang quét kho dữ liệu... Hãy nhớ lại các hệ thức và điều kiện nhé!',
    encouraging: 'Không sao cả! Sai lầm là cơ hội để nhớ lâu hơn. Xem lời giải nhé!',
  };

  const currentMessage = message || defaultMessages[mood];

  return (
    <div className={`relative flex items-center ${compact ? 'gap-2' : 'gap-4'} ${className}`}>
      {/* 3D-Styled SVG Robot */}
      <div
        className={`relative shrink-0 transition-transform duration-300 ${
          mood === 'cheer' ? 'animate-bounce' : 'animate-[bounce_3s_ease-in-out_infinite]'
        }`}
        style={{
          width: compact ? 64 : 96,
          height: compact ? 72 : 108,
          filter: 'drop-shadow(0 8px 16px rgba(14, 165, 233, 0.35))',
        }}
      >
        <svg
          viewBox="0 0 160 180"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* 3D Metallic Head Gradient */}
            <linearGradient id="robotBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#f8fafc" />
              <stop offset="50%" stop-color="#cbd5e1" />
              <stop offset="100%" stop-color="#64748b" />
            </linearGradient>
            {/* Screen Visor Gradient */}
            <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#082f49" />
              <stop offset="100%" stop-color="#0369a1" />
            </linearGradient>
            {/* Cyan Energy Glow */}
            <radialGradient id="energyGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#38bdf8" />
              <stop offset="80%" stop-color="#0284c7" />
              <stop offset="100%" stop-color="#0c4a6e" />
            </radialGradient>
            {/* Jetpack Flame */}
            <linearGradient id="flameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="40%" stop-color="#f97316" />
              <stop offset="100%" stop-color="transparent" />
            </linearGradient>
          </defs>

          {/* Jetpack Flames */}
          <path
            d="M 52 145 C 50 165, 55 175, 56 180 C 58 175, 62 165, 60 145 Z"
            fill="url(#flameGrad)"
            className="animate-pulse"
          />
          <path
            d="M 100 145 C 98 165, 103 175, 104 180 C 106 175, 110 165, 108 145 Z"
            fill="url(#flameGrad)"
            className="animate-pulse"
          />

          {/* Jetpack Tanks */}
          <rect x="44" y="100" width="20" height="46" rx="10" fill="#475569" stroke="#94a3b8" stroke-width="2" />
          <rect x="96" y="100" width="20" height="46" rx="10" fill="#475569" stroke="#94a3b8" stroke-width="2" />

          {/* Antenna */}
          <line x1="80" y1="20" x2="80" y2="40" stroke="#94a3b8" stroke-width="5" stroke-linecap="round" />
          <circle
            cx="80"
            cy="16"
            r="10"
            fill={mood === 'thinking' ? '#facc15' : '#38bdf8'}
            className={mood === 'thinking' ? 'animate-ping' : ''}
          />
          <circle cx="80" cy="16" r="6" fill="#ffffff" />

          {/* Thought / Idea Bulb */}
          {mood === 'thinking' && (
            <g transform="translate(95, 2) scale(0.7)">
              <circle cx="15" cy="15" r="14" fill="#facc15" opacity="0.9" />
              <text x="15" y="21" font-size="18" font-weight="bold" fill="#713f12" text-anchor="middle">💡</text>
            </g>
          )}

          {/* Ears / Headbolts */}
          <rect x="20" y="55" width="12" height="26" rx="6" fill="#38bdf8" />
          <rect x="128" y="55" width="12" height="26" rx="6" fill="#38bdf8" />

          {/* Head & Helmet */}
          <rect
            x="28"
            y="35"
            width="104"
            height="72"
            rx="24"
            fill="url(#robotBodyGrad)"
            stroke="#e2e8f0"
            stroke-width="3"
          />

          {/* Visor Screen */}
          <rect
            x="38"
            y="45"
            width="84"
            height="52"
            rx="16"
            fill="url(#visorGrad)"
            stroke="#38bdf8"
            stroke-width="2"
          />

          {/* Visor Reflection Stripe */}
          <path
            d="M 44 50 L 78 50 L 58 75 L 44 75 Z"
            fill="#ffffff"
            opacity="0.15"
          />

          {/* EYES & FACE - REACTIVE TO MOOD */}
          {blink ? (
            // Blinking (horizontal lines)
            <g stroke="#38bdf8" stroke-width="4" stroke-linecap="round">
              <line x1="56" y1="68" x2="72" y2="68" />
              <line x1="88" y1="68" x2="104" y2="68" />
            </g>
          ) : mood === 'cheer' || mood === 'happy' ? (
            // Happy inverted curved eyes ^ ^
            <g stroke="#38bdf8" stroke-width="4" stroke-linecap="round" fill="none">
              <path d="M 54 72 Q 63 60 72 72" />
              <path d="M 88 72 Q 97 60 106 72" />
              {/* Cute little mouth */}
              <path d="M 74 84 Q 80 89 86 84" stroke="#38bdf8" stroke-width="3" />
            </g>
          ) : mood === 'encouraging' ? (
            // Encouraging gentle eyes > <
            <g stroke="#38bdf8" stroke-width="4" stroke-linecap="round" fill="none">
              <path d="M 54 64 L 62 70 L 54 76" />
              <path d="M 106 64 L 98 70 L 106 76" />
              <line x1="74" y1="84" x2="86" y2="84" stroke-width="3" />
            </g>
          ) : mood === 'thinking' ? (
            // Thinking eyes looking sideways/up
            <g fill="#38bdf8">
              <circle cx="68" cy="64" r="7" />
              <circle cx="100" cy="64" r="7" />
              <circle cx="70" cy="62" r="3" fill="#ffffff" />
              <circle cx="102" cy="62" r="3" fill="#ffffff" />
            </g>
          ) : (
            // Idle glowing eyes
            <g fill="#38bdf8">
              <circle cx="62" cy="68" r="8" />
              <circle cx="98" cy="68" r="8" />
              <circle cx="65" cy="65" r="3" fill="#ffffff" />
              <circle cx="101" cy="65" r="3" fill="#ffffff" />
            </g>
          )}

          {/* Neck Joint */}
          <rect x="70" y="107" width="20" height="10" rx="3" fill="#334155" />

          {/* Body Torso */}
          <path
            d="M 44 117 C 44 115, 116 115, 116 117 L 108 152 C 108 155, 52 155, 52 152 Z"
            fill="url(#robotBodyGrad)"
            stroke="#cbd5e1"
            stroke-width="3"
          />

          {/* Math Delta & Cosmic Emblem on Chest */}
          <circle cx="80" cy="134" r="10" fill="#0369a1" stroke="#38bdf8" stroke-width="1.5" />
          <text
            x="80"
            y="138"
            font-size="12"
            font-weight="bold"
            fill="#ffffff"
            text-anchor="middle"
            font-family="monospace"
          >
            √9
          </text>
        </svg>
      </div>

      {/* Speech Bubble */}
      <div
        className={`relative rounded-2xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-md text-slate-100 shadow-xl ${
          compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-sm'
        } max-w-sm`}
      >
        {/* Triangle pointer to robot */}
        <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-slate-900/90" />
        <div className="flex items-center gap-1.5 font-semibold text-cyan-400 text-xs mb-0.5">
          <span>Robo-Math 9</span>
          <span className="text-slate-500 text-[10px]">· Trợ lý Vũ trụ</span>
        </div>
        <p className="text-slate-200 leading-snug">{currentMessage}</p>
      </div>
    </div>
  );
};
