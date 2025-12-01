const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs').promises;
const path = require('path');

/**
 * Parse resume file (PDF or DOCX)
 */
async function parseResume(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  let text = '';
  
  if (ext === '.pdf') {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    text = data.text;
  } else if (ext === '.docx' || ext === '.doc') {
    const result = await mammoth.extractRawText({ path: filePath });
    text = result.value;
  } else {
    throw new Error('Unsupported file format');
  }

  // Extract information from resume text
  const parsedData = extractResumeData(text);
  return parsedData;
}

/**
 * Extract structured data from resume text
 */
function extractResumeData(text) {
  const data = {
    skills: [],
    experience: [],
    education: [],
    summary: ''
  };

  // Extract skills (common keywords)
  const skillKeywords = [
    'javascript', 'python', 'java', 'react', 'node', 'sql', 'mongodb',
    'html', 'css', 'typescript', 'angular', 'vue', 'express', 'aws',
    'docker', 'kubernetes', 'git', 'agile', 'scrum', 'leadership',
    'communication', 'problem solving', 'teamwork', 'project management'
  ];

  const lowerText = text.toLowerCase();
  skillKeywords.forEach(skill => {
    if (lowerText.includes(skill)) {
      data.skills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
    }
  });

  // Extract email
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  if (emailMatch) {
    data.email = emailMatch[0];
  }
  
  // Extract phone (multiple formats)
  const phonePatterns = [
    /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/, // Standard US format
    /\+?\d{10,15}/, // International format
    /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/ // Simple format
  ];
  
  for (const pattern of phonePatterns) {
    const phoneMatch = text.match(pattern);
    if (phoneMatch) {
      data.phone = phoneMatch[0].trim();
      break;
    }
  }

  // Extract name (typically first 1-3 lines of resume)
  const lines = text.split('\n').filter(line => line.trim());
  
  if (lines.length > 0) {
    // First line is usually the name
    const firstLine = lines[0].trim();
    // Remove common prefixes/suffixes
    const cleanName = firstLine.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.)\s+/i, '').trim();
    
    // Split name into parts
    const nameParts = cleanName.split(/\s+/).filter(part => part.length > 0);
    
    if (nameParts.length >= 2) {
      // Assume first part is first name, last part is last name
      data.firstName = nameParts[0];
      data.lastName = nameParts.slice(1).join(' '); // Handle middle names
    } else if (nameParts.length === 1) {
      // Only one name found, use as first name
      data.firstName = nameParts[0];
      data.lastName = '';
    }
    
    // Try to extract summary (first paragraph after name)
    if (lines.length > 1) {
      const summaryLines = lines.slice(1, 4).filter(line => {
        // Skip lines that look like contact info
        const lowerLine = line.toLowerCase();
        return !lowerLine.includes('@') && 
               !lowerLine.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/) &&
               !lowerLine.includes('phone') &&
               !lowerLine.includes('email') &&
               line.length > 20;
      });
      if (summaryLines.length > 0) {
        data.summary = summaryLines.join(' ').substring(0, 200);
      }
    }
  }

  return data;
}

module.exports = {
  parseResume,
  extractResumeData
};

