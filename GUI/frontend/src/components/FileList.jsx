import React from 'react';
import { FaFile, FaTrash, FaEdit, FaClock } from 'react-icons/fa';
import { formatFileSize, formatDate, getFileIcon } from '../utils/helpers';

const FileList = ({ files, folder, onFileSelect, onFileDelete, selectedFile }) => {
  if (!files || files.length === 0) {
    return (
      <div className="text-center py-12">
        <FaFile className="mx-auto text-6xl text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">No files in this folder</p>
        <p className="text-gray-400 text-sm mt-2">Create a new file to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.name}
          className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer ${
            selectedFile?.name === file.name
              ? 'border-primary-500 bg-primary-50 shadow-md'
              : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-sm'
          }`}
          onClick={() => onFileSelect(file)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <span className="text-3xl">{getFileIcon(file.extension)}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-lg">{file.name}</h3>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <FaClock className="text-xs" />
                    <span>{formatDate(file.modified)}</span>
                  </span>
                  <span>{formatFileSize(file.size)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFileSelect(file);
                }}
                className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                title="Edit file"
              >
                <FaEdit className="text-lg" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Are you sure you want to delete ${file.name}?`)) {
                    onFileDelete(folder, file.name);
                  }
                }}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                title="Delete file"
              >
                <FaTrash className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileList;
