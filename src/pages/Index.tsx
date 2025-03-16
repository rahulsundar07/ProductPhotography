
import React, { useState } from 'react';
import { toast } from "sonner";
import Header from '@/components/Header';
import ImageUploader from '@/components/ImageUploader';
import PromptInput from '@/components/PromptInput';
import ResultsDisplay from '@/components/ResultsDisplay';
import { generateBackground } from '@/services/api';
import { Loader } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const Index = () => {
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = (file: File) => {
    setProductImage(file);
    
    console.log('Image selected:', {
      name: file.name,
      type: file.type,
      size: file.size
    });
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProductImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
    
    // Reset other states
    setGeneratedImage(null);
    setShowResults(false);
    setError(null);
  };

  // Inside the Index component
  const [processingStep, setProcessingStep] = useState<string>(""); 
  
  // Update the handleGenerateBackground function
  const handleGenerateBackground = async (prompt: string) => {
    if (!productImage) {
      toast.error('Please upload a product image first');
      return;
    }
  
    // Show the starting toast before beginning the process
    toast.info('Starting background generation. This may take a minute...', {
      duration: 3000,
    });
  
    try {
      setIsGenerating(true);
      setProgress(0);
      setError(null);
      setProcessingStep("Preparing your image");
      
      const result = await generateBackground(
        { productImage, prompt },
        (progressValue) => {
          setProgress(progressValue);
          // Update processing step based on progress
          if (progressValue < 20) setProcessingStep("Initializing");
          else if (progressValue < 40) setProcessingStep("Analyzing image");
          else if (progressValue < 60) setProcessingStep("Generating background");
          else if (progressValue < 80) setProcessingStep("Applying enhancements");
          else if (progressValue < 95) setProcessingStep("Finalizing image");
          else setProcessingStep("Almost done!");
        }
      );
      
      setGeneratedImage(result.outputImageUrl);
      setShowResults(true);
      
      // Show success toast after completion
      toast.success('Background generated successfully!', {
        description: 'Your image is ready to download.',
        action: {
          label: 'View',
          onClick: () => setShowResults(true)
        },
      });
    } catch (error) {
      console.error('Failed to generate background:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      
      // Show error toast with the correct error message
      toast.error(`Something went wrong`, {
        description: errorMessage,
        action: {
          label: 'Try Again',
          onClick: () => handleGenerateBackground(prompt)
        },
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setProductImage(null);
    setProductImagePreview(null);
    setGeneratedImage(null);
    setShowResults(false);
    setProgress(0);
    setError(null);
    console.log('Reset all states');
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 sm:px-6 bg-gradient-to-b from-slate-50 via-blue-50 to-purple-50">
      <Header />
      
      <div className="w-full max-w-4xl mx-auto mt-8">
        {!showResults ? (
          <>
            {!isGenerating ? (
              <>
                <ImageUploader onImageSelected={handleImageSelected} />
                
                {productImage && (
                  <PromptInput 
                    defaultPrompt="natural outdoor setting, forest background, high resolution" 
                    onSubmit={handleGenerateBackground}
                  />
                )}
              </>
            ) : (
              <div className="w-full max-w-md mx-auto mt-12 text-center animate-fade-in">
                <div className="glass-panel p-8 rounded-2xl backdrop-blur-md bg-white/80 border border-white/20 shadow-xl">
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative w-16 h-16 mb-4">
                      <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                      <div 
                        className="absolute inset-0 border-4 border-t-primary border-l-transparent border-r-transparent border-b-transparent rounded-full animate-spin-slow"
                      ></div>
                    </div>
                    
                    <h3 className="text-lg font-medium mb-2">
                      Generating Your Background
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-6">
                      This may take 30-50 seconds
                    </p>
                    
                    <div className="w-full h-2 bg-gray-200 rounded-full mb-2 overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {progress.toFixed(0)}% complete
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {productImagePreview && generatedImage && (
              <ResultsDisplay 
                originalImage={productImagePreview} 
                generatedImage={generatedImage}
                onReset={handleReset}
              />
            )}
          </>
        )}
        
        {error && (
          <div className="mt-8 max-w-md mx-auto">
            <Alert variant="destructive" className="bg-destructive/5 border-destructive/30">
              <AlertTitle>Error Details</AlertTitle>
              <AlertDescription className="mt-2">
                <div className="text-sm overflow-auto p-2 bg-background/50 rounded border border-destructive/10 max-h-40">
                  {error}
                </div>
                <button
                  onClick={handleReset}
                  className="mt-4 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                >
                  Try Again
                </button>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
