# Resume Upload Troubleshooting Guide

## Issue: "Failed to upload resume. Please try again."

### Most Common Causes:

1. **MongoDB Not Running** ⚠️ (Most Likely)
   - The backend needs MongoDB to save candidate data
   - Error: `ECONNREFUSED 127.0.0.1:27017`

2. **Backend Server Not Running**
   - Backend should be running on port 5000
   - Check: http://localhost:5000/health

3. **Network/CORS Issues**
   - Frontend can't reach backend

## Solutions:

### 1. Start MongoDB

**Option A: Local MongoDB**
```bash
# Windows (if installed as service)
net start MongoDB

# Or start manually
mongod --dbpath "C:\data\db"
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hr-agent
   ```

### 2. Start Backend Server

```bash
cd backend
npm start
```

Should see:
```
✅ Connected to MongoDB
🚀 HR Agent Backend running on port 5000
```

### 3. Check Backend Health

Visit: http://localhost:5000/health

Should return:
```json
{
  "status": "OK",
  "message": "HR Agent API is running"
}
```

### 4. Verify Frontend Connection

The frontend calls: `http://localhost:5000/api/resumes/upload`

Make sure:
- Backend is running on port 5000
- No firewall blocking the connection
- CORS is enabled (already configured)

## Quick Fix Steps:

1. **Start MongoDB:**
   ```bash
   # Check if MongoDB is installed
   mongod --version
   
   # Start MongoDB service (Windows)
   net start MongoDB
   ```

2. **Start Backend:**
   ```bash
   cd C:\Users\shrin\Speakeasy\backend
   npm start
   ```

3. **Verify:**
   - Backend shows: "✅ Connected to MongoDB"
   - Visit: http://localhost:5000/health
   - Try uploading resume again

## Error Messages:

- **"Cannot connect to server"** → Backend not running
- **"Database error"** → MongoDB not running
- **"Resume file is required"** → File not selected
- **"Email is required"** → Email field empty

## Need Help?

Check backend console logs for detailed error messages!


