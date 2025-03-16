import React from 'react';
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface LoadingIndicatorProps {
  progress: number;
  message?: string;
  className?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  progress, 
  message = "Processing your image...", 
  className 
}) => {
  // Generate step messages based on progress
  const getStepMessage = () => {
    if (progress < 20) return "Initializing...";
    if (progress < 40) return "Analyzing image...";
    if (progress < 60) return "Generating background...";
    if (progress < 80) return "Applying enhancements...";
    if (progress < 95) return "Finalizing image...";
    return "Almost done!";
  };

  return (
    <div className={cn("w-full p-6 glass-morphism", className)}>
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-center">{message}</h3>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground text-center animate-pulse">
          {getStepMessage()} ({Math.round(progress)}%)
        </p>
      </div>
    </div>
  );
};

export default LoadingIndicator;