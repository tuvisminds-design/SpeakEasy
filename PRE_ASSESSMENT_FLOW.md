# 🎤 Pre-Assessment Survey Flow

## Overview

The Speakeasy application now includes a **Python bot** that handles the pre-assessment survey **before** users access the main application. This ensures all users complete the survey first.

## Flow

1. **User starts application** → Python bot launches first
2. **Python bot** → Guides user through 9 pre-assessment questions
3. **Survey completion** → Results saved, completion status marked
4. **Speakeasy app launches** → Automatically opens in browser
5. **React app checks** → Skips PreEvaluationTest if Python bot completed it

## How to Use

### Option 1: Use the Startup Script (Recommended)

**Windows:**
```bash
start-speakeasy-with-survey.bat
```

**PowerShell:**
```powershell
.\start-speakeasy-with-survey.ps1
```

### Option 2: Manual Start

1. Run the Python bot first:
   ```bash
   python mico_survey_bot.py
   ```

2. Complete the survey

3. The bot will automatically launch the React app when you click "Start Your Speakeasy Journey"

## Files

- `mico_survey_bot.py` - Python GUI bot for pre-assessment
- `start-speakeasy-with-survey.bat` - Windows batch script
- `start-speakeasy-with-survey.ps1` - PowerShell script
- `public/survey-status.json` - Completion status (created by bot)
- `survey_completed.flag` - Completion flag file
- `survey_results/` - Directory for saved survey results

## Integration

The React app (`src/App.js`) automatically checks for Python bot completion:
- On app load, it fetches `/survey-status.json`
- If completed via Python bot, it sets `speakeasy_test_completed` in localStorage
- User skips the React PreEvaluationTest component

## Survey Questions

The bot asks 9 questions across 3 categories:
1. **Need for App** (3 questions)
2. **Usage Frequency** (3 questions)  
3. **Likely to Recommend** (3 questions)

## Results

Survey results are saved to:
- `survey_results/survey_results_YYYYMMDD_HHMMSS.json`
- Includes scores, answers, and timestamps

## Notes

- The Python bot must complete before accessing the main app
- Survey completion is persistent (stored in localStorage)
- Users can skip the Python bot and use the React PreEvaluationTest if needed
- The bot automatically launches the React app after completion

