
import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Add this state for image loading
  const [isImageLoading, setIsImageLoading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }

    setIsImageLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreview(e.target.result as string);
        onImageSelected(file);
        setIsImageLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div 
        className={`upload-zone h-72 flex flex-col items-center justify-center p-6 ${isDragging ? 'active' : ''} ${preview ? 'overflow-hidden' : ''} shadow-lg transition-all border-opacity-30 hover:border-opacity-50`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {preview ? (
          <div className="w-full h-full relative">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <p className="text-sm font-medium text-foreground bg-white/90 px-4 py-2 rounded-full shadow-sm">
                Click to change
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <p className="font-medium text-foreground mb-2 text-lg">Drop your product image here</p>
            <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
            <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center animate-bounce">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept="image/*"
          className="hidden"
        />
      </div>
      {!preview && (
        <div className="mt-6 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p className="font-medium text-base text-foreground mb-3">Example products</p>
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            {/* Removed the first example product */}
            <div className="aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer bg-white p-1">
              <img 
                src="/lovable-uploads/d5d1c8b2-2eb8-4401-8c6b-222251a7643f.png" 
                alt="Product example"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer bg-white p-1">
              <img 
                src="/lovable-uploads/ba7c0c89-df9a-4afe-8d8a-1d17ac9adbb4.png" 
                alt="Product example"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer bg-white p-1">
              <img 
                src="/lovable-uploads/41218077-6805-4319-a741-46c3b17b8980.png" 
                alt="Product example"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
