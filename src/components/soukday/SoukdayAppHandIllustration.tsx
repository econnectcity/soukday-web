'use client';

import React from 'react';

interface SoukdayAppHandIllustrationProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  isFrench?: boolean;
}

export default function SoukdayAppHandIllustration({
  className = '',
  width = '100%',
  height = '100%',
  isFrench = true,
}: SoukdayAppHandIllustrationProps) {
  return (
    <svg
      viewBox="0 0 360 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none overflow-visible ${className}`}
      style={{ width, height }}
      aria-label="Application mobile Soukday"
    >
      <defs>
        {/* Soft Drop Shadow for Phone */}
        <filter id="phoneShadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="4" dy="10" stdDeviation="8" floodColor="#431407" floodOpacity="0.16" />
        </filter>

        {/* Golden Sparkle Glow */}
        <filter id="sparkleGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Floating Badge Shadow */}
        <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.08" />
        </filter>

        {/* Titanium Frame Gradient */}
        <linearGradient id="phoneFrame" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3F3935" />
          <stop offset="50%" stopColor="#24211E" />
          <stop offset="100%" stopColor="#12100E" />
        </linearGradient>

        {/* Glass Reflection */}
        <linearGradient id="screenGlass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.16" />
          <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Soukday Coral Brand Gradient */}
        <linearGradient id="soukdayBrandGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F68B62" />
          <stop offset="60%" stopColor="#f89b77" />
          <stop offset="100%" stopColor="#F68B62" />
        </linearGradient>

        {/* Realistic Warm Skin Gradient */}
        <linearGradient id="skinGrad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#C47E53" />
          <stop offset="45%" stopColor="#DC976C" />
          <stop offset="100%" stopColor="#ECAB80" />
        </linearGradient>

        {/* Hand Depth / Palm Shadow */}
        <linearGradient id="palmShadow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C47E53" />
          <stop offset="100%" stopColor="#9C5933" />
        </linearGradient>

        {/* Sleeve Cuff Gradient */}
        <linearGradient id="cuffGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#292524" />
          <stop offset="100%" stopColor="#1C1917" />
        </linearGradient>

        {/* Golden Sparkle Gradient */}
        <linearGradient id="goldSparkle" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        {/* Screen Clip Mask: 100% UNTOUCHED */}
        <clipPath id="phoneScreenMask">
          <rect x="-56" y="-102" width="112" height="194" rx="17" />
        </clipPath>
      </defs>

      {/* ================= SPARKLES ================= */}
      {/* Top-Left Sparkle */}
      <g transform="translate(56, 42) scale(1)" filter="url(#sparkleGlow)">
        <path
          d="M0 -14 C1 -4 4 -1 14 0 C4 1 1 4 0 14 C-1 4 -4 1 -14 0 C-4 -1 -1 -4 0 -14 Z"
          fill="url(#goldSparkle)"
        />
        <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
      </g>

      {/* Top-Right Sparkle */}
      <g transform="translate(268, 34) scale(1.2)" filter="url(#sparkleGlow)">
        <path
          d="M0 -15 C1.2 -4.5 4.5 -1.2 15 0 C4.5 1.2 1.2 4.5 0 15 C-1.2 4.5 -4.5 1.2 -15 0 C-4.5 -1.2 -1.2 -4.5 0 -15 Z"
          fill="url(#goldSparkle)"
        />
        <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
      </g>

      {/* Mid-Right Sparkle */}
      <g transform="translate(296, 96) scale(0.7)" filter="url(#sparkleGlow)">
        <path
          d="M0 -12 C1 -3 3 -1 12 0 C3 1 1 3 0 12 C-1 3 -3 1 -12 0 C-3 -1 -1 -3 0 -12 Z"
          fill="url(#goldSparkle)"
        />
        <circle cx="0" cy="0" r="1.5" fill="#FFFFFF" />
      </g>

      {/* ================= HAND & ARM (Natural Grip Supporting the Phone from Base) ================= */}
      {/* 1. Forearm and Sleeve coming smoothly from bottom left */}
      <g>
        {/* Sleeve cuff in dark stone charcoal */}
        <path
          d="M-10 215 C20 195 55 178 88 166 C96 163 106 166 111 174 L120 196 C125 206 120 215 110 218 L-10 218 Z"
          fill="url(#cuffGrad)"
        />
        {/* Crisp white inner shirt rim */}
        <path
          d="M89 167 C97 164 106 168 111 176 L113 180 C106 173 97 170 90 173 Z"
          fill="#FFFFFF"
          opacity="0.9"
        />

        {/* Forearm & Wrist smoothly supporting from bottom */}
        <path
          d="M88 169 C114 156 138 142 158 132 C172 125 184 130 188 142 C192 154 184 172 174 190 C160 210 138 218 116 218 Z"
          fill="url(#skinGrad)"
        />
        {/* Soft anatomical wrist contour */}
        <path
          d="M104 178 C126 166 150 148 168 138 C174 148 172 162 162 182 L116 216 Z"
          fill="#431407"
          opacity="0.08"
        />
      </g>

      {/* 2. Fingers wrapping BEHIND the phone chassis (visible supporting from the side/back) */}
      <g>
        {/* Index Finger supporting back */}
        <path
          d="M110 114 C116 104 128 102 136 108 C142 113 142 120 135 125 C127 131 116 128 110 118 Z"
          fill="url(#palmShadow)"
          stroke="#9C5933"
          strokeWidth="0.8"
        />
        {/* Middle Finger supporting back */}
        <path
          d="M102 132 C107 123 118 121 126 127 C132 132 131 139 125 144 C118 150 108 146 102 136 Z"
          fill="url(#palmShadow)"
          stroke="#9C5933"
          strokeWidth="0.8"
        />
        {/* Ring Finger supporting back */}
        <path
          d="M95 152 C100 144 110 142 117 147 C122 152 121 158 116 163 C110 168 101 165 95 156 Z"
          fill="url(#palmShadow)"
          stroke="#9C5933"
          strokeWidth="0.8"
        />
      </g>

      {/* ================= SMARTPHONE (Angled 14 degrees, 100% UNCOVERED SCREEN) ================= */}
      <g transform="translate(182, 120) rotate(-14)" filter="url(#phoneShadow)">
        
        {/* Outer Phone Frame (Graphite Titanium) */}
        <rect
          x="-62"
          y="-108"
          width="124"
          height="206"
          rx="21"
          fill="url(#phoneFrame)"
          stroke="#57534E"
          strokeWidth="2.2"
        />

        {/* Side Button Accents */}
        <rect x="61" y="-55" width="2.5" height="16" rx="1.2" fill="#78716C" />
        <rect x="-63.5" y="-68" width="2.5" height="12" rx="1.2" fill="#78716C" />
        <rect x="-63.5" y="-48" width="2.5" height="18" rx="1.2" fill="#78716C" />
        <rect x="-63.5" y="-24" width="2.5" height="18" rx="1.2" fill="#78716C" />

        {/* Inner Jet Black Bezel */}
        <rect
          x="-58"
          y="-104"
          width="116"
          height="198"
          rx="18"
          fill="#0C0A09"
        />

        {/* Screen Background */}
        <rect
          x="-56"
          y="-102"
          width="112"
          height="194"
          rx="17"
          fill="#FAFAF9"
        />

        {/* ================= 100% VISIBLE SCREEN UI (SOUKDAY BRAND CORAL) ================= */}
        <g clipPath="url(#phoneScreenMask)">
          
          {/* Status Bar */}
          <rect x="-56" y="-102" width="112" height="20" fill="url(#soukdayBrandGrad)" />
          {/* Dynamic Island */}
          <rect x="-16" y="-100" width="32" height="6.5" rx="3.2" fill="#0C0A09" />
          <circle cx="8" cy="-96.8" r="1.3" fill="#1C1917" />
          
          {/* Time & Battery */}
          <text x="-44" y="-93" fontSize="6" fontWeight="bold" fill="#FFFFFF" fontFamily="system-ui, sans-serif">
            9:41
          </text>
          <rect x="36" y="-94" width="8" height="4" rx="1" stroke="#FFFFFF" strokeWidth="0.6" fill="none" />
          <rect x="37" y="-93" width="5.5" height="2" rx="0.5" fill="#FFFFFF" />

          {/* App Header (Soukday Coral Gradient) */}
          <rect x="-56" y="-82" width="112" height="30" fill="url(#soukdayBrandGrad)" />
          
          {/* Soukday Wordmark & Icon */}
          <g transform="translate(-46, -74)">
            <circle cx="4.5" cy="4.5" r="4.5" fill="#FFFFFF" />
            <text x="2.5" y="7" fontSize="5.5" fontWeight="900" fill="#F68B62">S</text>
            <text
              x="12"
              y="7"
              fontFamily="system-ui, sans-serif"
              fontWeight="900"
              fontSize="10"
              fill="#FFFFFF"
              letterSpacing="-0.2"
            >
              Soukday
            </text>
          </g>

          {/* Montreal Delivery Pin */}
          <rect x="-46" y="-64" width="62" height="8" rx="4" fill="#FFFFFF" fillOpacity="0.22" />
          <circle cx="-41" cy="-60" r="1.8" fill="#FFFFFF" />
          <text
            x="-36"
            y="-58"
            fontFamily="system-ui, sans-serif"
            fontWeight="bold"
            fontSize="5"
            fill="#FFFFFF"
          >
            📍 Montréal & Rive-Sud
          </text>

          {/* Search Bar */}
          <rect x="-48" y="-46" width="96" height="12" rx="6" fill="#FFFFFF" stroke="#E7E5E4" strokeWidth="0.8" />
          <circle cx="-40" cy="-40" r="2.5" stroke="#A8A29E" strokeWidth="0.9" fill="none" />
          <line x1="-38" y1="-38" x2="-36" y2="-36" stroke="#A8A29E" strokeWidth="0.9" />
          <text
            x="-32"
            y="-37"
            fontFamily="system-ui, sans-serif"
            fontSize="5"
            fill="#78716C"
            fontWeight="500"
          >
            {isFrench ? "Épiceries, halal, épices..." : "Groceries, halal, spices..."}
          </text>

          {/* Category Chips Row */}
          <rect x="-48" y="-30" width="30" height="10" rx="5" fill="#FEE2E2" stroke="#FECACA" strokeWidth="0.5" />
          <text x="-44" y="-23.5" fontSize="5" fontWeight="bold" fill="#DC2626">🥩 Boucherie</text>

          <rect x="-14" y="-30" width="30" height="10" rx="5" fill="#FFF7ED" stroke="#FED7AA" strokeWidth="0.5" />
          <text x="-10" y="-23.5" fontSize="5" fontWeight="bold" fill="#EA580C">🌾 Épicerie</text>

          <rect x="20" y="-30" width="28" height="10" rx="5" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="0.5" />
          <text x="24" y="-23.5" fontSize="5" fontWeight="bold" fill="#D97706">🥐 Pains</text>

          {/* Product Cards Row */}
          {/* Card 1: Merguez Halal */}
          <g transform="translate(-48, -16)">
            <rect x="0" y="0" width="45" height="58" rx="7" fill="#FFFFFF" stroke="#E7E5E4" strokeWidth="0.8" />
            <rect x="2.5" y="2.5" width="40" height="30" rx="5" fill="#FCEFEA" />
            {/* Halal Badge */}
            <rect x="5" y="5" width="13" height="5" rx="2.5" fill="#10B981" />
            <text x="7" y="8.8" fontSize="3.5" fontWeight="bold" fill="#FFFFFF">HALAL</text>
            <text x="22" y="21" fontSize="16" textAnchor="middle">🥩</text>
            
            <text x="3.5" y="39" fontSize="5" fontWeight="bold" fill="#1C1917">Merguez Halal</text>
            <text x="3.5" y="46" fontSize="4.5" fontWeight="500" fill="#78716C">Boucherie fine</text>
            <text x="3.5" y="53" fontSize="6.5" fontWeight="900" fill="#F68B62">9,99 $</text>
            
            {/* Orange Add Button */}
            <circle cx="38" cy="51" r="4.5" fill="#F68B62" />
            <text x="38" y="53.5" fontSize="7" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">+</text>
          </g>

          {/* Card 2: Huile d'olive pure */}
          <g transform="translate(3, -16)">
            <rect x="0" y="0" width="45" height="58" rx="7" fill="#FFFFFF" stroke="#E7E5E4" strokeWidth="0.8" />
            <rect x="2.5" y="2.5" width="40" height="30" rx="5" fill="#FFFBEB" />
            <rect x="5" y="5" width="14" height="5" rx="2.5" fill="#F59E0B" />
            <text x="7" y="8.8" fontSize="3.5" fontWeight="bold" fill="#FFFFFF">DIRECT</text>
            <text x="22" y="21" fontSize="16" textAnchor="middle">🫒</text>
            
            <text x="3.5" y="39" fontSize="5" fontWeight="bold" fill="#1C1917">Huile d'olive</text>
            <text x="3.5" y="46" fontSize="4.5" fontWeight="500" fill="#78716C">Épicerie Soukday</text>
            <text x="3.5" y="53" fontSize="6.5" fontWeight="900" fill="#F68B62">14,50 $</text>
            
            {/* Orange Add Button */}
            <circle cx="38" cy="51" r="4.5" fill="#F68B62" />
            <text x="38" y="53.5" fontSize="7" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">+</text>
          </g>

          {/* Bottom App Navigation */}
          <rect x="-56" y="48" width="112" height="24" fill="#FFFFFF" stroke="#E7E5E4" strokeWidth="0.8" />
          <circle cx="-34" cy="58" r="3" fill="#F68B62" />
          <circle cx="-11" cy="58" r="2.5" fill="#A8A29E" />
          <circle cx="11" cy="58" r="2.5" fill="#A8A29E" />
          <circle cx="34" cy="58" r="4.5" fill="#F68B62" />
          <text x="34" y="60.2" fontSize="5.5" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">2</text>
          
          {/* Home indicator bar */}
          <rect x="-18" y="68" width="36" height="2" rx="1" fill="#0C0A09" />

          {/* Diagonal Glass Sheen */}
          <polygon points="-56,-102 56,-102 10,92 -56,92" fill="url(#screenGlass)" pointerEvents="none" />
        </g>
      </g>

      {/* ================= NATURAL BASE THUMB (RESTING ON OUTER CORNER/FRAME ONLY) ================= */}
      {/* The thumb gently rests on the bottom-left chin/outer frame, NEVER touching or blocking the screen! */}
      <g>
        <path
          d="M136 156 C144 148 156 148 164 155 C168 159 168 166 162 171 C154 177 142 174 134 165 Z"
          fill="url(#skinGrad)"
          stroke="#B36B42"
          strokeWidth="1"
        />
        <path
          d="M148 153 C154 156 158 161 156 166"
          stroke="#FFFFFF"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.35"
        />
      </g>

      {/* ================= FLOATING RATING BADGE ================= */}
      <g transform="translate(226, 62)" filter="url(#badgeShadow)">
        <rect x="0" y="0" width="102" height="26" rx="13" fill="#FFFFFF" stroke="#FCDCD0" strokeWidth="1" />
        <circle cx="13" cy="13" r="7.5" fill="#F68B62" />
        <text x="13" y="16" fontSize="9" fill="#FFFFFF" textAnchor="middle">⭐</text>
        <text x="26" y="12" fontSize="7.5" fontWeight="bold" fill="#1C1917" fontFamily="system-ui, sans-serif">
          App Soukday
        </text>
        <text x="26" y="19.5" fontSize="6" fontWeight="600" fill="#F68B62" fontFamily="system-ui, sans-serif">
          {isFrench ? "Note 4.9 • iOS & Android" : "Rated 4.9 • iOS & Android"}
        </text>
      </g>
    </svg>
  );
}
