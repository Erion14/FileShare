"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { api } from "@/app/utils/api";

export function FileUploadi() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (files: File[]) => {
    try {
      setError(null);
      const formData = new FormData();
      
      // Append each file individually
      files.forEach((file, index) => {
        formData.append(`file${index}`, file); // Or use 'files[]' for array format
      });

      const { data } = await api.post("/api/files", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadProgress(percent);
        }
      });

      console.log("Upload successful:", data);
    } catch (err) {
      setError("File upload failed. Please try again.");
      console.error("Upload error:", err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
      <FileUpload onChange={handleFileUpload} />
      
      {/* Progress Feedback */}
      {uploadProgress > 0 && (
        <div className="mt-4">
          <div className="h-2 bg-gray-200 rounded">
            <div 
              className="h-full bg-blue-500 rounded transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm mt-2">
            {uploadProgress === 100 ? "Processing..." : `Uploading... ${uploadProgress}%`}
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <p className="text-red-500 mt-4 text-sm">{error}</p>
      )}
    </div>
  );
}