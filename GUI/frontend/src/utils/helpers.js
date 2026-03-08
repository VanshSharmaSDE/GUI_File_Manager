import React from 'react';
import { 
  FaFileCode, 
  FaHtml5, 
  FaCss3Alt, 
  FaJsSquare, 
  FaReact, 
  FaPython, 
  FaJava,
  FaFileAlt,
  FaFileImage,
  FaFile,
  FaDatabase
} from 'react-icons/fa';
import { 
  SiTypescript,
  SiCplusplus,
  SiC,
  SiJson,
  SiMarkdown,
  SiYaml
} from 'react-icons/si';
import { 
  VscFileCode,
  VscJson,
  VscMarkdown
} from 'react-icons/vsc';

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const formatDate = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getFileIcon = (extension, isSelected = false) => {
  const ext = extension?.toLowerCase();
  const selectedClass = isSelected ? 'text-white' : '';
  
  const iconData = {
    // JavaScript/TypeScript
    '.js': { Icon: FaJsSquare, color: 'text-yellow-400' },
    '.jsx': { Icon: FaReact, color: 'text-cyan-400' },
    '.ts': { Icon: SiTypescript, color: 'text-blue-500' },
    '.tsx': { Icon: FaReact, color: 'text-blue-400' },
    
    // Web
    '.html': { Icon: FaHtml5, color: 'text-orange-500' },
    '.htm': { Icon: FaHtml5, color: 'text-orange-500' },
    '.css': { Icon: FaCss3Alt, color: 'text-blue-400' },
    '.scss': { Icon: FaCss3Alt, color: 'text-pink-400' },
    '.sass': { Icon: FaCss3Alt, color: 'text-pink-400' },
    '.less': { Icon: FaCss3Alt, color: 'text-blue-300' },
    
    // Programming Languages
    '.java': { Icon: FaJava, color: 'text-red-500' },
    '.py': { Icon: FaPython, color: 'text-blue-500' },
    '.cpp': { Icon: SiCplusplus, color: 'text-blue-600' },
    '.c': { Icon: SiC, color: 'text-blue-700' },
    '.h': { Icon: VscFileCode, color: 'text-purple-500' },
    '.hpp': { Icon: VscFileCode, color: 'text-purple-500' },
    '.cs': { Icon: VscFileCode, color: 'text-green-600' },
    '.php': { Icon: VscFileCode, color: 'text-indigo-500' },
    '.rb': { Icon: VscFileCode, color: 'text-red-600' },
    
    // Data/Config
    '.json': { Icon: VscJson, color: 'text-yellow-500' },
    '.xml': { Icon: VscFileCode, color: 'text-orange-600' },
    '.yaml': { Icon: SiYaml, color: 'text-purple-500' },
    '.yml': { Icon: SiYaml, color: 'text-purple-500' },
    '.toml': { Icon: VscFileCode, color: 'text-gray-600' },
    '.env': { Icon: VscFileCode, color: 'text-yellow-600' },
    
    // Documentation
    '.md': { Icon: VscMarkdown, color: 'text-gray-700' },
    '.mdx': { Icon: VscMarkdown, color: 'text-blue-600' },
    '.txt': { Icon: FaFileAlt, color: 'text-gray-500' },
    '.pdf': { Icon: FaFileAlt, color: 'text-red-500' },
    
    // Images
    '.png': { Icon: FaFileImage, color: 'text-purple-400' },
    '.jpg': { Icon: FaFileImage, color: 'text-blue-400' },
    '.jpeg': { Icon: FaFileImage, color: 'text-blue-400' },
    '.gif': { Icon: FaFileImage, color: 'text-green-400' },
    '.svg': { Icon: FaFileImage, color: 'text-orange-400' },
    '.ico': { Icon: FaFileImage, color: 'text-yellow-500' },
    '.webp': { Icon: FaFileImage, color: 'text-purple-500' },
    
    // Database
    '.sql': { Icon: FaDatabase, color: 'text-orange-600' },
    '.db': { Icon: FaDatabase, color: 'text-blue-700' },
    '.sqlite': { Icon: FaDatabase, color: 'text-blue-600' },
  };
  
  const defaultIcon = { Icon: FaFile, color: 'text-gray-400' };
  const { Icon, color } = iconData[ext] || defaultIcon;
  
  return React.createElement(Icon, { 
    className: isSelected ? selectedClass : color 
  });
};

export const getFolderColor = (folder) => {
  const colorMap = {
    'Code': 'bg-blue-100 text-blue-800 border-blue-300',
    'Plans': 'bg-green-100 text-green-800 border-green-300',
    'Progress': 'bg-purple-100 text-purple-800 border-purple-300'
  };
  
  return colorMap[folder] || 'bg-gray-100 text-gray-800 border-gray-300';
};
