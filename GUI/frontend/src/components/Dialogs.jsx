import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaFolder, FaFile } from 'react-icons/fa';

export const RenameDialog = ({ item, onConfirm, onCancel }) => {
  const [newName, setNewName] = useState(item?.name || '');
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
 const nameWithoutExt = item?.name?.replace(/\.[^/.]+$/, '') || '';
      inputRef.current.setSelectionRange(0, nameWithoutExt.length);
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newName.trim() && newName !== item.name) {
      onConfirm(newName.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded shadow-2xl p-6 w-full max-w-md border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-black flex items-center space-x-2">
            {item?.isDirectory ? <FaFolder className="text-black" /> : <FaFile className="text-black" />}
            <span>Rename {item?.isDirectory ? 'Folder' : 'File'}</span>
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <FaTimes className="text-sm" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New name
            </label>
            <input
              ref={inputRef}
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="input-field"
              placeholder="Enter new name"
            />
          </div>
          
          <div className="flex items-center space-x-2 justify-end">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newName.trim() || newName === item?.name}
              className={`btn-primary ${!newName.trim() || newName === item?.name ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Rename
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const CreateDialog = ({ type, currentPath, onConfirm, onCancel }) => {
  const [name, setName] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onConfirm(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded shadow-2xl p-6 w-full max-w-md border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-black flex items-center space-x-2">
            {type === 'folder' ? <FaFolder className="text-black" /> : <FaFile className="text-black" />}
            <span>Create New {type === 'folder' ? 'Folder' : 'File'}</span>
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <FaTimes className="text-sm" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {type === 'folder' ? 'Folder' : 'File'} name
            </label>
            {currentPath && (
              <p className="text-xs text-gray-600 mb-2 bg-gray-50 px-2 py-1 rounded">
                Create in: <span className="font-mono">{currentPath}/</span>
              </p>
            )}
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder={type === 'folder' ? 'my-folder' : 'example.md'}
            />
            {type === 'file' && (
              <p className="text-xs text-gray-500 mt-2">
                Supported: .md, .txt, .js, .jsx, .ts, .tsx, .json, .html, .css, .java, .py, .cpp, .c, .h
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-2 justify-end">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className={`btn-primary ${!name.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const MoveDialog = ({ item, folders, onConfirm, onCancel }) => {
  const [destinationPath, setDestinationPath] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (destinationPath) {
      onConfirm(destinationPath);
    }
  };

  const getAllFolders = (items, parentPath = '', result = []) => {
    items.forEach(item => {
      if (item.isDirectory) {
        const fullPath = parentPath ? `${parentPath}/${item.name}` : item.name;
        result.push(fullPath);
        if (item.children && item.children.length > 0) {
          getAllFolders(item.children, fullPath, result);
        }
      }
    });
    return result;
  };

  const folderList = getAllFolders(folders);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded shadow-2xl p-6 w-full max-w-md border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-black flex items-center space-x-2">
            {item?.isDirectory ? <FaFolder className="text-black" /> : <FaFile className="text-black" />}
            <span>Move {item?.name}</span>
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <FaTimes className="text-sm" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination folder
            </label>
            <select
              value={destinationPath}
              onChange={(e) => setDestinationPath(e.target.value)}
              className="input-field"
            >
              <option value="">Select destination...</option>
              {folderList.map((folder) => (
                <option key={folder} value={folder} disabled={folder === item?.path || item?.path?.startsWith(folder + '/')}>
                  {folder}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2 justify-end">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!destinationPath}
              className={`btn-primary ${!destinationPath ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Move
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};