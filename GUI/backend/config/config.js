require('dotenv').config();
const path = require('path');

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  workspaceRoot: process.env.WORKSPACE_ROOT || path.join(__dirname, '../../..'),
  maxFileSize: 100 * 1024 * 1024, // 100MB
  allowedExtensions: ['.md', '.txt', '.js', '.jsx', '.ts', '.tsx', '.json', '.html', '.css', '.java', '.py', '.cpp', '.c', '.h'],
  maxDepth: 500 // Maximum folder nesting depth
};
