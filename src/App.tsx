import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Menu, Moon, Sun, Loader2 } from 'lucide-react';
import { Message, ChatSession } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { sendMessageToGeminiStream } from './services/gemini';
import { Sidebar } from './components/Sidebar';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AboutModal } from './components/AboutModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [sessions, setSessions] = useLocalStorage<ChatSession[]>('chatbot-sessions', []);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 768 : false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Set initial session ONLY on first load if none selected
  useEffect(() => {
    if (!hasInitialized.current) {
      if (!currentSessionId && sessions.length > 0) {
        setCurrentSessionId(sessions[0].id);
      }
      hasInitialized.current = true;
    }
  }, [sessions, currentSessionId]);

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setIsSidebarOpen(false);
  };

  const handleClearAllChats = () => {
    setSessions([]);
    setCurrentSessionId(null);
    setIsSettingsModalOpen(false);
  };

  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id);
    setIsSidebarOpen(false);
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSessions = sessions.filter(s => s.id !== id);
    setSessions(newSessions);
    if (currentSessionId === id) {
      setCurrentSessionId(newSessions.length > 0 ? newSessions[0].id : null);
    }
  };

  const generateTitle = (text: string) => {
    const title = text.split(' ').slice(0, 5).join(' ');
    return title.length > 30 ? title.substring(0, 30) + '...' : title;
  };

  const saveMessage = (sessionId: string, message: Message) => {
    setSessions(prev => {
      const sessionIndex = prev.findIndex(s => s.id === sessionId);
      if (sessionIndex >= 0) {
        const updated = [...prev];
        updated[sessionIndex] = {
          ...updated[sessionIndex],
          messages: [...updated[sessionIndex].messages, message],
          updatedAt: Date.now()
        };
        // Sort by updatedAt descending
        return updated.sort((a, b) => b.updatedAt - a.updatedAt);
      }
      return prev;
    });
  };

  const handleSendMessage = async (text: string) => {
    let activeSessionId = currentSessionId;
    
    // Create new session if needed
    if (!activeSessionId) {
      activeSessionId = uuidv4();
      const newSession: ChatSession = {
        id: activeSessionId,
        title: generateTitle(text),
        messages: [],
        updatedAt: Date.now()
      };
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(activeSessionId);
    }

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      text,
      timestamp: Date.now()
    };

    saveMessage(activeSessionId, userMessage);
    setIsLoading(true);

    try {
      // Get history up to this point (including the new user message)
      const currentSessionData = sessions.find(s => s.id === activeSessionId);
      const history = currentSessionData ? currentSessionData.messages : [];
      const fullHistory = [...history, userMessage];

      // Add placeholder message for AI
      const aiMessageId = uuidv4();
      let currentAiText = '';
      
      const initialAiMessage: Message = {
        id: aiMessageId,
        role: 'model',
        text: '',
        timestamp: Date.now()
      };
      saveMessage(activeSessionId, initialAiMessage);

      await sendMessageToGeminiStream(fullHistory, (chunk) => {
        currentAiText += chunk;
        setSessions(prev => {
          const sessionIndex = prev.findIndex(s => s.id === activeSessionId);
          if (sessionIndex >= 0) {
            const updated = [...prev];
            const messages = [...updated[sessionIndex].messages];
            const msgIndex = messages.findIndex(m => m.id === aiMessageId);
            if (msgIndex >= 0) {
              messages[msgIndex] = { ...messages[msgIndex], text: currentAiText };
            }
            updated[sessionIndex] = {
              ...updated[sessionIndex],
              messages
            };
            return updated;
          }
          return prev;
        });
      });
    } catch (error: any) {
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'model',
        text: `**Error:** ${error.message || 'Failed to communicate with AI.'}`,
        timestamp: Date.now()
      };
      saveMessage(activeSessionId, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!currentSessionId || messages.length < 2 || isLoading) return;
    
    // Find the last user message
    const lastUserMessageIndex = [...messages].reverse().findIndex(m => m.role === 'user');
    if (lastUserMessageIndex === -1) return;
    
    const realIndex = messages.length - 1 - lastUserMessageIndex;
    const historyUpToUserMessage = messages.slice(0, realIndex + 1);
    
    // Remove all messages after the last user message in the session state
    setSessions(prev => {
      const updated = [...prev];
      const sessionIndex = updated.findIndex(s => s.id === currentSessionId);
      if (sessionIndex >= 0) {
        updated[sessionIndex] = {
          ...updated[sessionIndex],
          messages: historyUpToUserMessage,
          updatedAt: Date.now()
        };
      }
      return updated;
    });

    setIsLoading(true);

    try {
      // Add placeholder message for AI
      const aiMessageId = uuidv4();
      let currentAiText = '';
      
      const initialAiMessage: Message = {
        id: aiMessageId,
        role: 'model',
        text: '',
        timestamp: Date.now()
      };
      saveMessage(currentSessionId, initialAiMessage);

      await sendMessageToGeminiStream(historyUpToUserMessage, (chunk) => {
        currentAiText += chunk;
        setSessions(prev => {
          const sessionIndex = prev.findIndex(s => s.id === currentSessionId);
          if (sessionIndex >= 0) {
            const updated = [...prev];
            const sessionMessages = [...updated[sessionIndex].messages];
            const msgIndex = sessionMessages.findIndex(m => m.id === aiMessageId);
            if (msgIndex >= 0) {
              sessionMessages[msgIndex] = { ...sessionMessages[msgIndex], text: currentAiText };
            }
            updated[sessionIndex] = {
              ...updated[sessionIndex],
              messages: sessionMessages
            };
            return updated;
          }
          return prev;
        });
      });
    } catch (error: any) {
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'model',
        text: `**Error:** ${error.message || 'Failed to communicate with AI.'}`,
        timestamp: Date.now()
      };
      saveMessage(currentSessionId, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full bg-[#f9fafb] dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      
      <Sidebar 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      <main className="flex-1 flex flex-col bg-white dark:bg-slate-950 h-full relative min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-8 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-2">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Open sidebar"
              >
                <Menu size={20} />
              </button>
            )}
            <h2 className="font-semibold text-slate-800 dark:text-slate-200 truncate">
              {currentSession?.title || 'AI ChatBot'}
            </h2>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            title="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto relative flex flex-col">
          {!currentSessionId || messages.length === 0 ? (
            <WelcomeScreen onSelectPrompt={handleSendMessage} />
          ) : (
            <div className="pb-32 w-full">
              {messages.map((message, index) => (
                <ChatMessage 
                  key={message.id} 
                  message={message} 
                  isLastModelMessage={message.role === 'model' && index === messages.length - 1}
                  onRegenerate={handleRegenerate}
                  isRegenerating={isLoading}
                />
              ))}
              
              {isLoading && (
                <div className="flex w-full py-6 px-4 md:px-8">
                  <div className="max-w-4xl mx-auto flex gap-4 md:gap-6 w-full">
                    <div className="shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 border border-blue-200 text-blue-600 dark:bg-blue-900/50 dark:border-blue-800/50 dark:text-blue-400 flex items-center justify-center shadow-sm">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                    <div className="flex-1 min-w-0 flex items-center pt-1">
                      <div className="flex gap-1 items-center h-full">
                        <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 pt-0 md:p-8 md:pt-0 w-full shrink-0 bg-transparent dark:bg-slate-950 flex flex-col items-center">
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
          <div className="mt-4 text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wide">
            © {new Date().getFullYear()} Pankaj Singha. All rights reserved. <a href="https://pankajportfolioo.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 hover:underline transition-colors ml-1">Visit Portfolio</a>
          </div>
        </div>
      </main>

      <AboutModal 
        isOpen={isAboutModalOpen} 
        onClose={() => setIsAboutModalOpen(false)} 
      />
      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onClearAllChats={handleClearAllChats}
      />
    </div>
  );
}
