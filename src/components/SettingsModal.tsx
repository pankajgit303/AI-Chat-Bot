import React, { useState } from 'react';
import { X, Moon, Sun, Trash2, AlertCircle } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearAllChats: () => void;
}

export function SettingsModal({ isOpen, onClose, onClearAllChats }: SettingsModalProps) {
  const { theme, toggleTheme } = useTheme();
  const [confirmClear, setConfirmClear] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h2>
          </div>
          <button 
            onClick={() => {
              setConfirmClear(false);
              onClose();
            }}
            className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Theme Setting */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-slate-200">Theme</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Switch between light and dark mode</p>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium text-sm"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

          {/* Data Setting */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-red-600 dark:text-red-400">Clear Data</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Delete all chat history locally</p>
              </div>
              {!confirmClear ? (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-medium text-sm"
                >
                  <Trash2 size={16} />
                  Clear All
                </button>
              ) : null}
            </div>
            
            {confirmClear && (
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30 flex flex-col gap-3 mt-2 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-start gap-2 text-red-700 dark:text-red-400">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">Are you sure? This will permanently delete all your chats.</p>
                </div>
                <div className="flex gap-2 justify-end mt-1">
                  <button 
                    onClick={() => setConfirmClear(false)}
                    className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      onClearAllChats();
                      setConfirmClear(false);
                    }}
                    className="px-3 py-1.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Yes, Delete Everything
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Settings are saved locally in your browser.
          </p>
        </div>
      </div>
    </div>
  );
}
