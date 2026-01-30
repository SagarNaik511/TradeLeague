'use client';

import { useEffect, useState } from 'react';

const AnimatedCounter = ({ value, className }: { value: number; className?: string }) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    const animationDuration = 1000; // 1 second
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(animationDuration / frameDuration);
    const valueDifference = value - currentValue;
    const increment = valueDifference / totalFrames;

    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const nextValue = currentValue + increment * frame;
      
      if (frame === totalFrames) {
        setCurrentValue(value);
        clearInterval(counter);
      } else {
        setCurrentValue(nextValue);
      }
    }, frameDuration);

    return () => clearInterval(counter);
  }, [value]);

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };
  
  return <span className={className}>{formatCurrency(currentValue)}</span>;
};

export default AnimatedCounter;
