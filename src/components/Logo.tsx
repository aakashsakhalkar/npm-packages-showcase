import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Logo: React.FC<LogoProps> = ({ size = 42, className = '', style = {} }) => {
  return (
    <div
      className={`brand-logo-wrapper ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        position: 'relative',
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease',
        cursor: 'pointer',
        ...style,
      }}
    >
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          filter: 'drop-shadow(0 4px 12px rgba(99, 102, 241, 0.35))',
        }}
      >
        <defs>
          {/* Background Gradient */}
          <linearGradient id="logo-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Top Face Gradient */}
          <linearGradient id="logo-top-face" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#a5f3fc" />
          </linearGradient>

          {/* Left Face Gradient */}
          <linearGradient id="logo-left-face" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#3730a3" />
          </linearGradient>

          {/* Right Face Gradient */}
          <linearGradient id="logo-right-face" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>

          {/* Border Glow Gradient */}
          <linearGradient id="logo-border-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.8" />
          </linearGradient>

          {/* Ambient Glow */}
          <radialGradient id="logo-ambient-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>

          {/* Glow Filter for Sparkle */}
          <filter id="logo-sparkle-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Glow */}
        <circle cx="32" cy="32" r="28" fill="url(#logo-ambient-glow)" />

        {/* Base Squircle with Glass Border */}
        <rect
          x="2.5"
          y="2.5"
          width="59"
          height="59"
          rx="16"
          fill="url(#logo-bg-grad)"
          stroke="url(#logo-border-glow)"
          strokeWidth="1.5"
        />

        {/* 3D Isometric Cube / NPM Package */}
        <g>
          {/* Top Face (Glossy / Bright) */}
          <path d="M32 13.5 L49 22.8 L32 32.2 L15 22.8 Z" fill="url(#logo-top-face)" />

          {/* Top Face Seam / Fold Accent */}
          <path
            d="M32 13.5 L32 32.2"
            stroke="#ffffff"
            strokeWidth="1"
            strokeOpacity="0.4"
            strokeLinecap="round"
          />
          <path
            d="M15 22.8 L49 22.8"
            stroke="#ffffff"
            strokeWidth="0.7"
            strokeOpacity="0.25"
          />

          {/* Left Face (Indigo / Violet) */}
          <path d="M15 22.8 L32 32.2 L32 50.5 L15 41.2 Z" fill="url(#logo-left-face)" />

          {/* Left Face Modern Stylized "A" Accent / Inset */}
          <path
            d="M23.5 28 L28.5 41.5 M23.5 28 L18.5 41.5 M20 37 L27 37"
            stroke="#a5b4fc"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.9"
          />

          {/* Right Face (Cyan / Sky) */}
          <path d="M32 32.2 L49 22.8 L49 41.2 L32 50.5 Z" fill="url(#logo-right-face)" />

          {/* Right Face Stylized Code / Package Brackets */}
          <path
            d="M37 32 L44 36 L37 40"
            stroke="#bae6fd"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.9"
            fill="none"
          />
          <path
            d="M41 43.5 L46 46.5"
            stroke="#38bdf8"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeOpacity="0.75"
          />

          {/* Front Center Vertical Edge Highlight */}
          <path
            d="M32 32.2 L32 50.5"
            stroke="#e0e7ff"
            strokeWidth="1.2"
            strokeOpacity="0.6"
            strokeLinecap="round"
          />
        </g>

        {/* Accent Sparkle Top Right */}
        <g filter="url(#logo-sparkle-glow)">
          <path
            d="M49 11 C49 13.5 50.5 15 53 15 C50.5 15 49 16.5 49 19 C49 16.5 47.5 15 45 15 C47.5 15 49 13.5 49 11 Z"
            fill="#ffffff"
          />
          <circle cx="49" cy="15" r="1" fill="#38bdf8" />
        </g>
      </svg>
    </div>
  );
};
