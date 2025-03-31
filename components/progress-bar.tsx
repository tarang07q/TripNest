'use client';

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'primary' | 'success' | 'error' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  showLabel = true,
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const variantStyles = {
    primary: 'bg-blue-600',
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-yellow-600',
  };

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const labelSizeStyles = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          {showLabel && (
            <div>
              <span className={`font-semibold inline-block ${labelSizeStyles[size]}`}>
                {Math.round(percentage)}%
              </span>
            </div>
          )}
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${percentage}%` }}
            className={`
              shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center
              ${variantStyles[variant]}
              ${sizeStyles[size]}
              transition-all duration-500
            `}
          />
        </div>
      </div>
    </div>
  );
} 