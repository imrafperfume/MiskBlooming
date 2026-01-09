"use client";

import type React from "react";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Upload,
  X,
  ImageIcon,
  AlertCircle,
  CheckCircle,
  Loader2,
  Cloud,
  Zap,
  Settings,
  Info,
  ExternalLink,
  TestTube,
  Copy,
  AlertTriangle,
} from "lucide-react";
import { Button } from "./button";
import {
  uploadToCloudinary,
  mockUploadToCloudinary,
  validateImageFile,
  getResponsiveImageUrls,
  getConfigurationStatus,
  testCloudinaryConfig,
  getUploadPresetGuide,
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
  enableMockMode?: boolean;
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
  enableMockMode = false,
}: CloudinaryFileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStats, setUploadStats] = useState({
    total: 0,
    completed: 0,
    failed: 0,
  });
  const [configStatus, setConfigStatus] = useState<ReturnType<
    typeof getConfigurationStatus
  > | null>(null);
  const [useMockMode, setUseMockMode] = useState(enableMockMode);
  const [showConfigDetails, setShowConfigDetails] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [isTestingConfig, setIsTestingConfig] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    error?: string;
    details?: any;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check configuration on mount
  useEffect(() => {
    const status = getConfigurationStatus();
    setConfigStatus(status);

    // Auto-enable mock mode if Cloudinary is not configured
    if (!status.isConfigured && !enableMockMode) {
      setUseMockMode(true);
      console.warn("Cloudinary not configured, using mock mode");
    }
  }, [enableMockMode]);

  const handleTestConfiguration = async () => {
    setIsTestingConfig(true);
    setTestResult(null);

    try {
      const result = await testCloudinaryConfig();
      setTestResult(result);

      if (result.success) {
        // If test is successful, we can safely disable mock mode
        setUseMockMode(false);
      }
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : "Test failed",
      });
    } finally {
      setIsTestingConfig(false);
    }
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

      // Upload files to Cloudinary or use mock mode
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

          let result: CloudinaryUploadResult;

          if (useMockMode) {
            // Use mock upload for development/testing
            result = await mockUploadToCloudinary(uploadedFile.file, {
              folder,
              tags,
              context: {
                alt: `Product image ${uploadedFile.file.name}`,
                caption: `Uploaded ${new Date().toISOString()}`,
              },
            });
          } else {
            // Upload to Cloudinary with optimizations
            result = await uploadToCloudinary(uploadedFile.file, {
              folder,
              tags,
              context: {
                alt: `Product image ${uploadedFile.file.name}`,
                caption: `Uploaded ${new Date().toISOString()}`,
              },
              // eager: [
              //   {
              //     width: 150,
              //     height: 150,
              //     crop: "thumb",
              //     quality: "auto",
              //     format: "webp",
              //   },
              //   {
              //     width: 400,
              //     height: 400,
              //     crop: "fill",
              //     quality: "auto",
              //     format: "webp",
              //   },
              //   {
              //     width: 800,
              //     height: 800,
              //     crop: "fill",
              //     quality: "auto",
              //     format: "webp",
              //   },
              //   {
              //     width: 1200,
              //     height: 1200,
              //     crop: "fill",
              //     quality: "auto",
              //     format: "webp",
              //   },
              // ],
            });
          }

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
          const errorMessage =
            error instanceof Error ? error.message : "Upload failed";

          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === uploadedFile.id
                ? {
                    ...f,
                    status: "error",
                    error: errorMessage,
                  }
                : f
            )
          );

          setUploadStats((prev) => ({ ...prev, failed: prev.failed + 1 }));
          console.error("Upload error:", error);
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
    [
      uploadedFiles,
      existingFiles,
      maxFiles,
      folder,
      tags,
      onFilesUploaded,
      useMockMode,
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
      let result: CloudinaryUploadResult;

      if (useMockMode) {
        result = await mockUploadToCloudinary(file.file, {
          folder,
          tags,
          context: {
            alt: `Product image ${file.file.name}`,
            caption: `Uploaded ${new Date().toISOString()}`,
          },
        });
      } else {
        result = await uploadToCloudinary(file.file, {
          folder,
          tags,
          context: {
            alt: `Product image ${file.file.name}`,
            caption: `Uploaded ${new Date().toISOString()}`,
          },
          // eager: [
          //   {
          //     width: 150,
          //     height: 150,
          //     crop: "thumb",
          //     quality: "auto",
          //     format: "webp",
          //   },
          //   {
          //     width: 400,
          //     height: 400,
          //     crop: "fill",
          //     quality: "auto",
          //     format: "webp",
          //   },
          //   {
          //     width: 800,
          //     height: 800,
          //     crop: "fill",
          //     quality: "auto",
          //     format: "webp",
          //   },
          //   {
          //     width: 1200,
          //     height: 1200,
          //     crop: "fill",
          //     quality: "auto",
          //     format: "webp",
          //   },
          // ],
        });
      }

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
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: "error",
                error: errorMessage,
              }
            : f
        )
      );
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const setupGuide = getUploadPresetGuide();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Configuration Status */}
      {configStatus && !configStatus.isConfigured && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-red-800">
                Upload Preset Configuration Issue
              </h4>
              <div className="text-sm text-red-700 mt-1">
                <p className="font-medium">{setupGuide.currentIssue}</p>
                <div className="mt-2">
                  <p>Issues found:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    {configStatus.errors.map((error: any, index: any) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
                <p className="mt-2">
                  {useMockMode
                    ? "Currently using mock mode for development."
                    : "Upload functionality is disabled."}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {!useMockMode && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setUseMockMode(true)}
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Enable Mock Mode
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSetupGuide(!showSetupGuide)}
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  {showSetupGuide ? "Hide" : "Show"} Setup Guide
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConfigDetails(!showConfigDetails)}
                >
                  <Settings className="w-4 h-4 mr-1" />
                  {showConfigDetails ? "Hide" : "Show"} Config Details
                </Button>
                {configStatus.cloudName && configStatus.uploadPreset && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleTestConfiguration}
                    disabled={isTestingConfig}
                  >
                    {isTestingConfig ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <TestTube className="w-4 h-4 mr-1" />
                    )}
                    Test Configuration
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Setup Guide */}
          {showSetupGuide && (
            <div className="mt-4 p-4 bg-red-100 rounded border">
              <h5 className="font-medium text-red-800 mb-3">
                Fix Upload Preset Configuration:
              </h5>
              <div className="text-sm text-red-700 space-y-2">
                <div className="bg-red-200 p-3 rounded mb-3">
                  <p className="font-medium">⚠️ Current Issue:</p>
                  <p>
                    Your upload preset "{configStatus.configValues.uploadPreset}
                    " is configured for signed uploads, but client-side uploads
                    require an unsigned preset.
                  </p>
                </div>

                <p className="font-medium">Steps to fix:</p>
                {setupGuide.steps.map((step: any, index: any) => (
                  <div key={index} className="flex items-start">
                    <span className="text-red-600 mr-2 font-medium">
                      {index + 1}.
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <h6 className="font-medium text-red-800 mb-2">
                  Update Environment Variable:
                </h6>
                <div className="space-y-2">
                  {Object.entries(setupGuide.exampleEnvVars).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between bg-red-200 p-2 rounded"
                      >
                        <code className="text-sm">
                          {key}={value}
                        </code>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(`${key}=${value}`)}
                          className="p-1"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h6 className="font-medium text-red-800 mb-2">
                  Troubleshooting Checklist:
                </h6>
                <div className="space-y-1">
                  {setupGuide.troubleshooting.map((tip: any, index: number) => (
                    <div key={index} className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      <span className="text-sm">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Configuration Details */}
          {showConfigDetails && configStatus && (
            <div className="mt-4 p-3 bg-red-100 rounded border">
              <h5 className="font-medium text-red-800 mb-2">
                Current Configuration:
              </h5>
              <div className="text-sm text-red-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Cloud Name:</span>
                  <code className="bg-red-200 px-2 py-1 rounded">
                    {configStatus.configValues.cloudName}
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span>Upload Preset:</span>
                  <code className="bg-red-200 px-2 py-1 rounded font-bold">
                    {configStatus.configValues.uploadPreset}
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span>API Key:</span>
                  <span>
                    {configStatus.configValues.hasApiKey
                      ? "✓ Set"
                      : "✗ Not set (optional)"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>API Secret:</span>
                  <span>
                    {configStatus.configValues.hasApiSecret
                      ? "✓ Set"
                      : "✗ Not set (for server ops)"}
                  </span>
                </div>
              </div>
              <div className="mt-2 p-2 bg-red-200 rounded">
                <p className="text-xs text-red-800">
                  <strong>Problem:</strong> The preset "
                  {configStatus.configValues.uploadPreset}" requires signed
                  uploads (server-side), but you're trying to upload from the
                  client-side which requires an unsigned preset.
                </p>
              </div>
            </div>
          )}

          {/* Test Result */}
          {testResult && (
            <div
              className={`mt-4 p-3 rounded border ${
                testResult.success
                  ? "bg-green-100 border-green-200"
                  : "bg-red-100 border-red-200"
              }`}
            >
              <div className="flex items-center">
                {testResult.success ? (
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                )}
                <span
                  className={`text-sm font-medium ${
                    testResult.success ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {testResult.success
                    ? "Configuration test successful!"
                    : "Configuration test failed"}
                </span>
              </div>
              {testResult.error && (
                <div className="text-sm text-red-700 mt-1">
                  <strong>Error:</strong> {testResult.error}
                </div>
              )}
              {testResult.success && (
                <div className="text-sm text-green-700 mt-1">
                  Your Cloudinary configuration is working correctly. You can
                  now disable mock mode.
                </div>
              )}
              {testResult.details && !testResult.success && (
                <div className="text-xs text-red-600 mt-2 bg-red-200 p-2 rounded">
                  <strong>Debug Info:</strong>
                  <br />
                  Preset: {testResult.details.preset}
                  <br />
                  Cloud: {testResult.details.cloudName}
                  <br />
                  Status: {testResult.details.status}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mode Indicator */}
      {useMockMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center">
            <Info className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm text-blue-800">
              Running in mock mode - uploads will be simulated for development
            </span>
            {configStatus?.isConfigured && testResult?.success && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setUseMockMode(false)}
                className="ml-auto"
              >
                Use Real Cloudinary
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${
            isDragOver
              ? "border-luxury-400 bg-foregroundscale-105"
              : "border-border  hover:border-gray-400"
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
              isDragOver ? "bg-luxury-100" : "bg-background "
            }`}
          >
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            ) : (
              <div className="relative">
                <Upload
                  className={`w-8 h-8 ${
                    isDragOver ? "text-primary " : "text-gray-400"
                  }`}
                />
                {useMockMode ? (
                  <Settings className="w-4 h-4 text-orange-500 absolute -top-1 -right-1" />
                ) : (
                  <Cloud className="w-4 h-4 text-blue-500 absolute -top-1 -right-1" />
                )}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center justify-center gap-2">
              {isDragOver
                ? "Drop files here"
                : useMockMode
                ? "Upload (Mock Mode)"
                : "Upload to Cloudinary"}
              {!useMockMode && <Zap className="w-4 h-4 text-yellow-500" />}
            </h3>
            <p className="text-foreground  mb-4">
              Drag and drop your images here, or click to browse
              <br />
              {useMockMode ? (
                <span className="text-sm text-orange-600">
                  Mock mode - simulated uploads for development
                </span>
              ) : (
                <span className="text-sm text-blue-600">
                  Automatic optimization & WebP conversion included
                </span>
              )}
            </p>
            <div className="text-sm text-foreground space-y-1">
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
          <div className="absolute inset-0 bg-foreground 0 bg-opacity-10 rounded-xl flex items-center justify-center">
            <div className="text-primary font-semibold text-lg">
              Drop files to upload
            </div>
          </div>
        )}
      </div>

      {/* Upload Progress Summary */}
      {isUploading && uploadStats.total > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-blue-900 flex items-center">
              {useMockMode ? "Simulating Upload" : "Uploading to Cloudinary"}
              {useMockMode ? (
                <Settings className="w-4 h-4 ml-2 text-orange-500" />
              ) : (
                <Cloud className="w-4 h-4 ml-2 text-blue-500" />
              )}
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
              className="bg-background border border-border  rounded-lg p-4"
            >
              <div className="flex items-center space-x-4">
                {/* Preview */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-background  flex-shrink-0">
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
                          {useMockMode ? (
                            <Settings className="w-4 h-4" />
                          ) : (
                            <Cloud className="w-4 h-4" />
                          )}
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

                  <div className="text-xs text-foreground mb-2">
                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                    {file.cloudinaryResult && (
                      <span className="ml-2 text-blue-600">
                        • {useMockMode ? "Mock" : "Optimized"}:{" "}
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
                        {useMockMode
                          ? "Mock upload completed"
                          : "Uploaded & optimized successfully"}
                      </div>
                      {file.cloudinaryResult && (
                        <div className="text-xs text-foreground ">
                          {useMockMode ? "Mock ID" : "Public ID"}:{" "}
                          {file.cloudinaryResult.public_id}
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

      {/* Features Info */}
      {/* <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          {useMockMode ? (
            <Settings className="w-5 h-5 text-orange-600 mr-2" />
          ) : (
            <Cloud className="w-5 h-5 text-blue-600 mr-2" />
          )}
          <h4 className="font-medium text-blue-900">
            {useMockMode
              ? "Mock Mode Features"
              : "Cloudinary Optimization Features"}
          </h4>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
          <div className="flex items-center">
            <Zap className="w-4 h-4 mr-2 text-yellow-500" />
            {useMockMode
              ? "Simulated WebP conversion"
              : "Automatic WebP conversion"}
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            {useMockMode ? "Mock quality optimization" : "Quality optimization"}
          </div>
          <div className="flex items-center">
            <ImageIcon className="w-4 h-4 mr-2 text-purple-500" />
            {useMockMode ? "Simulated size variants" : "Multiple size variants"}
          </div>
          <div className="flex items-center">
            <Upload className="w-4 h-4 mr-2 text-blue-500" />
            {useMockMode ? "Local preview" : "CDN delivery"}
          </div>
        </div>
      </div> */}
    </div>
  );
}
