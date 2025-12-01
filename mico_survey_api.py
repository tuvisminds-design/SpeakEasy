#!/usr/bin/env python3
"""
MICO Survey API - Headless survey service for React integration
Provides REST API endpoints for the survey questions and answers
"""

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import json
from datetime import datetime
from pathlib import Path
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for React app

# Survey questions from original bot
QUESTIONS = [
    {
        'id': 'need_1',
        'category': 'need',
        'question': "You're asked to deliver a presentation to a large audience with minimal preparation time. How do you feel?",
        'options': [
            {'text': "Confident and ready", 'value': 1, 'points': 5},
            {'text': "Slightly nervous but manageable", 'value': 2, 'points': 15},
            {'text': "Very anxious and unprepared", 'value': 3, 'points': 25},
            {'text': "I would avoid the situation if possible", 'value': 4, 'points': 30}
        ],
        'emoji': "🎤"
    },
    {
        'id': 'need_2',
        'category': 'need',
        'question': "How often do you find yourself in situations requiring public speaking?",
        'options': [
            {'text': "Regularly (weekly)", 'value': 1, 'points': 25},
            {'text': "Occasionally (monthly)", 'value': 2, 'points': 20},
            {'text': "Rarely (a few times a year)", 'value': 3, 'points': 15},
            {'text': "Never", 'value': 4, 'points': 10}
        ],
        'emoji': "📅"
    },
    {
        'id': 'need_3',
        'category': 'need',
        'question': "When you think about public speaking, what's your biggest concern?",
        'options': [
            {'text': "Forgetting what to say", 'value': 1, 'points': 20},
            {'text': "Not being clear or articulate", 'value': 2, 'points': 25},
            {'text': "Lack of structure in my speech", 'value': 3, 'points': 25},
            {'text': "I don't have concerns", 'value': 4, 'points': 5}
        ],
        'emoji': "🤔"
    },
    {
        'id': 'frequency_1',
        'category': 'frequency',
        'question': "Imagine Speakeasy offers daily 10-minute exercises to improve your public speaking. How likely are you to incorporate these?",
        'options': [
            {'text': "Very likely - I'd do it daily", 'value': 1, 'points': 30},
            {'text': "Somewhat likely - 3-4 times a week", 'value': 2, 'points': 20},
            {'text': "Maybe - 1-2 times a week", 'value': 3, 'points': 10},
            {'text': "Unlikely - I'd rarely use it", 'value': 4, 'points': 5}
        ],
        'emoji': "⏰"
    },
    {
        'id': 'frequency_2',
        'category': 'frequency',
        'question': "Would you prefer structured lessons or flexible, on-demand exercises?",
        'options': [
            {'text': "Structured lessons with a plan", 'value': 1, 'points': 20},
            {'text': "On-demand exercises when needed", 'value': 2, 'points': 15},
            {'text': "A mix of both", 'value': 3, 'points': 25},
            {'text': "Neither - I'm not sure", 'value': 4, 'points': 5}
        ],
        'emoji': "📚"
    },
    {
        'id': 'frequency_3',
        'category': 'frequency',
        'question': "How important is it for you to practice before an important speaking opportunity?",
        'options': [
            {'text': "Extremely important - I always practice", 'value': 1, 'points': 25},
            {'text': "Very important - I usually practice", 'value': 2, 'points': 20},
            {'text': "Somewhat important - I practice sometimes", 'value': 3, 'points': 10},
            {'text': "Not important - I wing it", 'value': 4, 'points': 5}
        ],
        'emoji': "🎯"
    },
    {
        'id': 'recommend_1',
        'category': 'recommend',
        'question': "After using Speakeasy for a month and noticing improvement, how likely are you to recommend it?",
        'options': [
            {'text': "Extremely likely - I'd tell everyone", 'value': 1, 'points': 30},
            {'text': "Very likely - I'd recommend to friends", 'value': 2, 'points': 20},
            {'text': "Somewhat likely - Maybe if asked", 'value': 3, 'points': 10},
            {'text': "Not likely - I'd keep it to myself", 'value': 4, 'points': 5}
        ],
        'emoji': "💬"
    },
    {
        'id': 'recommend_2',
        'category': 'recommend',
        'question': "What would most influence your decision to recommend Speakeasy?",
        'options': [
            {'text': "Personalized feedback and improvement", 'value': 1, 'points': 25},
            {'text': "Easy-to-use interactive exercises", 'value': 2, 'points': 20},
            {'text': "Visible progress tracking", 'value': 3, 'points': 15},
            {'text': "Nothing specific", 'value': 4, 'points': 5}
        ],
        'emoji': "⭐"
    },
    {
        'id': 'recommend_3',
        'category': 'recommend',
        'question': "How do you typically discover and share apps with others?",
        'options': [
            {'text': "I actively recommend apps I love", 'value': 1, 'points': 25},
            {'text': "I share when someone asks for recommendations", 'value': 2, 'points': 20},
            {'text': "I rarely share apps", 'value': 3, 'points': 10},
            {'text': "I never share apps", 'value': 4, 'points': 5}
        ],
        'emoji': "📱"
    }
]

# In-memory storage for survey sessions
survey_sessions = {}

