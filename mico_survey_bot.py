#!/usr/bin/env python3
"""
MICO Survey Bot - Pre-App Survey with MICO Character
A friendly Python bot that greets users and guides them through the pre-app survey
"""

import tkinter as tk
from tkinter import ttk, messagebox
import json
import webbrowser
import subprocess
import sys
import os
from datetime import datetime
from pathlib import Path

class MicoSurveyBot:
    def __init__(self, root):
        self.root = root
        self.root.title("MICO Survey Bot - Speakeasy Pre-App Survey")
        self.root.geometry("800x700")
        self.root.configure(bg="#f0fdf4")
        
        # Survey questions from PreEvaluationTest.js
        self.questions = [
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
        
        self.current_question = 0
        self.answers = {}
        self.points = 0
        self.survey_completed = False
        
        self.show_greeting()
    
    def show_greeting(self):
        """Show MICO greeting screen"""
        self.clear_window()
        
        # MICO Icon/Character Display
        mico_frame = tk.Frame(self.root, bg="#f0fdf4")
        mico_frame.pack(pady=50)
        
        # MICO Text Art (simplified representation)
        mico_text = """
        ╔═══════════════════════════╗
        ║      🎤 MICO 🎤          ║
        ║                           ║
        ║   👀      👀             ║
        ║        😊                ║
        ║      ╱     ╲             ║
        ║     ╱       ╲            ║
        ╚═══════════════════════════╝
        """
        
        mico_label = tk.Label(
            mico_frame,
            text=mico_text,
            font=("Courier", 12),
            bg="#f0fdf4",
            fg="#166534"
        )
        mico_label.pack()
        
        # Greeting Message
        greeting_frame = tk.Frame(self.root, bg="#f0fdf4")
        greeting_frame.pack(pady=20)
        
        # Get current time for greeting
        from datetime import datetime
        current_hour = datetime.now().hour
        if current_hour < 12:
            greeting = "Good morning"
        elif current_hour < 18:
            greeting = "Good afternoon"
        else:
            greeting = "Good evening"
        
        greeting_title = tk.Label(
            greeting_frame,
            text=f"👋 {greeting}! I'm MICO!",
            font=("Arial", 24, "bold"),
            bg="#f0fdf4",
            fg="#166534"
        )
        greeting_title.pack(pady=10)
        
        greeting_text = tk.Label(
            greeting_frame,
            text=f"{greeting}! Let's start with a short survey to assess your current needs.\n"
                 "I'll guide you through a quick assessment to help personalize your Speakeasy experience.",
            font=("Arial", 12),
            bg="#f0fdf4",
            fg="#065f46",
            justify="center"
        )
        greeting_text.pack(pady=10)
        
        # Start Button
        start_button = tk.Button(
            self.root,
            text="Let's Begin! 🚀",
            font=("Arial", 14, "bold"),
            bg="#14b8a6",
            fg="white",
            padx=30,
            pady=10,
            cursor="hand2",
            command=self.start_survey
        )
        start_button.pack(pady=30)
    
    def clear_window(self):
        """Clear all widgets from the window"""
        for widget in self.root.winfo_children():
            widget.destroy()
    
    def start_survey(self):
        """Start the survey"""
        self.current_question = 0
        self.answers = {}
        self.points = 0
        self.show_question()
    
    def show_question(self):
        """Display current question"""
        self.clear_window()
        
        if self.current_question >= len(self.questions):
            self.show_results()
            return
        
        question_data = self.questions[self.current_question]
        progress = ((self.current_question + 1) / len(self.questions)) * 100
        
        # Header Frame
        header_frame = tk.Frame(self.root, bg="#f0fdf4")
        header_frame.pack(fill="x", padx=20, pady=10)
        
        # MICO Character
        mico_label = tk.Label(
            header_frame,
            text="🎤 MICO",
            font=("Arial", 16, "bold"),
            bg="#f0fdf4",
            fg="#166534"
        )
        mico_label.pack(side="left")
        
        # Progress
        progress_label = tk.Label(
            header_frame,
            text=f"Question {self.current_question + 1} of {len(self.questions)}",
            font=("Arial", 12),
            bg="#f0fdf4",
            fg="#065f46"
        )
        progress_label.pack(side="right")
        
        # Progress Bar
        progress_frame = tk.Frame(self.root, bg="#f0fdf4")
        progress_frame.pack(fill="x", padx=20, pady=10)
        
        progress_canvas = tk.Canvas(
            progress_frame,
            height=20,
            bg="#e5e7eb",
            highlightthickness=0
        )
        progress_canvas.pack(fill="x")
        
        progress_width = int((progress / 100) * 750)
        progress_canvas.create_rectangle(
            0, 0, progress_width, 20,
            fill="#14b8a6",
            outline=""
        )
        
        # Question Frame
        question_frame = tk.Frame(self.root, bg="white", relief="raised", bd=2)
        question_frame.pack(fill="both", expand=True, padx=20, pady=20)
        
        # Question Text
        question_label = tk.Label(
            question_frame,
            text=f"{question_data['emoji']} {question_data['question']}",
            font=("Arial", 14),
            bg="white",
            fg="#111827",
            wraplength=700,
            justify="left",
            anchor="w"
        )
        question_label.pack(padx=20, pady=20, anchor="w")
        
        # Options Frame
        options_frame = tk.Frame(question_frame, bg="white")
        options_frame.pack(fill="both", expand=True, padx=20, pady=10)
        
        # Create option buttons
        for idx, option in enumerate(question_data['options']):
            option_btn = tk.Button(
                options_frame,
                text=option['text'],
                font=("Arial", 11),
                bg="#f9fafb",
                fg="#111827",
                relief="solid",
                bd=1,
                padx=20,
                pady=15,
                anchor="w",
                cursor="hand2",
                command=lambda opt=option: self.handle_answer(question_data['id'], opt)
            )
            option_btn.pack(fill="x", pady=5)
            option_btn.bind("<Enter>", lambda e, btn=option_btn: btn.config(bg="#ecfdf5"))
            option_btn.bind("<Leave>", lambda e, btn=option_btn: btn.config(bg="#f9fafb"))
        
        # Points Display
        points_label = tk.Label(
            self.root,
            text=f"Points earned: {self.points}",
            font=("Arial", 10),
            bg="#f0fdf4",
            fg="#065f46"
        )
        points_label.pack(pady=10)
        
        # Encouragement Text
        encouragement = tk.Label(
            self.root,
            text="MICO is cheering you on! 🎉" if self.current_question < len(self.questions) - 1 else "Almost done! One more question!",
            font=("Arial", 10, "italic"),
            bg="#f0fdf4",
            fg="#059669"
        )
        encouragement.pack(pady=5)
    
    def handle_answer(self, question_id, option):
        """Handle user's answer"""
        self.answers[question_id] = option
        self.points += option['points']
        self.current_question += 1
        
        if self.current_question < len(self.questions):
            self.root.after(300, self.show_question)  # Small delay for smooth transition
        else:
            self.show_results()
    
    def calculate_scores(self):
        """Calculate category scores"""
        need_questions = [q for q in self.questions if q['category'] == 'need']
        frequency_questions = [q for q in self.questions if q['category'] == 'frequency']
        recommend_questions = [q for q in self.questions if q['category'] == 'recommend']
        
        need_score = sum(self.answers.get(q['id'], {}).get('points', 0) for q in need_questions)
        frequency_score = sum(self.answers.get(q['id'], {}).get('points', 0) for q in frequency_questions)
        recommend_score = sum(self.answers.get(q['id'], {}).get('points', 0) for q in recommend_questions)
        
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
    
    def show_results(self):
        """Display survey results"""
        self.clear_window()
        
        scores = self.calculate_scores()
        overall_score = (scores['need']['percentage'] + scores['frequency']['percentage'] + scores['recommend']['percentage']) / 3
        
        # Results Header
        header_frame = tk.Frame(self.root, bg="#f0fdf4")
        header_frame.pack(fill="x", padx=20, pady=20)
        
        mico_celebration = tk.Label(
            header_frame,
            text="🎤 MICO 🎉",
            font=("Arial", 20, "bold"),
            bg="#f0fdf4",
            fg="#166534"
        )
        mico_celebration.pack()
        
        title_label = tk.Label(
            header_frame,
            text="Great Job! 🎉",
            font=("Arial", 24, "bold"),
            bg="#f0fdf4",
            fg="#111827"
        )
        title_label.pack(pady=10)
        
        subtitle_label = tk.Label(
            header_frame,
            text="MICO has analyzed your responses",
            font=("Arial", 12),
            bg="#f0fdf4",
            fg="#065f46"
        )
        subtitle_label.pack()
        
        # Overall Score
        score_frame = tk.Frame(self.root, bg="#14b8a6", relief="raised", bd=2)
        score_frame.pack(fill="x", padx=20, pady=20)
        
        score_label = tk.Label(
            score_frame,
            text=f"Your Engagement Score: {round(overall_score)}%",
            font=("Arial", 18, "bold"),
            bg="#14b8a6",
            fg="white"
        )
        score_label.pack(pady=15)
        
        score_message = tk.Label(
            score_frame,
            text=(
                "You're a perfect match for Speakeasy!" if overall_score >= 70 else
                "Speakeasy could be very helpful for you!" if overall_score >= 40 else
                "Speakeasy might help you improve your speaking skills!"
            ),
            font=("Arial", 12),
            bg="#14b8a6",
            fg="white"
        )
        score_message.pack(pady=5)
        
        # Category Scores
        categories_frame = tk.Frame(self.root, bg="#f0fdf4")
        categories_frame.pack(fill="both", expand=True, padx=20, pady=10)
        
        # Need Score
        need_frame = tk.Frame(categories_frame, bg="#dbeafe", relief="solid", bd=1)
        need_frame.pack(fill="x", pady=5)
        
        tk.Label(
            need_frame,
            text="🎯 Need for App",
            font=("Arial", 12, "bold"),
            bg="#dbeafe",
            fg="#1e40af"
        ).pack(anchor="w", padx=10, pady=5)
        
        tk.Label(
            need_frame,
            text=f"{scores['need']['percentage']}%",
            font=("Arial", 16, "bold"),
            bg="#dbeafe",
            fg="#1e40af"
        ).pack(anchor="w", padx=10)
        
        # Frequency Score
        freq_frame = tk.Frame(categories_frame, bg="#f3e8ff", relief="solid", bd=1)
        freq_frame.pack(fill="x", pady=5)
        
        tk.Label(
            freq_frame,
            text="📈 Usage Frequency",
            font=("Arial", 12, "bold"),
            bg="#f3e8ff",
            fg="#7c3aed"
        ).pack(anchor="w", padx=10, pady=5)
        
        tk.Label(
            freq_frame,
            text=f"{scores['frequency']['percentage']}%",
            font=("Arial", 16, "bold"),
            bg="#f3e8ff",
            fg="#7c3aed"
        ).pack(anchor="w", padx=10)
        
        # Recommend Score
        rec_frame = tk.Frame(categories_frame, bg="#fce7f3", relief="solid", bd=1)
        rec_frame.pack(fill="x", pady=5)
        
        tk.Label(
            rec_frame,
            text="👥 Likely to Recommend",
            font=("Arial", 12, "bold"),
            bg="#fce7f3",
            fg="#be185d"
        ).pack(anchor="w", padx=10, pady=5)
        
        tk.Label(
            rec_frame,
            text=f"{scores['recommend']['percentage']}%",
            font=("Arial", 16, "bold"),
            bg="#fce7f3",
            fg="#be185d"
        ).pack(anchor="w", padx=10)
        
        # Save Results Button
        save_btn = tk.Button(
            self.root,
            text="💾 Save Results",
            font=("Arial", 12),
            bg="#6b7280",
            fg="white",
            padx=20,
            pady=10,
            cursor="hand2",
            command=lambda: self.save_results(scores, overall_score)
        )
        save_btn.pack(pady=10)
        
        # Continue Button
        continue_btn = tk.Button(
            self.root,
            text="Start Your Speakeasy Journey →",
            font=("Arial", 14, "bold"),
            bg="#14b8a6",
            fg="white",
            padx=30,
            pady=15,
            cursor="hand2",
            command=self.close_bot
        )
        continue_btn.pack(pady=20)
    
    def save_results(self, scores, overall_score):
        """Save survey results to JSON file"""
        results = {
            'timestamp': datetime.now().isoformat(),
            'overall_score': round(overall_score),
            'category_scores': {
                'need': scores['need']['percentage'],
                'frequency': scores['frequency']['percentage'],
                'recommend': scores['recommend']['percentage']
            },
            'answers': {qid: {'text': ans['text'], 'points': ans['points']} 
                       for qid, ans in self.answers.items()},
            'total_points': self.points
        }
        
        # Create results directory if it doesn't exist
        results_dir = Path("survey_results")
        results_dir.mkdir(exist_ok=True)
        
        # Save to file
        filename = results_dir / f"survey_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(filename, 'w') as f:
            json.dump(results, f, indent=2)
        
        messagebox.showinfo("Results Saved", f"Survey results saved to:\n{filename}")
    
    def close_bot(self):
        """Close the bot after marking completion"""
        # Mark survey as completed
        self.mark_survey_completed()
        
        # Save results before closing
        if self.answers:
            scores = self.calculate_scores()
            overall_score = (scores['need']['percentage'] + scores['frequency']['percentage'] + scores['recommend']['percentage']) / 3
            self.save_results(scores, overall_score)
        
        # Show completion message
        messagebox.showinfo(
            "Survey Complete!",
            "Thank you for completing the survey!\n\n"
            "Your results have been saved.\n"
            "Return to the browser to continue to Speakeasy."
        )
        
        # Close the bot window
        self.root.quit()
        self.root.destroy()
    
    def mark_survey_completed(self):
        """Mark survey as completed by creating flag files"""
        # Create flag file in project root
        survey_flag_file = Path("survey_completed.flag")
        try:
            with open(survey_flag_file, 'w') as f:
                json.dump({
                    'completed': True,
                    'timestamp': datetime.now().isoformat(),
                    'answers_count': len(self.answers)
                }, f)
            self.survey_completed = True
        except Exception as e:
            print(f"Warning: Could not create survey flag file: {e}")
        
        # Also save to public folder for React app to access
        public_dir = Path("public")
        if public_dir.exists():
            public_flag_file = public_dir / "survey-status.json"
            try:
                with open(public_flag_file, 'w') as f:
                    json.dump({
                        'completed': True,
                        'timestamp': datetime.now().isoformat(),
                        'answers_count': len(self.answers),
                        'completed_via': 'python_bot'
                    }, f)
            except Exception as e:
                print(f"Warning: Could not create public survey status file: {e}")
    
    def launch_speakeasy_app(self):
        """Launch the Speakeasy React application"""
        try:
            # Check if React app is already running
            import socket
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            result = sock.connect_ex(('localhost', 3000))
            sock.close()
            
            if result == 0:
                # Port 3000 is open, app is likely running
                print("Speakeasy app appears to be running. Opening in browser...")
                webbrowser.open('http://localhost:3000')
            else:
                # App is not running, start it
                print("Starting Speakeasy application...")
                project_root = Path(__file__).parent
                
                # Determine the command based on OS
                if sys.platform == 'win32':
                    # Windows
                    subprocess.Popen(
                        ['npm.cmd', 'start'],
                        cwd=str(project_root),
                        shell=True,
                        creationflags=subprocess.CREATE_NEW_CONSOLE
                    )
                else:
                    # Unix-like (Linux, macOS)
                    subprocess.Popen(
                        ['npm', 'start'],
                        cwd=str(project_root),
                        shell=True,
                        stdout=subprocess.DEVNULL,
                        stderr=subprocess.DEVNULL
                    )
                
                # Wait a bit for the server to start, then open browser
                import time
                time.sleep(5)  # Give React app time to start
                webbrowser.open('http://localhost:3000')
                
        except Exception as e:
            messagebox.showerror(
                "Launch Error",
                f"Could not launch Speakeasy app automatically.\n\n"
                f"Error: {str(e)}\n\n"
                f"Please start the app manually:\n"
                f"1. Open terminal in: {Path(__file__).parent}\n"
                f"2. Run: npm start\n"
                f"3. Open: http://localhost:3000"
            )


def main():
    """Main function to run the bot"""
    root = tk.Tk()
    app = MicoSurveyBot(root)
    root.mainloop()


if __name__ == "__main__":
    main()




