import React, { useEffect, useRef } from 'react';
import { FaEdit, FaTrash, FaCut, FaCopy, FaFolder, FaFile } from 'react-icons/fa';

const ContextMenu = ({ x, y, onClose, item, onRename, onDelete, onMove, onNewFile, onNewFolder }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleAction = (action) => {
    action();
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="fixed bg-white border border-gray-200 rounded shadow-xl py-1 z-50 min-w-[180px] text-sm"
      style={{ top: y, left: x }}
    >
      {item ? (
        <>
          {item.isDirectory && (
            <>
              <button
                onClick={() => handleAction(onNewFile)}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center space-x-2 text-gray-700"
              >
                <FaFile className="text-black text-xs" />
                <span>New File Here</span>
              </button>
              <button
                onClick={() => handleAction(onNewFolder)}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center space-x-2 text-gray-700"
              >
                <FaFolder className="text-black text-xs" />
                <span>New Folder Here</span>
              </button>
              <div className="border-t border-gray-200 my-1"></div>
            </>
          )}
          <button
            onClick={() => handleAction(() => onRename(item))}
            className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center space-x-2 text-gray-700"
          >
            <FaEdit className="text-black text-xs" />
            <span>Rename</span>
          </button>
          <button
            onClick={() => handleAction(() => onMove(item))}
            className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center space-x-2 text-gray-700"
          >
            <FaCut className="text-black text-xs" />
            <span>Move</span>
          </button>
          <div className="border-t border-gray-200 my-1"></div>
          <button
            onClick={() => handleAction(() => onDelete(item))}
            className="w-full px-3 py-2 text-left hover:bg-red-50 flex items-center space-x-2 text-red-600"
          >
            <FaTrash className="text-xs" />
            <span>Delete</span>
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => handleAction(onNewFile)}
            className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center space-x-2 text-gray-700"
          >
            <FaFile className="text-black text-xs" />
            <span>New File</span>
          </button>
          <button
            onClick={() => handleAction(onNewFolder)}
            className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center space-x-2 text-gray-700"
          >
            <FaFolder className="text-black text-xs" />
            <span>New Folder</span>
          </button>
        </>
      )}
    </div>
  );
};

export default ContextMenu;