# 🚀 HireByte

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/Jeeban-2006/HireByte2?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/Jeeban-2006/HireByte2?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/Jeeban-2006/HireByte2?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

**An AI-Powered ATS-Friendly Resume Builder with Real-Time Analysis**

Build professional resumes with AI assistance and instant ATS compatibility scoring

[Live Demo](https://hirebyte.vercel.app) • [Documentation](https://github.com/Jeeban-2006/HireByte2#readme) • [Report Bug](https://github.com/Jeeban-2006/HireByte2/issues)

</div>

---

## ✨ Features

### 🎯 Core Capabilities
- **🤖 Dual AI Integration** - Groq (Llama 3.3 70B) + Google Gemini 2.0 Flash for intelligent resume analysis
- **📊 Real-Time ATS Scoring** - Instant compatibility analysis with detailed feedback
- ** Multi-Page Preview** - Live page count with smooth navigation controls
- **🌙 Dark/Light Mode** - Seamless theme switching with full compatibility
- **🎬 Smooth Animations** - Framer Motion powered transitions and interactions
- **📱 Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- **💾 Auto-Save** - Local storage keeps your work safe automatically

### 🚀 Advanced Features
- **📄 Universal PDF Support** - 3-tier extraction system (pdf2json → pdf-parse → OCR with Tesseract.js)
- **🎯 Smart PDF Export** - React-PDF renderer with ATS-optimized formatting
- **🔍 Keyword Optimization** - AI-powered analysis for job description matching
- **📈 Semantic Analysis** - HuggingFace embeddings for resume-job alignment
- **🎨 Customizable Sections** - Personal info, experience, skills, projects, education, certifications, and more
- **🖱️ Drag-and-Drop** - Reorder resume sections with smooth animations
- **💬 AI Chat Assistant** - Interactive suggestions for resume improvements
- **📋 Copy to Clipboard** - Quick sharing of suggestions and content

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16.1.6 with Turbopack |
| **Language** | TypeScript 5+ |
| **UI Library** | React 19.0.2 |
| **Styling** | Tailwind CSS 3.4+ |
| **Animations** | Framer Motion 11+ |
| **UI Components** | Radix UI + shadcn/ui |
| **AI - Primary** | Groq SDK (Llama 3.3 70B) |
| **AI - Fallback** | Google Gemini 2.0 Flash |
| **AI - Embeddings** | HuggingFace Inference API |
| **PDF Extraction** | pdf2json, pdf-parse, Tesseract.js |
| **PDF Generation** | @react-pdf/renderer 4.2+ |
| **PDF Processing** | pdfjs-dist 4.9+ |
| **Drag & Drop** | @dnd-kit 6+ |
| **Forms** | React Hook Form + Zod |
| **Icons** | Lucide React |
| **Hosting** | Vercel |

---

## 📂 Project Structure

```
HireByte2/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing page with animated hero
│   │   ├── layout.tsx                  # Root layout with SEO metadata
│   │   ├── resume-page.tsx             # Main resume builder page
│   │   ├── globals.css                 # Global styles and theme
│   │   ├── not-found.tsx               # 404 error page
│   │   ├── sitemap.ts                  # Dynamic sitemap generation
│   │   ├── resume-parser/              # Resume parsing demo
│   │   └── api/
│   │       └── ai/
│   │           ├── analyze-ats/        # ATS scoring endpoint
│   │           ├── chat/               # AI chat assistant
│   │           ├── extract-text/       # PDF text extraction
│   │           └── generate-resume/    # AI resume generation
│   ├── components/
│   │   ├── layout/
│   │   │   ├── hero-section.tsx        # Animated landing hero
│   │   │   ├── footer.tsx              # Footer with credits
│   │   │   ├── ats-testing-section.tsx # ATS analysis interface
│   │   │   └── resume-builder-section.tsx
│   │   ├── resume-builder.tsx          # Main resume editor
│   │   ├── resume-preview.tsx          # Multi-page live preview
│   │   ├── resume-pdf.tsx              # PDF document renderer
│   │   ├── resume-download-button.tsx  # PDF export button
│   │   ├── ai-resume-dialog.tsx        # AI generation dialog
│   │   ├── draggable-resume-builder.tsx# Drag-and-drop wrapper
│   │   ├── theme-toggle.tsx            # Dark/light mode switcher
│   │   └── ui/                         # 40+ shadcn/ui components
│   ├── lib/
│   │   ├── ai-service.ts               # AI integration layer
│   │   ├── ai-utils.ts                 # AI helper functions
│   │   ├── api-config.ts               # API configuration
│   │   ├── resume-text-extractor.ts    # 3-tier PDF extraction
│   │   ├── resume-template.ts          # Resume templates
│   │   ├── file-utils.ts               # File handling utilities
│   │   ├── types.ts                    # TypeScript definitions
│   │   └── utils.ts                    # General utilities
│   └── hooks/
│       ├── use-toast.ts                # Toast notifications
│       ├── use-mobile.tsx              # Responsive detection
│       └── use-smooth-scroll.ts        # Smooth scrolling
├── public/
│   ├── resume.png                      # Resume preview image
│   ├── manifest.json                   # PWA manifest
│   ├── robots.txt                      # SEO configuration
│   └── pdf.worker.min.mjs              # PDF.js worker
├── docs/
│   ├── blueprint.md                    # Project blueprint
│   └── SEO-CHECKLIST.md               # SEO guidelines
├── patches/                            # Package patches
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** or **yarn**
- **AI API Keys** (at least one):
  - Groq API Key (Recommended - Free tier available)
  - Google Gemini API Key (Fallback)
  - HuggingFace API Key (Optional - for embeddings)

### Installation

```bash
# Clone the repository
git clone https://github.com/Jeeban-2006/HireByte2.git
cd HireByte2

# Install dependencies
npm install
```

### Environment Configuration

Create a `.env.local` file in the root directory:

```env
# AI Configuration - Groq (Primary)
GROQ_API_KEY=your_groq_api_key_here

# AI Configuration - Google Gemini (Fallback)
GOOGLE_GEMINI_API_KEY=your_gemini_key_here

# AI Configuration - HuggingFace (Optional for embeddings)
HUGGINGFACE_API_KEY=your_huggingface_key_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:9002
NEXT_PUBLIC_SITE_NAME=HireByte
NEXT_PUBLIC_SITE_DESCRIPTION=AI-powered resume builder and ATS compatibility checker

# Optional - Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS=
GOOGLE_SITE_VERIFICATION=

# Optional - Social Media
NEXT_PUBLIC_TWITTER_HANDLE=@hirebyte
NEXT_PUBLIC_LINKEDIN_URL=
```

### Get Your API Keys

#### Groq (Primary AI - Free)
1. Visit [console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Generate an API key
4. Free tier: 30 requests/minute

#### Google Gemini (Fallback AI - Free)
1. Visit [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Free tier: 1,500 requests/day

#### HuggingFace (Optional - Free)
1. Visit [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Create a read token
3. Used for semantic embeddings

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 📖 Usage Guide

### 1. Building Your Resume

1. Navigate to the resume builder
2. Fill in your information:
   - Personal details (name, email, phone, location)
   - Professional summary
   - Work experience
   - Skills (technical and soft skills)
   - Education
   - Projects
   - Certifications
   - Awards
3. Watch the live preview update in real-time
4. Your progress is automatically saved

### 2. Multi-Page Preview

The preview automatically shows how many pages your resume will be:

- **Page Counter**: Displays current page and total pages
- **Navigation**: Use Previous/Next buttons to browse pages
- **Real-Time Updates**: Page count updates as you edit
- **Smooth Transitions**: Animated page switching

### 3. PDF Export

1. Complete your resume content
2. Review the multi-page preview
3. Click **"Download PDF"** button
4. PDF is generated with ATS-friendly formatting
5. Maintains exact layout from preview

### 4. ATS Compatibility Testing

1. Click on the **ATS Testing** section
2. Upload your resume PDF or paste content
3. Add the job description you're applying for
4. Click **"Analyze Resume"**
5. Get instant results:
   - Overall ATS score (0-100)
   - Detailed strengths analysis
   - Identified weaknesses
   - Actionable improvement suggestions
6. View detailed suggestions inline
7. Copy suggestions to clipboard

### 5. AI-Powered Features

#### Resume Generation
- Click **"Generate with AI"**
- Provide job title and brief description
- AI creates professional content instantly

#### Smart Suggestions
- Real-time keyword optimization
- Semantic analysis for job matching
- Professional writing improvements

#### AI Chat Assistant
- Ask questions about resume best practices
- Get personalized advice
- Improve specific sections

---

## 🎨 Features Deep Dive

### Framer Motion Animations

**Implemented Throughout:**
- Staggered entrance animations on hero section
- Scroll-triggered animations (whileInView)
- Smooth page transitions
- Interactive micro-animations

**Example Usage:**
```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Your content here
</motion.div>
```

### Multi-Page Preview System

**Technical Details:**
- A4 page size: 1123px height at 96 DPI
- Content calculation: 1100px per page threshold
- Debounced updates: 300ms for performance
- Transform-based navigation for smooth scrolling

**Implementation:**
```tsx
const pageCount = Math.ceil(contentHeight / 1100);
const transform = `translateY(-${(currentPage - 1) * 1123}px)`;
```

### Universal PDF Text Extraction

**3-Tier Intelligent System:**

**Strategy 1: pdf2json (Fast)**
- Processes 80% of standard PDFs
- Lightning-fast extraction
- Best for text-based PDFs

**Strategy 2: pdf-parse (Robust)**
- Fallback for complex PDFs
- Handles encrypted documents
- Better for multi-column layouts

**Strategy 3: OCR with Tesseract.js (Universal)**
- For scanned/image-based PDFs
- Photo-captured resumes
- 30-60 seconds processing time
- 99% success rate overall

**Supported PDF Types:**
- ✅ Standard text PDFs
- ✅ Encrypted/password-protected PDFs
- ✅ Scanned documents
- ✅ Photo-captured resumes
- ✅ Image-based PDFs
- ✅ Multi-column layouts

### Dark/Light Mode

- System preference detection
- Manual toggle available
- Full compatibility across all components
- Smooth transitions
- Persisted user preference

---

## 🔧 API Reference

### AI Service Integration

```typescript
import { analyzeResumeWithAI } from '@/lib/ai-service';

// Analyze resume against job description
const result = await analyzeResumeWithAI(resumeText, jobDescription);

// Response structure
{
  score: number;        // 0-100
  feedback: string;     // Detailed analysis
  provider: 'groq' | 'gemini';
  keywords: string[];
  suggestions: string[];
}
```

### PDF Text Extraction

```typescript
import { extractTextFromPDF } from '@/lib/resume-text-extractor';

const text = await extractTextFromPDF(file);
// Automatically tries all 3 strategies
```

---

## 🧪 Testing

### PDF Upload Testing
1. Test with various PDF types
2. Check extraction method in console
3. Verify text accuracy
4. Test OCR with scanned PDFs (30-60s expected)

### ATS Analysis Testing
1. Upload sample resume
2. Use realistic job description
3. Verify score range (0-100)
4. Check feedback quality
5. Test with multiple resume types

### Responsive Testing
1. Test on mobile devices
2. Verify animations on low-power devices
3. Check touch interactions
4. Validate form inputs

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

**Environment Variables:**
1. Go to your project settings on Vercel
2. Add all environment variables from `.env.local`
3. Redeploy if needed

### Deploy to Netlify

```bash
# Build the project
npm run build

# Deploy
netlify deploy --prod
```

### Environment Variables for Production

Make sure to add all required environment variables to your hosting platform:
- `GROQ_API_KEY`
- `GOOGLE_GEMINI_API_KEY` (optional)
- `HUGGINGFACE_API_KEY` (optional)
- All `NEXT_PUBLIC_*` variables

---

## 🐛 Troubleshooting

### PDF Download Issues
**Issue**: PDF not generating or formatting incorrect
**Solutions**:
- ✅ Check browser console for errors
- ✅ Ensure all required fields are filled
- ✅ Try with shorter content first
- ✅ Verify React-PDF dependencies are installed

### AI Analysis Errors
**Issue**: ATS scoring fails or returns errors
**Solutions**:
- ✅ Verify API keys in `.env.local`
- ✅ Check API rate limits (Groq: 30/min)
- ✅ Ensure fallback to Gemini is working
- ✅ Check terminal logs for specific errors

### PDF Extraction Fails
**Issue**: Uploaded PDF text not extracted
**Solutions**:
- ✅ Check PDF file is not corrupted
- ✅ Wait for OCR processing (up to 60s for scanned PDFs)
- ✅ Check browser console for extraction method used
- ✅ Verify PDF is not protected with DRM

### Build Errors
**Issue**: Project fails to build or start
**Solutions**:
```bash
# Clear all caches and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

### Page Preview Not Updating
**Issue**: Page count or navigation not working
**Solutions**:
- ✅ Check if content has sufficient height
- ✅ Verify framer-motion is installed
- ✅ Clear browser cache
- ✅ Check for JavaScript errors in console

---

## 📊 Performance Optimization

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Components loaded on demand
- **Debouncing**: Input and resize events debounced
- **Memoization**: React.memo and useMemo for expensive operations
- **Bundle Analysis**: Monitor bundle size with `npm run build`

---

## 🔒 Security

- No passwords or sensitive data stored
- API keys kept server-side only
- Client-side data encrypted in localStorage
- No email functionality to prevent data leakage
- PDF processing done client-side when possible

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Contribution Guidelines
- Follow the existing code style
- Add comments for complex logic
- Update documentation for new features
- Test thoroughly before submitting
- Keep PRs focused on a single feature

---

## 👥 Creators

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Jeeban-2006">
        <img src="https://github.com/Jeeban-2006.png" width="100px;" alt="Jeeban Krushna Sahu"/>
        <br />
        <sub><b>Jeeban Krushna Sahu</b></sub>
      </a>
      <br />
      <a href="https://www.linkedin.com/in/jeeban-krushna-sahu/">LinkedIn</a> • 
      <a href="https://github.com/Jeeban-2006">GitHub</a>
    </td>
    <td align="center">
      <a href="https://github.com/Abhijxxt14">
        <img src="https://github.com/Abhijxxt14.png" width="100px;" alt="Abhijeet Soren"/>
        <br />
        <sub><b>Abhijeet Soren</b></sub>
      </a>
      <br />
      <a href="https://github.com/Abhijxxt14">GitHub</a>
    </td>
  </tr>
</table>

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Radix UI](https://www.radix-ui.com/) - Unstyled UI primitives
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components
- [Groq](https://groq.com/) - Lightning-fast AI inference
- [Google Gemini](https://ai.google.dev/) - Powerful AI model
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide](https://lucide.dev/) - Beautiful icons
- [Vercel](https://vercel.com/) - Deployment platform

---

## 💬 Support & Contact

- 🐛 **Bug Reports**: [Open an issue](https://github.com/Jeeban-2006/HireByte2/issues)
- 💡 **Feature Requests**: [Start a discussion](https://github.com/Jeeban-2006/HireByte2/discussions)
- ⭐ **Show Support**: [Give us a star](https://github.com/Jeeban-2006/HireByte2)
- 📧 **Contact**: Create an issue for questions

---

## 🗺️ Roadmap

- [ ] Multi-language support (i18n)
- [ ] Resume templates library
- [ ] LinkedIn profile import
- [ ] Cover letter generator
- [ ] Interview question generator
- [ ] Resume versioning system
- [ ] Team collaboration features
- [ ] Mobile app (React Native)
- [ ] Browser extension
- [ ] Advanced analytics dashboard

---

<div align="center">

**Built with ❤️ by [Jeeban Krushna Sahu](https://github.com/Jeeban-2006) and [Abhijeet Soren](https://github.com/Abhijxxt14)**

⭐ Star us on GitHub — it motivates us a lot!

[Website](https://hirebyte.vercel.app) • [GitHub](https://github.com/Jeeban-2006/HireByte2) • [Issues](https://github.com/Jeeban-2006/HireByte2/issues)

</div>
