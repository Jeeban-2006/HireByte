
"use client";

import React from 'react';

export function SplashScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-background transition-opacity duration-500 ease-in-out">
      <div className="relative">
        <div className="flex items-center justify-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="96"
                height="96"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary animate-draw mr-4"
            >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
            <h1 
                className="text-5xl md:text-7xl font-bold text-foreground overflow-hidden whitespace-nowrap w-0 animate-typewriter font-headline relative"
            >
            HireByte
            <span className="border-r-4 border-accent animate-blink-caret absolute right-0 top-0 h-full"></span>
            </h1>
        </div>
         <div className="absolute inset-0 animate-scanline"></div>
      </div>
    </div>
  );
}
