import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export default function ProgressBar({ currentStep, totalSteps, className = '' }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between text-sm text-[#4A6965] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        <span>Langkah {currentStep} dari {totalSteps}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-green-100 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-[#284B46] to-[#4A6965] h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}