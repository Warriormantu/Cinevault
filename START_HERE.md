# 🚀 CineVault - Start Here

Your full-stack movie discovery app is ready to run! Here's how to get started:

---

## 🔧 Setup Instructions

### 1. Install Dependencies

**Frontend:**
```bash
cd client
npm install
```

**Backend:**
```bash
cd server
npm install
```

### 2. Environment Variables ✅

**Backend (.env)** - Already configured with MongoDB Atlas
```
PORT=5000
MONGO_URI=mongodb+srv://mandb:Zxc273412@cluster0.tbtixea.mongodb.net/cinevault_db?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env.local)** - Needs TMDB API key
```bash
VITE_API_URL=http://localhost:5000/api
VITE_TMDB_API_KEY=YOUR_TMDB_API_KEY_HERE  # ← Add your key from https://www.themoviedb.org/settings/api
```

---

## ▶️ Running the Project

### Start Backend (Terminal 1)
```bash
cd server
npm run dev
```

Expected: `✓ Server running on http://localhost:5000`

### Start Frontend (Terminal 2)
```bash
cd client
npm run dev
```

Expected: `VITE v... ready in XXX ms`

### Open in Browser
Visit: **http://localhost:3000**

---

## 🎬 What You Can Do

✅ **Browse movies** - Trending, Popular, Upcoming  
✅ **Search movies** - Real-time TMDB search  
✅ **View details** - Full movie information  
✅ **Create account** - Sign up with JWT auth  
✅ **Save favorites** - Add movies to "My List"  
✅ **Responsive UI** - Works on all devices  

---

## 🗂️ Project Structure

```
cinevault/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Routes/pages
│   │   ├── services/      # API calls
│   │   ├── context/       # Auth context
│   │   └── App.jsx
│   ├── .env.local         # ← Add TMDB key here
│   └── package.json
│
├── server/                # Express backend
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth, errors
│   ├── .env              # ✅ Already configured
│   └── server.js
│
├── README.md             # Project overview
├── FINAL_DEPLOYMENT_STEPS.md    # Deployment guide
├── DEPLOYMENT_CHECKLIST.md      # Pre-deploy checklist
└── QUICK_COMMANDS.md     # Common commands
```

---

## 📝 Next Steps

### Before First Run:
- [ ] Add TMDB API key to `client/.env.local`
- [ ] Verify MongoDB connection string in `server/.env`
- [ ] Run `npm install` in both folders

### First Run Checklist:
- [ ] Start backend on http://localhost:5000
- [ ] Start frontend on http://localhost:3000
- [ ] Browse movies without logging in
- [ ] Search for a movie
- [ ] Sign up with email/password
- [ ] Add movie to favorites

### When Ready to Deploy:
- [ ] Follow `FINAL_DEPLOYMENT_STEPS.md`
- [ ] Use `DEPLOYMENT_CHECKLIST.md` to verify
- [ ] Deploy to Vercel (frontend) + Render (backend)

---

## 🆘 Troubleshooting

**Frontend can't reach backend?**
- [ ] Check backend is running on port 5000
- [ ] Verify VITE_API_URL in .env.local

**Search returns error?**
- [ ] Add TMDB API key to .env.local
- [ ] Verify key is valid at https://www.themoviedb.org/settings/api

**MongoDB connection failed?**
- [ ] Check internet connection
- [ ] Verify MongoDB URI in server/.env
- [ ] Ensure MongoDB Atlas cluster is running

**Build errors?**
```bash
# Clear cache and reinstall
rm -r node_modules
npm install
npm run dev
```

---

## 📚 Documentation

- **README.md** - Project overview
- **FINAL_DEPLOYMENT_STEPS.md** - How to deploy
- **DEPLOYMENT_CHECKLIST.md** - Verify before deployment
- **QUICK_COMMANDS.md** - Useful commands
- **QUICK_TEST_CHECKLIST.md** - Test your app

---

## 🎯 Architecture

**Frontend → Backend → Database**

1. React app loads on localhost:3000
2. Makes API calls to localhost:5000/api
3. Backend queries MongoDB Atlas
4. TMDB API for movie data
5. JWT tokens for authentication

---

## 🔑 Key Features Implemented

| Feature | Status | Location |
|---------|--------|----------|
| Search | ✅ | SearchBar.jsx + api.js |
| Auth | ✅ | Login.jsx + authContext |
| Favorites | ✅ | MyList.jsx + user.js |
| Details | ✅ | MovieDetails.jsx |
| UI Polish | ✅ | MovieCard + animations |

---

## 🚀 Ready? Let's Go!

1. Add TMDB key to `client/.env.local`
2. Run both dev servers
3. Open http://localhost:3000
4. Build amazing things!

---

**Questions?** Check the documentation files or review the code comments.

**Ready to deploy?** Follow `FINAL_DEPLOYMENT_STEPS.md`

**Happy coding!** 🎬✨
