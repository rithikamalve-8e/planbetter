import React, { useCallback, useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

interface FloorPlanUploadProps {
  onUploadComplete: (floorPlanId: string, imageData: string) => void;
  projectId: string;
  publicAnonKey: string;
}

export function FloorPlanUpload({ onUploadComplete, projectId, publicAnonKey }: FloorPlanUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setFileName(file.name);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setPreview(imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!preview) {
      toast.error('Please select a file first');
      return;
    }

    setUploading(true);
    
    try {
      // Generate a local floor plan ID
      const id = `floor-plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Simulate a brief upload delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Floor plan uploaded successfully!');
      onUploadComplete(id, preview);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload floor plan');
    } finally {
      setUploading(false);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setFileName('');
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-3xl mx-auto">
      {!preview ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 transition-all ${
            dragActive
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-green-400 bg-white'
          }`}
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Upload className="w-8 h-8 text-green-600" />
            </div>
            
            <h3 className="mb-2 text-gray-900">Upload Your Floor Plan</h3>
            <p className="text-gray-600 mb-4">
              Drag & drop your floor plan or click to browse
            </p>
            
            <div className="flex justify-center">
              <Label htmlFor="file-upload" className="cursor-pointer">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="mb-4"
                  onClick={handleBrowseClick}
                >
                  Browse Files
                </Button>
                <Input
                  id="file-upload"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </Label>
            </div>
            
            <p className="text-sm text-gray-500">
              Supports PNG, JPG up to 10MB
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative border-2 border-green-300 rounded-xl overflow-hidden bg-white">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearPreview}
              className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white"
            >
              <X className="w-4 h-4" />
            </Button>
            <img
              src={preview}
              alt="Floor plan preview"
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">{fileName}</p>
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-green-600 hover:bg-green-700"
            >
              {uploading ? 'Uploading...' : 'Continue to Analysis'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}