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
      viewBox="0 0 380 230"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none overflow-visible ${className}`}
      style={{ width, height }}
      aria-label="Illustration de l'application mobile Soukday"
    >
      <defs>
        {/* Soft Drop Shadow for Phone */}
        <filter id="phoneShadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="6" dy="12" stdDeviation="10" floodColor="#431407" floodOpacity="0.18" />
        </filter>

        {/* Golden Sparkle Glow */}
        <filter id="sparkleGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Floating Badge Shadow */}
        <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.1" />
        </filter>

        {/* Phone Frame Metallic Gradient */}
        <linearGradient id="phoneFrame" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#292524" />
          <stop offset="50%" stopColor="#1C1917" />
          <stop offset="100%" stopColor="#0C0A09" />
        </linearGradient>

        {/* Screen Glass Reflection */}
        <linearGradient id="screenGlass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.15" />
          <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Soukday Coral Brand Gradient (Exact match to Soukday logo) */}
        <linearGradient id="soukdayBrandGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F68B62" />
          <stop offset="60%" stopColor="#f89b77" />
          <stop offset="100%" stopColor="#F68B62" />
        </linearGradient>

        {/* Warm Skin Gradient */}
        <linearGradient id="skinGrad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#C47E53" />
          <stop offset="45%" stopColor="#DC976C" />
          <stop offset="100%" stopColor="#ECAB80" />
        </linearGradient>

        {/* Finger Depth Shadow */}
        <linearGradient id="fingerShadow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ECAB80" />
          <stop offset="100%" stopColor="#B36B42" />
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

        {/* Screen Clipping Mask */}
        <clipPath id="phoneScreenMask">
          <rect x="-62" y="-124" width="124" height="216" rx="20" />
        </clipPath>
      </defs>

      {/* ================= BACKGROUND SPARKLES ================= */}
      {/* 1. Large Top-Left Sparkle */}
      <g transform="translate(68, 52) scale(1.1)" filter="url(#sparkleGlow)">
        <path
          d="M0 -15 C1.2 -4.5 4.5 -1.2 15 0 C4.5 1.2 1.2 4.5 0 15 C-1.2 4.5 -4.5 1.2 -15 0 C-4.5 -1.2 -1.2 -4.5 0 -15 Z"
          fill="url(#goldSparkle)"
        />
        <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
      </g>

      {/* 2. Top-Right Sparkle */}
      <g transform="translate(290, 42) scale(1.3)" filter="url(#sparkleGlow)">
        <path
          d="M0 -16 C1.4 -4.8 4.8 -1.4 16 0 C4.8 1.4 1.4 4.8 0 16 C-1.4 4.8 -4.8 1.4 -16 0 C-4.8 -1.4 -1.4 -4.8 0 -16 Z"
          fill="url(#goldSparkle)"
        />
        <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
      </g>

      {/* 3. Mid-Right Small Sparkle */}
      <g transform="translate(322, 115) scale(0.75)" filter="url(#sparkleGlow)">
        <path
          d="M0 -12 C1 -3 3 -1 12 0 C3 1 1 3 0 12 C-1 3 -3 1 -12 0 C-3 -1 -1 -3 0 -12 Z"
          fill="url(#goldSparkle)"
        />
        <circle cx="0" cy="0" r="1.5" fill="#FFFFFF" />
      </g>

      {/* 4. Lower-Left Sparkle */}
      <g transform="translate(42, 112) scale(0.65)" filter="url(#sparkleGlow)">
        <path
          d="M0 -10 C0.8 -2.5 2.5 -0.8 10 0 C2.5 0.8 0.8 2.5 0 10 C-0.8 2.5 -2.5 0.8 -10 0 C-2.5 -0.8 -0.8 -2.5 0 -10 Z"
          fill="url(#goldSparkle)"
        />
      </g>

      {/* ================= ARM & SLEEVE (Coming cleanly from bottom left) ================= */}
      <g>
        {/* Sleeve */}
        <path
          d="M-20 230 C15 205 50 185 85 170 C95 166 108 170 114 180 L125 210 C130 220 125 230 115 230 Z"
          fill="url(#cuffGrad)"
        />
        {/* White shirt inner cuff line */}
        <path
          d="M86 172 C96 168 107 172 113 181 L116 186 C108 178 97 175 88 178 Z"
          fill="#FFFFFF"
          opacity="0.9"
        />

        {/* Forearm & Wrist */}
        <path
          d="M85 174 C112 160 142 142 168 126 C182 117 194 122 198 135 C202 148 196 168 184 188 C168 212 145 226 122 230 Z"
          fill="url(#skinGrad)"
        />
        {/* Soft anatomical wrist shadow */}
        <path
          d="M102 184 C128 170 156 150 178 134 C184 145 182 160 172 182 L120 228 Z"
          fill="#431407"
          opacity="0.08"
        />
      </g>

      {/* ================= SMARTPHONE (Tilted at 18 degrees) ================= */}
      <g transform="translate(196, 134) rotate(-18)" filter="url(#phoneShadow)">
        
        {/* Outer Phone Frame (Graphite Titanium) */}
        <rect
          x="-68"
          y="-130"
          width="136"
          height="228"
          rx="24"
          fill="url(#phoneFrame)"
          stroke="#57534E"
          strokeWidth="2.5"
        />

        {/* Antenna / Button Accents on Frame */}
        <rect x="67" y="-70" width="3" height="18" rx="1.5" fill="#78716C" />
        <rect x="-70" y="-85" width="3" height="14" rx="1.5" fill="#78716C" />
        <rect x="-70" y="-62" width="3" height="22" rx="1.5" fill="#78716C" />
        <rect x="-70" y="-34" width="3" height="22" rx="1.5" fill="#78716C" />

        {/* Screen Bezel (Jet Black) */}
        <rect
          x="-64"
          y="-126"
          width="128"
          height="220"
          rx="21"
          fill="#0C0A09"
        />

        {/* Inner Screen Display (White / Light Background) */}
        <rect
          x="-62"
          y="-124"
          width="124"
          height="216"
          rx="19"
          fill="#FAFAF9"
        />

        {/* ================= SCREEN CONTENT (SOUKDAY APP IN BRAND ORANGE) ================= */}
        <g clipPath="url(#phoneScreenMask)">
          
          {/* Status Bar */}
          <rect x="-62" y="-124" width="124" height="22" fill="url(#soukdayBrandGrad)" />
          {/* Dynamic Island / Speaker Pill */}
          <rect x="-18" y="-121" width="36" height="7" rx="3.5" fill="#0C0A09" />
          <circle cx="9" cy="-117.5" r="1.5" fill="#1C1917" />
          
          {/* Status Bar Clock & Icons */}
          <text x="-48" y="-113" fontSize="6.5" fontWeight="bold" fill="#FFFFFF" fontFamily="system-ui, sans-serif">
            9:41
          </text>
          <path d="M42 -117 A3 3 0 0 1 48 -117 M40 -115 A6 6 0 0 1 50 -115" stroke="#FFFFFF" strokeWidth="0.8" fill="none" />
          <rect x="42" y="-113" width="9" height="4.5" rx="1" stroke="#FFFFFF" strokeWidth="0.7" fill="none" />
          <rect x="43" y="-112" width="6" height="2.5" rx="0.5" fill="#FFFFFF" />

          {/* App Header (Soukday Coral Gradient) */}
          <rect x="-62" y="-102" width="124" height="34" fill="url(#soukdayBrandGrad)" />
          
          {/* Soukday Wordmark & Cart Icon */}
          <g transform="translate(-50, -92)">
            <circle cx="5" cy="5" r="5" fill="#FFFFFF" />
            <text x="2.5" y="7.5" fontSize="6" fontWeight="900" fill="#F68B62">S</text>
            <text
              x="13"
              y="7.5"
              fontFamily="system-ui, sans-serif"
              fontWeight="900"
              fontSize="11"
              fill="#FFFFFF"
              letterSpacing="-0.3"
            >
              Soukday
            </text>
          </g>

          {/* Location Delivery Pin */}
          <rect x="-50" y="-81" width="68" height="9" rx="4.5" fill="#FFFFFF" fillOpacity="0.22" />
          <circle cx="-45" cy="-76.5" r="2" fill="#FFFFFF" />
          <text
            x="-40"
            y="-74.5"
            fontFamily="system-ui, sans-serif"
            fontWeight="bold"
            fontSize="5.5"
            fill="#FFFFFF"
          >
            📍 Montréal & Rive-Sud
          </text>

          {/* Search Bar */}
          <rect x="-52" y="-62" width="104" height="13" rx="6.5" fill="#FFFFFF" stroke="#E7E5E4" strokeWidth="0.8" />
          <circle cx="-43" cy="-55.5" r="2.8" stroke="#A8A29E" strokeWidth="1" fill="none" />
          <line x1="-41" y1="-53.5" x2="-39" y2="-51.5" stroke="#A8A29E" strokeWidth="1" />
          <text
            x="-34"
            y="-52.5"
            fontFamily="system-ui, sans-serif"
            fontSize="5.5"
            fill="#78716C"
            fontWeight="500"
          >
            {isFrench ? "Épiceries, halal, épices..." : "Groceries, halal, spices..."}
          </text>

          {/* Horizontal Category Badges */}
          {/* Badge 1: Boucherie Halal */}
          <rect x="-52" y="-44" width="34" height="11" rx="5.5" fill="#FEE2E2" stroke="#FECACA" strokeWidth="0.5" />
          <text x="-48" y="-36.5" fontSize="5.5" fontWeight="bold" fill="#DC2626">🥩 Boucherie</text>

          {/* Badge 2: Épicerie Maghrébine */}
          <rect x="-14" y="-44" width="34" height="11" rx="5.5" fill="#FFF7ED" stroke="#FED7AA" strokeWidth="0.5" />
          <text x="-10" y="-36.5" fontSize="5.5" fontWeight="bold" fill="#EA580C">🌾 Épicerie</text>

          {/* Badge 3: Boulangerie */}
          <rect x="24" y="-44" width="32" height="11" rx="5.5" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="0.5" />
          <text x="28" y="-36.5" fontSize="5.5" fontWeight="bold" fill="#D97706">🥐 Pains</text>

          {/* Product Cards Row */}
          {/* Card 1 */}
          <g transform="translate(-52, -28)">
            <rect x="0" y="0" width="49" height="66" rx="8" fill="#FFFFFF" stroke="#E7E5E4" strokeWidth="0.8" />
            <rect x="3" y="3" width="43" height="34" rx="6" fill="#FCEFEA" />
            {/* Halal Stamp */}
            <rect x="6" y="6" width="15" height="6" rx="3" fill="#10B981" />
            <text x="8.5" y="10.5" fontSize="4" fontWeight="bold" fill="#FFFFFF">HALAL</text>
            <text x="24" y="24" fontSize="18" textAnchor="middle">🥩</text>
            
            <text x="4" y="44" fontSize="5.5" fontWeight="bold" fill="#1C1917">Merguez Halal</text>
            <text x="4" y="52" fontSize="5" fontWeight="500" fill="#78716C">Boucherie artisanale</text>
            <text x="4" y="60" fontSize="7" fontWeight="900" fill="#F68B62">9,99 $</text>
            
            {/* Orange Add Button */}
            <circle cx="41" cy="58" r="5" fill="#F68B62" />
            <text x="41" y="60.5" fontSize="8" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">+</text>
          </g>

          {/* Card 2 */}
          <g transform="translate(3, -28)">
            <rect x="0" y="0" width="49" height="66" rx="8" fill="#FFFFFF" stroke="#E7E5E4" strokeWidth="0.8" />
            <rect x="3" y="3" width="43" height="34" rx="6" fill="#FFFBEB" />
            <rect x="6" y="6" width="17" height="6" rx="3" fill="#F59E0B" />
            <text x="8" y="10.5" fontSize="4" fontWeight="bold" fill="#FFFFFF">DIRECT</text>
            <text x="24" y="24" fontSize="18" textAnchor="middle">🫒</text>
            
            <text x="4" y="44" fontSize="5.5" fontWeight="bold" fill="#1C1917">Huile d'olive pure</text>
            <text x="4" y="52" fontSize="5" fontWeight="500" fill="#78716C">Épicerie Soukday</text>
            <text x="4" y="60" fontSize="7" fontWeight="900" fill="#F68B62">14,50 $</text>
            
            {/* Orange Add Button */}
            <circle cx="41" cy="58" r="5" fill="#F68B62" />
            <text x="41" y="60.5" fontSize="8" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">+</text>
          </g>

          {/* App Bottom Navigation Bar */}
          <rect x="-62" y="46" width="124" height="26" fill="#FFFFFF" stroke="#E7E5E4" strokeWidth="0.8" />
          {/* Home active icon (Coral) */}
          <circle cx="-38" cy="57" r="3.5" fill="#F68B62" />
          {/* Browse icon */}
          <circle cx="-13" cy="57" r="3" fill="#A8A29E" />
          {/* Orders icon */}
          <circle cx="13" cy="57" r="3" fill="#A8A29E" />
          {/* Cart active badge with count */}
          <circle cx="38" cy="57" r="5" fill="#F68B62" />
          <text x="38" y="59.5" fontSize="6.5" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">2</text>
          
          {/* iPhone Home Indicator bar */}
          <rect x="-20" y="68" width="40" height="2.5" rx="1.2" fill="#0C0A09" />

          {/* Glass glare highlight over screen */}
          <polygon points="-62,-124 62,-124 10,92 -62,92" fill="url(#screenGlass)" pointerEvents="none" />
        </g>
      </g>

      {/* ================= FINGERS WRAPPING AROUND PHONE ================= */}
      {/* Anatomical fingers with natural curve and depth */}
      <g>
        {/* Thumb (bottom-right edge holding phone) */}
        <g>
          <path
            d="M214 122 C228 116 244 122 252 134 C257 142 254 152 244 158 C232 165 218 162 206 150 Z"
            fill="url(#skinGrad)"
            stroke="#B36B42"
            strokeWidth="1.2"
          />
          <path
            d="M232 128 C242 134 246 142 242 148"
            stroke="#FFFFFF"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.35"
          />
        </g>

        {/* Index Finger (left side peek) */}
        <g>
          <path
            d="M112 118 C120 106 136 104 146 112 C153 118 152 127 144 133 C134 140 120 137 112 126 Z"
            fill="url(#fingerShadow)"
            stroke="#B36B42"
            strokeWidth="1"
          />
          <path
            d="M124 112 C134 112 140 118 142 124"
            stroke="#FFFFFF"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.4"
          />
        </g>

        {/* Middle Finger (left side peek) */}
        <g>
          <path
            d="M102 139 C109 128 125 126 134 134 C141 140 140 150 132 156 C122 163 108 160 102 148 Z"
            fill="url(#fingerShadow)"
            stroke="#B36B42"
            strokeWidth="1"
          />
          <path
            d="M114 134 C123 134 128 140 130 146"
            stroke="#FFFFFF"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.4"
          />
        </g>

        {/* Ring Finger (left side peek) */}
        <g>
          <path
            d="M94 162 C101 152 116 150 124 158 C131 164 129 173 122 179 C113 185 100 182 94 171 Z"
            fill="url(#fingerShadow)"
            stroke="#B36B42"
            strokeWidth="1"
          />
        </g>
      </g>

      {/* ================= FLOATING BADGE (TOP RIGHT OF PHONE) ================= */}
      <g transform="translate(242, 68)" filter="url(#badgeShadow)">
        <rect x="0" y="0" width="108" height="28" rx="14" fill="#FFFFFF" stroke="#FCDCD0" strokeWidth="1" />
        <circle cx="14" cy="14" r="8" fill="#F68B62" />
        <text x="14" y="17" fontSize="10" fill="#FFFFFF" textAnchor="middle">⭐</text>
        <text x="28" y="13" fontSize="8" fontWeight="bold" fill="#1C1917" fontFamily="system-ui, sans-serif">
          App Soukday
        </text>
        <text x="28" y="21" fontSize="6.5" fontWeight="600" fill="#F68B62" fontFamily="system-ui, sans-serif">
          {isFrench ? "Note 4.9 • iOS & Android" : "Rated 4.9 • iOS & Android"}
        </text>
      </g>
    </svg>
  );
}
