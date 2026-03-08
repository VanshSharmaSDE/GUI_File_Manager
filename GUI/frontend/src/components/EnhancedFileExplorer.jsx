import React, { useState, useEffect } from 'react';
import Toolbar from './Toolbar';
import FileTreeView from './FileTreeView';
import ContextMenu from './ContextMenu';
import { CreateDialog, RenameDialog, MoveDialog } from './Dialogs';

const EnhancedFileExplorer = ({ 
  folder,
  items,
  onFileSelect,
  onItemDelete,
  onItemRename,
  onItemMove,
  onFileCreate,
  onFolderCreate,
  onRefresh,
  onBulkDelete,
  isCompact = false,
  currentFilePath = null
}) => {
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [lastSelectedIndex, setLastSelectedIndex] = useState(null);
  const [isDragOverRoot, setIsDragOverRoot] = useState(false);
  
  // Flatten items for easier selection management
  const flattenItems = (items, result = []) => {
    items.forEach(item => {
      result.push(item);
      if (item.children && item.children.length > 0) {
        flattenItems(item.children, result);
      }
    });
    return result;
  };

  const allItems = flattenItems(items);
  const filteredItems = searchQuery
    ? allItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : items;

  // Filter items recursively for search
  const filterItemsRecursive = (items, query) => {
    if (!query) return items;
    
    const lowerQuery = query.toLowerCase();
    return items.reduce((acc, item) => {
      const matches = item.name.toLowerCase().includes(lowerQuery);
      const childrenMatch = item.children 
        ? filterItemsRecursive(item.children, query)
        : [];
      
      if (matches || childrenMatch.length > 0) {
        acc.push({
          ...item,
          children: childrenMatch.length > 0 ? childrenMatch : item.children
        });
      }
      
      return acc;
    }, []);
  };

  const displayItems = searchQuery ? filterItemsRecursive(items, searchQuery) : items;

  // Keep the currently open file selected
  useEffect(() => {
    if (currentFilePath) {
      setSelectedItems(new Set([currentFilePath]));
    }
  }, [currentFilePath, items]);

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyDown = (e) => {
      // Ctrl+A - Select all
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        handleSelectAll();
      }
      // Delete key
      else if (e.key === 'Delete' && selectedItems.size > 0) {
        e.preventDefault();
        handleDelete();
      }
      // F2 - Rename
      else if (e.key === 'F2' && selectedItems.size === 1) {
        e.preventDefault();
        const item = allItems.find(i => selectedItems.has(i.path));
        if (item) handleRename(item);
      }
      // Ctrl+N - New file
      else if (e.ctrlKey && e.key === 'n' && !e.shiftKey) {
        e.preventDefault();
        handleNewFile();
      }
      // Ctrl+Shift+N - New folder
      else if (e.ctrlKey && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        handleNewFolder();
      }
      // F5 - Refresh
      else if (e.key === 'F5') {
        e.preventDefault();
        onRefresh();
      }
      // Escape - Deselect
      else if (e.key === 'Escape') {
        setSelectedItems(new Set());
        setContextMenu(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItems, allItems]);

  const handleSelect = (item, mode) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      
      if (mode === 'single') {
        next.clear();
        next.add(item.path);
        setLastSelectedIndex(allItems.findIndex(i => i.path === item.path));
      } else if (mode === 'toggle') {
        if (next.has(item.path)) {
          next.delete(item.path);
        } else {
          next.add(item.path);
        }
        setLastSelectedIndex(allItems.findIndex(i => i.path === item.path));
      } else if (mode === 'range' && lastSelectedIndex !== null) {
        const currentIndex = allItems.findIndex(i => i.path === item.path);
        const start = Math.min(lastSelectedIndex, currentIndex);
        const end = Math.max(lastSelectedIndex, currentIndex);
        
        for (let i = start; i <= end; i++) {
          next.add(allItems[i].path);
        }
      }
      
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedItems(new Set(allItems.map(item => item.path)));
  };

  const handleDeselectAll = () => {
    setSelectedItems(new Set());
  };

  const handleDoubleClick = (e, item) => {
    // Open file on double-click
    if (!item.isDirectory) {
      onFileSelect(item);
    }
  };

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item
    });
  };

  const handleNewFile = (targetItem = null) => {
    const basePath = targetItem && targetItem.isDirectory ? targetItem.path : folder;
    setDialog({ type: 'create-file', currentPath: basePath });
  };

  const handleNewFolder = (targetItem = null) => {
    const basePath = targetItem && targetItem.isDirectory ? targetItem.path : folder;
    setDialog({ type: 'create-folder', currentPath: basePath });
  };

  const handleRename = (item) => {
    setDialog({ type: 'rename', item });
  };

  const handleMove = (item) => {
    setDialog({ type: 'move', item, allItems: items });
  };

  const handleDelete = async () => {
    const selectedPaths = Array.from(selectedItems);
    const count = selectedPaths.length;
    
    if (window.confirm(`Are you sure you want to delete ${count} item${count > 1 ? 's' : ''}?`)) {
      if (selectedPaths.length === 1) {
        const item = allItems.find(i => i.path === selectedPaths[0]);
        if (item) {
          await onItemDelete(item);
        }
      } else {
        await onBulkDelete(selectedPaths);
      }
      setSelectedItems(new Set());
    }
  };

  const handleCreateConfirm = (name) => {
    const fullPath = `${dialog.currentPath}/${name}`;
    
    if (dialog.type === 'create-file') {
      onFileCreate(fullPath);
    } else if (dialog.type === 'create-folder') {
      onFolderCreate(fullPath);
    }
    
    setDialog(null);
  };

  const handleRenameConfirm = (newName) => {
    onItemRename(dialog.item.path, newName);
    setDialog(null);
    setSelectedItems(new Set());
  };

  const handleMoveConfirm = (destinationPath) => {
    const sourcePath = dialog.item.path;
    const fileName = sourcePath.split('/').pop();
    const fullDestPath = `${destinationPath}/${fileName}`;
    
    onItemMove(sourcePath, fullDestPath);
    setDialog(null);
    setSelectedItems(new Set());
  };

  // Count only files (not folders) for selection display
  const allFiles = allItems.filter(item => !item.isDirectory);
  const selectedFiles = allItems.filter(item => !item.isDirectory && selectedItems.has(item.path));

  return (
    <div className="h-full flex flex-col bg-white">
      <Toolbar
        selectedCount={selectedFiles.length}
        totalCount={allFiles.length}
        onNewFile={handleNewFile}
        onNewFolder={handleNewFolder}
        onRefresh={onRefresh}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isCompact={isCompact}
      />
      
      <div 
        className={`flex-1 overflow-auto bg-white mx-4 mb-4 rounded border ${isDragOverRoot ? 'border-blue-500 border-2 bg-blue-50' : 'border-gray-200'}`}
        onContextMenu={(e) => {
          if (e.target === e.currentTarget || e.target.closest('.overflow-y-auto')) {
            handleContextMenu(e, null);
          }
        }}
        onDoubleClick={(e) => {
          // Check if clicked on empty space (not on a file/folder item)
          if (!e.target.closest('[draggable="true"]')) {
            e.preventDefault();
            setContextMenu({
              x: e.clientX,
              y: e.clientY,
              item: null
            });
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          setIsDragOverRoot(true);
        }}
        onDragLeave={(e) => {
          // Only hide highlight when leaving the entire drop zone
          if (e.currentTarget.contains(e.relatedTarget)) {
            return;
          }
          e.preventDefault();
          setIsDragOverRoot(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragOverRoot(false);

          try {
            const draggedData = JSON.parse(e.dataTransfer.getData('text/plain'));
            const sourcePath = draggedData.path;
            const fileName = sourcePath.split('/').pop();
            const destinationPath = `${folder}/${fileName}`;

            // Don't move if already in root of current folder
            const sourceFolder = sourcePath.split('/')[0];
            const sourcePathDepth = sourcePath.split('/').length;
            if (sourceFolder === folder && sourcePathDepth === 2) {
              return;
            }

            if (onItemMove) {
              onItemMove(sourcePath, destinationPath);
            }
          } catch (error) {
            console.error('Drop error:', error);
          }
        }}
      >
        <FileTreeView
          items={displayItems}
          selectedItems={selectedItems}
          onSelect={handleSelect}
          onDoubleClick={handleDoubleClick}
          onContextMenu={handleContextMenu}
          onMove={onItemMove}
        />
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          item={contextMenu.item}
          onClose={() => setContextMenu(null)}
          onRename={handleRename}
          onDelete={(item) => {
            setSelectedItems(new Set([item.path]));
            handleDelete();
          }}
          onMove={handleMove}
          onNewFile={() => handleNewFile(contextMenu.item)}
          onNewFolder={() => handleNewFolder(contextMenu.item)}
        />
      )}

      {dialog?.type === 'create-file' && (
        <CreateDialog
          type="file"
          currentPath={dialog.currentPath}
          onConfirm={handleCreateConfirm}
          onCancel={() => setDialog(null)}
        />
      )}

      {dialog?.type === 'create-folder' && (
        <CreateDialog
          type="folder"
          currentPath={dialog.currentPath}
          onConfirm={handleCreateConfirm}
          onCancel={() => setDialog(null)}
        />
      )}

      {dialog?.type === 'rename' && (
        <RenameDialog
          item={dialog.item}
          onConfirm={handleRenameConfirm}
          onCancel={() => setDialog(null)}
        />
      )}

      {dialog?.type === 'move' && (
        <MoveDialog
          item={dialog.item}
          folders={dialog.allItems}
          onConfirm={handleMoveConfirm}
          onCancel={() => setDialog(null)}
        />
      )}
    </div>
  );
};

export default EnhancedFileExplorer;