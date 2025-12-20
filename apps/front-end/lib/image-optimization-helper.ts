import imageCompression from "browser-image-compression";

/**
 * Configuration for image compression
 */
const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.8, // Max file size: 800KB
  maxWidthOrHeight: 1920, // Max dimension: 1920px
  useWebWorker: true,
  fileType: "image/jpeg" as const,
  initialQuality: 0.85, // 85% quality
};

/**
 * Minimum file size to trigger compression (500KB)
 * Files smaller than this will not be compressed
 */
const MIN_SIZE_TO_COMPRESS = 500 * 1024; // 500KB in bytes

/**
 * Checks if a file is an image based on MIME type
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

/**
 * Compresses an image file if it exceeds the minimum size threshold
 * @param file - The image file to compress
 * @returns The compressed file or the original if compression is not needed
 */
export async function compressImage(file: File): Promise<File> {
  // Only compress if it's an image and larger than threshold
  if (!isImageFile(file) || file.size < MIN_SIZE_TO_COMPRESS) {
    return file;
  }

  try {
    console.log(
      `🖼️ Compressing image: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`
    );

    const compressedFile = await imageCompression(file, COMPRESSION_OPTIONS);

    console.log(
      `✅ Compressed to: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`
    );

    return compressedFile;
  } catch (error) {
    console.error("❌ Error compressing image:", error);
    // Return original file if compression fails
    return file;
  }
}

/**
 * Optimizes all image fields in a Request by compressing them
 * This acts as a "middleware" for routes that handle image uploads
 *
 * @param request - The incoming Request object
 * @returns A new Request with optimized images, or the original request if no optimization needed
 */
export async function optimizeRequestImages(
  request: Request
): Promise<Request> {
  const contentType = request.headers.get("content-type");

  // Only process multipart/form-data requests
  if (!contentType?.includes("multipart/form-data")) {
    return request;
  }

  try {
    // Extract FormData from request
    const formData = await request.formData();

    // Check if there are any image files
    let hasImages = false;
    for (const [, value] of formData.entries()) {
      if (value instanceof File && isImageFile(value)) {
        hasImages = true;
        break;
      }
    }

    // If no images, return original request
    if (!hasImages) {
      return request;
    }

    // Create new FormData with compressed images
    const optimizedFormData = new FormData();

    for (const [key, value] of formData.entries()) {
      if (value instanceof File && isImageFile(value)) {
        // Compress the image
        const compressedFile = await compressImage(value);
        optimizedFormData.append(key, compressedFile, value.name);
      } else {
        // Keep non-image values as-is
        optimizedFormData.append(key, value);
      }
    }

    // Create new Request with optimized FormData
    // Note: We cannot set Content-Type header manually as it needs the boundary
    // The browser will set it automatically when we pass FormData as body
    const headers = new Headers();
    for (const [key, value] of request.headers.entries()) {
      // Skip Content-Type as it will be auto-generated with correct boundary
      if (key.toLowerCase() !== "content-type") {
        headers.set(key, value);
      }
    }

    return new Request(request.url, {
      method: request.method,
      headers: headers,
      body: optimizedFormData,
    });
  } catch (error) {
    console.error("❌ Error optimizing request images:", error);
    // Return original request if optimization fails
    return request;
  }
}
