"use client";
import { useState } from "react";
import { parseResumeFromPdfFile } from "@/lib/parsers/pdf-reader";
import type { Resume } from "@/lib/types/resume-types";
import { ResumeTable } from "./ResumeTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils/general-utils";
import { Upload, FileText, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function ResumeParser() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a PDF file.",
      });
      return;
    }

    setIsLoading(true);
    setFileName(file.name);

    try {
      const text = await parseResumeFromPdfFile(file);
      
      // Create a basic Resume object from the extracted text
      // In a real implementation, you would parse the text more intelligently
      const parsedResume: Resume = {
        personalInfo: {
          name: "Extracted from PDF",
          email: "",
          phone: "",
          address: "",
          linkedin: "",
          portfolio: "",
          github: "",
        },
        summary: text.substring(0, 200) + "...",
        education: [],
        experience: [],
        skills: [],
        projects: [],
        certifications: [],
        awards: [],
        volunteerExperience: [],
        languages: [],
      };

      setResume(parsedResume);
      
      toast({
        title: "Resume parsed!",
        description: `Successfully extracted text from ${file.name}`,
      });
    } catch (error) {
      console.error("Error parsing resume:", error);
      toast({
        variant: "destructive",
        title: "Parsing failed",
        description: "Could not parse the PDF file. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4"
            >
              <Sparkles className="h-8 w-8 text-primary" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-4">
              Resume Parser <span className="text-primary">Playground</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload a resume PDF to test the parsing capabilities of our AI system
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="mb-8 hover:shadow-lg transition-all duration-300 hover:border-primary/50 group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FileText className="h-5 w-5 group-hover:text-primary transition-colors" />
                  </motion.div>
                  Upload Resume
                </CardTitle>
                <CardDescription>
                  Select a PDF resume to parse and analyze
                </CardDescription>
              </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <motion.label
                  htmlFor="resume-upload"
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300",
                    isLoading
                      ? "border-muted bg-muted/50"
                      : "border-border hover:border-primary hover:bg-accent hover:shadow-md"
                  )}
                >
                  {isLoading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">Parsing resume...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Upload className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors" />
                      </motion.div>
                      <p className="text-sm font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground">PDF files only</p>
                      {fileName && (
                        <motion.p 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-xs text-primary font-medium mt-2"
                        >
                          Current: {fileName}
                        </motion.p>
                      )}
                    </div>
                  )}
                  <input
                    id="resume-upload"
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isLoading}
                  />
                </motion.label>
              </div>
            </CardContent>
          </Card>
          </motion.div>

          {resume && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="group/card"
            >
              <Card className="hover:shadow-xl transition-all duration-300 hover:border-primary/50 overflow-hidden relative">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-1 bg-gradient-to-r from-primary via-blue-500 to-primary"
                />
                
                {/* Dark overlay that fades on hover */}
                <div className="absolute inset-0 bg-slate-950/90 dark:bg-slate-950/95 backdrop-blur-sm transition-opacity duration-500 group-hover/card:opacity-0 z-10 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-center px-4"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="inline-block mb-4"
                    >
                      <Sparkles className="h-16 w-16 text-primary" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">Hover to Reveal</h3>
                    <p className="text-slate-300">Move your cursor here to see the parsing results</p>
                  </motion.div>
                </div>

                <CardHeader className="relative z-0">
                  <CardTitle className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <Sparkles className="h-5 w-5 text-primary" />
                    </motion.div>
                    Parsing Results
                  </CardTitle>
                  <CardDescription>
                    Extracted information from the resume
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-0">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <ResumeTable resume={resume} />
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
