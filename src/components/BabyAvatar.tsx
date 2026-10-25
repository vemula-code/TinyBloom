import React, { useState, useEffect } from 'react';
import { Baby, Sparkles, Camera } from 'lucide-react';

interface BabyAvatarProps {
  avatarUrl?: string;
  name: string;
  gender?: 'boy' | 'girl';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  showEditBadge?: boolean;
}

export const BabyAvatar: React.FC<BabyAvatarProps> = ({
  avatarUrl,
  name,
  gender = 'boy',
  size = 'md',
  className = '',
  onClick,
  showEditBadge = false,
}) => {
  const [hasError, setHasError] = useState(false);

  // Reset error state when avatarUrl changes
  useEffect(() => {
    setHasError(false);
  }, [avatarUrl]);

  const sizeClasses = {
    sm: 'w-10 h-10 rounded-xl text-xs',
    md: 'w-14 h-14 rounded-2xl text-sm',
    lg: 'w-16 h-16 sm:w-20 sm:h-20 rounded-2xl text-base',
    xl: 'w-24 h-24 rounded-3xl text-xl',
  };

  const initial = name ? name.trim().charAt(0).toUpperCase() : 'B';

  // Preset badge illustrations
  const renderFallback = () => {
    return (
      <div
        className={`${sizeClasses[size]} bg-gradient-to-br from-[#91A98B]/30 via-[#F3C9B8]/40 to-[#AFCDE0]/30 border-2 border-[var(--color-primary,#91A98B)]/40 flex flex-col items-center justify-center text-[var(--color-primary-dark,#3D5939)] shadow-2xs font-bold font-heading relative overflow-hidden select-none ${className}`}
      >
        <span className="leading-none drop-shadow-xs">{initial}</span>
        <span className="text-[10px] opacity-75 font-sans font-medium">🌱</span>
      </div>
    );
  };

  const isPreset = avatarUrl === 'sprout' || avatarUrl === 'bear' || avatarUrl === 'lion' || avatarUrl === 'chick';

  return (
    <div
      onClick={onClick}
      className={`relative inline-block shrink-0 ${onClick ? 'cursor-pointer group' : ''}`}
      title={onClick ? 'Click to change photo' : name}
    >
      {avatarUrl && !hasError && !isPreset ? (
        <img
          src={avatarUrl}
          alt={name}
          onError={() => setHasError(true)}
          className={`${sizeClasses[size]} object-cover border-2 border-[var(--color-primary,#91A98B)]/30 shadow-2xs transition-transform duration-200 ${
            onClick ? 'group-hover:scale-105' : ''
          } ${className}`}
        />
      ) : isPreset ? (
        <div
          className={`${sizeClasses[size]} bg-gradient-to-br from-[#91A98B]/20 via-[#FFF9F0] to-[#F5D77A]/30 border-2 border-[var(--color-primary,#91A98B)]/40 flex items-center justify-center text-2xl shadow-2xs ${className}`}
        >
          {avatarUrl === 'sprout' && '🌱'}
          {avatarUrl === 'bear' && '🧸'}
          {avatarUrl === 'lion' && '🦁'}
          {avatarUrl === 'chick' && '🐣'}
        </div>
      ) : (
        renderFallback()
      )}

      {showEditBadge && (
        <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-[#212A24] rounded-full border border-[var(--color-primary,#91A98B)] shadow-2xs text-[var(--color-primary,#91A98B)] opacity-90 group-hover:opacity-100 transition-opacity">
          <Camera className="w-3 h-3" />
        </div>
      )}
    </div>
  );
};
