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
      <img
        src="/assets/images/tinybloom-emblem.png"
        alt="TinyBloom"
        width={size}
        height={size}
        className="rounded-2xl shrink-0 object-cover shadow-2xs border border-[#91A98B]/20 bg-[#F8F4E8]"
        style={{ width: `${size}px`, height: `${size}px` }}
      />

      {showText && (
        <div className="flex flex-col leading-tight select-none">
          <span className="font-heading font-extrabold text-base tracking-tight text-[var(--color-text-main,#303832)]">
            Tiny<span className="text-[var(--color-primary-dark,#5B7B56)]">Bloom</span>
          </span>
          <span className="text-[10px] text-[var(--color-text-muted,#6E7B6C)] font-medium tracking-normal">
            Every little milestone matters.
          </span>
        </div>
      )}
    </div>
  );
};
