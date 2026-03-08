import React, { useState, useEffect } from 'react';
import { FaFolder, FaFolderOpen, FaFile, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { formatFileSize, formatDate, getFileIcon } from '../utils/helpers';

const FileTreeItem = ({ 
  item, 
  depth = 0, 
  selectedItems, 
  onSelect, 
  onDoubleClick, 
  onContextMenu,
  expandedFolders,
  onToggleFolder,
  onMove
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const isSelected = selectedItems.has(item.path);
  const isExpanded = expandedFolders.has(item.path);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = (e) => {
    if (e.ctrlKey || e.metaKey) {
      onSelect(item, 'toggle');
    } else if (e.shiftKey) {
      onSelect(item, 'range');
    } else {
      onSelect(item, 'single');
    }
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    onDoubleClick(e, item);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (!isSelected) {
      onSelect(item, 'single');
    }
    onContextMenu(e, item);
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    onToggleFolder(item.path);
  };

  // Drag and drop handlers
  const handleDragStart = (e) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({
      path: item.path,
      name: item.name,
      isDirectory: item.isDirectory
    }));
  };

  const handleDragOver = (e) => {
    if (item.isDirectory) {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragEnter = (e) => {
    if (item.isDirectory) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (!item.isDirectory) {
      // Don't allow dropping on files, let it bubble to parent for root drop
      return;
    }

    try {
      const draggedData = JSON.parse(e.dataTransfer.getData('text/plain'));
      const sourcePath = draggedData.path;
      const destinationPath = item.path;

      // Prevent dropping onto itself or its children
      if (sourcePath === destinationPath || destinationPath.startsWith(sourcePath + '/')) {
        return;
      }

      const fileName = sourcePath.split('/').pop();
      const fullDestPath = `${destinationPath}/${fileName}`;

      if (onMove) {
        onMove(sourcePath, fullDestPath);
      }
    } catch (error) {
      console.error('Drop error:', error);
    }
  };

  return (
    <div>
      <div
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex items-center space-x-2 px-3 py-2 cursor-pointer transition-all group text-sm ${
          isSelected ? 'bg-black text-white' : isDragOver ? 'bg-blue-100 border-2 border-blue-500' : 'hover:bg-gray-100'
        }`}
        style={{ paddingLeft: `${depth * 20 + 12}px` }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
      >
        {item.isDirectory && hasChildren && (
          <button
            onClick={handleToggle}
            className="p-1 hover:bg-gray-200 rounded"
          >
            {isExpanded ? (
              <FaChevronDown className={`text-sm ${isSelected ? 'text-white' : 'text-gray-600'}`} />
            ) : (
              <FaChevronRight className={`text-sm ${isSelected ? 'text-white' : 'text-gray-600'}`} />
            )}
          </button>
        )}
        
        {item.isDirectory && !hasChildren && <div className="w-6" />}
        
        {item.isDirectory ? (
          isExpanded ? (
            <FaFolderOpen className={`text-lg ${isSelected ? 'text-white' : 'text-gray-700'}`} />
          ) : (
            <FaFolder className={`text-lg ${isSelected ? 'text-white' : 'text-gray-700'}`} />
          )
        ) : (
          <span className="text-lg">
            {getFileIcon(item.extension, isSelected)}
          </span>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className={`font-medium truncate ${isSelected ? 'text-white' : (item.isDirectory ? 'text-gray-900' : 'text-gray-700')}`}>
              {item.name}
            </span>
            {!item.isDirectory && (
              <div className={`flex items-center space-x-4 text-xs ml-4 ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                <span>{formatFileSize(item.size)}</span>
                <span className="hidden lg:inline">{formatDate(item.modified)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {item.isDirectory && isExpanded && hasChildren && (
        <div>
          {item.children.map((child) => (
            <FileTreeItem
              key={child.path}
              item={child}
              depth={depth + 1}
              selectedItems={selectedItems}
              onSelect={onSelect}
              onDoubleClick={onDoubleClick}
              onContextMenu={onContextMenu}
              expandedFolders={expandedFolders}
              onToggleFolder={onToggleFolder}
              onMove={onMove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileTreeView = ({ 
  items, 
  selectedItems, 
  onSelect, 
  onDoubleClick, 
  onContextMenu,
  onMove
}) => {
  // Auto-expand all folders by default to show nested files
  const getAllFolderPaths = (items, paths = new Set()) => {
    items.forEach(item => {
      if (item.isDirectory && item.children && item.children.length > 0) {
        paths.add(item.path);
        getAllFolderPaths(item.children, paths);
      }
    });
    return paths;
  };

  const [expandedFolders, setExpandedFolders] = useState(() => getAllFolderPaths(items));

  // Update expanded folders when items change
  useEffect(() => {
    setExpandedFolders(getAllFolderPaths(items));
  }, [items]);

  const handleToggleFolder = (path) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  if (!items || items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="text-center">
          <FaFolder className="mx-auto text-6xl mb-4 opacity-50" />
          <p>No items in this folder</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-64">
      {items.map((item) => (
        <FileTreeItem
          key={item.path}
          item={item}
          selectedItems={selectedItems}
          onSelect={onSelect}
          onDoubleClick={onDoubleClick}
          onContextMenu={onContextMenu}
          expandedFolders={expandedFolders}
          onToggleFolder={handleToggleFolder}
          onMove={onMove}
        />
      ))}
    </div>
  );
};

export default FileTreeView;