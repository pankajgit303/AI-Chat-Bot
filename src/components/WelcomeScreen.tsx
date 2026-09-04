import React from 'react';
import { Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onSelectPrompt: (prompt: string) => void;
}

export function WelcomeScreen({ onSelectPrompt }: WelcomeScreenProps) {
  const examplePrompts = [
    { label: "Logic", text: "Explain machine learning in simple words" },
    { label: "Coding", text: "Help me learn JavaScript basics" },
    { label: "Database", text: "Create a study plan for DBMS" },
    { label: "Theory", text: "Explain software engineering concepts" }
  ];

  return (
    <div className="flex-1 w-full flex flex-col overflow-y-auto">
      <div className="max-w-3xl mx-auto w-full min-h-full flex flex-col justify-center items-center px-4 py-8 md:px-6">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 ring-4 ring-blue-50/50 dark:ring-blue-900/10 shrink-0">
          <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3 tracking-tight text-center">
          Intelligent Virtual Assistant
        </h1>
        <p className="text-slate-500 text-center max-w-lg mb-8 md:mb-10 leading-relaxed text-sm md:text-base">
          Academic AI project exploring conversational interfaces and API integration. Powered by Google Gemini for accurate, real-time responses.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 w-full max-w-2xl">
          {examplePrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => onSelectPrompt(prompt.text)}
              className="group text-left p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all bg-white dark:bg-slate-900"
            >
              <p className="text-[10px] md:text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-1 opacity-70">{prompt.label}</p>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{prompt.text}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
