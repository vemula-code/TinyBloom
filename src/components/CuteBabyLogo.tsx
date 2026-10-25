import React from 'react';

interface CuteBabyLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const CuteBabyLogo: React.FC<CuteBabyLogoProps> = ({
  size = 36,
  className = '',
  showText = false,
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-xs"
      >
        <defs>
          {/* Warm Honey & Terracotta Gradient */}
          <linearGradient id="logoBgGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          {/* Baby Skin Gradient */}
          <linearGradient id="babySkinGrad" x1="60" y1="35" x2="60" y2="95" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="100%" stopColor="#fef3c7" />
          </linearGradient>

          {/* Rosy Cheek Glow */}
          <radialGradient id="cheekGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Squircle App Icon Container */}
        <rect width="120" height="120" rx="32" fill="url(#logoBgGrad)" />

        {/* Soft Inner Glow Border */}
        <rect x="2" y="2" width="116" height="116" rx="30" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="2.5" />

        {/* Dhruv's Guiding North Star in the sky (top right) */}
        <g transform="translate(88, 18) scale(0.9)">
          <path
            d="M8 0L9.8 5.6L16 8L9.8 10.4L8 16L6.2 10.4L0 8L6.2 5.6L8 0Z"
            fill="#fef08a"
          />
          <circle cx="8" cy="8" r="2" fill="#ffffff" />
        </g>

        {/* Baby Head / Face */}
        <circle cx="60" cy="62" r="32" fill="url(#babySkinGrad)" stroke="#f59e0b" strokeWidth="1.5" />

        {/* Cute Baby Hair Curl on top */}
        <path
          d="M60 30 C58 22, 67 18, 68 24 C69 28, 63 29, 61 31"
          stroke="#78350f"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Cute Baby Ears */}
        <circle cx="28" cy="62" r="6.5" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.2" />
        <circle cx="92" cy="62" r="6.5" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.2" />

        {/* Happy Sleeping / Smiling Baby Eyes (^ ^) */}
        <path
          d="M44 58 C46 54, 50 54, 52 58"
          stroke="#451a03"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M68 58 C70 54, 74 54, 76 58"
          stroke="#451a03"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Rosy Pink Cheeks */}
        <circle cx="42" cy="66" r="6" fill="url(#cheekGlow)" />
        <circle cx="78" cy="66" r="6" fill="url(#cheekGlow)" />

        {/* Sweet Button Nose */}
        <circle cx="60" cy="63" r="1.8" fill="#d97706" />

        {/* Cute Baby Smile */}
        <path
          d="M54 69 C56 75, 64 75, 66 69"
          stroke="#451a03"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Tiny Baby Milk Droplet / Tongue Smile */}
        <path
          d="M57 71 C58 74, 62 74, 63 71"
          fill="#f43f5e"
          fillOpacity="0.8"
        />

        {/* Gentle Growth Ruler & Heart Cloud below */}
        <g transform="translate(20, 88)">
          {/* Soft White Cloud Cradle */}
          <path
            d="M12 14 C12 7, 20 4, 28 6 C33 0, 47 0, 52 6 C60 4, 68 7, 68 14 C68 20, 60 22, 52 22 L28 22 C20 22, 12 20, 12 14 Z"
            fill="#ffffff"
            fillOpacity="0.95"
          />

          {/* Tiny Red Heart */}
          <path
            d="M40 9 C40 6.5, 37.5 5, 35.5 6.5 C33.5 5, 31 6.5, 31 9 C31 13, 35.5 16, 35.5 16 C35.5 16, 40 13, 40 9 Z"
            fill="#ea580c"
          />

          {/* Ruler Ticks on the cloud base */}
          <line x1="20" y1="17" x2="20" y2="21" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="25" y1="18" x2="25" y2="21" stroke="#d97706" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="46" y1="18" x2="46" y2="21" stroke="#d97706" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="51" y1="17" x2="51" y2="21" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="56" y1="18" x2="56" y2="21" stroke="#d97706" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      </svg>

      {showText && (
        <div className="flex flex-col text-left">
          <span className="text-base font-bold tracking-tight text-stone-900 leading-tight">
            DTracker
          </span>
          <span className="text-[10px] font-medium text-orange-700 leading-none">
            Dhruv’s Growth
          </span>
        </div>
      )}
    </div>
  );
};
