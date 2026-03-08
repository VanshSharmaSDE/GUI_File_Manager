import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Sidebar from './Sidebar';
import EnhancedFileExplorer from './EnhancedFileExplorer';
import FileEditor from './FileEditor';
import Settings from './Settings';
import { api } from '../services/api';

const DEFAULT_SETTINGS = {
  autoSave: false,
  autoSaveDelay: 2000,
  useCodeEditor: false,
  renderMarkdownByDefault: true
};

const Dashboard = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folderStructure, setFolderStructure] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const initializeWorkspace = async () => {
      // Load folder structure with multiple refreshes to ensure all content is visible
      await loadFolderStructure();
      setTimeout(() => loadFolderStructure(), 100);
      setTimeout(() => loadFolderStructure(), 300);
      setTimeout(() => loadFolderStructure(), 600);
    };
    
    initializeWorkspace();
  }, []);

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
  };

  const handleFolderCreated = async () => {
    // Reload folder structure after folder creation
    await loadFolderStructure();
    setTimeout(() => loadFolderStructure(), 100);
    setTimeout(() => loadFolderStructure(), 300);
    setTimeout(() => loadFolderStructure(), 600);
  };

  const handleFolderDeleted = async (deletedFolderName) => {
    // Reload folder structure after folder deletion
    await loadFolderStructure();
    setTimeout(() => loadFolderStructure(), 100);
    setTimeout(() => loadFolderStructure(), 300);
    setTimeout(() => loadFolderStructure(), 600);
    
    // If selected folder was deleted, switch to first available folder
    if (selectedFolder === deletedFolderName) {
      const remainingFolders = Object.keys(folderStructure).filter(f => f !== deletedFolderName);
      if (remainingFolders.length > 0) {
        setSelectedFolder(remainingFolders[0]);
      } else {
        setSelectedFolder(null);
      }
    }
  };

  const loadFolderStructure = async () => {
    try {
      setIsLoading(true);
      const response = await api.getFolderStructure();
      if (response.success) {
        setFolderStructure(response.data);
        
        // Auto-select first folder if none is selected
        const availableFolders = Object.keys(response.data);
        if (availableFolders.length > 0 && !selectedFolder) {
          setSelectedFolder(availableFolders[0]);
        }
      } else {
        console.error('Failed to load folder structure:', response);
      }
    } catch (error) {
      toast.error('Failed to load folder structure');
      console.error('Load folder structure error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (file) => {
    try {
      const response = await api.getFileContent(file.path);
      if (response.success) {
        setSelectedFile(response.data);
      }
    } catch (error) {
      toast.error('Failed to load file content');
      console.error(error);
    }
  };

  const handleFileSave = async (filePath, content) => {
    try {
      const response = await api.updateFile(filePath, content);
      if (response.success) {
        toast.success('File saved successfully');
        
        // Update the selected file's content to reflect the changes
        if (selectedFile && selectedFile.path === filePath) {
          setSelectedFile({
            ...selectedFile,
            content: content
          });
        }
        
        await loadFolderStructure();
      }
    } catch (error) {
      toast.error('Failed to save file');
      console.error('Save error:', error);
    }
  };

  const handleItemDelete = async (item) => {
    try {
      const response = await api.deleteItem(item.path);
      if (response.success) {
        toast.success(`${item.isDirectory ? 'Folder' : 'File'} deleted successfully`);
        if (selectedFile?.path === item.path) {
          setSelectedFile(null);
        }
        await loadFolderStructure();
        setTimeout(() => loadFolderStructure(), 100);
        setTimeout(() => loadFolderStructure(), 300);
      } else {
        console.error('Delete failed:', response);
        toast.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete item');
    }
  };

  const handleBulkDelete = async (paths) => {
    try {
      const response = await api.bulkDelete(paths);
      if (response.success) {
        const { deleted, failed } = response.data;
        toast.success(`Deleted ${deleted.length} items`);
        if (failed.length > 0) {
          toast.error(`Failed to delete ${failed.length} items`);
        }
        if (selectedFile && paths.includes(selectedFile.path)) {
          setSelectedFile(null);
        }
        await loadFolderStructure();
        setTimeout(() => loadFolderStructure(), 100);
        setTimeout(() => loadFolderStructure(), 300);
      }
    } catch (error) {
      toast.error('Failed to delete items');
      console.error(error);
    }
  };

  const handleItemRename = async (oldPath, newName) => {
    try {
      const response = await api.renameItem(oldPath, newName);
      if (response.success) {
        toast.success('Item renamed successfully');
        if (selectedFile?.path === oldPath) {
          setSelectedFile(null);
        }
        await loadFolderStructure();
        setTimeout(() => loadFolderStructure(), 100);
        setTimeout(() => loadFolderStructure(), 300);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error('An item with this name already exists');
      } else {
        toast.error('Failed to rename item');
      }
      console.error(error);
    }
  };

  const handleItemMove = async (sourcePath, destinationPath) => {
    try {
      const response = await api.moveItem(sourcePath, destinationPath);
      if (response.success) {
        toast.success('Item moved successfully');
        if (selectedFile?.path === sourcePath) {
          setSelectedFile(null);
        }
        await loadFolderStructure();
        setTimeout(() => loadFolderStructure(), 100);
        setTimeout(() => loadFolderStructure(), 300);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error('Destination already exists');
      } else {
        toast.error('Failed to move item');
      }
      console.error(error);
    }
  };

  const handleFileCreate = async (filePath, content = '') => {
    try {
      const response = await api.createFile(filePath, content);
      if (response.success) {
        toast.success('File created successfully');
        
        // Force multiple refreshes with increasing delays to ensure filesystem sync
        await loadFolderStructure();
        setTimeout(() => loadFolderStructure(), 100);
        setTimeout(() => loadFolderStructure(), 300);
        setTimeout(() => loadFolderStructure(), 600);
        
        // Open the newly created file after a delay
        setTimeout(async () => {
          try {
            const fileResponse = await api.getFileContent(filePath);
            if (fileResponse.success) {
              setSelectedFile(fileResponse.data);
            }
          } catch (err) {
            console.error('Error loading created file:', err);
          }
        }, 400);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error('File already exists');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to create file');
      }
      console.error(error);
    }
  };

  const handleFolderCreate = async (folderPath) => {
    try {
      const response = await api.createFolder(folderPath);
      if (response.success) {
        toast.success('Folder created successfully');
        
        // Force multiple refreshes with increasing delays to ensure filesystem sync
        await loadFolderStructure();
        setTimeout(() => loadFolderStructure(), 100);
        setTimeout(() => loadFolderStructure(), 300);
        setTimeout(() => loadFolderStructure(), 600);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error('Folder already exists');
      } else {
        toast.error('Failed to create folder');
      }
      console.error(error);
    }
  };

  const handleCloseEditor = () => {
    setSelectedFile(null);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium text-base">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-white">
      <Toaster position="top-right" toastOptions={{
        duration: 3000,
        style: {
          background: '#fff',
          color: '#363636',
        },
        success: {
          iconTheme: {
            primary: '#000',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }} />
      
      <Sidebar 
        selectedFolder={selectedFolder} 
        onFolderSelect={setSelectedFolder}
        onItemMove={handleItemMove}
        folders={Object.keys(folderStructure)}
        onOpenSettings={() => setShowSettings(true)}
      />
      
      <div className="flex-1 flex overflow-hidden relative">
        <div className={`${selectedFile ? 'w-2/5' : 'w-full'} transition-all duration-300 h-full flex flex-col`}>
          <EnhancedFileExplorer
            folder={selectedFolder}
            items={folderStructure[selectedFolder] || []}
            onFileSelect={handleFileSelect}
            onItemDelete={handleItemDelete}
            onBulkDelete={handleBulkDelete}
            onItemRename={handleItemRename}
            onItemMove={handleItemMove}
            onFileCreate={handleFileCreate}
            onFolderCreate={handleFolderCreate}
            onRefresh={loadFolderStructure}
            isCompact={!!selectedFile}
            currentFilePath={selectedFile?.path}
          />
        </div>
        
        {selectedFile && (
          <div className="w-3/5 h-full transition-all duration-300 flex">
            <FileEditor
              file={selectedFile}
              onSave={(filePath, content) => handleFileSave(filePath, content)}
              onClose={handleCloseEditor}
              autoSave={settings.autoSave}
              autoSaveDelay={settings.autoSaveDelay}
              useCodeEditor={settings.useCodeEditor}
              renderMarkdownByDefault={settings.renderMarkdownByDefault}
            />
          </div>
        )}
      </div>

      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
        folders={Object.keys(folderStructure)}
        onFolderCreated={handleFolderCreated}
        onFolderDeleted={handleFolderDeleted}
      />
    </div>
  );
};

export default Dashboard;
