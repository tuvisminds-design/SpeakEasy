# 🚀 How to Start HireEasy Services

## Required Services:

1. **MongoDB** (Database)
2. **Backend Server** (Port 5000)
3. **Frontend** (Port 3000) - Already running

## Step-by-Step:

### 1. Start MongoDB

**Option A: If MongoDB is installed locally:**
```powershell
# Check if MongoDB service exists
Get-Service MongoDB

# Start MongoDB service
net start MongoDB
```

**Option B: Use MongoDB Atlas (Cloud - Recommended):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster
4. Get connection string
5. Create `backend/.env` file:
   ```
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/hr-agent
   PORT=5000
   ```

### 2. Start Backend Server

```powershell
cd C:\Users\shrin\Speakeasy\backend
npm start
```

**You should see:**
```
✅ Connected to MongoDB
🚀 HR Agent Backend running on port 5000
📡 API available at http://localhost:5000/api
```

### 3. Verify Everything is Running

**Check Backend:**
- Visit: http://localhost:5000/health
- Should show: `{"status":"OK","message":"HR Agent API is running"}`

**Check Frontend:**
- Already running at: http://localhost:3000

### 4. Try Uploading Resume Again

Once both services are running, the resume upload should work!

## Quick Commands:

```powershell
# Terminal 1: Start MongoDB (if local)
net start MongoDB

# Terminal 2: Start Backend
cd C:\Users\shrin\Speakeasy\backend
npm start

# Terminal 3: Frontend (already running)
# Should be at http://localhost:3000
```

## Troubleshooting:

- **"Cannot connect to server"** → Backend not running
- **"Database error"** → MongoDB not running  
- **"ECONNREFUSED"** → Service not started


