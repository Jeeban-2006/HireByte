import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import {
  calculateKeywordMatch,
  calculateSkillMatch,
  extractTechnicalSkills,
} from '@/lib/utils/ai-analysis-utils';

// Initialize Groq (primary)
const groq = process.env.GROQ_API_KEY ? new Groq({
  apiKey: process.env.GROQ_API_KEY,
}) : null;

export async function POST(req: NextRequest) {
  try {
    // Debug: Check API keys
    console.log('🔍 Environment Check:');
    console.log('- GROQ_API_KEY:', process.env.GROQ_API_KEY ? '✅ Set' : '❌ Missing');
    
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: 'Both resume text and job description are required' },
        { status: 400 }
      );
    }

    // Step 1: Calculate keyword match
    const keywordScore = calculateKeywordMatch(resumeText, jobDescription);

    // Step 2: Calculate skill match
    const skillScore = calculateSkillMatch(resumeText, jobDescription);

    // Step 3: Calculate weighted final score (simplified without embeddings)
    const finalScore = Math.round(
      keywordScore * 0.6 +  // 60% keyword match
      skillScore * 0.4      // 40% skill match
    );

    // Step 5: Use Groq LLaMA to generate detailed feedback
    const resumeSkills = extractTechnicalSkills(resumeText);
    const jobSkills = extractTechnicalSkills(jobDescription);
    const missingSkills = jobSkills.filter(skill => !resumeSkills.includes(skill));

    const feedbackPrompt = `You are a senior ATS expert and resume consultant with 15+ years of experience. Analyze this resume against the job description and provide detailed, actionable feedback.

=== RESUME ===
${resumeText.slice(0, 3000)}

=== JOB DESCRIPTION ===
${jobDescription.slice(0, 3000)}

=== ANALYSIS METRICS ===
• Overall ATS Match: ${finalScore}/100
• Keyword Match: ${keywordScore.toFixed(1)}%
• Skill Match: ${skillScore.toFixed(1)}%
• Missing Skills: ${missingSkills.slice(0, 8).join(', ') || 'None identified'}

=== YOUR TASK ===
Provide a comprehensive analysis in this EXACT format:

✅ STRENGTHS (3-5 points):
• [Specific strength with evidence from resume]
• [Another strength with concrete example]
• [What the candidate does exceptionally well]

⚠️ WEAKNESSES (3-5 points):
• [Specific weakness and why it matters]
• [Missing qualifications or gaps]
• [Areas that need immediate attention]

💡 WHAT NEEDS IMPROVEMENT (5-7 actionable items):
• [Specific change needed with before/after example]
• [Skill or keyword to add and where]
• [Section that needs restructuring and how]
• [Quantifiable metric to add]
• [Technical terminology to include]

🗑️ WHAT TO REMOVE (2-4 items):
• [Content that weakens the resume]
• [Irrelevant information or outdated skills]
• [Redundant or generic statements]

🎯 ATS OPTIMIZATION TIPS (3-4 technical fixes):
• [Formatting or structure changes for ATS parsing]
• [Keyword placement strategies]
• [Section organization improvements]

📊 KEYWORD GAPS (Top 5-8 missing keywords):
• [Critical keyword 2] - [Where to add it]

Be specific, direct, and actionable. Use examples from the resume where possible.`;

    if (!groq) {
      const basicFeedback = `
CALCULATED SCORES:
- Overall Match: ${finalScore}/100
- Keyword Match: ${keywordScore.toFixed(1)}%
- Skill Match: ${skillScore.toFixed(1)}%

MISSING SKILLS: ${missingSkills.slice(0, 5).join(', ') || 'None identified'}

GROQ_API_KEY is not configured. Please add it to your .env.local file.`;

      return NextResponse.json({
        score: Math.max(0, Math.min(100, finalScore)),
        feedback: basicFeedback,
        breakdown: {
          keywordScore: Math.round(keywordScore),
          skillScore: Math.round(skillScore),
          missingSkills: missingSkills.slice(0, 10),
        },
      });
    }

    try {
      console.log('🔄 Using Groq API...');
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert ATS specialist providing detailed resume feedback.',
          },
          {
            role: 'user',
            content: feedbackPrompt,
          },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.4,
        max_tokens: 2000,
      });

      const feedback = completion.choices[0]?.message?.content || 'Unable to generate detailed feedback.';
      console.log('✅ Groq API success');

      return NextResponse.json({
        score: Math.max(0, Math.min(100, finalScore)),
        feedback,
        breakdown: {
          keywordScore: Math.round(keywordScore),
          skillScore: Math.round(skillScore),
          missingSkills: missingSkills.slice(0, 10),
        },
      });
    } catch (groqError) {
      console.error('❌ Groq API failed:', groqError);
      
      const basicFeedback = `
CALCULATED SCORES:
- Overall Match: ${finalScore}/100
- Keyword Match: ${keywordScore.toFixed(1)}%
- Skill Match: ${skillScore.toFixed(1)}%

MISSING SKILLS: ${missingSkills.slice(0, 5).join(', ') || 'None identified'}

Groq API error. Please check your API key.`;

      return NextResponse.json({
        score: Math.max(0, Math.min(100, finalScore)),
        feedback: basicFeedback,
        breakdown: {
          keywordScore: Math.round(keywordScore),
          skillScore: Math.round(skillScore),
          missingSkills: missingSkills.slice(0, 10),
        },
      });
    }
  } catch (error) {
    console.error('ATS Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze resume. Please try again.' },
      { status: 500 }
    );
  }
}