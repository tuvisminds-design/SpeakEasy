import React from 'react';

interface SpeakEasyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SpeakEasyLogo: React.FC<SpeakEasyLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Background circle with teal color */}
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="#14b8a6"
          className="drop-shadow-sm"
        />
        
        {/* Vintage microphone body - tall rounded rectangle */}
        <rect
          x="18"
          y="12"
          width="12"
          height="16"
          rx="6"
          fill="none"
          stroke="#000000"
          strokeWidth="2"
        />
        
        {/* Microphone grille lines */}
        <line x1="20" y1="16" x2="28" y2="16" stroke="#000000" strokeWidth="1.5"/>
        <line x1="20" y1="18" x2="28" y2="18" stroke="#000000" strokeWidth="1.5"/>
        <line x1="20" y1="20" x2="28" y2="20" stroke="#000000" strokeWidth="1.5"/>
        <line x1="20" y1="22" x2="28" y2="22" stroke="#000000" strokeWidth="1.5"/>
        <line x1="20" y1="24" x2="28" y2="24" stroke="#000000" strokeWidth="1.5"/>
        <line x1="20" y1="26" x2="28" y2="26" stroke="#000000" strokeWidth="1.5"/>
        
        {/* Microphone stand - curved lines */}
        <path
          d="M24 28 Q20 30 18 32"
          stroke="#000000"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M24 28 Q28 30 30 32"
          stroke="#000000"
          strokeWidth="2"
          fill="none"
        />
        
        {/* Horizontal bar connecting the stand */}
        <line x1="18" y1="32" x2="30" y2="32" stroke="#000000" strokeWidth="2"/>
        
        {/* Base - flat rounded rectangle */}
        <rect
          x="14"
          y="32"
          width="20"
          height="4"
          rx="2"
          fill="none"
          stroke="#000000"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

export default SpeakEasyLogo;
