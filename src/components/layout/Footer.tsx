
"use client";

import { FileText } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full border-t border-slate-200 dark:border-slate-800 mt-32">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Top Row - Copyright & Links */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Left - Copyright */}
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="p-1 rounded bg-blue-500/10">
                <FileText className="h-3 w-3 text-blue-500" />
              </div>
              <span>© {currentYear} HireByte. All rights reserved.</span>
            </div>

            {/* Right - Links */}
            <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
              <a href="https://github.com/Jeeban-2006/HireByte2#readme" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                Docs
              </a>
              <a href="#privacy" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                Privacy
              </a>
              <a href="#terms" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                Terms
              </a>
              <a href="#status" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                Status
              </a>
              <a href="https://forms.gle/4BdyX4rqwWrA6Wx18" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                Feedback
              </a>
            </div>
          </div>

          {/* Bottom Row - Credits */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <p className="text-sm text-center text-slate-600 dark:text-slate-400">
              Designed & Developed by{' '}
              <Link 
                href="https://linkedin.com/in/jeeban-krushna-sahu-004228301" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Jeeban Krushna Sahu
              </Link>
              {' '}&{' '}
              <Link 
                href="https://github.com/Abhijxxt14" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Abhijeet Soren
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
