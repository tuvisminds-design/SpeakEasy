# SpeakEasy Backend API

A Node.js backend API for the SpeakEasy Public Speaking Assistant, providing AI-powered speech generation and conversation management.

## Features

- 🔐 **Authentication**: JWT-based authentication with admin/user roles
- 🤖 **AI Integration**: Support for OpenAI, Claude, and Gemini
- 💾 **Database**: SQLite (in-memory) with PostgreSQL option
- 📊 **Conversation Management**: Store and retrieve speech generation history
- ⚙️ **Admin Panel**: Configure AI providers and view system statistics
- 🛡️ **Security**: Rate limiting, CORS, and input validation

## Technology Stack

- **Node.js** with **TypeScript**
- **Express.js** web framework
- **Knex.js** query builder with migrations
- **SQLite** (in-memory) / **PostgreSQL** database
- **JWT** authentication
- **OpenAI**, **Claude**, **Gemini** AI providers
- **Joi** validation
- **Helmet** security middleware

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment file:
   ```bash
   cp env.example .env
   ```

3. Configure your environment variables in `.env`:
   ```env
   # Required: Add your AI API keys
   OPENAI_API_KEY=your-openai-api-key
   ANTHROPIC_API_KEY=your-anthropic-api-key
   GOOGLE_API_KEY=your-google-api-key
   
   # Optional: Change JWT secret
   JWT_SECRET=your-super-secret-jwt-key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login with username/password

### Conversations

- `POST /api/conversations/generate` - Generate speech points
- `GET /api/conversations/history` - Get conversation history
- `GET /api/conversations/:id` - Get specific conversation
- `DELETE /api/conversations/:id` - Delete conversation
- `GET /api/conversations/stats/overview` - Get user statistics

### Admin (Admin only)

- `GET /api/admin/ai-settings` - Get AI provider settings
- `PUT /api/admin/ai-provider` - Update active AI provider
- `GET /api/admin/stats` - Get system statistics

## Authentication API

- `POST /api/auth/send-otp` - Send OTP to email address
- `POST /api/auth/verify-otp` - Verify OTP and get JWT token
- `GET /api/auth/profile` - Get user profile (requires authentication)
- `PUT /api/auth/profile` - Update user profile (requires authentication)

## API Usage Examples

### Send OTP
```bash
curl -X POST http://localhost:3001/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "kulkarni.madhwaraj@gmail.com"}'
```

### Verify OTP
```bash
curl -X POST http://localhost:3001/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "kulkarni.madhwaraj@gmail.com", "otp": "1234"}'
```

## Default Admin Account

- **Email**: `admin@speakeasy.com`
- **Name**: Admin User
- **Authentication**: OTP-based (no password required)

## Database Configuration

### SQLite (Default)
The application uses SQLite in-memory database by default, which is perfect for development and testing.

### PostgreSQL
To use PostgreSQL, update your `.env` file:
```env
DATABASE_TYPE=postgresql
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=speakeasy
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
```

## AI Provider Configuration

The system supports three AI providers:

1. **OpenAI** (GPT-3.5-turbo)
2. **Claude** (Claude-3-sonnet)
3. **Gemini** (Gemini Pro)

Only one provider can be active at a time. Use the admin endpoints to switch between providers.

## API Usage Examples

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "kulkarni.madhwaraj@gmail.com", "password": "admin123"}'
```

### Generate Speech
```bash
curl -X POST http://localhost:3001/api/conversations/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "topic": "The importance of work-life balance",
    "speech_type": "impromptu",
    "duration": 5
  }'
```

### Get Conversation History
```bash
curl -X GET http://localhost:3001/api/conversations/history \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

### Project Structure

```
src/
├── config/          # Database configuration
├── middleware/      # Express middleware
├── migrations/      # Database migrations
├── routes/          # API route handlers
├── seeds/           # Database seeds
├── services/        # Business logic
├── types/           # TypeScript type definitions
└── index.ts         # Application entry point
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevent abuse with request rate limiting
- **Input Validation**: Joi schema validation for all inputs
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Security**: Security headers and protection
- **SQL Injection Protection**: Parameterized queries with Knex.js

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `DATABASE_TYPE` | Database type | sqlite |
| `JWT_SECRET` | JWT signing secret | - |
| `OPENAI_API_KEY` | OpenAI API key | - |
| `ANTHROPIC_API_KEY` | Claude API key | - |
| `GOOGLE_API_KEY` | Gemini API key | - |

## License

MIT License
