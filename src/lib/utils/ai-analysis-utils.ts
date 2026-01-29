/**
 * Utility functions for ATS scoring using embeddings and semantic similarity
 */

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
}

/**
 * Extract keywords from text (simple implementation)
 */
export function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));

  // Count frequency
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  // Return unique words sorted by frequency
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word);
}

/**
 * Calculate keyword match percentage between resume and job description
 */
export function calculateKeywordMatch(
  resumeText: string,
  jobDescription: string
): number {
  const resumeKeywords = new Set(extractKeywords(resumeText));
  const jobKeywords = extractKeywords(jobDescription);

  if (jobKeywords.length === 0) return 0;

  let matches = 0;
  jobKeywords.forEach(keyword => {
    if (resumeKeywords.has(keyword)) {
      matches++;
    }
  });

  return (matches / jobKeywords.length) * 100;
}

/**
 * Extract technical skills from text
 */
export function extractTechnicalSkills(text: string): string[] {
  const skillPatterns = [
    // Programming languages
    /\b(javascript|typescript|python|java|c\+\+|c#|ruby|go|rust|swift|kotlin|php|scala|r)\b/gi,
    // Frameworks & Libraries
    /\b(react|angular|vue|next\.?js|node\.?js|express|django|flask|spring|laravel|rails)\b/gi,
    // Databases
    /\b(mongodb|postgresql|mysql|redis|elasticsearch|dynamodb|cassandra|oracle)\b/gi,
    // Cloud & DevOps
    /\b(aws|azure|gcp|docker|kubernetes|jenkins|terraform|ansible|git|github|gitlab)\b/gi,
    // Tools & Technologies
    /\b(rest|graphql|api|microservices|ci\/cd|agile|scrum|jira|webpack|babel)\b/gi,
  ];

  const skills = new Set<string>();
  
  skillPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => skills.add(match.toLowerCase()));
    }
  });

  return Array.from(skills);
}

/**
 * Calculate skill match percentage
 */
export function calculateSkillMatch(
  resumeText: string,
  jobDescription: string
): number {
  const resumeSkills = new Set(extractTechnicalSkills(resumeText));
  const jobSkills = extractTechnicalSkills(jobDescription);

  if (jobSkills.length === 0) return 100; // No specific skills required

  let matches = 0;
  jobSkills.forEach(skill => {
    if (resumeSkills.has(skill)) {
      matches++;
    }
  });

  return (matches / jobSkills.length) * 100;
}

/**
 * Normalize vector to unit length
 */
export function normalizeVector(vec: number[]): number[] {
  const magnitude = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
  return magnitude === 0 ? vec : vec.map(val => val / magnitude);
}