# ⚡ Quick Command Reference

## 🚀 Start Everything

### Terminal 1 - Database
```bash
mongod
```

### Terminal 2 - Backend
```bash
cd server
npm install  # (if first time)
npm run dev
```

Expected output:
```
Server running on port 5000
MongoDB Connected
```

### Terminal 3 - Frontend (optional)
```bash
cd client
npm install  # (if first time)
npm run dev
```

Expected output:
```
VITE v5.0.0  ready in XXX ms

➜  Local:   http://localhost:5173/
```

---

## 🧪 Quick Test Commands

### Test 1: Backend Running
```bash
curl http://localhost:5000
# Expected: "CineVault API Running..."
```

### Test 2: Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test@123"
  }'
```

### Test 3: Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123"
  }'
```

---

## 💾 Database Commands

### Connect to MongoDB
```bash
mongosh
```

### View Database
```bash
use cinevault
db.users.find()
db.users.findOne()
```

### Clear Test Data
```bash
db.users.deleteMany({})
```

### Exit MongoDB
```bash
exit
```

---

## 📊 Check Status

### Is Backend Running?
```bash
curl http://localhost:5000
```

### Is MongoDB Running?
```bash
mongosh --eval "db.adminCommand('ping')"
```

### What's Using Port 5000?
```bash
# On Windows:
netstat -ano | findstr :5000

# On Mac/Linux:
lsof -i:5000
```

---

## 🛠️ Install & Setup

### First Time Setup
```bash
# Install dependencies
cd server
npm install

cd ../client
npm install

# Create MongoDB (if local)
# mongod starts outside of terminal

# Update .env variables
cd ../server
# Edit .env with your settings
```

### If Something's Missing
```bash
# Reinstall everything
cd server
rm -rf node_modules package-lock.json
npm install

# Same for client
cd ../client
rm -rf node_modules package-lock.json
npm install
```

---

## 🧹 Cleanup

### Clear MongoDB
```bash
mongosh
use cinevault
db.users.deleteMany({})
exit
```

### Stop Backend
```bash
# Press Ctrl+C in terminal running backend
```

### Stop Frontend
```bash
# Press Ctrl+C in terminal running frontend
```

### Stop MongoDB
```bash
# Press Ctrl+C in terminal running MongoDB
```

---

## 📝 Edit Configuration

### Backend .env
```bash
# Open file
code server/.env

# Or with any editor:
# - Windows: notepad server\.env
# - Mac: open -e server/.env
# - Linux: nano server/.env
```

### Frontend API Key
```bash
# Edit Home.jsx
code client/src/pages/Home.jsx

# Search for: YOUR_TMDB_API_KEY
# Replace with your actual key from: https://www.themoviedb.org/settings/api
```

---

## 🆘 Emergency Fixes

### Backend won't start
```bash
# Clear cache and reinstall
cd server
rm -rf node_modules yarn.lock package-lock.json
npm install
npm run dev
```

### MongoDB won't connect
```bash
# Check MongoDB is running
mongosh

# If that works, MongoDB is fine
# Check MONGO_URI in .env file
```

### Port Already in Use
```bash
# Backend port 5000
# Windows: netstat -ano | findstr :5000
# Then kill process

# Frontend port 5173
# Change in client/vite.config.js
```

### Clear Everything & Start Fresh
```bash
# Stop all services (Ctrl+C)

# Delete node_modules
cd server && rm -rf node_modules
cd ../client && rm -rf node_modules

# Clear MongoDB
mongosh → db.users.deleteMany({})

# Reinstall
cd server && npm install
cd ../client && npm install

# Start fresh
# Terminal 1: mongod
# Terminal 2: cd server && npm run dev
# Terminal 3: cd client && npm run dev
```

---

## 📚 Access Points

| Service | URL | Command |
|---------|-----|---------|
| **Backend** | http://localhost:5000 | `npm run dev` (in `/server`) |
| **Frontend** | http://localhost:5173 | `npm run dev` (in `/client`) |
| **MongoDB** | localhost:27017 | `mongod` |
| **Postman** | Desktop app | Import *CineVault_API.postman_collection.json* |

---

## 🎯 Daily Workflow

### Start of Day
```bash
# Terminal 1
mongod

# Terminal 2
cd server && npm run dev

# Terminal 3
cd client && npm run dev

# Terminal 4
# Open Postman and test
```

### End of Day
```bash
# Ctrl+C in all terminals
# Everything stops
```

### Next Day
```bash
# Start same 3 terminals again
# Data persists (saved in MongoDB)
```

---

## 📞 Common Problems

| Problem | Quick Fix |
|---------|-----------|
| "Cannot POST /api/auth/register" | Check backend running: `curl http://localhost:5000` |
| "Cannot connect to MongoDB" | Check mongod running: `mongosh` |
| "EADDRINUSE: address already in use :::5000" | Kill process on port 5000 |
| "Cannot find module" | Run `npm install` and `npm run dev` again |
| "jwt malformed" | Token expired, register again |
| "User already exists" | Use different email or `db.users.deleteMany({})` |

---

## 🔑 Important Files

| File | Purpose | Path |
|------|---------|------|
| .env | Configuration | `/server/.env` |
| server.js | Main backend | `/server/server.js` |
| authController.js | Auth logic | `/server/controllers/authController.js` |
| User.js | Database schema | `/server/models/User.js` |
| Home.jsx | Frontend main | `/client/src/pages/Home.jsx` |

---

## 💻 Code Editor Shortcuts

### VS Code
```bash
# Open project
code server/     # Backend folder
code client/     # Frontend folder
code .           # Current folder
```

### Terminal in VS Code
```
Ctrl + `         # Toggle terminal
Ctrl + Shift + ` # New terminal
```

---

## 🚀 Deploy (Future)

```bash
# Backend (e.g., Heroku, Railway)
npm run start    # Uses package.json start script

# Frontend (e.g., Vercel, Netlify)
npm run build    # Creates optimized build
# Then deploy dist/ folder
```

---

## 📊 View Logs

### Backend Logs
```bash
# See in terminal where you ran: npm run dev
# All console.log() outputs appear here
```

### Frontend Logs
```bash
# Browser Console: F12 or Ctrl+Shift+I
# See in terminal where you ran: npm run dev
```

### MongoDB Logs
```bash
# See in terminal where you ran: mongod
```

---

✨ **That's it! You're ready to code!**

**Now get started:** 🚀

```bash
mongod  # Terminal 1
cd server && npm run dev  # Terminal 2
```

Happy coding! 💻
