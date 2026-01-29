import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/layout/ThemeProvider';

export const metadata: Metadata = {
  title: {
    default: 'HireByte - Free AI Resume Builder & ATS Score Checker | Optimize Your Resume',
    template: '%s | HireByte - AI Resume Tools'
  },
  description: 'Create professional ATS-friendly resumes with HireByte\'s free AI-powered resume builder. Get instant ATS compatibility scores, AI suggestions, and optimize your resume to pass applicant tracking systems. Build, analyze, and download your perfect resume today.',
  keywords: [
    'resume builder',
    'free resume builder',
    'ATS checker',
    'ATS score checker',
    'resume optimization',
    'ATS friendly resume',
    'AI resume builder',
    'applicant tracking system',
    'resume templates',
    'professional resume maker',
    'online resume builder',
    'resume analyzer',
    'job application tools',
    'career tools',
    'resume scoring',
    'resume parser',
    'CV builder',
    'job search tools',
    'resume editor',
    'resume creator'
  ],
  authors: [{ name: 'HireByte Team' }],
  creator: 'HireByte',
  publisher: 'HireByte',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://hirebyte.netlify.app'),
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://hirebyte.netlify.app',
    siteName: 'HireByte - AI Resume Builder',
    title: 'Free AI Resume Builder & ATS Score Checker | HireByte',
    description: 'Create ATS-friendly resumes with AI assistance. Free resume builder with instant ATS scoring, professional templates, and AI-powered optimization. Build your perfect resume in minutes.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HireByte - Free AI Resume Builder and ATS Compatibility Checker'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Resume Builder & ATS Checker | HireByte',
    description: 'Build ATS-friendly resumes with AI assistance. Get instant ATS scores, professional templates, and optimization tips. 100% free resume builder.',
    images: ['/og-image.jpg'],
    creator: '@hirebyte',
    site: '@hirebyte'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || 'https://hirebyte.netlify.app'} />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'HireByte - AI Resume Builder',
              description: 'Free AI-powered resume builder and ATS compatibility checker. Create professional, ATS-friendly resumes with instant scoring and AI suggestions.',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://hirebyte.netlify.app',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'All',
              browserRequirements: 'Requires JavaScript. Requires HTML5.',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock'
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '1250',
                bestRating: '5',
                worstRating: '1'
              },
              featureList: [
                'AI-Powered Resume Builder',
                'ATS Compatibility Checker',
                'Real-time ATS Score Analysis',
                'Professional Resume Templates',
                'AI Resume Suggestions',
                'PDF Resume Export',
                'Resume Optimization Tips',
                'Free Resume Parser'
              ],
              screenshot: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hirebyte.netlify.app'}/og-image.jpg`,
              author: {
                '@type': 'Organization',
                name: 'HireByte',
                url: process.env.NEXT_PUBLIC_SITE_URL || 'https://hirebyte.netlify.app'
              },
              potentialAction: {
                '@type': 'UseAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: process.env.NEXT_PUBLIC_SITE_URL || 'https://hirebyte.netlify.app',
                  actionPlatform: [
                    'http://schema.org/DesktopWebPlatform',
                    'http://schema.org/MobileWebPlatform'
                  ]
                }
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'What is an ATS and why is it important for my resume?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'An Applicant Tracking System (ATS) is software used by employers to filter and rank resumes before they reach human recruiters. Over 90% of large companies use ATS. HireByte helps you optimize your resume to pass ATS screening and increase your chances of getting interviews.'
                  }
                },
                {
                  '@type': 'Question',
                  name: 'Is HireByte resume builder really free?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! HireByte is completely free to use. You can build unlimited resumes, check ATS scores, get AI suggestions, and download your resume as PDF without any cost or credit card required.'
                  }
                },
                {
                  '@type': 'Question',
                  name: 'How does the ATS score checker work?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'HireByte analyzes your resume against job descriptions using AI to calculate an ATS compatibility score. It checks for formatting issues, keyword optimization, section structure, and provides actionable suggestions to improve your score.'
                  }
                },
                {
                  '@type': 'Question',
                  name: 'Can I edit my resume after creating it?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Absolutely! HireByte provides a user-friendly resume builder where you can add, edit, or remove sections at any time. Your changes are reflected in real-time in the preview and PDF export.'
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
