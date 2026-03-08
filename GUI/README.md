# File Management Dashboard

A professional MERN stack application for managing code, plans, and progress files with a Windows File Explorer-like interface.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC)
![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Features

### File Operations
- **📁 Full CRUD Operations**: Create, Read, Update, Delete files and folders
- **📂 Nested Folders**: Support for unlimited folder hierarchy (up to 5 levels deep)
- **✏️ File Editing**: Built-in code editor with line count and character count
- **🔄 File Operations**: Rename, move, and manage files with ease
- **🗑️ Bulk Operations**: Select multiple items and delete them at once

### Selection & Navigation
- **☑️ Multi-Select**: Select files with Ctrl+Click, Shift+Click for range selection
- **✅ Select All**: Quickly select all files with one click or Ctrl+A
- **🖱️ Context Menu**: Right-click context menu for quick actions
- **🔍 Real-time Search**: Filter files and folders instantly with search

### Professional UI
- **🎨 Modern Design**: Professional Windows Explorer-like interface
- **🌳 Tree View**: Expandable folder tree with visual hierarchy
- **📊 File Details**: Size, modification date, and file type indicators
- **⚡ Smooth Animations**: Beautiful transitions and hover effects
- **🎯 Keyboard Shortcuts**: Powerful keyboard shortcuts for efficiency

### Advanced Features
- **📱 Responsive Design**: Works perfectly on all screen sizes
- **🔒 Security**: Path validation and file type restrictions
- **⚡ Real-time Updates**: Instant UI updates on all operations
- **🎭 Modal Dialogs**: Beautiful dialogs for all user interactions
- **🔔 Toast Notifications**: Clear feedback for all operations

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+N` | Create new file |
| `Ctrl+Shift+N` | Create new folder |
| `Ctrl+A` | Select all items |
| `Ctrl+S` | Save current file |
| `Delete` | Delete selected items |
| `F2` | Rename selected item |
| `F5` | Refresh file list |
| `Esc` | Deselect all / Close dialogs |

## 🏗️ Architecture

### Backend (Node.js + Express)
```
backend/
├── server.js                 # Main server file
├── config/
│   └── config.js            # Configuration settings
├── controllers/
│   └── fileController.js    # File operation handlers (CRUD, move, rename, bulk)
├── routes/
│   └── fileRoutes.js        # API route definitions
└── middleware/
    └── errorHandler.js      # Error handling middleware
```

### Frontend (React + Tailwind CSS)
```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx           # Main dashboard container
│   │   ├── Sidebar.jsx             # Navigation sidebar
│   │   ├── EnhancedFileExplorer.jsx # Main file explorer with all features
│   │   ├── FileTreeView.jsx        # Tree view for nested folders
│   │   ├── Toolbar.jsx             # Action toolbar with buttons
│   │   ├── ContextMenu.jsx         # Right-click context menu
│   │   ├── Dialogs.jsx             # Create, rename, move dialogs
│   │   └── FileEditor.jsx          # File content editor
│   ├── services/
│   │   └── api.js                  # API service layer
│   └── utils/
│       └── helpers.js              # Utility functions
├── index.html
└── vite.config.js
```

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd GUI/backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (`.env` file is already created):
```env
PORT=5000
NODE_ENV=development
WORKSPACE_ROOT=c:\\Users\\vansh\\OneDrive\\Desktop\\Personal\\Java
```

4. Start the backend server:
```bash
npm run dev
```

The backend will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd GUI/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be running on `http://localhost:3000`

## 🎯 Usage

1. **Start Both Servers**:
   - Backend: `cd GUI/backend && npm run dev`
   - Frontend: `cd GUI/frontend && npm run dev`

2. **Access the Dashboard**:
   - Open your browser to `http://localhost:3000`

3. **Navigate Folders**:
   - Click on Code, Plans, or Progress in the sidebar

4. **Create Files and Folders**:
   - Click "New File" or "New Folder" button
   - Enter a name
   - Start editing files immediately

5. **Edit Files**:
   - Double-click on any file or click once to select then press Enter
   - Make changes in the editor
   - Press Ctrl+S to save

6. **Organize Files**:
   - Select items with checkbox or click
   - Right-click for context menu
   - Rename with F2
   - Move files between folders
   - Delete with Delete key or trash icon

7. **Multi-Select Operations**:
   - Ctrl+Click to select multiple items
   - Shift+Click for range selection
   - Ctrl+A to select all
   - Delete multiple items at once

## 🔧 API Endpoints

### File & Folder Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/files/structure` | Get all folders and files (recursive tree) |
| GET | `/api/files/content/*` | Get file content (supports nested paths) |
| POST | `/api/files/file` | Create new file |
| PUT | `/api/files/file` | Update file content |
| POST | `/api/files/folder` | Create new folder |
| DELETE | `/api/files/item/*` | Delete file or folder (supports nested paths) |
| PUT | `/api/files/rename` | Rename file or folder |
| PUT | `/api/files/move` | Move file or folder |
| POST | `/api/files/bulk-delete` | Delete multiple items |
| GET | `/api/health` | Health check |

### Example API Calls

**Get Folder Structure (Recursive):**
```javascript
GET /api/files/structure
Response: {
  "success": true,
  "data": {
    "Code": [
      {
        "name": "src",
        "path": "Code/src",
        "isDirectory": true,
        "children": [
          {
            "name": "app.js",
            "path": "Code/src/app.js",
            "size": 1234,
            "modified": "2026-03-08T10:00:00.000Z",
            "isDirectory": false,
            "extension": ".js"
          }
        ]
      }
    ],
    "Plans": [...],
    "Progress": [...]
  }
}
```

**Create File:**
```javascript
POST /api/files/file
Body: {
  "path": "Code/example.js",
  "content": "console.log('Hello');"
}
```

**Create Folder:**
```javascript
POST /api/files/folder
Body: {
  "path": "Code/new-folder"
}
```

**Rename Item:**
```javascript
PUT /api/files/rename
Body: {
  "oldPath": "Code/old-name.js",
  "newName": "new-name.js"
}
```

**Move Item:**
```javascript
PUT /api/files/move
Body: {
  "sourcePath": "Code/file.js",
  "destinationPath": "Plans/file.js"
}
```

**Bulk Delete:**
```javascript
POST /api/files/bulk-delete
Body: {
  "paths": ["Code/file1.js", "Code/folder1", "Plans/doc.md"]
}
Response: {
  "success": true,
  "message": "Deleted 3 items",
  "data": {
    "deleted": ["Code/file1.js", "Code/folder1", "Plans/doc.md"],
    "failed": []
  }
}
```

## 🎨 Technology Stack

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **CORS**: Cross-origin resource sharing
- **Morgan**: HTTP request logger
- **Dotenv**: Environment configuration

### Frontend
- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client
- **React Icons**: Icon library
- **React Hot Toast**: Toast notifications

## 📁 Supported File Types

The application supports the following file extensions:
- **Markdown**: `.md`
- **Text**: `.txt`
- **JavaScript**: `.js`, `.jsx`
- **TypeScript**: `.ts`, `.tsx`
- **JSON**: `.json`
- **Web**: `.html`, `.css`
- **Programming**: `.java`, `.py`, `.cpp`, `.c`, `.h`

## 🔒 Security Features

- Path validation to prevent directory traversal
- File extension whitelist
- File size limits (10MB max)
- Access control for specific folders only
- Error handling and logging

## 🚧 Future Enhancements

- [ ] MongoDB integration for file metadata
- [ ] User authentication and authorization
- [ ] File versioning and history
- [ ] Syntax highlighting in editor
- [ ] Code formatting tools
- [ ] File upload/download
- [ ] Collaborative editing
- [ ] Dark mode support

## 📝 Development

### Run in Development Mode

**Backend:**
```bash
cd GUI/backend
npm run dev
```

**Frontend:**
```bash
cd GUI/frontend
npm run dev
```

### Build for Production

**Frontend:**
```bash
cd GUI/frontend
npm run build
```

**Backend:**
```bash
cd GUI/backend
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ using the MERN stack

## 📞 Support

For issues or questions, please open an issue in the repository.

---

**Happy Coding! 🎉**
