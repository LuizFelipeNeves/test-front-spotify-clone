import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-12 px-4 sm:px-8 ${className}`}
      role="status"
      aria-live="polite"
    >
      {icon && (
        <div className="mb-4 text-gray-500" aria-hidden="true">
          {icon}
        </div>
      )}

      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-2 sm:mb-3">
        {title}
      </h2>

      {description !== undefined && (
        <p className="text-sm sm:text-base text-gray-400 mb-6 max-w-md leading-relaxed">
          {description}
        </p>
      )}

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
