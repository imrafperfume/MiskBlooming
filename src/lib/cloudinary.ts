// Cloudinary configuration and utilities
export const CLOUDINARY_CONFIG = {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "",
}

// Validate Cloudinary configuration
export const validateCloudinaryConfig = (): { valid: boolean; errors: string[]; canUseMock: boolean } => {
    const errors: string[] = []

    if (!CLOUDINARY_CONFIG.cloudName) {
        errors.push("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not configured")
    }

    // Check if upload preset is configured and not a default/signed preset
    if (!CLOUDINARY_CONFIG.uploadPreset) {
        errors.push("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET is not configured")
    } else if (CLOUDINARY_CONFIG.uploadPreset === "ml_default") {
        errors.push("Using default upload preset 'ml_default' - please create a custom unsigned preset")
    } else if (["portfolio", "signed", "default"].includes(CLOUDINARY_CONFIG.uploadPreset)) {
        errors.push(
            `Upload preset '${CLOUDINARY_CONFIG.uploadPreset}' appears to be a signed preset - please create an unsigned preset`,
        )
    }

    return {
        valid: errors.length === 0,
        errors,
        canUseMock: true, // Always allow mock mode as fallback
    }
}

export interface CloudinaryUploadResult {
    public_id: string
    secure_url: string
    url: string
    width: number
    height: number
    format: string
    resource_type: string
    bytes: number
    version: number
    folder?: string
    eager?: Array<{
        secure_url: string
        url: string
        transformation: string
    }>
}

export interface CloudinaryError {
    message: string
    http_code: number
}

