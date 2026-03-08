const fs = require('fs').promises;
const path = require('path');
const config = require('../config/config');

// Helper: Validate path is within workspace
const isPathSafe = (requestedPath) => {
  const resolvedPath = path.resolve(config.workspaceRoot, requestedPath);
  const normalizedRoot = path.resolve(config.workspaceRoot);
  return resolvedPath.startsWith(normalizedRoot);
};

// Helper: Read directory recursively
const readDirectoryRecursive = async (dirPath, relativePath = '', depth = 0) => {
  if (depth > config.maxDepth) return [];
  
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const items = [];
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
      
      try {
        const stats = await fs.stat(fullPath);
        const item = {
          name: entry.name,
          path: relPath,
          size: stats.size,
          modified: stats.mtime,
          created: stats.birthtime,
          isDirectory: entry.isDirectory(),
          extension: entry.isDirectory() ? null : path.extname(entry.name)
        };
        
        if (entry.isDirectory()) {
          item.children = await readDirectoryRecursive(fullPath, relPath, depth + 1);
        }
        
        items.push(item);
      } catch (statError) {
        console.error(`Error stating ${fullPath}:`, statError.message);
        // Skip items that can't be stat'd
        continue;
      }
    }
    
    return items.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error.message);
    return [];
  }
};

