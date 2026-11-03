import React, { useState } from 'react';

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
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {!imgFailed ? (
        <img
          src="/assets/images/tinybloom-emblem.png"
          alt="TinyBloom"
          width={size}
          height={size}
          onError={() => setImgFailed(true)}
          className="rounded-2xl shrink-0 object-cover shadow-2xs border border-[var(--color-primary)]/20 bg-white dark:bg-[#161D18] dark:p-0.5"
          style={{ width: `${size}px`, height: `${size}px` }}
        />
      ) : (
        <div
          className="rounded-2xl shrink-0 flex items-center justify-center shadow-2xs border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/15 text-[var(--color-primary)] font-bold select-none"
          style={{ width: `${size}px`, height: `${size}px` }}
        >
          <span style={{ fontSize: `${Math.max(12, Math.round(size * 0.52))}px` }}>🌱</span>
        </div>
      )}

      {showText && (
        <div className="flex flex-col leading-tight select-none">
          <span className="font-heading font-extrabold text-base tracking-tight text-[var(--color-text-main)]">
            Tiny<span className="text-[var(--color-primary-dark)] dark:text-[var(--color-primary)]">Bloom</span>
          </span>
          <span className="text-[10px] text-[var(--color-text-muted)] font-medium tracking-normal hidden sm:block">
            Every little milestone matters.
          </span>
        </div>
      )}
    </div>
  );
};
