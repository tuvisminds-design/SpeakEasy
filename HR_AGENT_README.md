# HR Agent - Intelligent Recruitment System

A professional HR recruitment platform with AI-powered interview training, automated scheduling, and email notifications. Integrated with **SpeakEasy** for candidate interview preparation.

## 🚀 Features

### Core Functionality
- **Resume Upload & Parsing**: Upload PDF/DOCX resumes with automatic data extraction
- **Automated Interview Scheduling**: Easy calendar-based scheduling system
- **Email Notifications**: Automated interview confirmation and reminder emails
- **Candidate Management**: Track candidates through the entire recruitment process

### SpeakEasy Integration
- **Interview Preparation**: Comprehensive tips and guidance for candidates
- **AI-Powered Practice**: Practice interview responses using SpeakEasy's PREP framework
- **Voice Training**: Text-to-speech and speech-to-text capabilities
- **Structured Responses**: Generate speaking points for any interview question

## 📋 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **Nodemailer** for email notifications
- **Multer** for file uploads
- **PDF-Parse & Mammoth** for resume parsing

### Frontend
- **React 18** with React Router
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **Axios** for API calls
- **Date-fns** for date formatting

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- SMTP email account (Gmail, Outlook, etc.)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/hr-agent
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   FRONTEND_URL=http://localhost:3000
   JWT_SECRET=your-secret-key-here
   ```

4. **Create uploads directory:**
   ```bash
   mkdir -p uploads/resumes
   ```

5. **Start the backend server:**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd hr-agent-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file (optional):**
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
hr-agent/
├── backend/
│   ├── controllers/
│   │   └── resumeController.js    # Resume parsing logic
│   ├── models/
│   │   ├── Candidate.js           # Candidate data model
│   │   └── Interview.js           # Interview data model
│   ├── routes/
│   │   ├── candidates.js          # Candidate API routes
│   │   ├── interviews.js          # Interview API routes
│   │   ├── emails.js              # Email API routes
│   │   └── resumes.js             # Resume upload routes
│   ├── services/
│   │   └── emailService.js        # Email sending service
│   ├── uploads/
│   │   └── resumes/               # Uploaded resume files
│   └── server.js                  # Express server setup
│
└── hr-agent-frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.js              # Main dashboard
    │   │   ├── ResumeUpload.js           # Resume upload component
    │   │   ├── InterviewScheduling.js    # Interview scheduling
    │   │   ├── InterviewPreparation.js    # Preparation tips (SpeakEasy)
    │   │   ├── InterviewPractice.js      # Practice with SpeakEasy
    │   │   └── Sidebar.js                # Navigation sidebar
    │   ├── App.js                        # Main app component
    │   ├── index.js                      # React entry point
    │   └── index.css                     # Tailwind CSS imports
    └── package.json
```

## 🎯 Usage Guide

### For Candidates

1. **Upload Resume**
   - Navigate to "Upload Resume"
   - Select your PDF or Word document
   - Fill in your contact information
   - System automatically parses your resume

2. **Schedule Interview**
   - Choose a convenient date and time
   - Receive confirmation email automatically
   - Get interview link (for video interviews)

3. **Prepare for Interview**
   - Review speaking tips and best practices
   - Study common interview questions
   - Use the preparation checklist

4. **Practice with SpeakEasy**
   - Enter any interview question
   - Get AI-generated speaking points using PREP framework
   - Practice with voice playback
   - Review structured responses

### For HR Team

1. **View Candidates**
   - Access candidate dashboard
   - Review uploaded resumes
   - Track interview status

2. **Manage Interviews**
   - View scheduled interviews
   - Send reminders
   - Update interview status

## 🔧 API Endpoints

### Candidates
- `POST /api/candidates` - Upload resume and create candidate
- `GET /api/candidates` - Get all candidates
- `GET /api/candidates/:id` - Get candidate by ID
- `PATCH /api/candidates/:id/status` - Update candidate status

### Interviews
- `POST /api/interviews` - Schedule new interview
- `GET /api/interviews` - Get all interviews
- `GET /api/interviews/:id` - Get interview by ID
- `PUT /api/interviews/:id` - Update interview
- `PATCH /api/interviews/:id/cancel` - Cancel interview

### Resumes
- `POST /api/resumes/upload` - Upload resume file

### Emails
- `POST /api/emails/test` - Send test email

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-Factor Authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the app password in `SMTP_PASS`

### Other Email Providers
Update `SMTP_HOST` and `SMTP_PORT` in `.env`:
- **Outlook**: `smtp-mail.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`
- **Custom SMTP**: Use your provider's settings

## 🎨 SpeakEasy Integration

The HR Agent integrates SpeakEasy's AI speech generation for interview preparation:

- **PREP Framework**: Point, Reason, Example, Point structure
- **Voice Features**: Text-to-speech for practice
- **Structured Responses**: AI-generated speaking points
- **Interview Tips**: Comprehensive preparation guidance

## 🔒 Security Notes

- Store sensitive credentials in `.env` files
- Never commit `.env` files to version control
- Use environment variables for API keys
- Implement authentication for production use

## 🚀 Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use MongoDB Atlas or production database
3. Configure production SMTP server
4. Set up file storage (AWS S3, etc.)

### Frontend
1. Build production bundle: `npm run build`
2. Serve with Nginx or similar
3. Configure API URL for production backend

## 📝 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues or questions, please open an issue on the repository.

---

**Built with ❤️ using SpeakEasy AI Integration**

