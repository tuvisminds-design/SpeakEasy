const { extractResumeData, parseResume } = require('./resumeController');
const fs = require('fs').promises;

/**
 * Analyze resume and provide improvement suggestions
 */
function analyzeResume(parsedData, resumeText) {
  const suggestions = [];
  const improvements = {
    summary: '',
    skills: [],
    experience: [],
    education: [],
    formatting: []
  };

  // Analyze Summary/Objective
  if (!parsedData.summary || parsedData.summary.length < 50) {
    suggestions.push({
      category: 'Summary',
      issue: 'Missing or too short professional summary',
      suggestion: 'Add a compelling 2-3 sentence professional summary highlighting your key strengths and career goals.',
      priority: 'high',
      example: 'Experienced software developer with 5+ years of expertise in full-stack development, specializing in React and Node.js. Proven track record of delivering scalable web applications and leading cross-functional teams.'
    });
    improvements.summary = 'Add a professional summary that highlights your key skills, experience, and career objectives. Keep it concise (2-3 sentences) and tailored to the role you\'re applying for.';
  } else if (parsedData.summary.length < 100) {
    suggestions.push({
      category: 'Summary',
      issue: 'Summary could be more detailed',
      suggestion: 'Expand your summary to include more specific achievements and skills.',
      priority: 'medium'
    });
  }

  // Analyze Skills
  if (!parsedData.skills || parsedData.skills.length === 0) {
    suggestions.push({
      category: 'Skills',
      issue: 'No skills section found',
      suggestion: 'Add a dedicated skills section listing technical and soft skills relevant to your target role.',
      priority: 'high',
      example: 'Technical Skills: JavaScript, React, Node.js, Python, SQL, MongoDB\nSoft Skills: Leadership, Communication, Problem Solving, Team Collaboration'
    });
  } else if (parsedData.skills.length < 5) {
    suggestions.push({
      category: 'Skills',
      issue: 'Limited skills listed',
      suggestion: 'Consider adding more relevant skills, including both technical and soft skills.',
      priority: 'medium'
    });
  }

  // Check for action verbs in experience
  const actionVerbs = ['developed', 'created', 'implemented', 'designed', 'managed', 'led', 'improved', 'optimized', 'achieved', 'delivered'];
  const lowerText = resumeText.toLowerCase();
  const hasActionVerbs = actionVerbs.some(verb => lowerText.includes(verb));
  
  if (!hasActionVerbs) {
    suggestions.push({
      category: 'Experience',
      issue: 'Experience descriptions lack action verbs',
      suggestion: 'Start each bullet point with strong action verbs (e.g., "Developed", "Led", "Implemented") to make your achievements more impactful.',
      priority: 'high',
      example: 'Instead of: "Worked on a project"\nUse: "Developed and deployed a scalable web application serving 10,000+ users"'
    });
  }

  // Check for quantifiable achievements
  const hasNumbers = /\d+/.test(resumeText);
  if (!hasNumbers) {
    suggestions.push({
      category: 'Experience',
      issue: 'Missing quantifiable achievements',
      suggestion: 'Add specific numbers, percentages, or metrics to demonstrate your impact (e.g., "Increased sales by 25%", "Managed team of 5 developers").',
      priority: 'high',
      example: 'Instead of: "Improved website performance"\nUse: "Improved website load time by 40%, resulting in 30% increase in user engagement"'
    });
  }

  // Check for contact information
  const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(resumeText);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
  
  if (!hasEmail || !hasPhone) {
    suggestions.push({
      category: 'Contact Information',
      issue: 'Missing contact information',
      suggestion: 'Ensure your resume includes a professional email address and phone number.',
      priority: 'high'
    });
  }

  // Formatting suggestions
  if (resumeText.length > 2000) {
    suggestions.push({
      category: 'Formatting',
      issue: 'Resume may be too long',
      suggestion: 'Keep your resume to 1-2 pages. Focus on the most relevant and recent experiences.',
      priority: 'medium'
    });
  }

  // Generate improved summary if missing
  if (!parsedData.summary || parsedData.summary.length < 50) {
    const skillsList = parsedData.skills && parsedData.skills.length > 0 
      ? parsedData.skills.slice(0, 3).join(', ')
      : 'your skills';
    improvements.summary = `Experienced professional with expertise in ${skillsList}. Seeking opportunities to leverage my skills and contribute to innovative projects.`;
  }

  // Suggest additional skills based on common industry standards
  const commonSkills = ['Communication', 'Problem Solving', 'Teamwork', 'Time Management', 'Leadership'];
  const missingSkills = commonSkills.filter(skill => 
    !parsedData.skills || !parsedData.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
  );
  
  if (missingSkills.length > 0) {
    improvements.skills = missingSkills.slice(0, 3);
  }

  return {
    suggestions,
    improvements,
    score: calculateResumeScore(parsedData, resumeText, suggestions)
  };
}

/**
 * Calculate resume quality score
 */
function calculateResumeScore(parsedData, resumeText, suggestions) {
  let score = 100;
  
  // Deduct points for each issue
  suggestions.forEach(suggestion => {
    if (suggestion.priority === 'high') {
      score -= 15;
    } else if (suggestion.priority === 'medium') {
      score -= 10;
    } else {
      score -= 5;
    }
  });
  
  // Bonus points
  if (parsedData.skills && parsedData.skills.length >= 10) score += 5;
  if (resumeText.length >= 500 && resumeText.length <= 2000) score += 5;
  if (/\d+/.test(resumeText)) score += 5; // Has numbers
  
  return Math.max(0, Math.min(100, score));
}

module.exports = {
  analyzeResume,
  calculateResumeScore
};

