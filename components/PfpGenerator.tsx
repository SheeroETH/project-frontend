import React, { useState, useRef, useCallback } from 'react';
import { Upload, Wand2, RefreshCw, Download, Image as ImageIcon } from 'lucide-react';
import { generatePfp } from '../services/apiService';

const PfpGenerator: React.FC = () => {
  // Default baby image
  const DEFAULT_IMAGE = "/default-baby.png";

  const [prompt, setPrompt] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(DEFAULT_IMAGE);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size too large. Please upload an image under 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setError(null);
        // Clear generated image when a new source is uploaded to avoid confusion
        setGeneratedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const [remainingGenerations, setRemainingGenerations] = useState<number>(4);
  const MAX_DAILY_GENERATIONS = 4;

  React.useEffect(() => {
    const checkDailyLimit = () => {
      const today = new Date().toISOString().split('T')[0];
      const storedData = localStorage.getItem('baby_factory_generations');

      if (storedData) {
        const { date, count } = JSON.parse(storedData);
        if (date === today) {
          setRemainingGenerations(MAX_DAILY_GENERATIONS - count);
        } else {
          // New day, reset
          localStorage.setItem('baby_factory_generations', JSON.stringify({ date: today, count: 0 }));
          setRemainingGenerations(MAX_DAILY_GENERATIONS);
        }
      } else {
        // First time
        localStorage.setItem('baby_factory_generations', JSON.stringify({ date: today, count: 0 }));
        setRemainingGenerations(MAX_DAILY_GENERATIONS);
      }
    };

    checkDailyLimit();
  }, []);

  const handleGenerate = async () => {
    if (remainingGenerations <= 0) {
      setError("You have reached your daily limit of 4 generations. Please come back tomorrow!");
      return;
    }

    if (!prompt && !selectedImage) {
      setError("Please write a prompt or upload an image to start.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Default prompt if user uploads image but doesn't write anything
      const effectivePrompt = prompt.trim() || "Make this into a cute 3D baby character style pfp";

      let imageToSend = selectedImage;

      // If the image is a local path (like our default image), convert it to base64
      if (selectedImage && selectedImage.startsWith('/')) {
        try {
          const response = await fetch(selectedImage);
          const blob = await response.blob();
          imageToSend = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        } catch (e) {
          console.error("Failed to convert default image to base64", e);
          throw new Error("Failed to process default image");
        }
      }

      const result = await generatePfp(effectivePrompt, imageToSend || undefined);
      setGeneratedImage(result);

      // Update daily count
      const today = new Date().toISOString().split('T')[0];
      const currentCount = MAX_DAILY_GENERATIONS - remainingGenerations;
      const newCount = currentCount + 1;
      localStorage.setItem('baby_factory_generations', JSON.stringify({ date: today, count: newCount }));
      setRemainingGenerations(MAX_DAILY_GENERATIONS - newCount);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `baby-pfp-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-8">

      {/* Control Bar */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6 mb-8">

        {/* Input Area */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch">

          {/* File Upload Trigger */}
          <div className="relative group shrink-0">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div
              className={`h-full aspect-square md:w-16 md:h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-200 ${selectedImage ? 'border-gray-200 bg-gray-50' : 'border-gray-200 bg-gray-50'}`}
            >
              {selectedImage ? (
                <img src={selectedImage} alt="Preview" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <Upload className="text-gray-400" size={24} />
              )}
            </div>
            {selectedImage && selectedImage !== DEFAULT_IMAGE && (
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedImage(DEFAULT_IMAGE); fileInputRef.current!.value = ''; }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 text-xs"
                title="Reset to default image"
              >
                ✕
              </button>
            )}
          </div>

          {/* Text Input */}
          <div className="flex-grow relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your baby PFP (e.g. 'A baby astronaut on mars')..."
              className="w-full h-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#EDEEFF] focus:ring-4 focus:ring-[#EDEEFF] transition-all text-gray-700 placeholder-gray-400 text-lg"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className={`shrink-0 h-16 px-8 rounded-2xl font-bold text-lg flex items-center justify-center space-x-2 transition-all shadow-lg shadow-gray-400
              ${isLoading
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#383838] to-[#000000] text-white hover:scale-105 hover:shadow-gray-500'
              }`}
          >
            {isLoading ? (
              <RefreshCw className="animate-spin" />
            ) : (
              <>
                <span>Create Baby</span>
                <Wand2 size={20} />
              </>
            )}
          </button>
          <div className="absolute -bottom-6 left-0 right-0 text-center">
            <span className="text-xs text-gray-400 font-medium">{remainingGenerations} / 4 free generations left</span>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-500 text-sm rounded-xl border border-red-100 text-center">
            {error}
          </div>
        )}
      </div>

      {/* Results Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

        {/* Source Image (if uploaded) */}
        {selectedImage && (
          <div className="flex flex-col items-center">
            <div className="relative bg-white rounded-3xl shadow-2xl shadow-blue-100 border-4 border-white w-full aspect-square flex items-center justify-center overflow-hidden">
              <img src={selectedImage} alt="Source" className="w-full h-full object-cover" />
            </div>
            <p className="mt-3 text-gray-400 font-medium text-sm uppercase tracking-widest">Original</p>
          </div>
        )}

        {/* Generated Result */}
        <div className={`flex flex-col items-center ${!selectedImage ? 'col-span-full max-w-lg mx-auto w-full' : ''}`}>
          <div className={`relative bg-white rounded-3xl shadow-2xl shadow-blue-100 border-4 border-white w-full aspect-square flex items-center justify-center overflow-hidden transition-all duration-500 ${isLoading ? 'animate-pulse' : ''}`}>

            {generatedImage ? (
              <img src={generatedImage} alt="Generated Baby PFP" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-gray-300">
                <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <ImageIcon size={48} className="opacity-20" />
                </div>
                <span className="font-medium text-lg">Your baby will appear here</span>
              </div>
            )}

            {/* Overlay Actions */}
            {generatedImage && !isLoading && (
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <button
                  onClick={handleDownload}
                  className="bg-white text-black px-6 py-3 rounded-full font-bold flex items-center space-x-2 transform hover:scale-110 transition-transform"
                >
                  <Download size={18} />
                  <span>Download</span>
                </button>
              </div>
            )}
          </div>

          {/* Status Text Box (Mimicking the 'Here is your BABY' box from screenshot) */}


        </div>

      </div>
    </div>
  );
};

export default PfpGenerator;
