# HR Agent - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Start MongoDB
Make sure MongoDB is running on your system:
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud) - update MONGODB_URI in .env
```

### Step 2: Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your email credentials
npm start
```

### Step 3: Frontend Setup
```bash
cd hr-agent-frontend
npm install
npm start
```

### Step 4: Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📧 Email Setup (Required for Notifications)

### Gmail Setup:
1. Go to: https://myaccount.google.com/apppasswords
2. Generate an App Password
3. Use it in `backend/.env`:
   ```
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   ```

## ✅ Test the System

1. **Upload Resume**
   - Go to "Upload Resume"
   - Upload a PDF or Word document
   - Fill in your details

2. **Schedule Interview**
   - Choose date and time
   - Check your email for confirmation

3. **Practice Interview**
   - Go to "Practice Session"
   - Enter an interview question
   - Get AI-generated speaking points

## 🎯 Key Features

- ✅ Resume Upload & Parsing
- ✅ Automated Interview Scheduling
- ✅ Email Notifications
- ✅ SpeakEasy AI Integration
- ✅ Interview Preparation Tips
- ✅ Practice Sessions with PREP Framework

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify `.env` file exists
- Check port 5000 is available

### Frontend won't start
- Check port 3000 is available
- Run `npm install` again
- Clear cache: `rm -rf node_modules package-lock.json && npm install`

### Emails not sending
- Verify SMTP credentials in `.env`
- Check email provider allows SMTP
- For Gmail, use App Password (not regular password)

## 📚 Next Steps

- Read full documentation: `HR_AGENT_README.md`
- Customize email templates in `backend/services/emailService.js`
- Add more interview questions in `InterviewPractice.js`
- Integrate with calendar APIs for automatic scheduling

---

**Ready to revolutionize your recruitment process! 🎉**

