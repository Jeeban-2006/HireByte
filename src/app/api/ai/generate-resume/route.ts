import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize Groq (primary)
const groq = process.env.GROQ_API_KEY ? new Groq({
  apiKey: process.env.GROQ_API_KEY,
}) : null;

export async function POST(req: NextRequest) {
  try {
    if (!groq) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured. Please add it to your .env.local file.' },
        { status: 500 }
      );
    }

    const { conversationHistory, userInput } = await req.json();

    // Extract user information from conversation
    const userMessages = conversationHistory
      .filter((msg: any) => msg.sender === 'user')
      .map((msg: any) => msg.content)
      .join('\n');

    const prompt = `You are an elite resume writer who charges $500+ per resume. You've helped thousands of professionals land jobs at top companies. You create resumes that get interviews, not just pass ATS systems.

CONVERSATION DATA TO ANALYZE:
${userMessages}

YOUR TASK: Create a powerful, results-driven resume that tells a compelling professional story.

RESUME WRITING PRINCIPLES:
1. IMPACT-FIRST: Every bullet point must show measurable results
2. KEYWORD OPTIMIZATION: Use industry-standard terminology naturally
3. ACHIEVEMENT HIERARCHY: Lead with biggest wins, support with smaller ones
4. NARRATIVE FLOW: Show clear career progression and growth
5. QUANTIFICATION: Convert all achievements to numbers, percentages, or dollar amounts

SECTION-BY-SECTION REQUIREMENTS:

PROFESSIONAL SUMMARY (3-4 lines):
- Lead with years of experience + core expertise
- Include 2-3 quantified achievements
- End with value proposition to employers
- Use dynamic action words (drove, delivered, optimized, scaled)

WORK EXPERIENCE:
- Start each bullet with strong action verbs (not "responsible for")
- Follow CAR method: Challenge/Action/Result
- Include metrics: numbers, percentages, timelines, scale
- Show progression and increasing responsibility
- Use present tense for current role, past tense for others

SKILLS SECTION:
- Group by category (Technical, Languages, Certifications)
- Only include skills mentioned in conversation or inferable from experience
- Use industry-standard naming conventions

FORMATTING RULES:
- Clean, ATS-friendly text format
- Consistent date formatting (MM/YYYY)
- Standard section headers
- Professional email format
- No graphics, tables, or special characters

If information is missing, use realistic placeholders in brackets: [Add metric], [Company Name], [Certification Year]

Generate a resume that would impress hiring managers and pass any ATS system:`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume writer creating professional, ATS-optimized resumes.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 2000,
      top_p: 1,
    });

    const resume = completion.choices[0]?.message?.content || 'Failed to generate resume content.';

    return NextResponse.json({ resume });
  } catch (error) {
    console.error('Resume generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate resume' },
      { status: 500 }
    );
  }
}