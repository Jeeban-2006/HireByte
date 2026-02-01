"use client";

import { FileText, Sparkles, Mic, Layout } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [showDocs, setShowDocs] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showUpdates, setShowUpdates] = useState(false);

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
              <button 
                onClick={() => { setShowDocs(!showDocs); setShowTerms(false); setShowUpdates(false); }}
                className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              >
                Docs
              </button>
              <button 
                onClick={() => { setShowTerms(!showTerms); setShowDocs(false); setShowUpdates(false); }}
                className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              >
                Terms
              </button>
              <button 
                onClick={() => { setShowUpdates(!showUpdates); setShowDocs(false); setShowTerms(false); }}
                className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              >
                Updates
              </button>
              <a href="https://forms.gle/4BdyX4rqwWrA6Wx18" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                Feedback
              </a>
            </div>
          </div>

          {/* Expandable Sections */}
          {showDocs && (
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-300">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">📚 Documentation</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• <strong>Getting Started:</strong> Create professional resumes in minutes with our intuitive builder</li>
                <li>• <strong>AI Features:</strong> Leverage AI-powered suggestions and ATS score analysis</li>
                <li>• <strong>Templates:</strong> Choose from multiple professionally designed templates</li>
                <li>• <strong>Export Options:</strong> Download your resume as PDF with perfect formatting</li>
                <li>• <strong>Voice Input:</strong> Use microphone to dictate your resume content</li>
              </ul>
              <a 
                href="https://github.com/Jeeban-2006/HireByte/blob/main/README.md" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-3 text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                View full documentation →
              </a>
            </div>
          )}

          {showTerms && (
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-300">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">📜 Terms of Service</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• <strong>Usage:</strong> HireByte is provided free for personal and professional use</li>
                <li>• <strong>Data Privacy:</strong> Your resume data is stored locally in your browser and not shared with third parties</li>
                <li>• <strong>AI Processing:</strong> When using AI features, content is processed securely and not retained</li>
                <li>• <strong>Responsibility:</strong> Users are responsible for the accuracy of information in their resumes</li>
                <li>• <strong>Availability:</strong> We strive to maintain uptime but cannot guarantee uninterrupted service</li>
              </ul>
            </div>
          )}

          {showUpdates && (
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-300">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">🚀 Latest Updates & Features</h3>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">AI Resume Generation</strong>
                    <p>Generate complete, professional resumes using advanced AI. Simply provide your details and let AI craft compelling content.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Mic className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">Microphone Input Resume Creation</strong>
                    <p>Speak your resume content! Use voice-to-text for hands-free resume building with real-time transcription.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Layout className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">New Templates</strong>
                    <p>Fresh, modern resume templates designed by HR professionals to maximize your chances of landing interviews.</p>
                  </div>
                </li>
              </ul>
            </div>
          )}

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