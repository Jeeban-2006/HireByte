import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize Groq (primary)
const groq = process.env.GROQ_API_KEY ? new Groq({
  apiKey: process.env.GROQ_API_KEY,
}) : null;

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory } = await req.json();

    // Build conversation context for Groq
    const messages = [
      {
        role: 'system',
        content: `You are Sarah, a senior executive recruiter with 12 years of experience at top tech companies (Google, Microsoft, Amazon). You've reviewed over 50,000 resumes and know exactly what hiring managers want to see.

Your personality: Direct, encouraging, detail-oriented, and results-focused. You ask probing questions to extract measurable achievements.

YOUR RESPONSE STRATEGY:
1. If this is early in conversation: Focus on their current role/recent experience
2. If discussing experience: Dig for specific numbers, metrics, and impact
3. If they're vague: Ask for quantifiable achievements (revenue, users, efficiency gains, etc.)
4. If discussing skills: Probe for proficiency levels and real-world applications
5. If they seem ready: Guide toward resume generation

RESPONSE RULES:
- Keep responses to 2-3 sentences max
- Always ask ONE specific follow-up question
- Use phrases like "Tell me about a time when..." or "What numbers can you share about..."
- Push for concrete examples, not generic descriptions
- If they mention achievements, ask "How did you measure that impact?"

Respond as Sarah would - conversational but laser-focused on extracting resume-worthy content.`,
      },
    ];

    // Add conversation history (last 5 messages)
    conversationHistory.slice(-5).forEach((msg: any) => {
      messages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content,
      });
    });

    // Add current user message
    messages.push({
      role: 'user',
      content: message,
    });

    if (!groq) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured. Please add it to your .env.local file.' },
        { status: 500 }
      );
    }

    try {
      const completion = await groq.chat.completions.create({
        messages: messages as any,
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 300,
        top_p: 1,
      });

      const responseText = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
      return NextResponse.json({ response: responseText });
    } catch (groqError) {
      console.error('Groq API error:', groqError);
      return NextResponse.json(
        { error: 'Failed to process chat message' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}