def calculate_scores(answers):
    """Calculate category scores from answers"""
    need_questions = [q for q in QUESTIONS if q['category'] == 'need']
    frequency_questions = [q for q in QUESTIONS if q['category'] == 'frequency']
    recommend_questions = [q for q in QUESTIONS if q['category'] == 'recommend']
    
    need_score = sum(answers.get(q['id'], {}).get('points', 0) for q in need_questions)
    frequency_score = sum(answers.get(q['id'], {}).get('points', 0) for q in frequency_questions)
    recommend_score = sum(answers.get(q['id'], {}).get('points', 0) for q in recommend_questions)
    
    max_need = len(need_questions) * 30
    max_frequency = len(frequency_questions) * 30
    max_recommend = len(recommend_questions) * 30
    
    return {
        'need': {
            'score': need_score,
            'max': max_need,
            'percentage': round((need_score / max_need) * 100) if max_need > 0 else 0,
            'level': 'high' if need_score >= max_need * 0.7 else 'medium' if need_score >= max_need * 0.4 else 'low'
        },
        'frequency': {
            'score': frequency_score,
            'max': max_frequency,
            'percentage': round((frequency_score / max_frequency) * 100) if max_frequency > 0 else 0,
            'level': 'high' if frequency_score >= max_frequency * 0.7 else 'medium' if frequency_score >= max_frequency * 0.4 else 'low'
        },
        'recommend': {
            'score': recommend_score,
            'max': max_recommend,
            'percentage': round((recommend_score / max_recommend) * 100) if max_recommend > 0 else 0,
            'level': 'high' if recommend_score >= max_recommend * 0.7 else 'medium' if recommend_score >= max_recommend * 0.4 else 'low'
        }
    }

@app.route('/api/survey/greeting', methods=['GET'])
def get_greeting():
    """Get MICO greeting message"""
    current_hour = datetime.now().hour
    if current_hour < 12:
        greeting = "Good morning"
    elif current_hour < 18:
        greeting = "Good afternoon"
    else:
        greeting = "Good evening"
    
    return jsonify({
        'greeting': greeting,
        'message': f"{greeting}! Let's start with a short survey to assess your current needs.",
        'submessage': "I'll guide you through a quick assessment to help personalize your Speakeasy experience."
    })

@app.route('/api/survey/questions', methods=['GET'])
def get_questions():
    """Get all survey questions"""
    return jsonify({
        'questions': QUESTIONS,
        'total': len(QUESTIONS)
    })

@app.route('/api/survey/start', methods=['POST'])
def start_survey():
    """Start a new survey session"""
    session_id = request.json.get('session_id') or f"session_{datetime.now().timestamp()}"
    survey_sessions[session_id] = {
        'answers': {},
        'current_question': 0,
        'points': 0,
        'started_at': datetime.now().isoformat()
    }
    return jsonify({
        'session_id': session_id,
        'message': 'Survey started'
    })

@app.route('/api/survey/answer', methods=['POST'])
def submit_answer():
    """Submit an answer for a question"""
    data = request.json
    session_id = data.get('session_id')
    question_id = data.get('question_id')
    option = data.get('option')
    
    if not session_id or session_id not in survey_sessions:
        return jsonify({'error': 'Invalid session'}), 400
    
    if not question_id or not option:
        return jsonify({'error': 'Missing question_id or option'}), 400
    
    session = survey_sessions[session_id]
    session['answers'][question_id] = option
    session['points'] += option.get('points', 0)
    session['current_question'] += 1
    
    return jsonify({
        'success': True,
        'current_question': session['current_question'],
        'total_questions': len(QUESTIONS),
        'points': session['points']
    })

@app.route('/api/survey/complete', methods=['POST'])
def complete_survey():
    """Complete the survey and get results"""
    data = request.json
    session_id = data.get('session_id')
    
    if not session_id or session_id not in survey_sessions:
        return jsonify({'error': 'Invalid session'}), 400
    
    session = survey_sessions[session_id]
    answers = session['answers']
    
    if len(answers) < len(QUESTIONS):
        return jsonify({'error': 'Survey not completed'}), 400
    
    # Calculate scores
    scores = calculate_scores(answers)
    overall_score = (scores['need']['percentage'] + scores['frequency']['percentage'] + scores['recommend']['percentage']) / 3
    
    # Save results
    results = {
        'timestamp': datetime.now().isoformat(),
        'overall_score': round(overall_score),
        'category_scores': {
            'need': scores['need']['percentage'],
            'frequency': scores['frequency']['percentage'],
            'recommend': scores['recommend']['percentage']
        },
        'answers': {qid: {'text': ans['text'], 'points': ans['points']} 
                   for qid, ans in answers.items()},
        'total_points': session['points']
    }
    
    # Save to file
    results_dir = Path("survey_results")
    results_dir.mkdir(exist_ok=True)
    filename = results_dir / f"survey_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(filename, 'w') as f:
        json.dump(results, f, indent=2)
    
    # Mark survey as completed for React app
    public_dir = Path("public")
    if public_dir.exists():
        public_flag_file = public_dir / "survey-status.json"
        with open(public_flag_file, 'w') as f:
            json.dump({
                'completed': True,
                'timestamp': datetime.now().isoformat(),
                'answers_count': len(answers),
                'completed_via': 'python_bot_api',
                'overall_score': round(overall_score)
            }, f)
    
    # Clean up session
    del survey_sessions[session_id]
    
    return jsonify({
        'success': True,
        'results': results,
        'scores': scores,
        'overall_score': round(overall_score)
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)

