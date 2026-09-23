import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  const dimension = size === 'sm' ? 16 : size === 'lg' ? 28 : 20;

  return (
    <svg
      className={`spinner spinner-${size} ${className}`}
      width={dimension}
      height={dimension}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Loading..."
    >
      <circle className="spinner-track" cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path className="spinner-arc" d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
};
