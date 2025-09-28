import { useState, useEffect } from "react";
import { RefreshIcon, BoltIcon, BookIcon, TimeIcon, TrashBinIcon, CopyIcon } from "../icons";
import { apiService } from "../services/api";
import { useAuth } from "../context/AuthContext";

const SpeechHistory = () => {
  const [speeches, setSpeeches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalConversations: 0,
    impromptuCount: 0,
    plannedCount: 0,
    totalMinutes: 0
  });
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!isAuthenticated) {
      try {
        await login('admin', 'admin123');
      } catch (error) {
        setError('Please log in to view speech history');
        setLoading(false);
        return;
      }
    }

    try {
      const [historyResult, statsResult] = await Promise.all([
        apiService.getConversationHistory(),
        apiService.getConversationStats()
      ]);
      
      setSpeeches(historyResult.conversations);
      setStats(statsResult);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load speech history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeColor = (type: string) => {
    return type === "impromptu" 
      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
      : "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
  };

  const getTypeLabel = (type: string) => {
    return type === "impromptu" ? "Impromptu" : "Planned";
  };

  const handleCopySpeech = (speech: any) => {
    const speechText = speech.points.join('\n');
    navigator.clipboard.writeText(speechText);
    // TODO: Show success toast
  };

  const handleDeleteSpeech = (id: number) => {
    // TODO: Implement delete functionality
    console.log("Delete speech:", id);
  };

  const handleRegenerateSpeech = (speech: any) => {
    // TODO: Implement regenerate functionality
    console.log("Regenerate speech:", speech);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <RefreshIcon className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Speech History
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          View and manage your previously generated speeches.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-theme-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <BoltIcon className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.impromptuCount}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Impromptu Speeches</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-theme-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <BookIcon className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.plannedCount}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Planned Presentations</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-theme-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <TimeIcon className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalMinutes}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Minutes</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-theme-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <RefreshIcon className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalConversations}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Speeches</p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading speech history...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-700 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={loadData}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Speech List */}
      {!loading && !error && (
        <div className="space-y-6">
          {speeches.map((speech) => (
          <div
            key={speech.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-theme-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {speech.topic}
                  </h3>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getTypeColor(speech.speech_type)}`}>
                    {getTypeLabel(speech.speech_type)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {speech.duration} min
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Created on {formatDate(speech.created_at)}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRegenerateSpeech(speech)}
                  className="p-2 text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-colors"
                  title="Regenerate Speech"
                >
                  <RefreshIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleCopySpeech(speech)}
                  className="p-2 text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-colors"
                  title="Copy Speech"
                >
                  <CopyIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteSpeech(speech.id)}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete Speech"
                >
                  <TrashBinIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {speech.speaking_points.map((point: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-brand-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{point}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && speeches.length === 0 && (
        <div className="text-center py-12">
          <RefreshIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No speeches yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Generate your first speech to see it appear here.
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg transition-colors">
            <BoltIcon className="w-5 h-5" />
            Generate Speech
          </button>
        </div>
      )}
    </div>
  );
};

export default SpeechHistory;
