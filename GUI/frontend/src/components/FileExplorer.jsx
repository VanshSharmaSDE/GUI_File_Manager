import React, { useState } from 'react';
import { FaPlus, FaSync, FaSearch } from 'react-icons/fa';
import FileList from './FileList';
import { getFolderColor } from '../utils/helpers';

const FileExplorer = ({ 
  folder, 
  files, 
  onFileSelect, 
  onFileDelete, 
  onCreateFile, 
  onRefresh,
  selectedFile 
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      onCreateFile(folder, newFileName.trim());
      setNewFileName('');
      setShowCreateModal(false);
    }
  };

  const filteredFiles = files?.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{folder}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {files?.length || 0} file{files?.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <FaPlus />
              <span>New File</span>
            </button>
            <button
              onClick={onRefresh}
              className="btn-secondary flex items-center space-x-2"
            >
              <FaSync />
              <span>Refresh</span>
            </button>
          </div>
        </div>
        
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        <FileList
          files={filteredFiles}
          folder={folder}
          onFileSelect={onFileSelect}
          onFileDelete={onFileDelete}
          selectedFile={selectedFile}
        />
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Create New File</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File Name
              </label>
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFile()}
                placeholder="example.md"
                className="input-field"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2">
                Supported: .md, .txt, .js, .jsx, .ts, .tsx, .json, .html, .css, .java, .py, .cpp, .c, .h
              </p>
            </div>
            
            <div className="flex items-center space-x-2 justify-end">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewFileName('');
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFile}
                disabled={!newFileName.trim()}
                className={`btn-primary ${!newFileName.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
