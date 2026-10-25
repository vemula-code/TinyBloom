import React from 'react';

interface TinyBloomLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const TinyBloomLogo: React.FC<TinyBloomLogoProps> = ({
  size = 38,
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
        className="shrink-0 drop-shadow-2xs"
        aria-label="TinyBloom Logo"
      >
        <defs>
          {/* Warm background circle gradient */}
          <radialGradient id="tbWarmGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF9F0" />
            <stop offset="70%" stopColor="#FDE6D2" />
            <stop offset="100%" stopColor="#F8D3B8" />
          </radialGradient>

          {/* Leaf Sage Gradients */}
          <linearGradient id="tbLeafLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A8C1A2" />
            <stop offset="100%" stopColor="#73936D" />
          </linearGradient>

          <linearGradient id="tbLeafRight" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8DA887" />
            <stop offset="100%" stopColor="#5D7C57" />
          </linearGradient>

          <linearGradient id="tbSproutTop" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#8BA685" />
            <stop offset="100%" stopColor="#678661" />
          </linearGradient>

          {/* Baby Skin & Cheeks */}
          <linearGradient id="tbBabySkin" x1="50%" y1="20%" x2="50%" y2="80%">
            <stop offset="0%" stopColor="#FFFDF7" />
            <stop offset="100%" stopColor="#FBE9DB" />
          </linearGradient>

          <radialGradient id="tbRosyCheek" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F5A28E" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#F5A28E" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft Warm Sun/Halo circle */}
        <circle cx="60" cy="62" r="42" fill="url(#tbWarmGlow)" />

        {/* Top Sprout Leaves (Growth emerging from above baby) */}
        {/* Left top sprout leaf */}
        <path
          d="M58 35 C52 23, 34 16, 32 30 C30 42, 48 40, 58 35 Z"
          fill="url(#tbSproutTop)"
        />
        {/* Right top sprout leaf */}
        <path
          d="M62 35 C68 21, 88 16, 88 30 C88 42, 70 40, 62 35 Z"
          fill="url(#tbSproutTop)"
        />
        {/* Tiny sprout stem */}
        <path
          d="M60 33 L60 44"
          stroke="#5D7C57"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Baby Head Circle */}
        <circle cx="60" cy="58" r="23" fill="url(#tbBabySkin)" stroke="#EBD2C1" strokeWidth="1.5" />

        {/* Sweet Hair curl */}
        <path
          d="M60 41 C57 34, 69 35, 68 41 C67 45, 62 45, 60 47"
          stroke="#7A5239"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Peaceful Sleeping Eyes (^ ^) */}
        <path
          d="M51 56 C53 52, 57 52, 59 56"
          stroke="#4A3425"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M63 56 C65 52, 69 52, 71 56"
          stroke="#4A3425"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Soft Rosy Cheeks */}
        <circle cx="48" cy="61" r="5" fill="url(#tbRosyCheek)" />
        <circle cx="72" cy="61" r="5" fill="url(#tbRosyCheek)" />

        {/* Gentle Baby Smile */}
        <path
          d="M58 64 C59.5 67, 62.5 67, 64 64"
          stroke="#543C2E"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Cradling Sprout Leaves (Hugging the baby gently like in the design) */}
        {/* Left cradling leaf */}
        <path
          d="M24 76 C20 54, 42 46, 54 62 C50 78, 36 86, 24 76 Z"
          fill="url(#tbLeafLeft)"
        />
        {/* Right cradling leaf */}
        <path
          d="M96 76 C100 54, 78 46, 66 62 C70 78, 84 86, 96 76 Z"
          fill="url(#tbLeafRight)"
        />

        {/* Base stem connecting leaves */}
        <path
          d="M54 78 C57 82, 63 82, 66 78"
          stroke="#5D7C57"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="font-heading font-extrabold text-base tracking-tight text-[#303832]">
            Tiny<span className="text-[#5B7B56]">Bloom</span>
          </span>
          <span className="text-[10px] text-[#6E7B6C] font-medium tracking-normal">
            Every little milestone matters.
          </span>
        </div>
      )}
    </div>
  );
};
