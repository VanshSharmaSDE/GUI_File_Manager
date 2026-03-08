import React from 'react';
import { FaTimes, FaCog } from 'react-icons/fa';

const Settings = ({ isOpen, onClose, settings, onSettingsChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FaCog className="text-2xl text-black" />
            <h2 className="text-2xl font-bold text-black">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <FaTimes className="text-xl text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">Editor Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-black text-sm">Auto Save</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Automatically save files after changes
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoSave}
                        onChange={(e) => onSettingsChange({ ...settings, autoSave: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-black text-sm">Auto Save Delay (ms)</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Time to wait before auto-saving
                      </p>
                    </div>
                    <input
                      type="number"
                      min="500"
                      max="10000"
                      step="100"
                      value={settings.autoSaveDelay}
                      onChange={(e) => onSettingsChange({ ...settings, autoSaveDelay: parseInt(e.target.value) })}
                      disabled={!settings.autoSave}
                      className="w-24 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black disabled:bg-gray-100 disabled:text-gray-400"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-black text-sm">Use Code Editor</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Enable Monaco Editor with syntax highlighting and IntelliSense
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.useCodeEditor}
                        onChange={(e) => onSettingsChange({ ...settings, useCodeEditor: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-black text-sm">Render Markdown by Default</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Show markdown preview for .md and README files
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.renderMarkdownByDefault}
                        onChange={(e) => onSettingsChange({ ...settings, renderMarkdownByDefault: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="btn-primary"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