// Generate optimized image URL with transformations
export const getOptimizedImageUrl = (
    publicId: string,
    options: {
        width?: number
        height?: number
        quality?: "auto" | number
        format?: "auto" | "webp" | "jpg" | "png"
        crop?: "fill" | "fit" | "scale" | "crop" | "thumb"
        gravity?: "auto" | "face" | "center" | "north" | "south" | "east" | "west"
        blur?: number
        sharpen?: number
    } = {},
): string => {
    const { width, height, quality = "auto", format = "auto", crop = "fill", gravity = "auto", blur, sharpen } = options

    if (!CLOUDINARY_CONFIG.cloudName || !publicId) {
        return "/placeholder.svg?height=400&width=400"
    }

    const transformations: string[] = []

    // Add quality
    transformations.push(`q_${quality}`)

    // Add format
    transformations.push(`f_${format}`)

    // Add dimensions and crop
    if (width || height) {
        let sizeTransform = ""
        if (width) sizeTransform += `w_${width}`
        if (height) sizeTransform += `,h_${height}`
        if (crop) sizeTransform += `,c_${crop}`
        if (gravity && crop !== "scale") sizeTransform += `,g_${gravity}`
        transformations.push(sizeTransform)
    }

    // Add effects
    if (blur) transformations.push(`e_blur:${blur}`)
    if (sharpen) transformations.push(`e_sharpen:${sharpen}`)

    const transformString = transformations.join(",")
    return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transformString}/${publicId}`
}

// Generate responsive image URLs for different screen sizes
export const getResponsiveImageUrls = (publicId: string) => {
    if (!publicId) {
        return {
            thumbnail: "/placeholder.svg?height=150&width=150",
            small: "/placeholder.svg?height=400&width=400",
            medium: "/placeholder.svg?height=800&width=800",
            large: "/placeholder.svg?height=1200&width=1200",
            original: "/placeholder.svg?height=1200&width=1200",
        }
    }

    return {
        thumbnail: getOptimizedImageUrl(publicId, { width: 150, height: 150, crop: "thumb" }),
        small: getOptimizedImageUrl(publicId, { width: 400, height: 400 }),
        medium: getOptimizedImageUrl(publicId, { width: 800, height: 800 }),
        large: getOptimizedImageUrl(publicId, { width: 1200, height: 1200 }),
        original: getOptimizedImageUrl(publicId, { quality: "auto", format: "auto" }),
    }
}

// Test Cloudinary configuration by making a simple request
export const testCloudinaryConfig = async (): Promise<{ success: boolean; error?: string; details?: any }> => {
    if (!CLOUDINARY_CONFIG.cloudName) {
        return { success: false, error: "Cloud name not configured" }
    }

    if (!CLOUDINARY_CONFIG.uploadPreset) {
        return { success: false, error: "Upload preset not configured" }
    }

    try {
        // Create a minimal test file (1x1 pixel transparent PNG)
        const testImageData =
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="

        const formData = new FormData()

        // Convert data URL to blob
        const response = await fetch(testImageData)
        const blob = await response.blob()

        formData.append("file", blob, "test.png")
        formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset)
        formData.append("folder", "test")
        formData.append("public_id", `config_test_${Date.now()}`)

        const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`

        console.log("Testing Cloudinary configuration:", {
            cloudName: CLOUDINARY_CONFIG.cloudName,
            uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
            uploadUrl,
        })

        const uploadResponse = await fetch(uploadUrl, {
            method: "POST",
            body: formData,
        })

        const responseText = await uploadResponse.text()

        if (!uploadResponse.ok) {
            let errorData: any = {}
            try {
                errorData = JSON.parse(responseText)
            } catch (e) {
                // Response is not JSON
            }

            console.error("Configuration test failed:", {
                status: uploadResponse.status,
                statusText: uploadResponse.statusText,
                response: responseText,
                errorData,
            })

            let errorMessage = errorData.error?.message || `HTTP ${uploadResponse.status}: ${uploadResponse.statusText}`

            // Provide specific guidance based on the error
            if (errorMessage.includes("Invalid upload preset")) {
                errorMessage = `Upload preset "${CLOUDINARY_CONFIG.uploadPreset}" does not exist. Please create it in your Cloudinary dashboard.`
            } else if (errorMessage.includes("Upload preset must be whitelisted") || errorMessage.includes("signed")) {
                errorMessage = `Upload preset "${CLOUDINARY_CONFIG.uploadPreset}" requires signed uploads. Please create an unsigned upload preset.`
            } else if (errorMessage.includes("API key")) {
                errorMessage = `Upload preset "${CLOUDINARY_CONFIG.uploadPreset}" requires an API key for signed uploads. Please create an unsigned upload preset instead.`
            }

            return {
                success: false,
                error: errorMessage,
                details: {
                    status: uploadResponse.status,
                    preset: CLOUDINARY_CONFIG.uploadPreset,
                    cloudName: CLOUDINARY_CONFIG.cloudName,
                    errorData,
                },
            }
        }

        const result = JSON.parse(responseText)
        console.log("Configuration test successful:", result.public_id)

        return {
            success: true,
            details: {
                publicId: result.public_id,
                url: result.secure_url,
                preset: CLOUDINARY_CONFIG.uploadPreset,
            },
        }
    } catch (error) {
        console.error("Configuration test error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error during configuration test",
        }
    }
}

