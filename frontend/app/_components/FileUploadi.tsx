"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { api } from "@/app/utils/api";

export function FileUploadi() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (files: File[]) => {
    try {
      if (files.length === 0) return;
      
      setError(null);
      setSuccessMessage(null);
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', files[0]);

      const { data } = await api.post("/api/files/upload", formData, {
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

      console.log("Upload response data:", data);
      setSuccessMessage(`File "${files[0].name}" uploaded successfully!`);
      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 1000); 

    } catch (err: any) {
      if (err.response?.data?.errors?.file) {
        setError(err.response.data.errors.file[0]);
      } else {
        setError("File upload failed. Please try again.");
      }
      console.error("Upload error:", err);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
      <FileUpload onChange={handleFileUpload} />
      
      {/* Progress Feedback */}
      {isUploading && uploadProgress > 0 && (
        <div className="mt-4">
          <div className="h-2 bg-gray-200 rounded">
            <div 
              className="h-full bg-blue-500 rounded transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
            {uploadProgress === 100 ? "Processing..." : `Uploading... ${uploadProgress}%`}
          </p>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
          <p className="text-green-600 dark:text-green-400">{successMessage}</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}