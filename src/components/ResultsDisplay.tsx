
import React from 'react';
import { Download, RefreshCw } from 'lucide-react';

interface ResultsDisplayProps {
  originalImage: string;
  generatedImage: string;
  onReset: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  originalImage,
  generatedImage,
  onReset
}) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'product-with-background.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 animate-scale-in">
      <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Your Results</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
            <img 
              src={originalImage} 
              alt="Original" 
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 py-3 px-4 bg-black/30 backdrop-blur-md text-white font-medium">
              Original Product
            </div>
          </div>
        </div>
        
        <div className="overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
            <img 
              src={generatedImage} 
              alt="Generated" 
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 py-3 px-4 bg-black/30 backdrop-blur-md text-white font-medium">
              AI-Generated Result
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] min-w-40"
        >
          <Download className="w-5 h-5" />
          Download Result
        </button>
        
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium transition-all hover:bg-secondary/80 active:scale-[0.98] min-w-40"
        >
          <RefreshCw className="w-5 h-5" />
          Create Another
        </button>
      </div>
    </div>
  );
};

export default ResultsDisplay;
