import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // Get folder structure (recursive)
  getFolderStructure: async () => {
    const response = await axios.get(`${API_BASE_URL}/files/structure`);
    return response.data;
  },

  // Get file content
  getFileContent: async (filePath) => {
    const response = await axios.get(`${API_BASE_URL}/files/content/${filePath}`);
    return response.data;
  },

  // Create new file
  createFile: async (filePath, content = '') => {
    const response = await axios.post(`${API_BASE_URL}/files/file`, {
      path: filePath,
      content
    });
    return response.data;
  },

  // Update file
  updateFile: async (filePath, content) => {
    const response = await axios.put(`${API_BASE_URL}/files/file`, {
      path: filePath,
      content
    });
    return response.data;
  },

  // Delete file or folder
  deleteItem: async (itemPath) => {
    const response = await axios.delete(`${API_BASE_URL}/files/item/${itemPath}`);
    return response.data;
  },

  // Rename file or folder
  renameItem: async (oldPath, newName) => {
    const response = await axios.put(`${API_BASE_URL}/files/rename`, {
      oldPath,
      newName
    });
    return response.data;
  },

  // Move file or folder
  moveItem: async (sourcePath, destinationPath) => {
    const response = await axios.put(`${API_BASE_URL}/files/move`, {
      sourcePath,
      destinationPath
    });
    return response.data;
  },

  // Create new folder
  createFolder: async (folderPath) => {
    const response = await axios.post(`${API_BASE_URL}/files/folder`, {
      path: folderPath
    });
    return response.data;
  },

  // Bulk delete
  bulkDelete: async (paths) => {
    const response = await axios.post(`${API_BASE_URL}/files/bulk-delete`, {
      paths
    });
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  }
};
