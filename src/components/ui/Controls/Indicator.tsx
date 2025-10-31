import { type JSX } from 'react';
import { cn } from '@/lib/utils';

interface IndicatorProps {
  label: string;
  color: 'gray' | 'green';
  icon: 'check' | 'lock' | 'group';
}

export function Indicator({ label, color, icon }: IndicatorProps) {
  const icons: Record<string, JSX.Element> = {
    check: (
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    ),
    lock: (
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    ),
    group: (
      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83.67-1.5 1.5-1.5S12 9.67 12 10.5V11h2.5c.83 0 1.5.67 1.5 1.5V18h2v-6.5c0-1.38-1.12-2.5-2.5-2.5H13V9.5c0-1.38-1.12-2.5-2.5-2.5S8 8.12 8 9.5V18H4z" />
    ),
  };

  return (
    <div
      className={cn(
        'flex items-center gap-1 text-xs',
        color === 'gray' ? 'text-gray-400' : 'text-green-400'
      )}
      title={`Playlist ${label}`}
    >
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
        {icons[icon]}
      </svg>
      <span className="hidden sm:inline">{label}</span>
    </div>
  );
}
