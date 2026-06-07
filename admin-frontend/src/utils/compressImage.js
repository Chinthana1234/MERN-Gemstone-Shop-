/**
 * Utility to compress and resize images client-side using the HTML5 Canvas API.
 * Reduces payload sizes and avoids server timeouts/size limits.
 * 
 * @param {File} file - The original File object from <input type="file">
 * @param {Object} options - Compression options
 * @param {number} options.maxSizeMB - Only compress if file size exceeds this threshold (default 1MB)
 * @param {number} options.maxWidth - Max width allowed for resizing (default 1920)
 * @param {number} options.maxHeight - Max height allowed for resizing (default 1920)
 * @param {number} options.quality - JPEG compression quality, between 0.0 and 1.0 (default 0.8)
 * @returns {Promise<File>} A promise that resolves with the compressed (or original) File object
 */
export const compressImage = (file, { maxSizeMB = 1, maxWidth = 1920, maxHeight = 1920, quality = 0.8 } = {}) => {
  return new Promise((resolve) => {
    // 1. Check if the file is an image
    if (!file.type.startsWith('image/')) {
      return resolve(file);
    }

    // 2. Only compress if the file exceeds the size threshold
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB <= maxSizeMB) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio while resizing
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              // Fallback to original file if blob conversion fails
              return resolve(file);
            }
            
            // Generate a compressed File object (converting to JPEG for best compression ratio)
            const newName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
            const compressedFile = new File([blob], newName, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            // If compressed file is somehow larger than original, return original
            if (compressedFile.size >= file.size) {
              return resolve(file);
            }

            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => {
        // Fallback to original file on load error
        resolve(file);
      };
    };
    reader.onerror = () => {
      // Fallback to original file on read error
      resolve(file);
    };
  });
};
