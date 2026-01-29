
"use client"

import * as React from "react"
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Eye, Sparkles } from "lucide-react"

interface AtsScoreDisplayProps {
  result: {
    score: number;
    feedback: string;
  }
}

// Parse feedback text with markdown-like formatting
function parseFeedback(text: string) {
  const lines = text.split('\n').filter(line => line.trim());
  const sections: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Parse section headers (e.g., **STRENGTHS:**)
    if (line.startsWith('**') && line.endsWith('**')) {
      const header = line.replace(/\*\*/g, '');
      sections.push(
        <div key={`header-${i}`} className="mt-4 mb-2 first:mt-0">
          <h3 className="text-lg font-bold text-primary">{header}</h3>
        </div>
      );
      i++;
      continue;
    }

    // Parse numbered list items
    if (/^\d+\./.test(line)) {
      const match = line.match(/^\d+\.\s*\*\*(.*?)\*\*:\s*(.*)/);
      if (match) {
        const [, title, content] = match;
        sections.push(
          <div key={`item-${i}`} className="mb-3 pl-4 border-l-2 border-primary/30">
            <p className="font-semibold text-foreground">{title}</p>
            <p className="text-sm text-muted-foreground mt-1">{content}</p>
          </div>
        );
      } else {
        sections.push(
          <p key={`line-${i}`} className="text-sm text-foreground mb-2 pl-4">
            {line}
          </p>
        );
      }
      i++;
      continue;
    }

    // Parse regular text
    if (line) {
      sections.push(
        <p key={`para-${i}`} className="text-sm text-muted-foreground mb-2 leading-relaxed">
          {line}
        </p>
      );
    }
    i++;
  }

  return sections;
}

export function AtsScoreDisplay({ result }: AtsScoreDisplayProps) {
  const chartData = [{ name: "score", score: result.score, fill: "hsl(var(--primary))" }]
  const chartConfig = {
    score: {
      label: "Score",
    },
  }

  const parsedFeedback = parseFeedback(result.feedback);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-4 relative group/card"
    >
      {/* Dark overlay that fades on hover */}
      <div className="absolute inset-0 bg-slate-950/95 dark:bg-slate-950/98 backdrop-blur-md transition-opacity duration-500 group-hover/card:opacity-0 z-50 flex items-center justify-center rounded-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
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
          <h3 className="text-2xl font-bold text-white mb-2">Hover to Reveal Score</h3>
          <p className="text-slate-300">Move your cursor here to see your ATS compatibility results</p>
        </motion.div>
      </div>

      <Card className="border-primary/50 hover:shadow-xl hover:border-primary transition-all duration-300 relative overflow-hidden">
        {/* Animated gradient border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-1 bg-gradient-to-r from-primary via-blue-500 to-cyan-400"
        />

        <CardHeader className="items-center pb-0">
          <CardTitle className="font-headline">AI-Powered Analysis</CardTitle>
          <CardDescription>Your resume's score and feedback from our AI coach.</CardDescription>
        </CardHeader>
        <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[200px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={-270}
            endAngle={90}
            innerRadius="80%"
            outerRadius="100%"
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar dataKey="score" background cornerRadius={10} />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-4 text-sm">
        <div className="flex items-center p-2 font-medium justify-center w-full">
            Your Score:
            <span className="ml-3 text-4xl font-bold bg-gradient-to-r from-primary via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {result.score}/100
            </span>
        </div>
        <Separator className="my-2" />
        <div className="w-full text-left">
            <h4 className="font-bold text-lg mb-4 text-primary">Actionable Feedback</h4>
             <ScrollArea className="h-80 pr-4">
                <div className="space-y-2">
                   {parsedFeedback}
                </div>
            </ScrollArea>
        </div>
      </CardFooter>
    </Card>
    </motion.div>
  )
}
