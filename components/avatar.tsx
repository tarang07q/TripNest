'use client';

import { ReactNode } from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  fallback?: ReactNode;
  className?: string;
}

export default function Avatar({
  src,
  alt = '',
  size = 'md',
  fallback,
  className = '',
}: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`
          rounded-full object-cover
          ${sizeClasses[size]}
          ${className}
        `}
      />
    );
  }

  if (fallback) {
    return (
      <div
        className={`
          rounded-full bg-gray-100 flex items-center justify-center
          ${sizeClasses[size]}
          ${textSizeClasses[size]}
          ${className}
        `}
      >
        {fallback}
      </div>
    );
  }

  return (
    <div
      className={`
        rounded-full bg-gray-100 flex items-center justify-center
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <svg
        className={`text-gray-400 ${sizeClasses[size]}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    </div>
  );
} 