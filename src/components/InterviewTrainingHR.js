import React, { useState, useCallback, useRef } from 'react';
import { Mic, MicOff, Volume2, Pause, ArrowRight, Sparkles, Target, CheckCircle, Loader2, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import deepgramVoiceAgent from '../services/deepgramVoiceAgent';
import MicoCharacter from './MicoCharacter';

const InterviewTrainingHR = ({ candidate, setActivePage }) => {
  const [topic, setTopic] = useState('');
  const [speechStructure, setSpeechStructure] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  
  // Voice states
  const [isListening, setIsListening] = useState(false);
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);
  const [playingSectionIndex, setPlayingSectionIndex] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [voiceError, setVoiceError] = useState(null);
  const currentAudioRef = useRef(null);
  const sttInitializedRef = useRef(false);

  // Common interview questions
  const interviewQuestions = [
    "Tell me about yourself",
    "Why do you want this job?",
    "What are your strengths?",
    "Describe a challenging project",
    "Where do you see yourself in 5 years?",
    "Why should we hire you?",
    "How do you handle pressure?",
    "What is your greatest achievement?",
    "What are your weaknesses?",
    "How do you work in a team?"
  ];

  // Handle STT transcript
  const handleTranscript = useCallback((text, isFinal) => {
    setTranscript(text);
    if (isFinal && text.trim()) {
      setTopic(prev => prev ? `${prev} ${text}` : text);
      setTranscript('');
    }
  }, []);

  // Handle STT errors
  const handleSTTError = useCallback((error) => {
    console.error('❌ STT Error:', error);
    
    // Provide user-friendly error message
    let userMessage = error.message || 'Failed to initialize voice input.';
    
    if (error.message && error.message.includes('1006')) {
      userMessage = 'Deepgram connection failed. Please check:\n\n' +
        '1. Your API key has WebSocket permissions enabled\n' +
        '2. Visit https://console.deepgram.com/ to verify your key\n' +
        '3. You may need to regenerate your API key with full permissions\n\n' +
        'Note: Voice input is optional - you can still type your questions.';
    }
    
    setVoiceError(userMessage);
    setIsListening(false);
    sttInitializedRef.current = false;
  }, []);

  // Start voice input
  const startVoiceInput = useCallback(async () => {
    try {
      setVoiceError(null);
      setIsListening(true);
      
      if (!sttInitializedRef.current) {
        await deepgramVoiceAgent.initializeSTT(handleTranscript, handleSTTError);
        sttInitializedRef.current = true;
      }
      
      await new Promise(resolve => setTimeout(resolve, 200));
      deepgramVoiceAgent.startListening();
    } catch (error) {
      console.error('Error in startVoiceInput:', error);
      setVoiceError(error.message || 'Failed to start voice input.');
      setIsListening(false);
      sttInitializedRef.current = false;
    }
  }, [handleTranscript, handleSTTError]);

  // Stop voice input
  const stopVoiceInput = useCallback(() => {
    deepgramVoiceAgent.stopListening();
    setIsListening(false);
  }, []);

  // Generate sample content based on common interview questions and position
  const getSampleContent = (topic, position = '') => {
    const topicLower = topic.toLowerCase();
    const positionLower = position.toLowerCase();
    
    // Determine role category for customization
    const isTechnical = positionLower.includes('engineer') || positionLower.includes('developer') || 
                       positionLower.includes('programmer') || positionLower.includes('software') ||
                       positionLower.includes('data scientist') || positionLower.includes('analyst');
    const isManager = positionLower.includes('manager') || positionLower.includes('lead') || 
                     positionLower.includes('director') || positionLower.includes('head');
    const isProduct = positionLower.includes('product') || positionLower.includes('pm');
    const isSales = positionLower.includes('sales') || positionLower.includes('business development');
    const isDesign = positionLower.includes('designer') || positionLower.includes('ux') || positionLower.includes('ui');
    
    // Sample content for "Tell me about yourself"
    if (topicLower.includes('tell me about yourself') || topicLower.includes('introduce yourself')) {
      let roleContext = '[Your Role]';
      let keySkills = '[Key Skills]';
      let achievement = '[Key Achievement]';
      
      if (isTechnical) {
        roleContext = position || 'Software Engineer';
        keySkills = 'full-stack development, system design, and agile methodologies';
        achievement = 'building scalable applications that serve thousands of users';
      } else if (isManager) {
        roleContext = position || 'Engineering Manager';
        keySkills = 'team leadership, project management, and cross-functional collaboration';
        achievement = 'leading teams to deliver complex projects on time and within budget';
      } else if (isProduct) {
        roleContext = position || 'Product Manager';
        keySkills = 'product strategy, user research, and data-driven decision making';
        achievement = 'launching products that increased user engagement by 40%';
      } else if (isSales) {
        roleContext = position || 'Sales Manager';
        keySkills = 'client relationship management, negotiation, and market analysis';
        achievement = 'exceeding sales targets by 25% consistently';
      } else if (isDesign) {
        roleContext = position || 'UX Designer';
        keySkills = 'user-centered design, prototyping, and design systems';
        achievement = 'designing interfaces that improved user satisfaction scores';
      }
      
      return {
        point: `I'm a ${roleContext} with [X] years of experience in [Industry/Field], specializing in ${keySkills}. I'm passionate about [Relevant Interest] and have a proven track record of ${achievement}.`,
        reason: "This question helps the interviewer understand your background, skills, and what drives you professionally. It's their first impression of how you communicate and prioritize information. A strong answer demonstrates self-awareness, career progression, and alignment with the role. For this position, they want to see how your experience directly relates to their needs.",
        example: `For instance, in my previous role at [Company], I ${isManager ? 'led a team of [X] people to' : isTechnical ? 'developed a' : 'worked on a'} [Specific Achievement]. The situation was [Brief Context]. My task was to [What You Needed to Do]. I took action by [Specific Actions - be detailed]. The result was [Quantifiable Outcome - e.g., 'increased efficiency by 30%' or 'reduced costs by $50K']. This experience taught me [Key Learning] relevant to ${position || 'this role'}.`,
        pointReiteration: `In summary, I bring ${keySkills} to this ${position || 'role'}, and I'm excited about the opportunity to [What You Want to Contribute] at [Company Name]. I'm confident my experience in [Relevant Area] makes me a strong fit for this ${position || 'position'}.`
      };
    }
    
    // Sample content for "Why do you want this job?"
    if (topicLower.includes('why do you want') || topicLower.includes('why this job') || topicLower.includes('why this position')) {
      let specificOpportunity = '[Specific Opportunity]';
      let relevantSkill = '[Relevant Skill]';
      
      if (isTechnical) {
        specificOpportunity = 'work on cutting-edge technology and solve complex technical challenges';
        relevantSkill = 'software architecture and modern development practices';
      } else if (isManager) {
        specificOpportunity = 'lead and mentor a talented team while driving strategic initiatives';
        relevantSkill = 'team leadership and organizational development';
      } else if (isProduct) {
        specificOpportunity = 'shape product strategy and work closely with engineering and design teams';
        relevantSkill = 'product vision and user-centric thinking';
      } else if (isSales) {
        specificOpportunity = 'build relationships with clients and drive business growth';
        relevantSkill = 'sales strategy and market development';
      } else if (isDesign) {
        specificOpportunity = 'create intuitive user experiences that make a real impact';
        relevantSkill = 'user research and design thinking';
      }
      
      return {
        point: `I'm excited about this ${position || 'role'} because it aligns perfectly with my career goals in [Field], and [Company Name]'s mission to [Company Mission] resonates deeply with my values. This position offers the opportunity to ${specificOpportunity} while contributing to [Company Impact].`,
        reason: "This question tests your motivation, research, and genuine interest. Interviewers want to see that you've done your homework, understand the role, and have clear reasons beyond just needing a job. It shows whether you'll be engaged and committed long-term. For this position, they want to see how your career goals align with what the role offers.",
        example: `For example, I've been following [Company Name]'s work in [Specific Area] for the past [Time Period]. When I saw the [Specific Project/Initiative] you launched, I was impressed by [Specific Detail]. In my previous role, I worked on something similar where [Your Experience]. I believe my experience with ${relevantSkill} would allow me to contribute meaningfully to [Company Goal] in this ${position || 'role'}.`,
        pointReiteration: `Ultimately, this ${position || 'role'} represents the perfect intersection of my skills in [Your Skills], my passion for [Your Interest], and my desire to make an impact at a company that values [Company Value]. I'm eager to bring my expertise in ${position ? position.toLowerCase() : '[Your Field]'} to your team.`
      };
    }
    
    // Sample content for "What are your strengths?"
    if (topicLower.includes('strength') || topicLower.includes('what are you good at')) {
      let strengths = '[Strength 1], [Strength 2], and [Strength 3]';
      let relevantContext = '[Relevant Context]';
      
      if (isTechnical) {
        strengths = 'problem-solving, technical expertise, and attention to detail';
        relevantContext = 'developing robust, scalable software solutions';
      } else if (isManager) {
        strengths = 'leadership, strategic thinking, and team development';
        relevantContext = 'leading high-performing teams and driving organizational success';
      } else if (isProduct) {
        strengths = 'user empathy, analytical thinking, and cross-functional collaboration';
        relevantContext = 'translating user needs into successful product features';
      } else if (isSales) {
        strengths = 'relationship building, negotiation, and persistence';
        relevantContext = 'closing deals and expanding client relationships';
      } else if (isDesign) {
        strengths = 'creativity, user research, and visual communication';
        relevantContext = 'creating intuitive and beautiful user experiences';
      }
      
      return {
        point: `My greatest strengths are ${strengths}. These have consistently helped me deliver results throughout my career, particularly in ${relevantContext}.`,
        reason: `This question allows you to highlight skills directly relevant to the ${position || 'job'}. Interviewers want to understand what you bring to the table and how your strengths match their needs. It's an opportunity to demonstrate self-awareness and connect your abilities to the role's requirements. For this ${position || 'position'}, they're looking for strengths that align with the core responsibilities.`,
        example: `For instance, my strength in ${strengths.split(',')[0]} was crucial when [Specific Situation]. I was tasked with [Task]. I applied this strength by [How You Used It]. This resulted in [Quantifiable Result]. Another example is when I [Another Situation], where my ${strengths.split(',')[1]} enabled me to [Outcome] relevant to ${position || 'this role'}.`,
        pointReiteration: `These strengths - ${strengths} - are exactly what I bring to this ${position || 'role'}. I'm confident they'll enable me to [Contribution] and help [Company/Team] achieve [Goal] in this ${position || 'position'}.`
      };
    }
    
    // Sample content for "Describe a challenging project"
    if (topicLower.includes('challenging') || topicLower.includes('difficult project') || topicLower.includes('challenge')) {
      let projectType = '[Project Name]';
      let keySkills = '[Key Skill] and [Another Skill]';
      
      if (isTechnical) {
        projectType = 'a complex system migration or performance optimization project';
        keySkills = 'technical problem-solving and system architecture';
      } else if (isManager) {
        projectType = 'leading a cross-functional team through a major initiative';
        keySkills = 'team leadership and project management';
      } else if (isProduct) {
        projectType = 'launching a new product feature under tight constraints';
        keySkills = 'product strategy and stakeholder management';
      } else if (isSales) {
        projectType = 'closing a major enterprise deal';
        keySkills = 'relationship building and negotiation';
      } else if (isDesign) {
        projectType = 'redesigning a complex user interface';
        keySkills = 'design thinking and user research';
      }
      
      return {
        point: `One of the most challenging projects I've worked on was ${projectType}, where I had to [Main Challenge]. Despite the obstacles, I successfully [Outcome], which taught me valuable lessons about [Key Learning] relevant to ${position || 'this role'}.`,
        reason: `This behavioral question assesses your problem-solving skills, resilience, and ability to handle pressure. Interviewers want to see how you approach difficult situations, manage resources, and learn from challenges. It demonstrates your real-world capabilities beyond your resume. For this ${position || 'position'}, they want to see how you handle challenges specific to ${position ? position.toLowerCase() : 'the role'}.`,
        example: `The situation was [Context - e.g., 'tight deadline, limited budget, complex requirements']. My task was to [What Needed to Be Done]. I took action by [Step 1], [Step 2], and [Step 3]. I faced challenges like [Specific Challenge], which I overcame by [Solution]. The result was [Outcome - be specific with numbers/metrics]. This project improved [Metric] by [Percentage/Amount] and received [Recognition/Feedback]. The skills I developed - ${keySkills} - are directly applicable to this ${position || 'role'}.`,
        pointReiteration: `This project was challenging, but it reinforced my ability to ${keySkills} under pressure. I'm confident these experiences have prepared me to handle similar challenges in this ${position || 'role'} and contribute effectively to [Company/Team] as a ${position || '[Your Role]'}.`
      };
    }
    
    // Default sample content for other questions
    let roleSpecificSkill = '[Key Skill]';
    if (isTechnical) roleSpecificSkill = 'technical problem-solving';
    else if (isManager) roleSpecificSkill = 'leadership and strategic thinking';
    else if (isProduct) roleSpecificSkill = 'product strategy and user empathy';
    else if (isSales) roleSpecificSkill = 'relationship building and sales execution';
    else if (isDesign) roleSpecificSkill = 'design thinking and user experience';
    
    return {
      point: `My main point regarding "${topic}" is [Your Clear Statement]. This directly addresses the question and demonstrates [Key Quality/Value] relevant to ${position || 'this role'}.`,
      reason: `This question is important because it helps the interviewer understand [What They're Assessing]. A strong answer shows [What It Demonstrates] and helps them evaluate [Evaluation Criteria]. It's an opportunity to showcase ${roleSpecificSkill} that's essential for this ${position || 'role'}.`,
      example: `For example, [Situation/Context]. I was responsible for [Task/Challenge]. I approached this by [Action 1], [Action 2], and [Action 3]. The outcome was [Specific Result with Metrics]. This experience demonstrates ${roleSpecificSkill} and shows how I [Relevant Capability] - skills that are directly applicable to this ${position || 'position'}.`,
      pointReiteration: `In conclusion, "${topic}" is important because [Summary of Reason]. My experience with [Relevant Experience] and my ability to ${roleSpecificSkill} make me well-equipped to [Contribution] as a ${position || '[Your Role]'}. I'm excited about the opportunity to [What You'll Do] in this ${position || 'role'}.`
    };
  };

  // Generate speech structure using PREP framework
  const generateSpeechStructure = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    setVoiceError(null);
    
    setTimeout(() => {
      const sampleContent = getSampleContent(topic, candidate?.position || '');
      
      const structure = {
        topic: topic,
        type: 'impromptu',
        sections: [
          {
            title: "Point",
            description: "State your main point clearly and concisely",
            content: sampleContent.point,
            tips: ["Be specific and direct", "Use confident language", "Make it memorable", "Answer the question directly"],
            timeAllocation: "30 seconds"
          },
          {
            title: "Reason",
            description: "Explain why your point matters",
            content: sampleContent.reason,
            tips: ["Connect to interviewer interests", "Use logic and evidence", "Show relevance to the role", "Demonstrate understanding"],
            timeAllocation: "1-2 minutes"
          },
          {
            title: "Example",
            description: "Provide concrete examples or stories",
            content: sampleContent.example,
            tips: ["Use personal experiences", "Include relevant data", "Make it relatable", "Use STAR method for behavioral questions"],
            timeAllocation: "2-3 minutes"
          },
          {
            title: "Point (Reiteration)",
            description: "Restate your main point with impact",
            content: sampleContent.pointReiteration,
            tips: ["Summarize key takeaways", "End with confidence", "Leave lasting impression", "Show enthusiasm"],
            timeAllocation: "30 seconds"
          }
        ]
      };
      setSpeechStructure(structure);
      setIsGenerating(false);
    }, 2000);
  };

  // Read section with TTS
  const readSection = useCallback(async (section, sectionIndex) => {
    try {
      setVoiceError(null);
      if (currentAudioRef.current) {
        deepgramVoiceAgent.stopSpeaking(currentAudioRef.current);
      }

      const textToRead = `${section.title}. ${section.description}. ${section.content}. Tips: ${section.tips.join('. ')}`;
      
      setIsTTSPlaying(true);
      setPlayingSectionIndex(sectionIndex);
      const audio = await deepgramVoiceAgent.speakText(
        textToRead,
        () => {
          setIsTTSPlaying(false);
          setPlayingSectionIndex(null);
          currentAudioRef.current = null;
        },
        (error) => {
          console.error('TTS Error:', error);
          setVoiceError('Failed to read text. Please check your API key.');
          setIsTTSPlaying(false);
          setPlayingSectionIndex(null);
          currentAudioRef.current = null;
        }
      );
      currentAudioRef.current = audio;
    } catch (error) {
      console.error('Error reading section:', error);
      setVoiceError(error.message || 'Failed to read text');
      setIsTTSPlaying(false);
      setPlayingSectionIndex(null);
    }
  }, []);

  // Stop TTS
  const stopTTS = useCallback(() => {
    if (currentAudioRef.current) {
      deepgramVoiceAgent.stopSpeaking(currentAudioRef.current);
      currentAudioRef.current = null;
      setIsTTSPlaying(false);
      setPlayingSectionIndex(null);
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 flex-1">
            <MicoCharacter animation="talking" size="medium" />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-8 h-8 text-teal-500" />
                <h1 className="text-3xl font-bold text-gray-900">Interview Training</h1>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">HireEasy</span>
                <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-lg text-sm font-medium">+ SpeakEasy</span>
              </div>
              <p className="text-gray-600 text-lg">
                Practice your interview responses using AI-powered speech generation and voice feedback
              </p>
              <div className="mt-3 p-4 bg-gradient-to-r from-purple-50 to-teal-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-700 flex items-center gap-2">
                  <span className="font-medium">MICO says:</span> 
                  "Welcome to HireEasy! I'll help you practice using SpeakEasy's PREP framework! Enter any interview question and I'll generate structured speaking points for you."
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActivePage && setActivePage('generator')}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Mic className="w-4 h-4" />
            Switch to SpeakEasy
          </button>
        </div>
      </div>

      {!speechStructure ? (
        /* Topic Selection */
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose a Question to Practice</h2>
          
          {/* Topic Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter an interview question or topic
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g., Tell me about yourself"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-teal-400 bg-teal-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 text-gray-900 placeholder-gray-500 font-medium"
              />
              <button
                onClick={isListening ? stopVoiceInput : startVoiceInput}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  isListening
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-teal-500 text-white hover:bg-teal-600'
                }`}
                title={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>
            {isListening && (
              <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-lg">
                <p className="text-sm text-teal-700 flex items-center gap-2">
                  <Mic className="w-4 h-4 animate-pulse" />
                  Listening... {transcript && `"${transcript}"`}
                </p>
              </div>
            )}
            {voiceError && (
              <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900 mb-1">Voice Input Unavailable</p>
                    <p className="text-sm text-red-700 whitespace-pre-line">{voiceError}</p>
                    <p className="text-xs text-red-600 mt-2">
                      💡 Tip: You can still type your interview question in the field above.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Question Suggestions */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Or choose from common interview questions:
            </p>
            <div className="flex flex-wrap gap-2">
              {interviewQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setTopic(question)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateSpeechStructure}
            disabled={!topic.trim() || isGenerating}
            className={`w-full py-3 px-6 bg-gradient-to-r from-teal-500 to-purple-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
              !topic.trim() || isGenerating
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:from-teal-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating speaking points with SpeakEasy...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Speaking Points with SpeakEasy
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* SpeakEasy Features Showcase */}
          <div className="mt-8 p-6 bg-gradient-to-r from-teal-50 to-purple-50 border border-teal-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-600" />
              How SpeakEasy Helps You
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <Target className="w-6 h-6 text-teal-500 mb-2" />
                <h4 className="font-semibold text-sm mb-1">PREP Framework</h4>
                <p className="text-xs text-gray-600">Structured responses: Point, Reason, Example, Point</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <Volume2 className="w-6 h-6 text-purple-500 mb-2" />
                <h4 className="font-semibold text-sm mb-1">Voice Practice</h4>
                <p className="text-xs text-gray-600">Hear your responses read aloud for practice</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <Sparkles className="w-6 h-6 text-teal-500 mb-2" />
                <h4 className="font-semibold text-sm mb-1">AI Coaching</h4>
                <p className="text-xs text-gray-600">Get personalized tips and feedback</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Speech Output */
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{speechStructure.topic}</h2>
              <p className="text-gray-600">PREP Framework - Practice your response</p>
            </div>
            <button
              onClick={() => {
                setSpeechStructure(null);
                setTopic('');
                setCurrentSection(0);
              }}
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              ← New Practice
            </button>
          </div>

          <div className="space-y-4">
            {speechStructure.sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-xl border-2 ${
                  index === currentSection
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === currentSection
                      ? 'bg-teal-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {section.timeAllocation}
                        </span>
                        <button
                          onClick={() => {
                            if (playingSectionIndex === index && isTTSPlaying) {
                              stopTTS();
                            } else {
                              readSection(section, index);
                            }
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            playingSectionIndex === index && isTTSPlaying
                              ? 'bg-red-100 text-red-600 hover:bg-red-200'
                              : 'bg-teal-100 text-teal-600 hover:bg-teal-200'
                          }`}
                          title={playingSectionIndex === index && isTTSPlaying ? 'Stop reading' : 'Read aloud'}
                        >
                          {playingSectionIndex === index && isTTSPlaying ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{section.description}</p>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Your Response:</h4>
                      <p className="text-gray-700">{section.content}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Tips:</h4>
                      <ul className="space-y-2">
                        {section.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
              disabled={currentSection === 0}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentSection(Math.min(speechStructure.sections.length - 1, currentSection + 1))}
              disabled={currentSection === speechStructure.sections.length - 1}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-purple-500 text-white rounded-lg font-medium hover:from-teal-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewTrainingHR;

