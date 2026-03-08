import React, { useState } from 'react';
import { FaFileAlt, FaCog, FaFolder } from 'react-icons/fa';

const Sidebar = ({ selectedFolder, onFolderSelect, onItemMove, folders, onOpenSettings }) => {
  const [dragOverFolder, setDragOverFolder] = useState(null);

  return (
    <div className="w-60 bg-black text-white shadow-xl h-screen flex flex-col border-r border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <FaFileAlt className="text-sm text-black" />
          </div>
          <div>
            <h1 className="text-sm font-semibold">File Manager</h1>
            <p className="text-xs text-gray-500">Workspace</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-2">
          Folders
        </p>
        {folders.map((folderName) => {
          const isSelected = selectedFolder === folderName;
          const isDragOver = dragOverFolder === folderName;
          
          const handleDragOver = (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'move';
          };

          const handleDragEnter = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragOverFolder(folderName);
          };

          const handleDragLeave = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragOverFolder(null);
          };

          const handleDrop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragOverFolder(null);

            try {
              const draggedData = JSON.parse(e.dataTransfer.getData('text/plain'));
              const sourcePath = draggedData.path;
              const fileName = sourcePath.split('/').pop();
              const destinationPath = `${folderName}/${fileName}`;

              // Don't move if already in the target folder
              if (sourcePath.startsWith(folderName + '/') && !sourcePath.includes('/', folderName.length + 1)) {
                return;
              }

              if (onItemMove) {
                onItemMove(sourcePath, destinationPath);
              }
            } catch (error) {
              console.error('Drop error:', error);
            }
          };
          
          return (
            <button
              key={folderName}
              onClick={() => onFolderSelect(folderName)}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded text-sm transition-all duration-150 ${
                isSelected 
                  ? 'bg-white text-black font-medium' 
                  : isDragOver
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:bg-gray-900 hover:text-white'
              }`}
            >
              <FaFolder className="text-sm" />
              <span>{folderName}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-3 border-t border-gray-800 space-y-2">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center space-x-2 px-3 py-2 rounded text-sm transition-all duration-150 text-gray-400 hover:bg-gray-900 hover:text-white"
        >
          <FaCog className="text-sm" />
          <span>Settings</span>
        </button>
        
        <div className="bg-gray-900 rounded px-3 py-2">
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
            <span className="text-xs text-gray-400">Active</span>
          </div>
          <p className="text-xs text-gray-500">
            v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
