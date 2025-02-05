'use client';
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadFile } from '@/app/services/ipfs';
import { api } from '@/app/utils/api';

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      for (const file of acceptedFiles) {
        setProgress(0);
        
        // Upload to IPFS
        const cid = await uploadFile(file);
        
        // Save metadata to backend
        await api.post('/api/files', {
          name: file.name,
          size: file.size,
          type: file.type,
          cid: cid
        });
        
        setProgress(100);
        setSuccessMessage(`File ${file.name} uploaded successfully!`);
      }
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: uploading
  });

  return (
    <div className="min-h-screen bg-[#121212] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Upload Files</h1>
        
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'}
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-4">
            <div className="text-4xl text-gray-400">
              📁
            </div>
            {isDragActive ? (
              <p className="text-lg text-gray-300">Drop the files here...</p>
            ) : (
              <p className="text-lg text-gray-400">
                Drag & drop files here, or click to select files
              </p>
            )}
            <p className="text-sm text-gray-500">
              Supported files: Images, PDFs, Documents
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {uploading && (
          <div className="mt-6">
            <div className="h-2 bg-gray-700 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Uploading... {progress}%
            </p>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mt-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
            <p className="text-green-400">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Upload History */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-white mb-4">Recent Uploads</h2>
          {/* Add your upload history list here */}
        </div>
      </div>
    </div>
  );
} 