import { useState } from "react";
import { BoltIcon, TargetIcon, QuestionIcon, TimeIcon } from "../icons";
import { apiService } from "../services/api";
import { useAuth } from "../context/AuthContext";

const SpeechGenerator = () => {
  const [speechTopic, setSpeechTopic] = useState("");
  const [speechType, setSpeechType] = useState<"impromptu" | "planned">("impromptu");
  const [duration, setDuration] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPoints, setGeneratedPoints] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, login } = useAuth();

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
    } catch (error) {
      console.error('Error generating speech:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate speech. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BoltIcon className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Speech Generator
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Transform any topic into compelling speaking points using proven frameworks and AI-powered insights.
        </p>
      </div>

      {/* Configure Your Speech Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8 shadow-theme-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <TargetIcon className="w-6 h-6 text-brand-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Configure Your Speech
          </h2>
        </div>

        {/* Topic Input */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <QuestionIcon className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              What would you like to speak about?
            </h3>
          </div>
          
          <input
            type="text"
            value={speechTopic}
            onChange={(e) => setSpeechTopic(e.target.value)}
            placeholder="Enter your speech topic..."
            className="w-full px-4 py-4 text-lg border-2 border-yellow-300 rounded-lg focus:border-yellow-400 focus:outline-none bg-yellow-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          />

          {/* Topic Suggestions */}
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Need inspiration? Try these topics:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedTopics.map((topic, index) => (
                <button
                  key={index}
                  onClick={() => setSpeechTopic(topic)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Speech Type Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Speech Type
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Impromptu Speech Card */}
            <div
              className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all ${
                speechType === "impromptu"
                  ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
              }`}
              onClick={() => setSpeechType("impromptu")}
            >
              <div className="flex items-center gap-3 mb-3">
                <BoltIcon className="w-6 h-6 text-brand-500" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Impromptu Speech
                </h4>
              </div>
              <span className="inline-block px-3 py-1 text-xs font-medium text-orange-700 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 rounded-full mb-3">
                PREP Framework
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Perfect for unexpected speaking opportunities. Uses the PREP method: Point, Reason, Example, Point.
              </p>
            </div>

            {/* Planned Presentation Card */}
            <div
              className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all ${
                speechType === "planned"
                  ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
              }`}
              onClick={() => setSpeechType("planned")}
            >
              <div className="flex items-center gap-3 mb-3">
                <TargetIcon className="w-6 h-6 text-blue-500" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Planned Presentation
                </h4>
              </div>
              <span className="inline-block px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 rounded-full mb-3">
                Full Outline
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Comprehensive structure for formal presentations with detailed outlines and supporting content.
              </p>
            </div>
          </div>
        </div>

        {/* Duration Slider */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <TimeIcon className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Duration
            </h3>
          </div>
          
          <div className="px-4">
            <div className="text-center mb-4">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {duration} minutes
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="1"
                max="30"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full h-2 appearance-none cursor-pointer slider-dual"
                style={{
                  background: `linear-gradient(to right, #12b76a 0%, #12b76a ${((duration - 1) / (30 - 1)) * 100}%, #e5e7eb ${((duration - 1) / (30 - 1)) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                <span>1 min</span>
                <span>30 min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <button
            onClick={handleGenerateSpeech}
            disabled={isGenerating}
            className={`inline-flex items-center gap-3 px-8 py-4 text-white font-semibold text-lg rounded-lg transition-colors shadow-lg hover:shadow-xl ${
              isGenerating 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-teal-500 hover:bg-teal-600'
            }`}
          >
            <BoltIcon className="w-6 h-6" />
            {isGenerating ? 'Generating...' : 'Generate Speaking Points'}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Generated Speaking Points */}
        {generatedPoints.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-theme-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <BoltIcon className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Generated Speaking Points
              </h2>
            </div>
            
            <div className="space-y-4">
              {generatedPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-700 dark:text-green-400 font-semibold text-sm">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Topic: {speechTopic}</span>
                <span>Type: {speechType === 'impromptu' ? 'Impromptu (PREP)' : 'Planned Presentation'}</span>
                <span>Duration: {duration} minutes</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeechGenerator;
