# Installation Instructions

## Prerequisites
Before starting, ensure you have:
- Node.js (v16 or higher) - [Download](https://nodejs.org/)
- npm (comes with Node.js)
- A code editor (VS Code recommended)
- A web browser (Chrome, Firefox, Edge, etc.)

## Step-by-Step Installation

### 1. Install Backend Dependencies

Open a terminal and navigate to the backend directory:
```powershell
cd c:\Users\vansh\OneDrive\Desktop\Personal\Java\GUI\backend
```

Install the required packages:
```powershell
npm install
```

Expected packages to be installed:
- express
- cors
- dotenv
- multer
- morgan
- nodemon (dev dependency)

### 2. Install Frontend Dependencies

Open a new terminal and navigate to the frontend directory:
```powershell
cd c:\Users\vansh\OneDrive\Desktop\Personal\Java\GUI\frontend
```

Install the required packages:
```powershell
npm install
```

Expected packages to be installed:
- react
- react-dom
- react-icons
- axios
- react-hot-toast
- prism-react-renderer
- vite
- tailwindcss
- autoprefixer
- postcss

## Running the Application

### Option 1: Using the Automated Script (Recommended)

Double-click either:
- `start.bat` (for Command Prompt)
- `start.ps1` (for PowerShell - may require execution policy change)

This will open two terminals and start both servers automatically.

### Option 2: Manual Start

**Terminal 1 - Backend:**
```powershell
cd c:\Users\vansh\OneDrive\Desktop\Personal\Java\GUI\backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd c:\Users\vansh\OneDrive\Desktop\Personal\Java\GUI\frontend
npm run dev
```

## Accessing the Application

Once both servers are running:

1. **Frontend Dashboard**: Open your browser to `http://localhost:3000`
2. **Backend API**: Running on `http://localhost:5000`

## Verification

### Backend Health Check
Open: `http://localhost:5000/api/health`

You should see:
```json
{
  "success": true,
  "message": "File Management API is running",
  "timestamp": "..."
}
```

### Frontend
The dashboard should load showing:
- Sidebar with Code, Plans, Progress folders
- File explorer showing existing files
- Professional UI with Tailwind styling

## Troubleshooting

### Port Already in Use

**Backend (Port 5000):**
Either change the port in `.env` file or kill the process using port 5000:
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Frontend (Port 3000):**
Vite will automatically suggest the next available port (3001, 3002, etc.)

### PowerShell Execution Policy

If you can't run `start.ps1`, run this command as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Package Installation Errors

If npm install fails:
1. Delete `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm install` again

Or try clearing npm cache:
```powershell
npm cache clean --force
npm install
```

### Environment Variables

Verify the `.env` file exists in `GUI/backend/` with:
```env
PORT=5000
NODE_ENV=development
WORKSPACE_ROOT=c:\\Users\\vansh\\OneDrive\\Desktop\\Personal\\Java
```

Adjust `WORKSPACE_ROOT` if your workspace is in a different location.

## Development Mode Features

### Hot Reload
Both frontend and backend support hot reload:
- **Frontend**: Changes to React files auto-refresh the browser
- **Backend**: nodemon restarts the server on file changes

### Available Scripts

**Backend:**
- `npm start` - Start in production mode
- `npm run dev` - Start with nodemon (development)

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Production Build

### Frontend
```powershell
cd GUI/frontend
npm run build
```

This creates an optimized build in the `dist/` folder.

### Backend
For production, set NODE_ENV to production in `.env`:
```env
NODE_ENV=production
```

Then run:
```powershell
cd GUI/backend
npm start
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Start both servers
3. ✅ Open `http://localhost:3000` in browser
4. 🎉 Start managing your files!

## Additional Resources

- [Main README](README.md) - Full documentation
- [Quick Start Guide](QUICKSTART.md) - Quick reference
- [React Documentation](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Express.js Guide](https://expressjs.com/)

## Support

If you encounter any issues:
1. Check the console logs in both terminals
2. Verify all dependencies are installed
3. Ensure ports 3000 and 5000 are available
4. Check the troubleshooting section above

---

**Ready to go! Happy file managing! 🚀**
