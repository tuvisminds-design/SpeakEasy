import React from 'react';

interface UserIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const UserIcon: React.FC<UserIconProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Document/Profile background */}
        <rect
          x="3"
          y="2"
          width="18"
          height="20"
          rx="2"
          fill="#f3f4f6"
          stroke="#d1d5db"
          strokeWidth="1"
        />
        
        {/* Folded corner */}
        <path
          d="M19 2L21 4L19 6V2Z"
          fill="#e5e7eb"
          stroke="#d1d5db"
          strokeWidth="1"
        />
        
        {/* Landscape icon inside document */}
        <g transform="translate(6, 6)">
          {/* Sky/Water area */}
          <rect
            x="0"
            y="0"
            width="12"
            height="6"
            fill="#dbeafe"
            rx="1"
          />
          
          {/* Hills/Grass area */}
          <path
            d="M0 6 Q2 4, 4 5 Q6 3, 8 4 Q10 2, 12 3 L12 8 L0 8 Z"
            fill="#86efac"
          />
          
          {/* Simple sun */}
          <circle
            cx="9"
            cy="2"
            r="1.5"
            fill="#fbbf24"
          />
        </g>
      </svg>
    </div>
  );
};

export default UserIcon;
