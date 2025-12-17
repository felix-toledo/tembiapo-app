/**
 * Compresses an image file using the HTML Canvas API.
 * @param file The original file to compress.
 * @param quality The quality of the output image (0 to 1). Default is 0.7.
 * @param maxWidth The maximum width of the output image. Default is 1024px.
 * @returns A Promise that resolves to the compressed File.
 */
export async function compressImage(
  file: File,
  quality: number = 0.7,
  maxWidth: number = 1024
): Promise<File> {
  return new Promise((resolve, reject) => {
    // If it's not an image, return original
    if (!file.type.match(/image.*/)) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        // Create canvas
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Draw image properly
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Image compression failed"));
              return;
            }

            // Create new file from blob
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg", // Force JPEG for better compression
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = (error) => reject(error);
    };

    reader.onerror = (error) => reject(error);
  });
}
