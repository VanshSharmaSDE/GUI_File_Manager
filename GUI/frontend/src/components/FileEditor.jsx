import React, { useState, useEffect, useRef } from 'react';
import { FaSave, FaTimes, FaCode, FaEye, FaEdit } from 'react-icons/fa';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const FileEditor = ({ file, onSave, onClose, autoSave = false, autoSaveDelay = 2000, useCodeEditor = false, renderMarkdownByDefault = true }) => {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [tempUseCodeEditor, setTempUseCodeEditor] = useState(useCodeEditor);
  const autoSaveTimerRef = useRef(null);

  useEffect(() => {
    if (file?.content !== undefined) {
      setContent(file.content);
      setHasChanges(false);
      // Set initial preview state based on file type and setting
      setShowPreview(isMarkdownFile(file?.filename) && renderMarkdownByDefault);
      // Reset temp code editor to settings default
      setTempUseCodeEditor(useCodeEditor);
    }
  }, [file, renderMarkdownByDefault, useCodeEditor]);

  useEffect(() => {
    // Auto-save functionality
    if (autoSave && hasChanges && content !== file?.content) {
      // Clear existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Set new timer
      autoSaveTimerRef.current = setTimeout(() => {
        handleSave();
      }, autoSaveDelay);
    }

    // Cleanup
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [content, hasChanges, autoSave, autoSaveDelay]);

  const handleContentChange = (e) => {
    const newContent = typeof e === 'string' ? e : e.target.value;
    setContent(newContent);
    setHasChanges(newContent !== (file?.content || ''));
  };

  const isMarkdownFile = (filename) => {
    if (!filename) return false;
    const lower = filename.toLowerCase();
    return lower.endsWith('.md') || lower.endsWith('.mdx') || lower.startsWith('readme');
  };

  const getLanguageFromFilename = (filename) => {
    if (!filename) return 'plaintext';
    const ext = filename.split('.').pop().toLowerCase();
    const languageMap = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'sass': 'sass',
      'less': 'less',
      'json': 'json',
      'md': 'markdown',
      'py': 'python',
      'java': 'java',
      'c': 'c',
      'cpp': 'cpp',
      'cs': 'csharp',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'swift': 'swift',
      'kt': 'kotlin',
      'sql': 'sql',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml',
      'sh': 'shell',
      'bash': 'shell',
      'dockerfile': 'dockerfile',
      'r': 'r',
      'txt': 'plaintext'
    };
    return languageMap[ext] || 'plaintext';
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(file.path, content);
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  if (!file) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-gray-50 border-l border-gray-200">
        <div className="text-center">
          <FaCode className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-gray-500 text-sm">Select a file to edit</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col bg-white border-l border-gray-200">
      <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-white flex-shrink-0">
        <div>
          <h2 className="text-base font-semibold text-black">{file.filename}</h2>
          <p className="text-sm text-gray-500 mt-0.5 flex items-center space-x-2">
            <span>{file.path}</span>
            {hasChanges && (
              <span className="px-2 py-0.5 text-xs bg-black text-white rounded font-medium">
                Modified
              </span>
            )}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className={`btn-primary flex items-center space-x-2 ${
              (!hasChanges || isSaving) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FaSave className="text-sm" />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
          <button
            onClick={onClose}
            className="btn-secondary flex items-center space-x-2"
          >
            <FaTimes className="text-sm" />
            <span>Close</span>
          </button>
        </div>
      </div>
      
      <div className="flex-1 min-h-0 p-4 bg-white overflow-hidden flex flex-col">
        {showPreview && isMarkdownFile(file?.filename) ? (
          <div className="w-full h-full overflow-y-auto bg-white">
            <div className="max-w-4xl mx-auto px-8 py-8">
              <div className="prose prose-lg prose-slate prose-headings:font-bold prose-headings:text-black prose-h1:text-4xl prose-h1:border-b prose-h1:pb-2 prose-h2:text-3xl prose-h2:border-b prose-h2:pb-2 prose-h3:text-2xl prose-h4:text-xl prose-p:text-gray-800 prose-p:leading-7 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-black prose-strong:font-semibold prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-l-blue-500 prose-blockquote:bg-gray-50 prose-blockquote:italic prose-img:rounded-lg prose-img:shadow-md prose-hr:border-gray-300 prose-li:text-gray-800 prose-table:border-collapse prose-th:border prose-th:border-gray-300 prose-th:bg-gray-100 prose-th:px-4 prose-th:py-2 prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2 max-w-none">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-4xl font-bold mt-6 mb-4 pb-2 border-b border-gray-300" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-3xl font-bold mt-6 mb-3 pb-2 border-b border-gray-200" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-2xl font-bold mt-5 mb-2" {...props} />,
                    h4: ({node, ...props}) => <h4 className="text-xl font-bold mt-4 mb-2" {...props} />,
                    h5: ({node, ...props}) => <h5 className="text-lg font-bold mt-3 mb-2" {...props} />,
                    h6: ({node, ...props}) => <h6 className="text-base font-bold mt-3 mb-2" {...props} />,
                    p: ({node, ...props}) => <p className="my-4 text-gray-800 leading-7" {...props} />,
                    a: ({node, ...props}) => <a className="text-blue-600 hover:underline" {...props} />,
                    code: ({node, inline, className, children, ...props}) => {
                      const match = /language-(\w+)/.exec(className || '');
                      return inline ? (
                        <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                          {children}
                        </code>
                      ) : (
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto my-4">
                          <code className={`font-mono text-sm ${className}`} {...props}>
                            {children}
                          </code>
                        </pre>
                      );
                    },
                    pre: ({node, ...props}) => <div {...props} />,
                    blockquote: ({node, ...props}) => (
                      <blockquote className="border-l-4 border-blue-500 bg-gray-50 pl-4 py-2 my-4 italic text-gray-700" {...props} />
                    ),
                    ul: ({node, ...props}) => <ul className="my-4 ml-6 list-disc space-y-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="my-4 ml-6 list-decimal space-y-2" {...props} />,
                    li: ({node, ...props}) => <li className="text-gray-800" {...props} />,
                    table: ({node, ...props}) => (
                      <div className="overflow-x-auto my-6">
                        <table className="min-w-full border-collapse border border-gray-300" {...props} />
                      </div>
                    ),
                    thead: ({node, ...props}) => <thead className="bg-gray-100" {...props} />,
                    th: ({node, ...props}) => <th className="border border-gray-300 px-4 py-2 text-left font-semibold" {...props} />,
                    td: ({node, ...props}) => <td className="border border-gray-300 px-4 py-2" {...props} />,
                    hr: ({node, ...props}) => <hr className="my-8 border-t-2 border-gray-300" {...props} />,
                    img: ({node, ...props}) => <img className="rounded-lg shadow-md my-4 max-w-full h-auto" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-semibold text-black" {...props} />,
                    em: ({node, ...props}) => <em className="italic" {...props} />,
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ) : tempUseCodeEditor ? (
          <Editor
            height="100%"
            language={getLanguageFromFilename(file?.filename)}
            value={content}
            onChange={handleContentChange}
            theme="vs"
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              lineHeight: 1.6,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
              formatOnPaste: true,
              formatOnType: true,
              autoClosingBrackets: 'always',
              autoClosingQuotes: 'always',
              suggestOnTriggerCharacters: true,
              quickSuggestions: true,
              folding: true,
              renderWhitespace: 'selection',
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: true,
              acceptSuggestionOnEnter: 'on',
              snippetSuggestions: 'top',
              parameterHints: { enabled: true },
              hover: { enabled: true },
              contextmenu: true,
            }}
            onMount={(editor) => {
              // Add Ctrl+S keybinding to Monaco
              editor.addCommand(window.monaco.KeyMod.CtrlCmd | window.monaco.KeyCode.KeyS, () => {
                handleSave();
              });
            }}
          />
        ) : (
          <textarea
            value={content}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            className="w-full flex-1 font-mono text-sm bg-white border border-gray-200 rounded p-3 focus:outline-none focus:ring-1 focus:ring-black focus:border-black resize-none"
            placeholder="Start typing..."
            spellCheck={false}
            style={{ lineHeight: '1.6' }}
          />
        )}
      </div>
      
      <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 flex-shrink-0">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            <p>
              Press <kbd className="px-2 py-1 bg-gray-200 rounded font-mono text-xs">Ctrl+S</kbd> to save
            </p>
            {autoSave && (
              <span className="flex items-center space-x-1 text-green-600">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                <span>Auto-save enabled</span>
              </span>
            )}
            {isMarkdownFile(file?.filename) && (
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-1.5 px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                title={showPreview ? 'Switch to edit mode (temporary)' : 'Show markdown preview (temporary)'}
              >
                {showPreview ? <FaEdit className="text-black" /> : <FaEye className="text-gray-400" />}
                <span className="text-xs font-medium text-black">
                  {showPreview ? 'Preview: ON' : 'Preview: OFF'}
                </span>
              </button>
            )}
            {!isMarkdownFile(file?.filename) && (
              <button
                onClick={() => setTempUseCodeEditor(!tempUseCodeEditor)}
                className="flex items-center space-x-1.5 px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                title={tempUseCodeEditor ? 'Switch to simple editor (temporary)' : 'Enable code editor with IntelliSense (temporary)'}
              >
                <FaCode className={tempUseCodeEditor ? 'text-black' : 'text-gray-400'} />
                <span className="text-xs font-medium text-black">
                  {tempUseCodeEditor ? 'Code Editor: ON' : 'Code Editor: OFF'}
                </span>
              </button>
            )}
          </div>
          <p>
            {content.split('\n').length} lines • {content.length} characters
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileEditor;
