'use client';

import { Spinner } from "@nextui-org/react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Spinner
        size={size}
        color="primary"
        labelColor="primary"
        label="Loading..."
      />
    </div>
  );
} 