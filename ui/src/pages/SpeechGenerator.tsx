import { useState } from "react";
import { BoltIcon, TargetIcon, QuestionIcon, TimeIcon, HeartIcon } from "../icons";
import { apiService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import AppFeedbackModal from "../components/feedback/AppFeedbackModal";
import ResponseFeedback from "../components/feedback/ResponseFeedback";

const SpeechGenerator = () => {
  const [speechTopic, setSpeechTopic] = useState("");
  const [speechType, setSpeechType] = useState<"impromptu" | "planned">("impromptu");
  const [duration, setDuration] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPoints, setGeneratedPoints] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [showAppFeedbackModal, setShowAppFeedbackModal] = useState(false);
  const { isAuthenticated } = useAuth();

  const suggestedTopics = [
    "The importance of work-life balance",
    "How technology shapes our future",
    "Leadership in challenging times",
    "The power of sustainable living",
    "Building resilience in uncertainty",
    "The future of remote work"
  ];

  const handleGenerateSpeech = async () => {
    if (!speechTopic.trim()) {
      setError('Please enter a speech topic');
      return;
    }

    if (!isAuthenticated) {
      setError('Please log in to generate speeches');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedPoints([]);

    try {
      const result = await apiService.generateSpeech(speechTopic, speechType, duration);
      setGeneratedPoints(result.speaking_points);
      setConversationId(result.conversation_id);
    } catch (error) {
      console.error('Error generating speech:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate speech. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BoltIcon className="w-8 h-8 text-teal-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Speech Generator
            </h1>
          </div>
          <button
            onClick={() => setShowAppFeedbackModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-white dark:bg-gray-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-600 transition-colors"
          >
            <HeartIcon className="w-4 h-4" />
            Share Feedback
          </button>
        </div>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Transform any topic into compelling speaking points using proven frameworks and AI-powered insights.
        </p>
      </div>

      {/* Configure Your Speech Section */}
      <div className="rounded-lg bg-white dark:bg-gray-800 text-slate-900 dark:text-white shadow-xl border-0">
        {/* Card Header */}
        <div className="flex flex-col space-y-1.5 p-6 pb-4">
          <h3 className="tracking-tight flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-white">
            <TargetIcon className="w-5 h-5 text-teal-600" />
            Configure Your Speech
          </h3>
        </div>

        {/* Card Content */}
        <div className="p-6 pt-0 space-y-6">
          {/* Topic Input Section */}
          <div className="space-y-4">
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <QuestionIcon className="w-4 h-4 text-teal-600" />
              What would you like to speak about?
            </label>
            <input
              type="text"
              value={speechTopic}
              onChange={(e) => setSpeechTopic(e.target.value)}
              placeholder="Enter your speech topic..."
              className="flex h-12 w-full bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-lg py-3 px-4 rounded-xl border-2 transition-all duration-200 border-slate-200 dark:border-slate-600 focus:border-teal-500 bg-white dark:bg-gray-700 text-slate-900 dark:text-white"
            />

            {/* Topic Suggestions */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Need inspiration? Try these topics:
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedTopics.map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => setSpeechTopic(topic)}
                    className="px-3 py-2 text-sm bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-700 rounded-lg border border-slate-200 hover:border-teal-300 transition-all duration-200 dark:bg-gray-700 dark:text-slate-300 dark:hover:bg-teal-900/20 dark:border-slate-600"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="shrink-0 bg-slate-200 dark:bg-slate-600 h-[1px] w-full my-6"></div>

          {/* Speech Type Selection */}
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base font-semibold text-slate-900 dark:text-white">
                Speech Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Impromptu Speech Card */}
                <div className="relative">
                  <input
                    type="radio"
                    id="impromptu"
                    name="speechType"
                    value="impromptu"
                    checked={speechType === "impromptu"}
                    onChange={(e) => setSpeechType(e.target.value as "impromptu")}
                    className="sr-only peer"
                  />
                  <label
                    htmlFor="impromptu"
                    className={`flex flex-col items-start space-y-3 rounded-xl border-2 p-4 cursor-pointer transition-all duration-200 ${
                      speechType === "impromptu"
                        ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                        : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                        <BoltIcon className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          Impromptu Speech
                        </div>
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-secondary/80 text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
                          PREP Framework
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Perfect for unexpected speaking opportunities. Uses the PREP method: Point, Reason, Example, Point.
                    </p>
                  </label>
                </div>

                {/* Planned Presentation Card */}
                <div className="relative">
                  <input
                    type="radio"
                    id="planned"
                    name="speechType"
                    value="planned"
                    checked={speechType === "planned"}
                    onChange={(e) => setSpeechType(e.target.value as "planned")}
                    className="sr-only peer"
                  />
                  <label
                    htmlFor="planned"
                    className={`flex flex-col items-start space-y-3 rounded-xl border-2 p-4 cursor-pointer transition-all duration-200 ${
                      speechType === "planned"
                        ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                        : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <TargetIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          Planned Presentation
                        </div>
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-secondary/80 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                          Full Outline
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Comprehensive structure for formal presentations with detailed outlines and supporting content.
                    </p>
                  </label>
                </div>
              </div>
            </div>

            {/* Duration Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <TimeIcon className="w-4 h-4 text-teal-600" />
                  Duration
                </label>
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {duration} minutes
                </div>
              </div>
              <div className="px-2">
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mt-2">
                  <span>1 min</span>
                  <span>15 min</span>
                  <span>30 min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateSpeech}
            disabled={isGenerating || !speechTopic.trim()}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <div className="flex items-center gap-2">
              <BoltIcon className="w-5 h-5" />
              {isGenerating ? "Generating..." : "Generate Speaking Points"}
            </div>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Generated Points */}
      {generatedPoints.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-xl border-0">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            Your Speaking Points
          </h3>
          <div className="space-y-4">
            {generatedPoints.map((point, index) => (
              <div
                key={index}
                className="p-4 bg-slate-50 dark:bg-gray-700 rounded-lg border-l-4 border-teal-500"
              >
                <p className="text-slate-700 dark:text-slate-300">{point}</p>
              </div>
            ))}
          </div>
          
          {/* Response Feedback Component */}
          {conversationId && (
            <ResponseFeedback 
              conversationId={conversationId}
              onFeedbackSubmitted={() => {
                // Optional: Show success message or update UI
                console.log('Feedback submitted successfully');
              }}
            />
          )}
        </div>
      )}

      {/* App Feedback Modal */}
      <AppFeedbackModal
        isOpen={showAppFeedbackModal}
        onClose={() => setShowAppFeedbackModal(false)}
        onSuccess={() => {
          // Optional: Show success message
          console.log('App feedback submitted successfully');
        }}
      />
    </div>
  );
};

export default SpeechGenerator;