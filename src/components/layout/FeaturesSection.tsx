"use client";

import { Brain, Mic, Palette, Sparkles, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Advanced AI analyzes your resume for ATS compatibility, suggests improvements, and generates professional content tailored to your industry.",
      color: "blue",
      benefits: [
        "Smart ATS scoring & analysis",
        "AI content suggestions",
        "Job description matching",
        "Professional writing assistance"
      ]
    },
    {
      icon: Mic,
      title: "Voice Input Support",
      description: "Speak naturally to fill your resume. Our voice recognition technology converts your speech to text instantly, making resume building faster and more accessible.",
      color: "purple",
      benefits: [
        "Hands-free resume editing",
        "Fast content input",
        "Natural conversation flow",
        "Multi-language support"
      ]
    },
    {
      icon: Palette,
      title: "Multiple Templates",
      description: "Choose from a growing collection of professional resume templates. Each template is ATS-friendly and customizable to match your personal brand.",
      color: "green",
      benefits: [
        "Professional designs",
        "ATS-optimized layouts",
        "Easy customization",
        "Industry-specific styles"
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        icon: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/30",
        hover: "group-hover:border-blue-500/50",
        badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
      },
      purple: {
        icon: "text-purple-500",
        bg: "bg-purple-500/10",
        border: "border-purple-500/30",
        hover: "group-hover:border-purple-500/50",
        badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
      },
      green: {
        icon: "text-green-500",
        bg: "bg-green-500/10",
        border: "border-green-500/30",
        hover: "group-hover:border-green-500/50",
        badge: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
      }
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <section className="py-20 md:py-32 bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_#1e3a8a33,_transparent_65%)]" aria-hidden="true" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge 
              variant="outline" 
              className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400"
            >
              <Sparkles className="h-3 w-3" />
              Key Features
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-slate-900 dark:text-slate-50">
              Build Smarter, Ship Faster
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Powerful features designed to help you create professional, ATS-friendly resumes in minutes, not hours.
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const colors = getColorClasses(feature.color);
            const Icon = feature.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group"
              >
                <Card className={`border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm transition-all duration-300 h-full hover:shadow-xl ${colors.hover}`}>
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className={`h-7 w-7 ${colors.icon}`} />
                    </div>
                    <CardTitle className="text-2xl mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <CheckCircle2 className={`h-4 w-4 ${colors.icon} mt-0.5 flex-shrink-0`} />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <Badge 
                      variant="secondary" 
                      className={`mt-4 ${colors.badge}`}
                    >
                      Available Now
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
