// Cloudinary configuration and utilities
export const CLOUDINARY_CONFIG = {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo",
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default",
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
    return {
        thumbnail: getOptimizedImageUrl(publicId, { width: 150, height: 150, crop: "thumb" }),
        small: getOptimizedImageUrl(publicId, { width: 400, height: 400 }),
        medium: getOptimizedImageUrl(publicId, { width: 800, height: 800 }),
        large: getOptimizedImageUrl(publicId, { width: 1200, height: 1200 }),
        original: getOptimizedImageUrl(publicId, { quality: "auto", format: "auto" }),
    }
}

// Upload image to Cloudinary
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
    const { folder = "misk-blooming/products", publicId, tags = [], context = {}, eager = [] } = options

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset)
    formData.append("cloud_name", CLOUDINARY_CONFIG.cloudName)

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
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`, {
            method: "POST",
            body: formData,
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error?.message || "Upload failed")
        }

        const result: CloudinaryUploadResult = await response.json()
        return result
    } catch (error) {
        console.error("Cloudinary upload error:", error)
        throw error
    }
}

// Delete image from Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000)
        const signature = await generateSignature(publicId, timestamp)

        const formData = new FormData()
        formData.append("public_id", publicId)
        formData.append("signature", signature)
        formData.append("api_key", CLOUDINARY_CONFIG.apiKey)
        formData.append("timestamp", timestamp.toString())

        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/destroy`, {
            method: "POST",
            body: formData,
        })

        const result = await response.json()
        return result.result === "ok"
    } catch (error) {
        console.error("Cloudinary delete error:", error)
        return false
    }
}

// Generate signature for authenticated requests (this would typically be done on the server)
const generateSignature = async (publicId: string, timestamp: number): Promise<string> => {
    // In a real application, this should be done on the server side
    // For demo purposes, we'll use a simple hash
    const crypto = await import("crypto")
    const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`
    return crypto.createHash("sha1").update(stringToSign).digest("hex")
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
