import * as React from 'react';
import { cn } from '@/lib/utils/general-utils';

interface LoadingSpinnerProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const LoadingSpinner = ({ size = 48, className, ...props }: LoadingSpinnerProps) => {
  return (
    <div role="status" className="inline-block">
      <svg
        className={cn('animate-rotate-loader', className)}
        width={size}
        height={size}
        viewBox="25 25 50 50"
        {...props}
      >
        <circle
          className="animate-dash-loader stroke-primary"
          cx="50"
          cy="50"
          r="20"
          fill="none"
          strokeWidth="4"
        />
        <path
          className="fill-primary/20"
          d="M50,32 L50,32 C51.1045695,32 52,32.8954305 52,34 L52,42 C52,43.1045695 51.1045695,44 50,44 L50,44 C48.8954305,44 48,43.1045695 48,42 L48,34 C48,32.8954305 48.8954305,32 50,32 Z M50,54 L50,54 C51.1045695,54 52,54.8954305 52,56 L52,64 C52,65.1045695 51.1045695,66 50,66 L50,66 C48.8954305,66 48,65.1045695 48,64 L48,56 C48,54.8954305 48.8954305,54 50,54 Z"
        ></path>
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

