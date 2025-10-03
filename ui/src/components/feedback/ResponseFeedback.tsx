import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import StarRating from './StarRating';

interface ResponseFeedbackProps {
  conversationId: number;
  onFeedbackSubmitted?: () => void;
}

interface FeedbackData {
  rating: number;
  correction_text?: string;
}

const ResponseFeedback: React.FC<ResponseFeedbackProps> = ({ 
  conversationId, 
  onFeedbackSubmitted 
}) => {
  const [rating, setRating] = useState(0);
  const [correctionText, setCorrectionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState<FeedbackData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if feedback already exists for this conversation
    const fetchExistingFeedback = async () => {
      try {
        const feedback = await apiService.getResponseFeedbackForConversation(conversationId);
        if (feedback) {
          setExistingFeedback(feedback);
          setRating(feedback.rating);
          setCorrectionText(feedback.correction_text || '');
        }
      } catch (err) {
        // No existing feedback, which is fine
        console.log('No existing feedback found');
      }
    };

    fetchExistingFeedback();
  }, [conversationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please provide a rating');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      await apiService.submitResponseFeedback(
        conversationId, 
        rating, 
        correctionText.trim() || undefined
      );
      
      setExistingFeedback({ rating, correction_text: correctionText.trim() });
      onFeedbackSubmitted?.();
      
      // Show success message briefly
      setTimeout(() => {
        setIsExpanded(false);
      }, 1500);
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
      console.error('Error submitting feedback:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setRating(0);
    setCorrectionText('');
    setError('');
    setIsExpanded(false);
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-700">
          {existingFeedback ? 'Update your feedback' : 'Rate this response'}
        </h4>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          {isExpanded ? 'Hide' : 'Rate & Feedback'}
        </button>
      </div>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How helpful was this response? *
            </label>
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              size="md"
            />
          </div>

          {/* Correction Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Any corrections or suggestions? (Optional)
            </label>
            <textarea
              value={correctionText}
              onChange={(e) => setCorrectionText(e.target.value)}
              placeholder="Share any corrections, improvements, or additional suggestions..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              {correctionText.length}/500 characters
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : existingFeedback ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
      )}

      {/* Success Message */}
      {existingFeedback && !isExpanded && (
        <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
          ✓ Feedback submitted! Thank you for your input.
        </div>
      )}
    </div>
  );
};

export default ResponseFeedback;
