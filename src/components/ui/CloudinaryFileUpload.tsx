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
  Cloud,
  Zap,
} from "lucide-react";
import { Button } from "./Button";
import {
  uploadToCloudinary,
  validateImageFile,
  getResponsiveImageUrls,
  type CloudinaryUploadResult,
} from "../../lib/cloudinary";

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  status: "uploading" | "success" | "error";
  progress: number;
  error?: string;
  cloudinaryResult?: CloudinaryUploadResult;
  optimizedUrls?: ReturnType<typeof getResponsiveImageUrls>;
}

interface CloudinaryFileUploadProps {
  onFilesUploaded: (
    files: Array<{
      url: string;
      publicId: string;
      optimizedUrls: ReturnType<typeof getResponsiveImageUrls>;
    }>
  ) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  existingFiles?: Array<{ url: string; publicId: string }>;
  className?: string;
  folder?: string;
  tags?: string[];
}

export function CloudinaryFileUpload({
  onFilesUploaded,
  maxFiles = 10,
  maxFileSize = 10,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  existingFiles = [],
  className = "",
  folder = "misk-blooming/products",
  tags = ["product", "misk-blooming"],
}: CloudinaryFileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStats, setUploadStats] = useState({
    total: 0,
    completed: 0,
    failed: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      // Validate and prepare files
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const validation = validateImageFile(file);

        if (!validation.valid) {
          alert(validation.error);
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
      setUploadStats({ total: newFiles.length, completed: 0, failed: 0 });

      // Upload files to Cloudinary
      const uploadPromises = newFiles.map(async (uploadedFile) => {
        try {
          // Simulate progress updates
          const progressInterval = setInterval(() => {
            setUploadedFiles((prev) =>
              prev.map((f) => {
                if (f.id === uploadedFile.id && f.progress < 90) {
                  return {
                    ...f,
                    progress: Math.min(f.progress + Math.random() * 20, 90),
                  };
                }
                return f;
              })
            );
          }, 200);

          // Upload to Cloudinary with optimizations
          const result = await uploadToCloudinary(uploadedFile.file, {
            folder,
            tags,
            context: {
              alt: `Product image ${uploadedFile.file.name}`,
              caption: `Uploaded ${new Date().toISOString()}`,
            },
            eager: [
              {
                width: 150,
                height: 150,
                crop: "thumb",
                quality: "auto",
                format: "webp",
              },
              {
                width: 400,
                height: 400,
                crop: "fill",
                quality: "auto",
                format: "webp",
              },
              {
                width: 800,
                height: 800,
                crop: "fill",
                quality: "auto",
                format: "webp",
              },
              {
                width: 1200,
                height: 1200,
                crop: "fill",
                quality: "auto",
                format: "webp",
              },
            ],
          });

          clearInterval(progressInterval);

          // Generate optimized URLs
          const optimizedUrls = getResponsiveImageUrls(result.public_id);

          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === uploadedFile.id
                ? {
                    ...f,
                    status: "success",
                    progress: 100,
                    cloudinaryResult: result,
                    optimizedUrls,
                  }
                : f
            )
          );

          setUploadStats((prev) => ({
            ...prev,
            completed: prev.completed + 1,
          }));

          return {
            url: result.secure_url,
            publicId: result.public_id,
            optimizedUrls,
          };
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

          setUploadStats((prev) => ({ ...prev, failed: prev.failed + 1 }));
          return null;
        }
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(Boolean) as Array<{
        url: string;
        publicId: string;
        optimizedUrls: ReturnType<typeof getResponsiveImageUrls>;
      }>;

      if (successfulUploads.length > 0) {
        onFilesUploaded(successfulUploads);
      }

      setIsUploading(false);
    },
    [uploadedFiles, existingFiles, maxFiles, folder, tags, onFilesUploaded]
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
      const result = await uploadToCloudinary(file.file, {
        folder,
        tags,
        context: {
          alt: `Product image ${file.file.name}`,
          caption: `Uploaded ${new Date().toISOString()}`,
        },
        eager: [
          {
            width: 150,
            height: 150,
            crop: "thumb",
            quality: "auto",
            format: "webp",
          },
          {
            width: 400,
            height: 400,
            crop: "fill",
            quality: "auto",
            format: "webp",
          },
          {
            width: 800,
            height: 800,
            crop: "fill",
            quality: "auto",
            format: "webp",
          },
          {
            width: 1200,
            height: 1200,
            crop: "fill",
            quality: "auto",
            format: "webp",
          },
        ],
      });

      const optimizedUrls = getResponsiveImageUrls(result.public_id);

      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: "success",
                progress: 100,
                cloudinaryResult: result,
                optimizedUrls,
              }
            : f
        )
      );

      onFilesUploaded([
        {
          url: result.secure_url,
          publicId: result.public_id,
          optimizedUrls,
        },
      ]);
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
    <div className={`space-y-6 ${className}`}>
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
              <div className="relative">
                <Upload
                  className={`w-8 h-8 ${
                    isDragOver ? "text-luxury-600" : "text-gray-400"
                  }`}
                />
                <Cloud className="w-4 h-4 text-blue-500 absolute -top-1 -right-1" />
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center justify-center gap-2">
              {isDragOver ? "Drop files here" : "Upload to Cloudinary"}
              <Zap className="w-4 h-4 text-yellow-500" />
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your images here, or click to browse
              <br />
              <span className="text-sm text-blue-600">
                Automatic optimization & WebP conversion included
              </span>
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

      {/* Upload Progress Summary */}
      {isUploading && uploadStats.total > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-blue-900">
              Uploading to Cloudinary
            </h4>
            <div className="text-sm text-blue-700">
              {uploadStats.completed + uploadStats.failed}/{uploadStats.total}{" "}
              files processed
            </div>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  ((uploadStats.completed + uploadStats.failed) /
                    uploadStats.total) *
                  100
                }%`,
              }}
            />
          </div>
          {uploadStats.failed > 0 && (
            <p className="text-sm text-red-600 mt-2">
              {uploadStats.failed} files failed to upload
            </p>
          )}
        </div>
      )}

      {/* Upload Progress */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Upload Progress</h4>
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center space-x-4">
                {/* Preview */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={
                      file.optimizedUrls?.thumbnail ||
                      file.preview ||
                      "/placeholder.svg"
                    }
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
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <Cloud className="w-4 h-4" />
                        </div>
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
                    {file.cloudinaryResult && (
                      <span className="ml-2 text-blue-600">
                        • Optimized:{" "}
                        {(file.cloudinaryResult.bytes / 1024 / 1024).toFixed(2)}{" "}
                        MB
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {file.status === "uploading" && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}

                  {/* Success Message */}
                  {file.status === "success" && (
                    <div className="space-y-1">
                      <div className="text-sm text-green-600 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Uploaded & optimized successfully
                      </div>
                      {file.cloudinaryResult && (
                        <div className="text-xs text-gray-500">
                          Public ID: {file.cloudinaryResult.public_id}
                        </div>
                      )}
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

      {/* Cloudinary Features Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <Cloud className="w-5 h-5 text-blue-600 mr-2" />
          <h4 className="font-medium text-blue-900">
            Cloudinary Optimization Features
          </h4>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
          <div className="flex items-center">
            <Zap className="w-4 h-4 mr-2 text-yellow-500" />
            Automatic WebP conversion
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            Quality optimization
          </div>
          <div className="flex items-center">
            <ImageIcon className="w-4 h-4 mr-2 text-purple-500" />
            Multiple size variants
          </div>
          <div className="flex items-center">
            <Upload className="w-4 h-4 mr-2 text-blue-500" />
            CDN delivery
          </div>
        </div>
      </div>
    </div>
  );
}
