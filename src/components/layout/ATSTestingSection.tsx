"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, CheckCircle, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { validateResumeText } from "@/lib/utils/file-handling-utils";
import { AtsScoreDisplay } from "@/components/ai/ATSScoreDisplay";
import { parseResumeFromPdf } from "@/lib/parsers/pdf-reader";
import { motion } from "framer-motion";

interface ATSTestingSectionProps {
  onScrollToBuilder: () => void;
  onAutofillResume?: (resumeText: string) => Promise<void>;
}

export function ATSTestingSection({ onScrollToBuilder, onAutofillResume }: ATSTestingSectionProps) {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.2 });
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [atsResult, setAtsResult] = useState<{score: number; feedback: string} | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [useTextInput, setUseTextInput] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAutofilling, setIsAutofilling] = useState(false);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf" || droppedFile.type.includes("document")) {
        setFile(droppedFile);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a PDF or Word document."
        });
      }
    }
  }, [toast]);

  const handleAutofillBuilder = async () => {
    if (!resumeText.trim() && !file) {
      toast({
        variant: "destructive",
        title: "No Resume Content",
        description: "Please upload a resume or paste resume text first."
      });
      return;
    }

    if (!onAutofillResume) {
      toast({
        variant: "destructive",
        title: "Feature Not Available",
        description: "Autofill feature is not configured."
      });
      return;
    }

    setIsAutofilling(true);
    try {
      await onAutofillResume(resumeText);
      toast({
        title: "Resume Autofilled! 🎉",
        description: "Your resume builder has been populated with the uploaded content."
      });
      // Scroll to builder after a short delay
      setTimeout(() => {
        onScrollToBuilder();
      }, 500);
    } catch (error) {
      console.error("Autofill error:", error);
      toast({
        variant: "destructive",
        title: "Autofill Failed",
        description: "There was an error parsing your resume. Please try again."
      });
    } finally {
      setIsAutofilling(false);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files || !e.target.files[0]) return;

  const selectedFile = e.target.files[0];
  setFile(selectedFile);
  setIsLoading(true);

  try {
    toast({
      title:
        selectedFile.type === 'application/pdf'
          ? 'Processing PDF'
          : 'Processing file',
      description: 'Extracting text from your file...',
    });

    let text = '';

    // Try pdfjs-dist first for PDF files (client-side parsing)
    if (selectedFile.type === 'application/pdf') {
      try {
        const fileUrl = URL.createObjectURL(selectedFile);
        text = await parseResumeFromPdf(fileUrl);
        URL.revokeObjectURL(fileUrl);
        
        if (text.trim().length > 5) {
          setResumeText(text.replace(/\s+/g, ' ').trim());
          toast({
            title: 'File processed!',
            description: `Extracted ${text.length} characters from your resume.`,
          });
          setIsLoading(false);
          return;
        }
      } catch (pdfError) {
        console.warn('pdfjs-dist parsing failed, falling back to server:', pdfError);
      }
    }

    // Fallback to server-side extraction
    const formData = new FormData();
    formData.append('file', selectedFile);

    const extractResponse = await fetch('/api/ai/extract-text', {
      method: 'POST',
      body: formData,
    });

    // ✅ READ JSON ONLY ONCE
    const data = await extractResponse.json();

    if (!extractResponse.ok) {
      throw new Error(data.error || 'Failed to extract text');
    }

    text = (data.text || '')
  .replace(/\s+/g, ' ')
  .trim();


    if (text.trim().length > 5) {

      setResumeText(text);

      toast({
        title: 'File processed!',
        description: `Extracted ${text.length} characters from your resume.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'No text found',
        description:
          "Could not extract enough text from the file. Please try the 'Paste Text' option.",
      });
    }
  } catch (error: any) {
    console.error('File processing error:', error);
    toast({
      variant: 'destructive',
      title: 'Error processing file',
      description:
        error.message ||
        "Could not read the file. Please try the 'Paste Text' option instead.",
    });
  } finally {
    setIsLoading(false);
  }
};


  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide a job description."
      });
      return;
    }

    if (!file && !resumeText.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please upload a resume file or paste resume text."
      });
      return;
    }

    setIsLoading(true);
    try {
      let finalResumeText = resumeText.trim();
      
      // Debug logging
      console.log('Resume text length:', finalResumeText.length);
      console.log('Resume text preview:', finalResumeText.substring(0, 100));
      
      // Validate resume text
      const validation = validateResumeText(finalResumeText);
      if (!validation.isValid) {
        console.error('Validation failed:', validation.error);
        toast({
          variant: "destructive",
          title: "Resume content needed",
          description: validation.error || "Please provide at least 20 characters of resume content."
        });
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/ai/analyze-ats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText: finalResumeText.trim(),
          jobDescription: jobDescription.trim()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const result = await response.json();
      setAtsResult(result);
      
      toast({
        title: "Analysis Complete!",
        description: `Your resume scored ${result.score}/100 for this job.`
      });
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "There was an error analyzing your resume. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section 
      ref={ref}
      id="ats-testing" 
      className="py-32 relative"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container mx-auto px-4 md:px-8"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Tag & Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full mb-6">
              <span className="text-xs font-medium text-blue-400">Feature</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">·</span>
              <span className="text-xs text-slate-700 dark:text-slate-300">ATS Analyzer</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4 text-slate-900 dark:text-slate-50">
              Test Your Resume's ATS Score
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
              Upload your existing resume and get instant feedback on how well it matches 
              job requirements. Our AI analyzes your resume against ATS systems.
            </p>
          </motion.div>

          {/* Two-Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            
            {/* Left Card - Upload & Job Description */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-6"
            >
              {/* Resume Upload */}
              <Card className="bg-slate-900/60 border-slate-800 rounded-2xl shadow-[0_18px_60px_rgba(0,0,0,0.55)] hover:shadow-[0_25px_70px_rgba(0,0,0,0.65)] hover:border-blue-500/50 transition-all duration-300 group">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-50">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <FileText className="h-5 w-5 text-blue-500 group-hover:text-blue-400 transition-colors" />
                    </motion.div>
                    Resume Content
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Upload a file or paste your resume text
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <Button
                      variant={!useTextInput ? "default" : "outline"}
                      size="sm"
                      onClick={() => setUseTextInput(false)}
                      className={!useTextInput ? "bg-blue-500 hover:bg-blue-600" : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}
                    >
                      Upload File
                    </Button>
                    <Button
                      variant={useTextInput ? "default" : "outline"}
                      size="sm"
                      onClick={() => setUseTextInput(true)}
                      className={useTextInput ? "bg-blue-500 hover:bg-blue-600" : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}
                    >
                      Paste Text
                    </Button>
                  </div>

                  {!useTextInput ? (
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragActive 
                          ? "border-blue-500 bg-blue-500/10" 
                          : "border-slate-300 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-900/40 hover:border-slate-400 dark:hover:border-slate-600"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileInput}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      
                      {file ? (
                        <div className="flex flex-col items-center gap-3">
                          <CheckCircle className="h-12 w-12 text-green-500" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-200">{file.name}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {(file.size / 1024 / 1024).toFixed(1)} MB
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setFile(null);
                              setResumeText("");
                            }}
                            className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            Change File
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <Upload className="h-12 w-12 text-slate-400 dark:text-slate-500" />
                          <div>
                            <p className="font-medium text-slate-700 dark:text-slate-300">Drop your resume here</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              or click to browse (PDF, DOC, TXT)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Textarea
                        id="resume-text"
                        placeholder="Paste your resume content here..."
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        className="min-h-[150px] resize-none bg-slate-100/50 dark:bg-slate-900/40 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 placeholder:text-slate-500"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Job Description */}
              <Card className="bg-slate-50/90 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 rounded-2xl shadow-[0_18px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_18px_60px_rgba(0,0,0,0.55)] hover:shadow-[0_25px_70px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_25px_70px_rgba(0,0,0,0.65)] hover:border-blue-500/50 transition-all duration-300 group">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-50">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FileText className="h-5 w-5 text-blue-500 group-hover:text-blue-400 transition-colors" />
                    </motion.div>
                    Your Resume
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Paste the job description to analyze against
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    id="job-description"
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[150px] resize-none bg-slate-900/40 border-slate-700 text-slate-200 placeholder:text-slate-500"
                  />
                </CardContent>
              </Card>

              {/* Analyze Button */}
              <Button
                size="lg"
                onClick={handleAnalyze}
                disabled={(!file && !resumeText.trim()) || !jobDescription.trim() || isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-base py-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Analyze Resume
                  </>
                )}
              </Button>

              {/* Autofill Builder Button */}
              {onAutofillResume && (
                <Button
                  size="lg"
                  onClick={handleAutofillBuilder}
                  disabled={(!file && !resumeText.trim()) || isAutofilling}
                  variant="outline"
                  className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 text-base py-6"
                >
                  {isAutofilling ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Parsing Resume...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-5 w-5" />
                      Autofill Resume Builder
                    </>
                  )}
                </Button>
              )}
            </motion.div>

            {/* Right Card - Live ATS Score */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Card className="bg-slate-900/60 border-slate-800 rounded-2xl shadow-[0_18px_60px_rgba(0,0,0,0.55)] h-full hover:shadow-[0_25px_70px_rgba(0,0,0,0.65)] hover:border-blue-500/50 transition-all duration-300 group">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-50">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <CheckCircle2 className="h-5 w-5 text-blue-500 group-hover:text-blue-400 transition-colors" />
                    </motion.div>
                    Live ATS Score
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    {atsResult ? "Your resume analysis results" : "Upload resume and analyze to see score"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {atsResult ? (
                    <div className="space-y-6">
                      {/* Big Score */}
                      <div>
                        <div className="flex items-end gap-3 mb-4">
                          <div className="text-7xl font-bold text-slate-50">{atsResult.score}</div>
                          <div className="text-3xl text-slate-400 pb-3">/100</div>
                        </div>
                        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${
                              atsResult.score >= 75 ? 'bg-gradient-to-r from-green-500 to-blue-500' :
                              atsResult.score >= 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                              'bg-gradient-to-r from-red-500 to-orange-500'
                            }`}
                            style={{ width: `${atsResult.score}%` }}
                          />
                        </div>
                      </div>

                      {/* Category Tags */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto mb-2" />
                          <div className="text-xs font-medium text-slate-300">Keywords</div>
                          <div className="text-xs text-slate-500 mt-1">Good</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                          <CheckCircle2 className="h-5 w-5 text-blue-500 mx-auto mb-2" />
                          <div className="text-xs font-medium text-slate-300">Format</div>
                          <div className="text-xs text-slate-500 mt-1">Excellent</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                          <CheckCircle2 className="h-5 w-5 text-yellow-500 mx-auto mb-2" />
                          <div className="text-xs font-medium text-slate-300">Structure</div>
                          <div className="text-xs text-slate-500 mt-1">Fair</div>
                        </div>
                      </div>

                      {/* Feedback */}
                      <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-4 max-h-[300px] overflow-y-auto">
                        <h4 className="text-sm font-semibold text-slate-200 mb-2">Detailed Feedback</h4>
                        <div className="text-sm text-slate-400 whitespace-pre-wrap leading-relaxed">
                          {atsResult.feedback}
                        </div>
                      </div>

                      {/* View Suggestions Section */}
                      <div className="border-t border-slate-800 pt-4">
                        <Button
                          onClick={() => setShowSuggestions(!showSuggestions)}
                          variant="default"
                          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                        >
                          {showSuggestions ? "Hide" : "View"} Detailed Suggestions
                        </Button>
                        
                        {/* Suggestions Display */}
                        {showSuggestions && (
                          <div className="mt-3 p-4 bg-slate-900/60 border border-slate-700 rounded-lg max-h-[300px] overflow-y-auto">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-sm font-semibold text-slate-200">Your Suggestions</h4>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  const text = `ATS Score: ${atsResult.score}/100\n\nFeedback:\n${atsResult.feedback}`;
                                  navigator.clipboard.writeText(text);
                                  toast({ title: "Copied to clipboard!" });
                                }}
                                className="h-7 text-xs"
                              >
                                Copy
                              </Button>
                            </div>
                            <div className="text-sm text-slate-300 whitespace-pre-wrap">
                              {atsResult.feedback}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CTA */}
                      <Button
                        onClick={onScrollToBuilder}
                        variant="outline"
                        className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                      >
                        Improve in builder →
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                        <FileText className="h-10 w-10 text-slate-600" />
                      </div>
                      <p className="text-slate-400 mb-2">No analysis yet</p>
                      <p className="text-sm text-slate-500">
                        Upload your resume and add a job description to get started
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}