import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'gold';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  icon,
  ...props 
}) => {
  // 3D Game Button Styles
  const baseStyles = "relative font-black py-3 px-6 rounded-2xl shadow-xl transition-all transform active:scale-95 active:shadow-md flex items-center justify-center gap-2 overflow-hidden border-t-2 border-white/30";
  
  const variants = {
    primary: "bg-gradient-to-b from-green-400 via-green-500 to-green-700 text-white border-b-4 border-green-900 shadow-green-900/40",
    secondary: "bg-gradient-to-b from-blue-400 via-blue-500 to-blue-700 text-white border-b-4 border-blue-900 shadow-blue-900/40",
    danger: "bg-gradient-to-b from-red-400 via-red-500 to-red-700 text-white border-b-4 border-red-900 shadow-red-900/40",
    gold: "bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-700 text-yellow-50 border-b-4 border-yellow-900 shadow-yellow-900/40 animate-glow",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {/* Gloss Effect Overlay */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
      
      {icon && <span className="drop-shadow-md filter">{icon}</span>}
      <span className="drop-shadow-md z-10">{children}</span>
    </button>
  );
};