# SpeakEasy Frontend-Backend Integration Guide

This guide explains how to integrate the React frontend with the Node.js backend for the SpeakEasy Public Speaking Assistant.

## 🏗️ Architecture Overview

```
Frontend (React + TypeScript)     Backend (Node.js + Express)
├── Speech Generator              ├── /api/conversations/generate
├── Speaking Tips                 ├── /api/conversations/history
├── Speech History                ├── /api/auth/login
└── Authentication Context        └── JWT Authentication
```

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
cp env.example .env
# Edit .env with your API keys
npm run dev
```

### 2. Frontend Setup

```bash
cd ui
npm install
npm run dev
```

### 3. Test Integration

1. Visit `http://localhost:5173`
2. Enter a speech topic
3. Click "Generate Speaking Points"
4. Check Speech History for saved conversations

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Speech Generation
- `POST /api/conversations/generate` - Generate speaking points
- `GET /api/conversations/history` - Get conversation history
- `GET /api/conversations/:id` - Get specific conversation
- `DELETE /api/conversations/:id` - Delete conversation
- `GET /api/conversations/stats/overview` - Get statistics

### Admin (Admin users only)
- `GET /api/admin/ai-settings` - Get AI provider settings
- `PUT /api/admin/ai-provider` - Update AI provider
- `GET /api/admin/stats` - Get system statistics

## 🔧 Frontend Integration

### API Service

The frontend uses a centralized API service (`src/services/api.ts`):

```typescript
import { apiService } from '../services/api';

// Login
const result = await apiService.login('admin', 'admin123');

// Generate speech
const speech = await apiService.generateSpeech(
  'Climate change', 
  'impromptu', 
  5
);

// Get history
const history = await apiService.getConversationHistory();
```

### Authentication Context

The app uses React Context for authentication:

```typescript
import { useAuth } from '../context/AuthContext';

const { user, login, logout, isAuthenticated } = useAuth();
```

### Component Updates

#### Speech Generator (`src/pages/SpeechGenerator.tsx`)

```typescript
const handleGenerateSpeech = async () => {
  setIsGenerating(true);
  try {
    const result = await apiService.generateSpeech(
      speechTopic, 
      speechType, 
      duration
    );
    setGeneratedPoints(result.speaking_points);
  } catch (error) {
    setError(error.message);
  } finally {
    setIsGenerating(false);
  }
};
```

#### Speech History (`src/pages/SpeechHistory.tsx`)

```typescript
useEffect(() => {
  const loadData = async () => {
    const [historyResult, statsResult] = await Promise.all([
      apiService.getConversationHistory(),
      apiService.getConversationStats()
    ]);
    setSpeeches(historyResult.conversations);
    setStats(statsResult);
  };
  loadData();
}, []);
```

## 🔐 Authentication Flow

1. **Auto-login**: App automatically logs in as admin for demo
2. **Token Storage**: JWT tokens stored in localStorage
3. **API Headers**: Authorization header added to all requests
4. **Error Handling**: 401 errors trigger logout

## 🎨 UI Features

### Speech Generator
- ✅ Topic input with suggestions
- ✅ Speech type selection (Impromptu/Planned)
- ✅ Duration slider (1-30 minutes)
- ✅ Real-time generation with loading states
- ✅ Error handling and display
- ✅ Generated points display

### Speech History
- ✅ Conversation list with pagination
- ✅ Statistics dashboard
- ✅ Search and filter options
- ✅ Delete conversations
- ✅ Regenerate speeches

### Responsive Design
- ✅ Mobile-first approach
- ✅ Dark/light theme support
- ✅ Consistent branding
- ✅ Accessible components

## 🛠️ Development

### Environment Variables

#### Backend (`.env`)
```env
PORT=3001
NODE_ENV=development
DATABASE_TYPE=sqlite
SQLITE_DATABASE=:memory:
JWT_SECRET=speakeasy-super-secret-jwt-key
OPENAI_API_KEY=your-openai-api-key-here
```

#### Frontend (vite.config.ts)
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
});
```

### Testing API Endpoints

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# Generate speech
curl -X POST http://localhost:3001/api/conversations/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"topic": "Climate change", "speech_type": "impromptu", "duration": 5}'

# Get history
curl -X GET http://localhost:3001/api/conversations/history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🚨 Error Handling

### Frontend
- Network errors show user-friendly messages
- Loading states prevent multiple requests
- Form validation with real-time feedback
- Graceful fallbacks for missing data

### Backend
- JWT validation middleware
- Input validation with Joi
- Database error handling
- AI provider fallback system

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Conversations Table
```sql
CREATE TABLE conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  topic VARCHAR(255) NOT NULL,
  speech_type VARCHAR(20) NOT NULL,
  duration INTEGER NOT NULL,
  ai_provider VARCHAR(20) NOT NULL,
  speaking_points TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 🔄 Deployment

### Backend
1. Set production environment variables
2. Configure PostgreSQL database
3. Run migrations: `npm run migrate`
4. Start server: `npm start`

### Frontend
1. Build: `npm run build`
2. Serve static files
3. Configure API proxy

## 📝 Notes

- The app uses SQLite in-memory database for development
- Production should use PostgreSQL
- OpenAI API key required for AI generation
- Mock provider available as fallback
- All API keys should be stored in environment variables
- JWT tokens expire after 7 days by default
