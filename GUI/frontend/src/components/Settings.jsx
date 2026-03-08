import React, { useState, useEffect } from 'react';
import { FaTimes, FaCog, FaFolder, FaFolderPlus, FaTrash } from 'react-icons/fa';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const Settings = ({ isOpen, onClose, settings, onSettingsChange, folders, onFolderCreated, onFolderDeleted }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    if (folders) {
      console.log('Settings: folders updated:', folders);
    }
  }, [folders]);

  if (!isOpen) return null;

  const handleAddFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error('Folder name cannot be empty');
      return;
    }
    
    if (folders && folders.includes(newFolderName)) {
      toast.error('Folder already exists');
      return;
    }

    setIsCreating(true);
    try {
      await api.createFolder(newFolderName);
      toast.success(`Folder "${newFolderName}" created`);
      setNewFolderName('');
      if (onFolderCreated) {
        await onFolderCreated();
      }
    } catch (error) {
      console.error('Failed to create folder:', error);
      toast.error('Failed to create folder');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteFolder = async (folderName) => {
    if (!confirm(`Delete folder "${folderName}"? This will remove all files inside.`)) {
      return;
    }

    setIsDeleting(folderName);
    try {
      await api.deleteItem(folderName);
      toast.success(`Folder "${folderName}" deleted`);
      if (onFolderDeleted) {
        await onFolderDeleted(folderName);
      }
    } catch (error) {
      console.error('Failed to delete folder:', error);
      toast.error('Failed to delete folder');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FaCog className="text-2xl text-black" />
            <h2 className="text-2xl font-bold text-black">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <FaTimes className="text-xl text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'general'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('folders')}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'folders'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Folders
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">Editor Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-black text-sm">Auto Save</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Automatically save files after changes
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoSave}
                        onChange={(e) => onSettingsChange({ ...settings, autoSave: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-black text-sm">Auto Save Delay (ms)</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Time to wait before auto-saving
                      </p>
                    </div>
                    <input
                      type="number"
                      min="500"
                      max="10000"
                      step="100"
                      value={settings.autoSaveDelay}
                      onChange={(e) => onSettingsChange({ ...settings, autoSaveDelay: parseInt(e.target.value) })}
                      disabled={!settings.autoSave}
                      className="w-24 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black disabled:bg-gray-100 disabled:text-gray-400"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-black text-sm">Use Code Editor</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Enable Monaco Editor with syntax highlighting and IntelliSense
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.useCodeEditor}
                        onChange={(e) => onSettingsChange({ ...settings, useCodeEditor: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-black text-sm">Render Markdown by Default</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Show markdown preview for .md and README files
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.renderMarkdownByDefault}
                        onChange={(e) => onSettingsChange({ ...settings, renderMarkdownByDefault: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'folders' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">Workspace Folders</h3>
                <p className="text-sm text-gray-600 mb-4">
                  These folders exist in your workspace directory. Create or delete folders to manage your workspace.
                </p>

                {/* Existing Folders */}
                <div className="space-y-2 mb-6">
                  {folders && folders.length > 0 ? (
                    folders.map((folderName) => (
                      <div
                        key={folderName}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center space-x-3">
                          <FaFolder className="text-lg text-gray-600" />
                          <span className="font-medium text-black text-sm">{folderName}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteFolder(folderName)}
                          disabled={isDeleting === folderName}
                          className="p-2 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                          title="Delete folder"
                        >
                          <FaTrash className="text-sm text-red-600" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      No folders found. Create one below.
                    </div>
                  )}
                </div>

                {/* Add New Folder */}
                <div className="border-t pt-6">
                  <h4 className="font-medium text-black text-sm mb-3">Create New Folder</h4>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="Folder name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black"
                      onKeyPress={(e) => e.key === 'Enter' && !isCreating && handleAddFolder()}
                      disabled={isCreating}
                    />
                    <button
                      onClick={handleAddFolder}
                      disabled={isCreating || !newFolderName.trim()}
                      className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                    >
                      <FaFolderPlus className="text-xs" />
                      <span>{isCreating ? 'Creating...' : 'Create'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="btn-primary"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
