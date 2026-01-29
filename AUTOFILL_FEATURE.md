# Resume Autofill Feature

## Overview
When a user uploads their resume to check the ATS score, they can now click the **"Autofill Resume Builder"** button to automatically populate the resume builder with their existing resume content.

## How It Works

### 1. **Upload & Parse**
- User uploads their resume (PDF/Word) in the ATS Testing Section
- The resume text is extracted using the existing PDF parsing functionality

### 2. **Intelligent Parsing**
- When user clicks "Autofill Resume Builder", the resume text is sent to `/api/ai/parse-resume`
- The API uses Groq AI (LLaMA 3.3 70B) to intelligently parse the resume into structured data
- The AI extracts:
  - **Personal Info**: name, email, phone, address, LinkedIn, portfolio, GitHub
  - **Summary**: professional summary or objective
  - **Experience**: job title, company, location, dates, description
  - **Education**: school, degree, location, graduation date, GPA
  - **Skills**: array of technical and soft skills
  - **Projects**: project name, description, links
  - **Certifications**: certification name, authority, date
  - **Awards**: award names and links
  - **Volunteer Experience**: role, organization, dates, description
  - **Languages**: language name and proficiency level

### 3. **Smart Mapping**
- The parsed data is intelligently mapped to the resume builder fields
- Each section goes to its corresponding place in the builder:
  - Contact info → Personal Info section
  - Work history → Experience section
  - Academic background → Education section
  - Technical abilities → Skills section
  - Portfolio items → Projects section
  - And so on...

### 4. **Seamless Experience**
- After autofill completes, the page automatically scrolls to the Resume Builder
- User sees their resume pre-populated and ready to edit
- All data is preserved in localStorage for later sessions

## Technical Implementation

### Files Modified:

1. **`src/app/api/ai/parse-resume/route.ts`** (NEW)
   - API endpoint for parsing resume text into structured JSON
   - Uses Groq AI for intelligent extraction
   - Returns structured Resume object

2. **`src/components/layout/ATSTestingSection.tsx`**
   - Added `onAutofillResume` prop for callback
   - Added "Autofill Resume Builder" button
   - Handles autofill loading state
   - Shows success toast and scrolls to builder

3. **`src/app/page.tsx`**
   - Added ref to ResumeBuilderSection
   - Added `handleAutofillFromATS` function
   - Connects ATS section to Resume Builder

4. **`src/components/resume/ResumeBuilderSection.tsx`**
   - Converted to forwardRef component
   - Exposed `handleAutofill` method via useImperativeHandle
   - Merges parsed data with existing resume data

## User Flow

```
┌─────────────────────────────────────┐
│  1. Upload Resume to ATS Section   │
│     (PDF, Word, or paste text)      │
└───────────────┬─────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│  2. Click "Autofill Resume Builder" │
└───────────────┬─────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│  3. AI Parses Resume Structure      │
│     (extracts all sections)         │
└───────────────┬─────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│  4. Resume Builder Auto-Populated   │
│     (all fields filled correctly)   │
└───────────────┬─────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│  5. User Edits & Customizes         │
│     (fine-tune and download)        │
└─────────────────────────────────────┘
```

## Benefits

- ✅ **Saves Time**: No manual re-entry of information
- ✅ **Reduces Errors**: AI accurately extracts data
- ✅ **Smart Mapping**: Right data goes to right place
- ✅ **Seamless UX**: Smooth transition between sections
- ✅ **Preserves Data**: Existing data is safely merged

## Requirements

- GROQ_API_KEY must be set in `.env.local`
- Uses LLaMA 3.3 70B model for parsing
- Resume must have extractable text (not scanned images)
