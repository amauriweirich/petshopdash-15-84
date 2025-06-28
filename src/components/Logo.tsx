
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className,
  size = 'md',
  animated = true
}) => {
  const sizes = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36'
  };

  return (
    <div className={cn(
      sizes[size],
      animated && 'animate-float',
      className
    )}>
      <img 
        src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&h=500&fit=crop&crop=center" 
        alt="Unicapital Logo" 
        className="w-full h-full object-contain rounded-lg shadow-lg" 
      />
    </div>
  );
};

export default Logo;
