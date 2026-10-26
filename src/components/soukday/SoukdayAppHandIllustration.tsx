'use client';

import React from 'react';

interface SoukdayAppHandIllustrationProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export default function SoukdayAppHandIllustration({
  className = '',
  width = '100%',
  height = '100%',
}: SoukdayAppHandIllustrationProps) {
  return (
    <svg
      viewBox="0 0 320 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none overflow-visible ${className}`}
      style={{ width, height }}
      aria-label="Illustration de l'application mobile Soukday"
    >
      <defs>
        {/* Phone bezel gradient */}
        <linearGradient id="phoneFrameGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>

        {/* Hand skin gradient */}
        <linearGradient id="handSkinGrad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#B47248" />
          <stop offset="40%" stopColor="#D89264" />
          <stop offset="100%" stopColor="#E6A87E" />
        </linearGradient>

        {/* Finger skin highlight */}
        <linearGradient id="fingerGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EEB58D" />
          <stop offset="100%" stopColor="#C88052" />
        </linearGradient>

        {/* Sleeve cuff */}
        <linearGradient id="cuffGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0D9488" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>

        {/* Screen header */}
        <linearGradient id="screenHeaderGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>

        {/* Golden Sparkle Glow */}
        <filter id="sparkleGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <linearGradient id="sparkleGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* ================= SPARKLES ================= */}
      {/* 1. Top Left Sparkle Star */}
      <g transform="translate(68, 48) scale(1.15)" filter="url(#sparkleGlow)">
        <path
          d="M0 -14 C1 -4 4 -1 14 0 C4 1 1 4 0 14 C-1 4 -4 1 -14 0 C-4 -1 -1 -4 0 -14 Z"
          fill="url(#sparkleGrad)"
        />
        <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
      </g>

      {/* 2. Top Right Sparkle Star */}
      <g transform="translate(242, 38) scale(1.3)" filter="url(#sparkleGlow)">
        <path
          d="M0 -15 C1.2 -4.5 4.5 -1.2 15 0 C4.5 1.2 1.2 4.5 0 15 C-1.2 4.5 -4.5 1.2 -15 0 C-4.5 -1.2 -1.2 -4.5 0 -15 Z"
          fill="url(#sparkleGrad)"
        />
        <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
      </g>

      {/* 3. Small Middle Sparkle */}
      <g transform="translate(268, 98) scale(0.75)" filter="url(#sparkleGlow)">
        <path
          d="M0 -12 C1 -3 3 -1 12 0 C3 1 1 3 0 12 C-1 3 -3 1 -12 0 C-3 -1 -1 -3 0 -12 Z"
          fill="url(#sparkleGrad)"
        />
        <circle cx="0" cy="0" r="1.5" fill="#FFFFFF" />
      </g>

      {/* 4. Tiny Left Sparkle */}
      <g transform="translate(42, 92) scale(0.65)" filter="url(#sparkleGlow)">
        <path
          d="M0 -10 C0.8 -2.5 2.5 -0.8 10 0 C2.5 0.8 0.8 2.5 0 10 C-0.8 2.5 -2.5 0.8 -10 0 C-2.5 -0.8 -0.8 -2.5 0 -10 Z"
          fill="url(#sparkleGrad)"
        />
      </g>

      {/* ================= ARM / WRIST ================= */}
      {/* Wrist / Arm coming from bottom left */}
      <g>
        <path
          d="M-10 200 C30 185 75 160 115 130 C135 115 150 102 162 108 C175 115 170 145 162 170 C155 190 140 210 135 220 L-10 220 Z"
          fill="url(#handSkinGrad)"
        />
        {/* Soft arm shadow/depth */}
        <path
          d="M10 210 C50 185 90 160 128 138 C140 145 145 165 140 195 L20 220 Z"
          fill="#000000"
          opacity="0.08"
        />
      </g>

      {/* ================= SMARTPHONE (Angled ~22 deg) ================= */}
      <g transform="translate(162, 108) rotate(-16)">
        {/* Phone Drop Shadow */}
        <rect
          x="-58"
          y="-110"
          width="116"
          height="192"
          rx="18"
          fill="#064E3B"
          opacity="0.25"
          transform="translate(4, 10)"
        />

        {/* Outer Phone Frame */}
        <rect
          x="-58"
          y="-110"
          width="116"
          height="192"
          rx="18"
          fill="url(#phoneFrameGrad)"
          stroke="#475569"
          strokeWidth="2.5"
        />

        {/* Screen Bezel / Inner Glass */}
        <rect
          x="-53"
          y="-105"
          width="106"
          height="182"
          rx="14"
          fill="#F8FAFC"
        />

        {/* Screen App UI */}
        <g clipPath="url(#phoneScreenClip)">
          {/* Top Notch / Island */}
          <rect x="-18" y="-103" width="36" height="6" rx="3" fill="#0F172A" />

          {/* App Header (Soukday Emerald/Mint) */}
          <rect x="-53" y="-95" width="106" height="34" fill="url(#screenHeaderGrad)" />
          
          {/* App Brand Name */}
          <text
            x="-44"
            y="-77"
            fontFamily="system-ui, sans-serif"
            fontWeight="900"
            fontSize="10"
            fill="#FFFFFF"
            letterSpacing="-0.3"
          >
            Soukday
          </text>
          
          {/* Location badge on screen */}
          <rect x="-44" y="-72" width="56" height="8" rx="4" fill="#047857" opacity="0.8" />
          <text
            x="-41"
            y="-66"
            fontFamily="system-ui, sans-serif"
            fontWeight="600"
            fontSize="5"
            fill="#ECFDF5"
          >
            📍 Montréal & Rive-Sud
          </text>

          {/* Search bar inside app */}
          <rect x="-46" y="-55" width="92" height="12" rx="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
          <circle cx="-38" cy="-49" r="2.5" stroke="#94A3B8" strokeWidth="1" fill="none" />
          <line x1="-36" y1="-47" x2="-34" y2="-45" stroke="#94A3B8" strokeWidth="1" />
          <text
            x="-30"
            y="-46"
            fontFamily="system-ui, sans-serif"
            fontSize="5.5"
            fill="#94A3B8"
          >
            Épicerie, épices, halal...
          </text>

          {/* Mini Category Chips */}
          <rect x="-46" y="-38" width="28" height="9" rx="4" fill="#FEF3C7" />
          <text x="-42" y="-32" fontSize="5" fontWeight="bold" fill="#D97706">🥖 Pain frais</text>
          
          <rect x="-15" y="-38" width="30" height="9" rx="4" fill="#FEE2E2" />
          <text x="-12" y="-32" fontSize="5" fontWeight="bold" fill="#DC2626">🥩 Boucherie</text>

          <rect x="18" y="-38" width="28" height="9" rx="4" fill="#E0E7FF" />
          <text x="21" y="-32" fontSize="5" fontWeight="bold" fill="#4338CA">🫒 Épicerie</text>

          {/* Mini Product Cards Grid on Phone */}
          {/* Card 1 */}
          <rect x="-46" y="-24" width="43" height="52" rx="6" fill="#FFFFFF" stroke="#F1F5F9" strokeWidth="1" />
          <rect x="-43" y="-21" width="37" height="26" rx="4" fill="#F8FAFC" />
          <text x="-28" y="-5" fontSize="14" textAnchor="middle">🥬</text>
          <text x="-42" y="12" fontSize="4.5" fontWeight="bold" fill="#1E293B">Légumes frais</text>
          <text x="-42" y="19" fontSize="4.5" fontWeight="900" fill="#059669">2,99 $</text>
          <circle cx="-8" cy="18" r="4" fill="#059669" />
          <text x="-8" y="20" fontSize="6" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">+</text>

          {/* Card 2 */}
          <rect x="3" y="-24" width="43" height="52" rx="6" fill="#FFFFFF" stroke="#F1F5F9" strokeWidth="1" />
          <rect x="6" y="-21" width="37" height="26" rx="4" fill="#F8FAFC" />
          <text x="24" y="-5" fontSize="14" textAnchor="middle">🥐</text>
          <text x="7" y="12" fontSize="4.5" fontWeight="bold" fill="#1E293B">Pâtisserie fine</text>
          <text x="7" y="19" fontSize="4.5" fontWeight="900" fill="#059669">4,50 $</text>
          <circle cx="41" cy="18" r="4" fill="#059669" />
          <text x="41" y="20" fontSize="6" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">+</text>

          {/* Bottom App Navigation */}
          <rect x="-53" y="58" width="106" height="19" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.8" />
          <circle cx="-32" cy="67" r="3" fill="#059669" />
          <circle cx="-6" cy="67" r="3" fill="#94A3B8" />
          <circle cx="20" cy="67" r="3" fill="#94A3B8" />
          <circle cx="36" cy="67" r="4.5" fill="#F68B62" />
          <text x="36" y="69.5" fontSize="6" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">1</text>
        </g>

        {/* Clip path for the phone screen */}
        <clipPath id="phoneScreenClip">
          <rect x="-53" y="-105" width="106" height="182" rx="14" />
        </clipPath>
      </g>

      {/* ================= HAND FINGERS (Wrapping around phone) ================= */}
      <g>
        {/* Thumb holding right/bottom side of phone */}
        <path
          d="M178 98 C192 92 206 96 215 106 C220 112 218 120 210 125 C198 132 184 130 172 120 Z"
          fill="url(#fingerGrad)"
          stroke="#C88052"
          strokeWidth="1"
        />

        {/* Index Finger peek */}
        <path
          d="M92 95 C98 84 112 82 120 89 C126 94 125 102 118 108 C110 114 98 112 92 102 Z"
          fill="url(#fingerGrad)"
          stroke="#B47248"
          strokeWidth="0.8"
        />

        {/* Middle Finger peek */}
        <path
          d="M82 114 C88 104 102 102 110 109 C116 114 115 122 108 128 C100 134 88 132 82 122 Z"
          fill="url(#fingerGrad)"
          stroke="#B47248"
          strokeWidth="0.8"
        />

        {/* Ring Finger peek */}
        <path
          d="M74 135 C80 126 94 125 101 131 C107 136 106 144 99 150 C92 155 80 152 74 142 Z"
          fill="url(#fingerGrad)"
          stroke="#B47248"
          strokeWidth="0.8"
        />
      </g>
    </svg>
  );
}
