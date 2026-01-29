import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = process.env.GROQ_API_KEY ? new Groq({
  apiKey: process.env.GROQ_API_KEY,
}) : null;

export async function POST(req: NextRequest) {
  try {
    const { resumeText } = await req.json();

    if (!resumeText) {
      return NextResponse.json(
        { error: 'Resume text is required' },
        { status: 400 }
      );
    }

    if (!groq) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const parsePrompt = `You are an expert resume parser. Extract structured information from the following resume text and return it as a valid JSON object.

RESUME TEXT:
${resumeText}

INSTRUCTIONS:
1. Extract ALL information present in the resume
2. Return ONLY valid JSON (no markdown, no code blocks, no explanations)
3. If a field is not present, use empty string "" or empty array []
4. For dates, preserve the format from the resume
5. For experience/education/projects, generate unique IDs using format "item-1", "item-2", etc.

REQUIRED JSON STRUCTURE:
{
  "personalInfo": {
    "name": "extracted name",
    "email": "extracted email",
    "phone": "extracted phone",
    "address": "extracted address/location",
    "linkedin": "linkedin URL or empty",
    "portfolio": "portfolio URL or empty",
    "github": "github URL or empty"
  },
  "summary": "professional summary or objective section",
  "experience": [
    {
      "id": "exp-1",
      "jobTitle": "position title",
      "company": "company name",
      "location": "work location",
      "startDate": "start date",
      "endDate": "end date or Present",
      "description": "full job description with bullet points"
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "school": "institution name",
      "degree": "degree name",
      "location": "school location",
      "graduationDate": "graduation date",
      "grade": "GPA or percentage"
    }
  ],
  "skills": ["skill1", "skill2", "skill3"],
  "projects": [
    {
      "id": "proj-1",
      "name": "project name",
      "description": "project description",
      "link": "project URL or empty"
    }
  ],
  "certifications": [
    {
      "id": "cert-1",
      "name": "certification name",
      "authority": "issuing authority",
      "date": "issue date",
      "link": "credential URL or empty"
    }
  ],
  "awards": [
    {
      "id": "award-1",
      "name": "award name",
      "link": "award URL or empty"
    }
  ],
  "volunteerExperience": [
    {
      "id": "vol-1",
      "role": "volunteer role",
      "organization": "organization name",
      "dates": "volunteer dates",
      "description": "description of volunteer work"
    }
  ],
  "languages": [
    {
      "id": "lang-1",
      "name": "language name",
      "proficiency": "proficiency level"
    }
  ]
}

Extract and return ONLY the JSON object now:`;

    console.log('🔄 Parsing resume with Groq API...');
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a precise resume parser. Return ONLY valid JSON with no additional text, markdown formatting, or code blocks.',
        },
        {
          role: 'user',
          content: parsePrompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      max_tokens: 4000,
    });

    let responseText = completion.choices[0]?.message?.content || '{}';
    
    // Clean up the response - remove markdown code blocks if present
    responseText = responseText.trim();
    if (responseText.startsWith('```json')) {
      responseText = responseText.replace(/^```json\s*/, '').replace(/```\s*$/, '');
    } else if (responseText.startsWith('```')) {
      responseText = responseText.replace(/^```\s*/, '').replace(/```\s*$/, '');
    }
    
    // Parse the JSON
    const parsedResume = JSON.parse(responseText);
    
    console.log('✅ Resume parsing successful');

    return NextResponse.json({
      success: true,
      data: parsedResume,
    });

  } catch (error: any) {
    console.error('❌ Resume parsing failed:', error);
    
    // If JSON parsing failed, try to extract what we can
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Resume parsing failed' },
      { status: 500 }
    );
  }
}
