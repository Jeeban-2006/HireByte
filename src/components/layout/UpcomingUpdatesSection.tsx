"use client";

import { Sparkles, Rocket, Globe, MessageSquare, FileCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function UpcomingUpdatesSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge 
            variant="outline" 
            className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400"
          >
            <Rocket className="h-3 w-3" />
            Coming Soon
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-slate-900 dark:text-slate-50">
            Next Up
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            We're constantly innovating to bring you the best resume building experience. Here's what's in the pipeline.
          </p>
        </div>

        {/* Updates Grid with Blur Effect */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Feature Card 1 - More Templates */}
          <div className="group relative">
            <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-all duration-500 h-full overflow-hidden group-hover:shadow-2xl group-hover:border-green-500/50">
              {/* Blur overlay - removed on hover */}
              <div className="absolute inset-0 backdrop-blur-md bg-slate-900/60 dark:bg-slate-950/80 transition-opacity duration-500 group-hover:opacity-0 z-10 flex items-center justify-center">
                <div className="text-center px-4">
                  <Sparkles className="h-8 w-8 text-green-400 mx-auto mb-2 animate-pulse" />
                  <p className="text-sm text-slate-300 dark:text-slate-400 font-medium">Hover to preview</p>
                </div>
              </div>
              
              {/* Card Content */}
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                  <FileCheck className="h-6 w-6 text-green-500" />
                </div>
                <CardTitle className="text-xl">Expanded Template Library</CardTitle>
                <CardDescription>
                  Access 20+ professional templates designed for different industries, experience levels, and career stages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20">
                  In Development
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Feature Card 2 - AI Voice Resume Builder */}
          <div className="group relative">
            <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-all duration-500 h-full overflow-hidden group-hover:shadow-2xl group-hover:border-purple-500/50">
              {/* Blur overlay - removed on hover */}
              <div className="absolute inset-0 backdrop-blur-md bg-slate-900/60 dark:bg-slate-950/80 transition-opacity duration-500 group-hover:opacity-0 z-10 flex items-center justify-center">
                <div className="text-center px-4">
                  <Sparkles className="h-8 w-8 text-purple-400 mx-auto mb-2 animate-pulse" />
                  <p className="text-sm text-slate-300 dark:text-slate-400 font-medium">Hover to preview</p>
                </div>
              </div>
              
              {/* Card Content */}
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-purple-500" />
                </div>
                <CardTitle className="text-xl">AI Voice Resume Builder</CardTitle>
                <CardDescription>
                  Create your entire resume through natural conversation - just talk about your experience and let AI structure it professionally
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                  Planned
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-slate-600 dark:text-slate-400">
            Have a feature request? <a href="https://forms.gle/4BdyX4rqwWrA6Wx18" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium underline">Let us know!</a>
          </p>
        </div>
      </div>
    </section>
  );
}

