"use client";

import { Sparkles, Star, TrendingUp, Users, CheckCircle2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface HeroSectionProps {
  onScrollToATS: () => void;
  onScrollToBuilder: () => void;
  onOpenAIDialog: () => void;
}

export function HeroSection({ onScrollToATS, onScrollToBuilder, onOpenAIDialog }: HeroSectionProps) {

  return (
    <section 
      className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32"
      itemScope 
      itemType="https://schema.org/WebApplication"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#1e3a8a33,_transparent_55%)]" aria-hidden="true" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
          
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* New Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Badge 
                variant="outline" 
                className="mb-6 inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
              >
                <Sparkles className="h-3 w-3" />
                New · AI resume builder
              </Badge>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] text-slate-900 dark:text-slate-50"
            >
              Ship ATS‑proof resumes
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                with an AI resume studio
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-xl"
            >
              Create professional resumes that pass ATS screening and land interviews. 
              Built by engineers, powered by AI, trusted by job seekers worldwide.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <Button
                size="lg"
                onClick={onScrollToBuilder}
                className="text-base px-8 py-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25"
              >
                Launch app
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onScrollToATS}
                className="text-base px-8 py-6 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50"
              >
                Run ATS check
              </Button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">Trusted by</div>
              <div className="flex flex-wrap items-center gap-6 text-slate-600 dark:text-slate-500">
                <div className="font-semibold text-sm">Y Combinator</div>
                <div className="font-semibold text-sm">Product Hunt</div>
                <div className="font-semibold text-sm">Google for Startups</div>
              </div>
            </motion.div>

            {/* Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="grid grid-cols-3 gap-4 mt-10"
            >
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
                className="bg-slate-100/80 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl p-4 cursor-pointer hover:shadow-lg hover:border-yellow-500/50 transition-all duration-300 group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Star className="h-4 w-4 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
                  </motion.div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">4.8/5</div>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">avg score</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
                className="bg-slate-100/80 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl p-4 cursor-pointer hover:shadow-lg hover:border-blue-500/50 transition-all duration-300 group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Users className="h-4 w-4 text-blue-500 group-hover:text-blue-400 transition-colors" />
                  </motion.div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">50K+</div>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">resumes</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
                className="bg-slate-100/80 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl p-4 cursor-pointer hover:shadow-lg hover:border-green-500/50 transition-all duration-300 group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <TrendingUp className="h-4 w-4 text-green-500 group-hover:text-green-400 transition-colors" />
                  </motion.div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">3×</div>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">callbacks</div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Column - App Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="relative group/preview"
          >
            {/* Dark overlay that fades on hover */}
            <div className="absolute inset-0 bg-slate-950/95 dark:bg-slate-950/98 backdrop-blur-md transition-opacity duration-500 group-hover/preview:opacity-0 z-20 flex items-center justify-center rounded-2xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="text-center px-4"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block mb-4"
                >
                  <div className="relative">
                    <Eye className="h-16 w-16 text-blue-500" />
                    <Sparkles className="h-8 w-8 text-cyan-400 absolute -top-1 -right-1 animate-pulse" />
                  </div>
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">Hover to Reveal</h3>
                <p className="text-slate-300">See ATS compatibility in action</p>
              </motion.div>
            </div>

            <div className="relative">
              {/* Glassy card with mock preview */}
              <div className="bg-slate-100/90 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl shadow-[0_18px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_18px_60px_rgba(0,0,0,0.55)] p-8 overflow-hidden transition-all duration-300 group-hover/preview:shadow-2xl group-hover/preview:border-blue-500/50">
                {/* Mock ATS Score Header */}
                <div className="mb-6">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">ATS Compatibility</div>
                  <div className="flex items-end gap-3">
                    <div className="text-6xl font-bold text-slate-900 dark:text-slate-50">92</div>
                    <div className="text-2xl text-slate-600 dark:text-slate-400 pb-2">/100</div>
                  </div>
                  <div className="mt-3 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-[92%] bg-gradient-to-r from-green-500 to-blue-500 rounded-full" />
                  </div>
                </div>

                {/* Mock Resume Preview */}
                <div className="bg-white rounded-lg overflow-hidden shadow-xl h-[280px]">
                  <img 
                    src="/resume.png" 
                    alt="Resume preview" 
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 mt-6">
                  <div className="bg-slate-200/50 dark:bg-slate-800/50 rounded-lg p-3 text-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto mb-1" />
                    <div className="text-xs text-slate-600 dark:text-slate-400">Keywords</div>
                  </div>
                  <div className="bg-slate-200/50 dark:bg-slate-800/50 rounded-lg p-3 text-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto mb-1" />
                    <div className="text-xs text-slate-600 dark:text-slate-400">Format</div>
                  </div>
                  <div className="bg-slate-200/50 dark:bg-slate-800/50 rounded-lg p-3 text-center">
                    <CheckCircle2 className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                    <div className="text-xs text-slate-600 dark:text-slate-400">Structure</div>
                  </div>
                </div>
              </div>

              {/* Decorative glow */}
              <div className="absolute -inset-4 bg-blue-500/20 blur-3xl -z-10 opacity-30" aria-hidden="true" />
            </div>
          </motion.div>

        </div>
      </div>

      {/* Pricing Tease */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="container mx-auto px-4 md:px-8 relative z-10 mt-20"
      >
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-slate-100/90 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-full px-6 py-3">
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Free while in beta · No credit card required
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}