// Upload image to Cloudinary using unsigned upload
export const uploadToCloudinary = async (
    file: File,
    options: {
        folder?: string
        publicId?: string
        tags?: string[]
        context?: Record<string, string>
        eager?: Array<{
            width?: number
            height?: number
            crop?: string
            quality?: string | number
            format?: string
        }>
    } = {},
): Promise<CloudinaryUploadResult> => {
    // Validate configuration first
    const configValidation = validateCloudinaryConfig()
    if (!configValidation.valid) {
        throw new Error(`Cloudinary configuration error: ${configValidation.errors.join(", ")}`)
    }

    const { folder = "misk-blooming/products", publicId, tags = [], context = {}, eager = [] } = options

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset)

    // Add optional parameters (only if supported by the upload preset)
    if (folder) formData.append("folder", folder)
    if (publicId) formData.append("public_id", publicId)
    if (tags.length > 0) formData.append("tags", tags.join(","))

    // Add context metadata
    if (Object.keys(context).length > 0) {
        const contextString = Object.entries(context)
            .map(([key, value]) => `${key}=${value}`)
            .join("|")
        formData.append("context", contextString)
    }

    // Add eager transformations for immediate optimization
    if (eager.length > 0) {
        const eagerString = eager
            .map((transform) => {
                const parts: string[] = []
                if (transform.width) parts.push(`w_${transform.width}`)
                if (transform.height) parts.push(`h_${transform.height}`)
                if (transform.crop) parts.push(`c_${transform.crop}`)
                if (transform.quality) parts.push(`q_${transform.quality}`)
                if (transform.format) parts.push(`f_${transform.format}`)
                return parts.join(",")
            })
            .join("|")
        formData.append("eager", eagerString)
    }

    try {
        const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`

        console.log("Uploading to Cloudinary (unsigned):", {
            url: uploadUrl,
            cloudName: CLOUDINARY_CONFIG.cloudName,
            uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
            folder,
            fileSize: file.size,
            fileType: file.type,
        })

        const response = await fetch(uploadUrl, {
            method: "POST",
            body: formData,
        })

        const responseText = await response.text()

        console.log("Cloudinary response:", {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
        })

        if (!response.ok) {
            let errorMessage = `Upload failed with status ${response.status}`

            try {
                const errorData = JSON.parse(responseText)
                console.error("Cloudinary error details:", errorData)

                errorMessage = errorData.error?.message || errorMessage

                // Handle specific error cases with helpful messages
                if (errorData.error?.message?.includes("Invalid upload preset")) {
                    errorMessage = `Invalid upload preset "${CLOUDINARY_CONFIG.uploadPreset}". Please create an unsigned upload preset in your Cloudinary dashboard.`
                } else if (
                    errorData.error?.message?.includes("Upload preset must be whitelisted") ||
                    errorData.error?.message?.includes("signed")
                ) {
                    errorMessage = `Upload preset "${CLOUDINARY_CONFIG.uploadPreset}" is configured for signed uploads. You need to create an unsigned upload preset for client-side uploads.`
                } else if (errorData.error?.message?.includes("Cloud name")) {
                    errorMessage = `Invalid cloud name "${CLOUDINARY_CONFIG.cloudName}". Please check your NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME environment variable.`
                } else if (errorData.error?.message?.includes("API key")) {
                    errorMessage = `API key error. Your upload preset "${CLOUDINARY_CONFIG.uploadPreset}" requires signed uploads. Please create an unsigned upload preset.`
                } else if (errorData.error?.message?.includes("folder")) {
                    errorMessage = `Folder "${folder}" is not allowed by your upload preset. Please configure allowed folders in your Cloudinary dashboard or remove the folder parameter.`
                }
            } catch (parseError) {
                console.error("Failed to parse error response:", parseError)
                errorMessage = `Upload failed: ${responseText.substring(0, 200)}`
            }

            throw new Error(errorMessage)
        }

        const result: CloudinaryUploadResult = JSON.parse(responseText)
        console.log("Upload successful:", {
            publicId: result.public_id,
            secureUrl: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
        })

        return result
    } catch (error) {
        console.error("Cloudinary upload error:", error)

        if (error instanceof Error) {
            throw error
        } else {
            throw new Error("Unknown upload error occurred")
        }
    }
}

// Mock upload function for development/testing
export const mockUploadToCloudinary = async (
    file: File,
    options: {
        folder?: string
        publicId?: string
        tags?: string[]
        context?: Record<string, string>
    } = {},
): Promise<CloudinaryUploadResult> => {
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Generate mock result
    const mockPublicId = `${options.folder || "test"}/${options.publicId || `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`}`
    const mockUrl = URL.createObjectURL(file)

    const mockResult: CloudinaryUploadResult = {
        public_id: mockPublicId,
        secure_url: mockUrl,
        url: mockUrl,
        width: 800,
        height: 600,
        format: file.type.split("/")[1] || "jpg",
        resource_type: "image",
        bytes: file.size,
        version: Date.now(),
        folder: options.folder,
        eager: [
            {
                secure_url: mockUrl,
                url: mockUrl,
                transformation: "w_150,h_150,c_thumb,q_auto,f_webp",
            },
            {
                secure_url: mockUrl,
                url: mockUrl,
                transformation: "w_400,h_400,c_fill,q_auto,f_webp",
            },
            {
                secure_url: mockUrl,
                url: mockUrl,
                transformation: "w_800,h_800,c_fill,q_auto,f_webp",
            },
            {
                secure_url: mockUrl,
                url: mockUrl,
                transformation: "w_1200,h_1200,c_fill,q_auto,f_webp",
            },
        ],
    }

    return mockResult
}

// Delete image from Cloudinary (requires API key and secret - server-side only)
export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
    console.warn("Delete operation requires server-side implementation for security")
    return false
}

// Validate image file
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]

    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: `File type ${file.type} is not supported. Please use JPG, PNG, WebP, or GIF.`,
        }
    }

    if (file.size > maxSize) {
        return {
            valid: false,
            error: `File size must be less than ${maxSize / 1024 / 1024}MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
        }
    }

    return { valid: true }
}

