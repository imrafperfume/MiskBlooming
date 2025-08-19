"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import {
  Upload,
  X,
  ImageIcon,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "./Button";

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  status: "uploading" | "success" | "error";
  progress: number;
  error?: string;
}

interface FileUploadProps {
  onFilesUploaded: (files: string[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  existingFiles?: string[];
  className?: string;
}

export function FileUpload({
  onFilesUploaded,
  maxFiles = 10,
  maxFileSize = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  existingFiles = [],
  className = "",
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported`;
    }
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`;
    }
    return null;
  };

  const simulateUpload = (file: UploadedFile): Promise<string> => {
    return new Promise((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);

          // Simulate success/failure (90% success rate)
          if (Math.random() > 0.1) {
            // Create a blob URL for the uploaded file
            const imageUrl = URL.createObjectURL(file.file);
            resolve(imageUrl);
          } else {
            reject(new Error("Upload failed"));
          }
        }

        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? {
                  ...f,
                  progress,
                  status: progress === 100 ? "success" : "uploading",
                }
              : f
          )
        );
      }, 100);
    });
  };

  const handleFiles = useCallback(
    async (files: FileList) => {
      const totalFiles =
        uploadedFiles.length + existingFiles.length + files.length;
      if (totalFiles > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }

      setIsUploading(true);
      const newFiles: UploadedFile[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const error = validateFile(file);

        if (error) {
          alert(error);
          continue;
        }

        const uploadedFile: UploadedFile = {
          id: `${Date.now()}-${i}`,
          file,
          preview: URL.createObjectURL(file),
          status: "uploading",
          progress: 0,
        };

        newFiles.push(uploadedFile);
      }

      setUploadedFiles((prev) => [...prev, ...newFiles]);

      // Upload files
      const uploadPromises = newFiles.map(async (uploadedFile) => {
        try {
          const url = await simulateUpload(uploadedFile);
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === uploadedFile.id
                ? { ...f, status: "success", progress: 100 }
                : f
            )
          );
          return url;
        } catch (error) {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === uploadedFile.id
                ? {
                    ...f,
                    status: "error",
                    error:
                      error instanceof Error ? error.message : "Upload failed",
                  }
                : f
            )
          );
          return null;
        }
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(Boolean) as string[];

      if (successfulUploads.length > 0) {
        onFilesUploaded([...existingFiles, ...successfulUploads]);
      }

      setIsUploading(false);
    },
    [
      uploadedFiles,
      existingFiles,
      maxFiles,
      maxFileSize,
      acceptedTypes,
      onFilesUploaded,
    ]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        handleFiles(files);
      }
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [handleFiles]
  );

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== fileId);
    });
  };

  const retryUpload = async (fileId: string) => {
    const file = uploadedFiles.find((f) => f.id === fileId);
    if (!file) return;

    setUploadedFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? { ...f, status: "uploading", progress: 0, error: undefined }
          : f
      )
    );

    try {
      const url = await simulateUpload(file);
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: "success", progress: 100 } : f
        )
      );
      onFilesUploaded([...existingFiles, url]);
    } catch (error) {
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: "error",
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : f
        )
      );
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${
            isDragOver
              ? "border-luxury-400 bg-luxury-50 scale-105"
              : "border-gray-300 hover:border-gray-400"
          }
          ${isUploading ? "pointer-events-none opacity-75" : "cursor-pointer"}
        `}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-4">
          <div
            className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
              isDragOver ? "bg-luxury-100" : "bg-gray-100"
            }`}
          >
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-luxury-600 animate-spin" />
            ) : (
              <Upload
                className={`w-8 h-8 ${
                  isDragOver ? "text-luxury-600" : "text-gray-400"
                }`}
              />
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isDragOver ? "Drop files here" : "Upload Product Images"}
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your images here, or click to browse
            </p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>Supported formats: JPG, PNG, WebP, GIF</p>
              <p>Maximum file size: {maxFileSize}MB each</p>
              <p>Maximum {maxFiles} files total</p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="pointer-events-none bg-transparent"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Choose Files
          </Button>
        </div>

        {isDragOver && (
          <div className="absolute inset-0 bg-luxury-500 bg-opacity-10 rounded-xl flex items-center justify-center">
            <div className="text-luxury-600 font-semibold text-lg">
              Drop files to upload
            </div>
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Uploading Files</h4>
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center space-x-4">
                {/* Preview */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={file.preview || "/placeholder.svg"}
                    alt={file.file.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.file.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      {file.status === "success" && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {file.status === "error" && (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="p-1"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-2">
                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                  </div>

                  {/* Progress Bar */}
                  {file.status === "uploading" && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-luxury-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}

                  {/* Success Message */}
                  {file.status === "success" && (
                    <div className="text-sm text-green-600">
                      Upload completed successfully
                    </div>
                  )}

                  {/* Error Message */}
                  {file.status === "error" && (
                    <div className="space-y-2">
                      <div className="text-sm text-red-600">
                        {file.error || "Upload failed"}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => retryUpload(file.id)}
                      >
                        Retry Upload
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
