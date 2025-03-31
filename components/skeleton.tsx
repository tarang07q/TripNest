'use client';

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`
        animate-pulse rounded-md bg-gray-200
        ${className}
      `}
    />
  );
}

export function SkeletonText({ lines = 1, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} className="h-4 w-full" />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return <Skeleton className={`rounded-full ${sizeClasses[size]} ${className}`} />;
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-lg border border-gray-200 p-4 ${className}`}>
      <Skeleton className="h-48 w-full mb-4" />
      <SkeletonText lines={2} className="mb-4" />
      <div className="flex items-center space-x-4">
        <SkeletonAvatar size="sm" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
} 