// Get all folders and their files (recursive)
const getFolderStructure = async (req, res) => {
  try {
    const structure = {};
    
    // Folders to exclude from display
    const excludeFolders = ['node_modules', '.git', 'GUI', '.vscode', 'dist', 'build'];
    
    // Read all folders in workspace root dynamically from actual filesystem
    const workspaceEntries = await fs.readdir(config.workspaceRoot, { withFileTypes: true });
    const folders = workspaceEntries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .filter(name => !name.startsWith('.') && !excludeFolders.includes(name));
    
    for (const folder of folders) {
      const folderPath = path.join(config.workspaceRoot, folder);
      structure[folder] = await readDirectoryRecursive(folderPath, folder);
    }
    
    res.json({
      success: true,
      data: structure
    });
  } catch (error) {
    console.error('Error getting folder structure:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


// Get file content
const getFileContent = async (req, res) => {
  try {
    // Express wildcard captures as params['0'] or params[0]
    const filePath = req.params[0] || req.params['0'];
    
    if (!isPathSafe(filePath)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }
    
    const fullPath = path.join(config.workspaceRoot, filePath);
    
    const content = await fs.readFile(fullPath, 'utf-8');
    const stats = await fs.stat(fullPath);
    
    res.json({
      success: true,
      data: {
        filename: path.basename(filePath),
        path: filePath,
        content,
        size: stats.size,
        modified: stats.mtime
      }
    });
  } catch (error) {
    console.error('Error reading file:', error.message);
    res.status(404).json({
      success: false,
      error: 'File not found'
    });
  }
};

// Create new file
const createFile = async (req, res) => {
  try {
    const { path: filePath, content = '' } = req.body;
    
    if (!isPathSafe(filePath)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }
    
    const ext = path.extname(filePath);
    if (ext && !config.allowedExtensions.includes(ext)) {
      return res.status(400).json({
        success: false,
        error: `File extension ${ext} is not allowed`
      });
    }
    
    const fullPath = path.join(config.workspaceRoot, filePath);
    
    // Check if file already exists
    try {
      await fs.access(fullPath);
      return res.status(409).json({
        success: false,
        error: 'File already exists'
      });
    } catch {
      // Create parent directories if they don't exist
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, content, 'utf-8');
      
      // Ensure the file is written to disk
      const fileHandle = await fs.open(fullPath, 'r+');
      await fileHandle.sync();
      await fileHandle.close();
      
      // Small delay to ensure filesystem operations complete
      await new Promise(resolve => setTimeout(resolve, 50));
      
      res.status(201).json({
        success: true,
        message: 'File created successfully',
        data: { path: filePath }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


// Update file content
const saveFile = async (req, res) => {
  try {
    const { path: filePath, content } = req.body;
    
    if (!isPathSafe(filePath)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }
    
    const fullPath = path.join(config.workspaceRoot, filePath);
    await fs.writeFile(fullPath, content, 'utf-8');
    
    // Ensure the file is written to disk
    const fileHandle = await fs.open(fullPath, 'r+');
    await fileHandle.sync();
    await fileHandle.close();
    
    res.json({
      success: true,
      message: 'File saved successfully',
      data: { path: filePath }
    });
  } catch (error) {
    console.error('Error saving file:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete file or folder
const deleteItem = async (req, res) => {
  try {
    // Express wildcard captures as params['0'] or params[0]
    const itemPath = req.params[0] || req.params['0'];
    
    if (!isPathSafe(itemPath)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }
    
    const fullPath = path.join(config.workspaceRoot, itemPath);
    
    const stats = await fs.stat(fullPath);
    
    if (stats.isDirectory()) {
      await fs.rm(fullPath, { recursive: true, force: true });
    } else {
      await fs.unlink(fullPath);
    }
    
    // Small delay to ensure filesystem operations complete
    await new Promise(resolve => setTimeout(resolve, 50));
    
    res.json({
      success: true,
      message: `${stats.isDirectory() ? 'Folder' : 'File'} deleted successfully`
    });
  } catch (error) {
    console.error(`Delete error for ${req.params[0]}:`, error.message);
    res.status(404).json({
      success: false,
      error: 'Item not found'
    });
  }
};

// Rename file or folder
const renameItem = async (req, res) => {
  try {
    const { oldPath, newName } = req.body;
    
    if (!isPathSafe(oldPath)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }
    
    const fullOldPath = path.join(config.workspaceRoot, oldPath);
    const parentDir = path.dirname(fullOldPath);
    const newPath = path.join(parentDir, newName);
    const relativeNewPath = path.relative(config.workspaceRoot, newPath);
    
    if (!isPathSafe(relativeNewPath)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }
    
    // Check if new name already exists
    try {
      await fs.access(newPath);
      return res.status(409).json({
        success: false,
        error: 'An item with this name already exists'
      });
    } catch {
      await fs.rename(fullOldPath, newPath);
      
      res.json({
        success: true,
        message: 'Item renamed successfully',
        data: { newPath: relativeNewPath }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Move file or folder
const moveItem = async (req, res) => {
  try {
    const { sourcePath, destinationPath } = req.body;
    
    if (!isPathSafe(sourcePath) || !isPathSafe(destinationPath)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }
    
    const fullSourcePath = path.join(config.workspaceRoot, sourcePath);
    const fullDestPath = path.join(config.workspaceRoot, destinationPath);
    
    // Ensure destination directory exists
    await fs.mkdir(path.dirname(fullDestPath), { recursive: true });
    
    // Check if destination already exists
    try {
      await fs.access(fullDestPath);
      return res.status(409).json({
        success: false,
        error: 'Destination already exists'
      });
    } catch {
      await fs.rename(fullSourcePath, fullDestPath);
      
      res.json({
        success: true,
        message: 'Item moved successfully',
        data: { newPath: destinationPath }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create new folder
const createFolder = async (req, res) => {
  try {
    const { path: folderPath } = req.body;
    
    if (!isPathSafe(folderPath)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }
    
    const fullPath = path.join(config.workspaceRoot, folderPath);
    
    // Check if folder already exists
    try {
      await fs.access(fullPath);
      return res.status(409).json({
        success: false,
        error: 'Folder already exists'
      });
    } catch {
      await fs.mkdir(fullPath, { recursive: true });
      
      // Verify the directory was created
      await fs.access(fullPath);
      
      // Small delay to ensure filesystem operations complete
      await new Promise(resolve => setTimeout(resolve, 50));
      
      console.log(`Folder created successfully: ${folderPath}`);
      
      res.status(201).json({
        success: true,
        message: 'Folder created successfully',
        data: { path: folderPath }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Bulk delete
const bulkDelete = async (req, res) => {
  try {
    const { paths } = req.body;
    
    if (!Array.isArray(paths) || paths.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid paths array'
      });
    }
    
    const results = {
      deleted: [],
      failed: []
    };
    
    for (const itemPath of paths) {
      try {
        if (!isPathSafe(itemPath) || config.baseFolders.includes(itemPath)) {
          results.failed.push({ path: itemPath, reason: 'Access denied' });
          continue;
        }
        
        const fullPath = path.join(config.workspaceRoot, itemPath);
        const stats = await fs.stat(fullPath);
        
        if (stats.isDirectory()) {
          await fs.rm(fullPath, { recursive: true, force: true });
        } else {
          await fs.unlink(fullPath);
        }
        
        results.deleted.push(itemPath);
      } catch (error) {
        results.failed.push({ path: itemPath, reason: error.message });
      }
    }
    
    res.json({
      success: true,
      message: `Deleted ${results.deleted.length} items`,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getFolderStructure,
  getFileContent,
  createFile,
  saveFile,
  deleteItem,
  renameItem,
  moveItem,
  createFolder,
  bulkDelete
};
