# HR Agent - Intelligent Recruitment System

An AI-powered HR agent that automates the recruitment process, from resume processing to interview scheduling, with integrated interview preparation training using SpeakEasy.

## Features

- 📄 **Resume Processing**: Upload and parse candidate resumes
- 📅 **Automated Interview Scheduling**: AI-powered scheduling with calendar integration
- 📧 **Email Automation**: Automated email notifications to candidates
- 🎤 **Interview Preparation**: Integrated SpeakEasy for candidate training and practice
- 🤖 **AI-Powered Matching**: Smart candidate-job matching
- 📊 **Dashboard**: Comprehensive dashboard for HR and candidates

## Tech Stack

### Backend
- Node.js + Express
- MongoDB (for data storage)
- Nodemailer (for email automation)
- Multer (for file uploads)
- PDF parser (for resume extraction)

### Frontend
- React 18
- Tailwind CSS
- Framer Motion (animations)
- Axios (API calls)

### Integration
- SpeakEasy components for interview preparation
- Deepgram API for voice features

## Project Structure

```
HR-Agent/
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── services/
│   └── middleware/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── public/
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas)
- Email service credentials (Gmail, SendGrid, etc.)

### Installation

1. **Backend Setup**:
```bash
cd backend
npm install
```

2. **Frontend Setup**:
```bash
cd frontend
npm install
```

3. **Environment Variables**:
Create `.env` files in both backend and frontend directories.

### Running the Application

**Backend**:
```bash
cd backend
npm start
```

**Frontend**:
```bash
cd frontend
npm start
```

## Features in Detail

### Resume Processing
- Upload PDF/DOCX resumes
- Extract candidate information
- Parse skills, experience, education
- Store in database for matching

### Interview Scheduling
- AI suggests optimal interview times
- Calendar integration
- Automatic conflict detection
- Timezone handling

### Email Automation
- Welcome emails
- Interview confirmation
- Reminder emails
- Rejection/acceptance notifications

### Interview Preparation (SpeakEasy Integration)
- Practice common interview questions
- Voice-based practice sessions
- Get feedback on speaking skills
- PREP framework for structured answers
- Confidence building exercises

## API Endpoints

### Candidates
- `POST /api/candidates` - Upload resume
- `GET /api/candidates/:id` - Get candidate details
- `POST /api/candidates/:id/schedule` - Schedule interview

### Interviews
- `GET /api/interviews` - List all interviews
- `POST /api/interviews` - Create interview
- `PUT /api/interviews/:id` - Update interview

### Emails
- `POST /api/emails/send` - Send email to candidate

## License

MIT
