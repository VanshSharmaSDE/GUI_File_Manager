import React from 'react';
import { 
  FaPlus, 
  FaFolderPlus, 
  FaSync, 
  FaSearch,
  FaCheckSquare
} from 'react-icons/fa';

const Toolbar = ({ 
  selectedCount, 
  totalCount,
  onNewFile, 
  onNewFolder, 
  onRefresh, 
  onSelectAll,
  onDeselectAll,
  searchQuery,
  onSearchChange,
  isCompact = false
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={onNewFile}
            className={`btn-primary flex items-center ${!isCompact ? 'space-x-1.5' : ''}`}
            title="New File (Ctrl+N)"
          >
            <FaPlus className="text-xs" />
            {!isCompact && <span>New File</span>}
          </button>
          <button
            onClick={onNewFolder}
            className={`btn-secondary flex items-center ${!isCompact ? 'space-x-1.5' : ''}`}
            title="New Folder (Ctrl+Shift+N)"
          >
            <FaFolderPlus className="text-xs" />
            {!isCompact && <span>New Folder</span>}
          </button>
          
          <div className="border-l border-gray-300 h-6 mx-2"></div>
          
          <button
            onClick={onRefresh}
            className={`btn-secondary flex items-center ${!isCompact ? 'space-x-1.5' : ''}`}
            title="Refresh (F5)"
          >
            <FaSync className="text-xs" />
            {!isCompact && <span>Refresh</span>}
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-600">
            {selectedCount > 0 ? (
              <span className="font-semibold text-black">
                {selectedCount} of {totalCount} selected
              </span>
            ) : (
              <span>{totalCount} items</span>
            )}
          </div>
          
          {selectedCount > 0 ? (
            <button
              onClick={onDeselectAll}
              className="text-sm text-black hover:text-gray-600 font-medium"
            >
              Deselect All
            </button>
          ) : (
            <button
              onClick={onSelectAll}
              className="text-sm text-black hover:text-gray-600 font-medium flex items-center space-x-1"
            >
              <FaCheckSquare className="text-sm" />
              <span>Select All</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="text"
          placeholder="Search files and folders..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
        />
      </div>
    </div>
  );
};

export default Toolbar;