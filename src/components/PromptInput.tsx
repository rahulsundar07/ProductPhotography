
import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';

interface PromptInputProps {
  defaultPrompt: string;
  onSubmit: (prompt: string) => void;
  disabled?: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ 
  defaultPrompt, 
  onSubmit,
  disabled = false
}) => {
  const [prompt, setPrompt] = useState(defaultPrompt);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(prompt);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 shadow-lg">
        <div className="mb-4">
          <label htmlFor="prompt" className="block text-sm font-medium text-foreground mb-2">
            Background Description
          </label>
          <div className="relative">
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all min-h-[80px] resize-none"
              placeholder="Describe the background you want..."
              disabled={disabled}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Try to be specific about the style, setting, and mood you want for your background.
          </p>
        </div>
        <button
          type="submit"
          disabled={disabled || !prompt.trim()}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 px-6 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wand2 className="w-4 h-4" />
          Generate Background
        </button>
      </form>
    </div>
  );
};

export default PromptInput;
