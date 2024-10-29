import React from 'react';

interface CountdownProps {
  count: number;
}

export const Countdown: React.FC<CountdownProps> = ({ count }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-[#D4A373] text-6xl font-light animate-pulse">
        {count}
      </div>
    </div>
  );
};