import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  icon: Icon
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-accentGold text-bgDark hover:bg-yellow-400 shadow-[0_0_15px_rgba(245,197,24,0.3)]",
    secondary: "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700",
    danger: "bg-red-600/10 text-red-500 hover:bg-red-600/20 border border-red-500/20",
    ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin ml-2" />
      ) : Icon ? (
        <Icon className="w-5 h-5 ml-2" />
      ) : null}
      {children}
    </button>
  );
};
