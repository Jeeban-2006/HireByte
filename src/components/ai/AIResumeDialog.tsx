"use client";

import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Bot, User, Send, Sparkles, FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIResumeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIResumeDialog({ open, onOpenChange }: AIResumeDialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your AI resume assistant. I'll help you create a professional resume based on our conversation. Tell me about yourself, your work experience, skills, and what kind of job you're applying for. The more details you provide, the better resume I can create!",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<string | null>(null);
  const [isGeneratingResume, setIsGeneratingResume] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call AI service to get response
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          conversationHistory: messages
        }),
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleGenerateResume = async () => {
    setIsGeneratingResume(true);
    
    try {
      const conversationText = messages
        .filter(m => m.sender === 'user')
        .map(m => m.content)
        .join(' ');

      const response = await fetch('/api/ai/generate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationHistory: messages,
          userInput: conversationText
        }),
      });

      if (!response.ok) throw new Error('Failed to generate resume');

      const data = await response.json();
      setGeneratedResume(data.resume);
      
      toast({
        title: "Resume Generated!",
        description: "Your AI-powered resume has been created successfully.",
      });
    } catch (error) {
      console.error('Error generating resume:', error);
      toast({
        title: "Error",
        description: "Failed to generate resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingResume(false);
    }
  };

  const handleDownloadResume = () => {
    if (!generatedResume) return;

    const blob = new Blob([generatedResume], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-generated-resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Resume Creator
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Chat Section */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Chat with AI
            </h3>
            
            <ScrollArea className="flex-1 border rounded-lg p-4 mb-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.sender === 'ai' && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                        {message.sender === 'user' && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                        <div>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        <LoadingSpinner size={16} />
                        <span className="text-sm">AI is typing...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                placeholder="Tell me about your experience, skills, education..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                onClick={handleGenerateResume}
                disabled={isGeneratingResume || messages.length < 3}
                className="flex-1"
              >
                {isGeneratingResume ? (
                  <>
                    <LoadingSpinner size={16} className="mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Resume
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Resume Preview Section */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Generated Resume
            </h3>
            
            <Card className="flex-1">
              <CardContent className="p-4">
                {generatedResume ? (
                  <div className="h-full">
                    <ScrollArea className="h-[400px] w-full">
                      <pre className="whitespace-pre-wrap text-sm font-mono">
                        {generatedResume}
                      </pre>
                    </ScrollArea>
                    <div className="mt-4 flex gap-2">
                      <Button
                        onClick={handleDownloadResume}
                        variant="outline"
                        className="flex-1"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Resume
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-center">
                    <div className="space-y-3">
                      <div className="p-3 rounded-full bg-muted w-fit mx-auto">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">
                        Chat with the AI about your experience and click "Generate Resume" to create your professional resume.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}