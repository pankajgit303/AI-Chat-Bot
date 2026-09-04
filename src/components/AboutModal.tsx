import React from 'react';
import { X, Code, ExternalLink, Cpu } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Cpu className="text-blue-600 dark:text-blue-400" />
            About Project
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <div className="space-y-6">
            
            <div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                AI ChatBot – Intelligent Virtual Assistant
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                An academic AI chatbot project developed to explore conversational AI, API integration, and modern web application development. The application uses Google's Gemini API to generate intelligent responses and provides a responsive, user-friendly chat experience.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                <Code size={16} /> Technologies Used
              </h4>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Tailwind CSS', 'Gemini API', 'Vite', 'Express (Backend)', 'LocalStorage'].map(tech => (
                  <span key={tech} className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300 shadow-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 uppercase tracking-wider">
                Developer Information
              </h4>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="shrink-0">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500 shadow-md">
                    <img 
                      src="/developer.png" 
                      alt="Pankaj Singha" 
                      className="w-full h-full object-cover bg-slate-100 dark:bg-slate-800"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Pankaj+Singha&background=3b82f6&color=fff&size=150';
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 border-l-0 sm:border-l-2 border-blue-500 pl-0 sm:pl-4 text-center sm:text-left w-full">
                  <p><span className="font-medium text-slate-900 dark:text-slate-200">Developed by:</span> Pankaj Singha</p>
                  <p><span className="font-medium text-slate-900 dark:text-slate-200">Portfolio:</span> <a href="https://pankajportfolioo.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1">pankajportfolioo.vercel.app <ExternalLink size={12} /></a></p>
                  <p><span className="font-medium text-slate-900 dark:text-slate-200">Course:</span> BCA – 2nd Year</p>
                  <p><span className="font-medium text-slate-900 dark:text-slate-200">Project Type:</span> Academic Project</p>
                  <p><span className="font-medium text-slate-900 dark:text-slate-200">Technology:</span> React + Gemini API</p>
                </div>
              </div>
            </div>

          </div>
        </div>
        
        {/* Footer */}
        <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showcase this project on your portfolio to demonstrate full-stack and AI integration skills.
          </p>
        </div>
      </div>
    </div>
  );
}
