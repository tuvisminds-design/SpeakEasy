import React from 'react';
import { motion } from 'framer-motion';

const MicoCharacter = ({ animation = "idle", size = "large" }) => {
  const sizeClasses = size === "large" ? "w-32 h-32" : size === "medium" ? "w-24 h-24" : "w-16 h-16";
  
  return (
    <motion.div
      className={`${sizeClasses} relative mx-auto`}
      animate={animation === "pointing" ? {
        x: [0, 10, 0],
        rotate: [0, 5, 0]
      } : animation === "celebrate" ? {
        y: [0, -20, 0],
        rotate: [0, 10, -10, 0],
        scale: [1, 1.1, 1]
      } : animation === "talking" ? {
        y: [0, -3, 0],
        scale: [1, 1.05, 1]
      } : {
        y: [0, -5, 0]
      }}
      transition={{
        duration: animation === "celebrate" ? 0.6 : animation === "talking" ? 1 : 2,
        repeat: (animation === "idle" || animation === "talking") ? Infinity : 0,
        ease: "easeInOut"
      }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Subtle light green shadow beneath */}
        <ellipse cx="100" cy="188" rx="30" ry="4" fill="#a7f3d0" opacity="0.5"/>
        
        {/* Classic Vintage Microphone - Bullet/Elvis style - EXACT from image */}
        {/* Top grille - Very rounded, bulbous, clearly a microphone head */}
        <ellipse cx="100" cy="42" rx="40" ry="24" fill="#a7f3d0" stroke="#166534" strokeWidth="3"/>
        
        {/* Three horizontal lines on grille */}
        <line x1="62" y1="35" x2="138" y2="35" stroke="#166534" strokeWidth="2.5"/>
        <line x1="62" y1="42" x2="138" y2="42" stroke="#166534" strokeWidth="2.5"/>
        <line x1="62" y1="49" x2="138" y2="49" stroke="#166534" strokeWidth="2.5"/>
        
        {/* Body - Clearly tapers from wide grille to narrow, then slightly wider at bottom */}
        <path d="M 60 66 Q 60 70 65 80 Q 70 90 75 100 Q 80 110 85 120 Q 90 130 95 135 Q 100 140 105 135 Q 110 130 115 120 Q 120 110 125 100 Q 130 90 135 80 Q 140 70 140 66 Q 140 60 135 60 Q 130 60 125 62 Q 120 64 115 65 Q 110 66 100 66 Q 90 66 85 65 Q 80 64 75 62 Q 70 60 65 60 Q 60 60 60 66 Z" 
              fill="#a7f3d0" stroke="#166534" strokeWidth="3" strokeLinejoin="round"/>
        
        {/* Lower section - slightly wider base */}
        <path d="M 65 80 Q 70 100 75 115 Q 80 130 85 138 Q 90 145 100 148 Q 110 145 115 138 Q 120 130 125 115 Q 130 100 135 80" 
              fill="#a7f3d0" stroke="#166534" strokeWidth="3" strokeLinejoin="round"/>
        
        {/* Face - Large round white eyes with dark green pupils */}
        <circle cx="88" cy="95" r="12" fill="white" stroke="#166534" strokeWidth="2.5"/>
        <circle cx="112" cy="95" r="12" fill="white" stroke="#166534" strokeWidth="2.5"/>
        <circle cx="88" cy="95" r="6" fill="#166534"/>
        <circle cx="112" cy="95" r="6" fill="#166534"/>
        
        {/* Simple curved smile */}
        <path d="M 78 110 Q 88 115 100 117 Q 112 115 122 110" stroke="#166534" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        
        {/* Right Arm (left side) - pointing left */}
        <ellipse cx="50" cy="112" rx="5" ry="24" fill="#a7f3d0" stroke="#166534" strokeWidth="2.5" transform="rotate(-30 50 112)"/>
        <circle cx="32" cy="88" r="11" fill="white" stroke="#166534" strokeWidth="2.5"/>
        <line x1="24" y1="86" x2="14" y2="78" stroke="#166534" strokeWidth="3.5" strokeLinecap="round"/>
        <line x1="26" y1="83" x2="28" y2="80" stroke="#166534" strokeWidth="2.5" strokeLinecap="round"/>
        
        {/* Left Arm (right side) - fist */}
        <ellipse cx="150" cy="118" rx="5" ry="22" fill="#a7f3d0" stroke="#166534" strokeWidth="2.5" transform="rotate(40 150 118)"/>
        <circle cx="161" cy="100" r="10" fill="white" stroke="#166534" strokeWidth="2.5"/>
        
        {/* Right Leg (left side) - forward */}
        <ellipse cx="80" cy="152" rx="5" ry="20" fill="#a7f3d0" stroke="#166534" strokeWidth="2.5" transform="rotate(12 80 152)"/>
        <ellipse cx="72" cy="171" rx="12" ry="8" fill="#a7f3d0" stroke="#166534" strokeWidth="2.5"/>
        
        {/* Left Leg (right side) - back */}
        <ellipse cx="120" cy="155" rx="5" ry="20" fill="#a7f3d0" stroke="#166534" strokeWidth="2.5" transform="rotate(-8 120 155)"/>
        <ellipse cx="128" cy="174" rx="12" ry="8" fill="#a7f3d0" stroke="#166534" strokeWidth="2.5"/>
        
        {/* Sparkle top right */}
        <line x1="135" y1="32" x2="143" y2="28" stroke="#166534" strokeWidth="2" strokeLinecap="round"/>
        <line x1="135" y1="32" x2="143" y2="32" stroke="#166534" strokeWidth="2" strokeLinecap="round"/>
        <line x1="135" y1="32" x2="143" y2="36" stroke="#166534" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </motion.div>
  );
};

export default MicoCharacter;


