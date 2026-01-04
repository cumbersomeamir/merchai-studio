
import React, { useState } from 'react';

interface EditorProps {
  imageUrl: string;
  onEdit: (prompt: string) => void;
  isEditing: boolean;
  onExport: () => void;
}

const Editor: React.FC<EditorProps> = ({ imageUrl, onEdit, isEditing, onExport }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onEdit(prompt);
      setPrompt('');
    }
  };

  const quickPrompts = [
    "Add a retro vintage filter",
    "Change the product color to navy blue",
    "Make the background a modern office",
    "Add dramatic sunset lighting",
    "Place in a mountain scenery"
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      <div className="relative flex-1 bg-slate-950 flex items-center justify-center p-4">
        {isEditing && (
          <div className="absolute inset-0 z-20 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-blue-400 font-medium animate-pulse text-lg">AI is remastering your mockup...</p>
          </div>
        )}
        <img 
          src={imageUrl} 
          alt="Generated Mockup" 
          className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
        />
      </div>

      <div className="p-6 bg-slate-900 border-t border-slate-800">
        <div className="flex flex-wrap gap-2 mb-4">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => onEdit(p)}
              className="text-xs px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type instructions to edit (e.g. 'Add a retro filter')"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <button
            type="submit"
            disabled={isEditing || !prompt.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-lg transition-all"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={onExport}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold rounded-lg transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-download"></i>
            Export
          </button>
        </form>
      </div>
    </div>
  );
};

export default Editor;
