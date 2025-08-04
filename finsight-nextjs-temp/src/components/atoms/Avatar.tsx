'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'circular' | 'rounded' | 'square';
  showStatus?: boolean;
  status?: 'online' | 'offline' | 'away' | 'busy';
  showBorder?: boolean;
  borderColor?: string;
  fallbackColor?: string;
  onClick?: () => void;
  className?: string;
}

export interface AvatarGroupProps {
  avatars: Omit<AvatarProps, 'size'>[];
  size?: AvatarProps['size'];
  max?: number;
  showMore?: boolean;
  spacing?: 'tight' | 'normal' | 'loose';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name = '',
  size = 'md',
  variant = 'circular',
  showStatus = false,
  status = 'offline',
  showBorder = false,
  borderColor = 'white',
  fallbackColor,
  onClick,
  className,
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  };

  const variantClasses = {
    circular: 'rounded-full',
    rounded: 'rounded-lg',
    square: 'rounded-none',
  };

  const statusClasses = {
    online: 'bg-success-500',
    offline: 'bg-gray-400',
    away: 'bg-warning-500',
    busy: 'bg-danger-500',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5',
  };

  const avatarClasses = cn(
    'relative inline-flex items-center justify-center font-medium text-white bg-gray-300 overflow-hidden transition-all duration-200',
    sizeClasses[size],
    variantClasses[variant],
    {
      'cursor-pointer hover:scale-105': onClick,
      'ring-2 ring-offset-2': showBorder,
    },
    className
  );

  const initials = getInitials(name);
  const avatarColor = fallbackColor || getAvatarColor(name);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const AvatarContent = () => (
    <div 
      className={avatarClasses}
      style={{ 
        backgroundColor: !src ? avatarColor : undefined,
        borderColor: showBorder ? borderColor : undefined 
      }}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Hide image on error to show fallback
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <span className="font-semibold select-none">
          {initials || '?'}
        </span>
      )}

      {/* Status Indicator */}
      {showStatus && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-white',
            statusSizes[size],
            statusClasses[status]
          )}
        />
      )}
    </div>
  );

  if (onClick) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AvatarContent />
      </motion.div>
    );
  }

  return <AvatarContent />;
};

const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  size = 'md',
  max = 3,
  showMore = true,
  spacing = 'normal',
  className,
}) => {
  const spacingClasses = {
    tight: '-space-x-1',
    normal: '-space-x-2',
    loose: '-space-x-3',
  };

  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={cn('flex items-center', spacingClasses[spacing], className)}>
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          {...avatar}
          size={size}
          showBorder={true}
          className="relative"
        />
      ))}
      
      {showMore && remainingCount > 0 && (
        <div
          className={cn(
            'relative inline-flex items-center justify-center bg-gray-100 text-gray-600 font-medium rounded-full border-2 border-white',
            {
              'w-6 h-6 text-xs': size === 'xs',
              'w-8 h-8 text-sm': size === 'sm',
              'w-10 h-10 text-base': size === 'md',
              'w-12 h-12 text-lg': size === 'lg',
              'w-16 h-16 text-xl': size === 'xl',
              'w-20 h-20 text-2xl': size === '2xl',
            }
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

// Helper function to generate consistent colors for names
function getAvatarColor(name: string): string {
  const colors = [
    '#00D4AA', '#007AFF', '#22C55E', '#F59E0B', '#EF4444',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316',
    '#6366F1', '#14B8A6', '#F472B6', '#A855F7', '#3B82F6'
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export default Avatar;
export { AvatarGroup };
