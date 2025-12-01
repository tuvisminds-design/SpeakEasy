# Controller Update - Multi-Service Management

## ✅ What's New

The controller has been updated to manage **three services**:

1. **🎤 SpeakEasy** - Port 3000
2. **⚙️ HR Backend** - Port 5000  
3. **💼 HR Frontend** - Port 3001

## 🎯 Features

- **Independent Control**: Start/stop each service individually
- **Status Monitoring**: Real-time status for each service
- **Service Logs**: View logs for each service
- **Quick Links**: Direct links to running services
- **Auto-Detection**: Automatically detects running services on startup

## 🚀 Usage

### Start the Controller
```bash
npm run controller
# or
npx electron controller/main.js
```

### In the Controller Window:

1. **SpeakEasy Service**
   - Click "Start" to launch SpeakEasy on port 3000
   - Click "Stop" to stop it
   - Link appears when running: http://localhost:3000

2. **HR Backend Service**
   - Click "Start" to launch HR Backend API on port 5000
   - Click "Stop" to stop it
   - Link appears when running: http://localhost:5000

3. **HR Frontend Service**
   - Click "Start" to launch HR Frontend on port 3001
   - Click "Stop" to stop it
   - Link appears when running: http://localhost:3001

4. **Refresh All Status**
   - Click to check status of all services

## 📋 Service Ports

| Service | Port | URL |
|---------|------|-----|
| SpeakEasy | 3000 | http://localhost:3000 |
| HR Backend | 5000 | http://localhost:5000 |
| HR Frontend | 3001 | http://localhost:3001 |

## 🔧 Configuration

### HR Frontend Port
The HR Frontend is configured to run on port 3001 via `.env` file:
```
PORT=3001
BROWSER=none
```

### HR Backend Port
Configured in `backend/.env`:
```
PORT=5000
```

## 💡 Tips

- Start HR Backend before HR Frontend (Frontend needs Backend API)
- All services can run simultaneously
- Controller automatically stops all services when closed
- Use "Refresh All Status" if services were started manually

## 🐛 Troubleshooting

### Service won't start?
- Check if port is already in use
- Verify dependencies are installed (`npm install`)
- Check service-specific logs in the controller

### Service won't stop?
- Click "Refresh All Status" first
- Try stopping manually via Task Manager (Windows) or Activity Monitor (Mac)

---

**All services are now manageable from one convenient controller! 🎉**

