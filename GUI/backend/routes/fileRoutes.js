const express = require('express');
const router = express.Router();
const {
  getFolderStructure,
  getFileContent,
  createFile,
  saveFile,
  deleteItem,
  renameItem,
  moveItem,
  createFolder,
  bulkDelete
} = require('../controllers/fileController');

// Get all folders and files (recursive)
router.get('/structure', getFolderStructure);

// Get specific file content (supports nested paths)
router.get('/content/*', getFileContent);

// Create new file
router.post('/file', createFile);

// Update file content
router.put('/file', saveFile);

// Delete file or folder (supports nested paths)
router.delete('/item/*', deleteItem);

// Rename file or folder
router.put('/rename', renameItem);

// Move file or folder
router.put('/move', moveItem);

// Create new folder
router.post('/folder', createFolder);

// Bulk delete
router.post('/bulk-delete', bulkDelete);

module.exports = router;