// Check if Cloudinary is properly configured
export const isCloudinaryConfigured = (): boolean => {
    return validateCloudinaryConfig().valid
}

// Get configuration status for debugging
export const getConfigurationStatus = () => {
    const validation = validateCloudinaryConfig()

    return {
        cloudName: !!CLOUDINARY_CONFIG.cloudName,
        uploadPreset: !!CLOUDINARY_CONFIG.uploadPreset,
        apiKey: !!CLOUDINARY_CONFIG.apiKey,
        apiSecret: !!CLOUDINARY_CONFIG.apiSecret,
        isConfigured: validation.valid,
        canUseMock: validation.canUseMock,
        errors: validation.errors,
        configValues: {
            cloudName: CLOUDINARY_CONFIG.cloudName || "Not set",
            uploadPreset: CLOUDINARY_CONFIG.uploadPreset || "Not set",
            hasApiKey: !!CLOUDINARY_CONFIG.apiKey,
            hasApiSecret: !!CLOUDINARY_CONFIG.apiSecret,
        },
    }
}

// Create a default upload preset configuration guide
export const getUploadPresetGuide = () => {
    return {
        steps: [
            "Go to your Cloudinary Dashboard (https://cloudinary.com/console)",
            "Navigate to Settings → Upload",
            "Scroll down to 'Upload presets'",
            "Click 'Add upload preset'",
            "Set 'Signing Mode' to 'Unsigned'",
            "Set 'Upload preset name' (e.g., 'misk_blooming_unsigned')",
            "Configure allowed formats: jpg, png, webp, gif",
            "Set max file size: 10MB",
            "Enable 'Use filename or externally defined Public ID'",
            "In 'Folder' section, allow 'misk-blooming' folder",
            "Save the preset",
            "Update your environment variable with the new preset name",
        ],
        currentIssue:
            CLOUDINARY_CONFIG.uploadPreset === "portfolio"
                ? `Your current preset "${CLOUDINARY_CONFIG.uploadPreset}" is configured for signed uploads, but you need an unsigned preset for client-side uploads.`
                : `You need to create an unsigned upload preset for client-side uploads.`,
        exampleEnvVars: {
            NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: CLOUDINARY_CONFIG.cloudName || "your-cloud-name",
            NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: "misk_blooming_unsigned", // Replace the current "portfolio" preset
        },
        troubleshooting: [
            "Make sure 'Signing Mode' is set to 'Unsigned' (not 'Server-side upload')",
            "Verify that the preset name matches exactly in your environment variable",
            "Check that allowed file formats include jpg, png, webp, gif",
            "Ensure max file size is set appropriately (10MB recommended)",
            "Test the preset using the 'Test Configuration' button",
        ],
    }
}
