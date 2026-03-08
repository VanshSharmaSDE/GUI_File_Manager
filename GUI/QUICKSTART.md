# Quick Start Guide

## Installation & Setup

### Step 1: Install Backend Dependencies
```bash
cd GUI/backend
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd GUI/frontend
npm install
```

### Step 3: Start the Application

**Terminal 1 - Backend:**
```bash
cd GUI/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd GUI/frontend
npm run dev
```

### Step 4: Access the Dashboard
Open your browser to: `http://localhost:3000`

## Features Quick Guide

### Creating a File
1. Select a folder from the sidebar (Code, Plans, or Progress)
2. Click "New File" button
3. Enter filename with extension (e.g., `notes.md`)
4. Click "Create"

### Editing a File
1. Click on any file in the list
2. The editor will open on the right side
3. Make your changes
4. Press `Ctrl+S` or click "Save"

### Deleting a File
1. Click the trash icon next to the file
2. Confirm the deletion

### Searching Files
Use the search box at the top of the file list to filter files by name.

## Keyboard Shortcuts
- `Ctrl+S` - Save current file

## Troubleshooting

### Backend won't start
- Make sure port 5000 is not in use
- Check that all dependencies are installed
- Verify the `.env` file exists

### Frontend won't start
- Make sure port 3000 is not in use
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check that the backend is running

### Files not showing
- Verify the WORKSPACE_ROOT path in `.env`
- Ensure the Code, Plans, and Progress folders exist
- Refresh the page

## Configuration

The workspace root is configured in `GUI/backend/.env`:
```env
WORKSPACE_ROOT=c:\\Users\\vansh\\OneDrive\\Desktop\\Personal\\Java
```

Adjust this path if your workspace is located elsewhere.

## Need Help?
Check the main README.md for detailed documentation.
