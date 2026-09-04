import React, { useState } from "react";
import {
  MessageSquare,
  Plus,
  Trash2,
  Settings,
  Info,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
} from "lucide-react";
import { ChatSession } from "../types";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onOpenAbout: () => void;
  onOpenSettings: () => void;
}

export function Sidebar({
  isOpen,
  setIsOpen,
  sessions,
  currentSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onOpenAbout,
  onOpenSettings,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSessions = sessions.filter((session) =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed md:static inset-y-0 left-0 z-30 w-72 bg-[#0f172a] text-slate-300 border-r border-slate-800 transform transition-transform duration-300 ease-in-out flex flex-col h-full shrink-0 ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0 md:w-0 md:border-r-0 md:overflow-hidden"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 font-bold text-white tracking-tight">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  ></path>
                </svg>
              </div>
              AI ChatBot
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Close sidebar"
            >
              <PanelLeftClose size={20} />
            </button>
          </div>

          <button
            onClick={onNewChat}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-3 px-4 flex items-center gap-3 transition-all mb-4 border border-slate-700/50"
          >
            <Plus size={20} />
            <span className="text-sm font-medium">New Chat</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={14} className="text-slate-500" />
            </div>
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/50 text-sm text-slate-200 placeholder-slate-500 rounded-lg pl-9 pr-3 py-2 border border-slate-700/50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="space-y-1 overflow-y-auto max-h-[380px] pr-2">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-3 mt-2">
              Recent Chats
            </p>
            <div className="space-y-1">
              {filteredSessions.length === 0 ? (
                <p className="text-sm text-slate-500 px-2 italic">
                  {sessions.length === 0
                    ? "No previous chats"
                    : "No matching chats"}
                </p>
              ) : (
                filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => onSelectSession(session.id)}
                    className={`group flex items-center justify-between p-3 rounded-lg text-sm cursor-pointer transition-colors ${
                      currentSessionId === session.id
                        ? "bg-slate-800/40 text-slate-200 border-l-2 border-blue-500"
                        : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                    }`}
                  >
                    <span className="truncate pr-2">{session.title}</span>
                    <div
                      onClick={(e) => onDeleteSession(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-auto p-6 space-y-4 border-t border-slate-800">
          <div
            className="bg-slate-800/50 p-4 rounded-xl cursor-pointer hover:bg-slate-800/70 transition-colors"
            onClick={onOpenAbout}
          >
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-2">
              Portfolio Project
            </p>
            <h4 className="text-xs font-semibold text-white mb-1">
              Developed by: Pankaj Singha
            </h4>
            <p className="text-[10px] text-slate-400">
              BCA – 2nd Year • React + Gemini
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onOpenSettings}
              className="flex-1 py-2 px-3 bg-slate-800 rounded-lg text-xs hover:bg-slate-700 flex items-center justify-center gap-2 text-slate-300"
            >
              <Settings size={16} />
              Settings
            </button>
            <button
              onClick={onOpenAbout}
              className="py-2 px-3 bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-300"
            >
              <Info size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
