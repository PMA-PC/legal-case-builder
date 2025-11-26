import { EvidenceItem } from "../types";

/**
 * Reads a File object and converts its content to a Base64 string,
 * along with returning its MIME type.
 * @param file The File object to process.
 * @returns A Promise resolving to an object containing base64Data and mimeType.
 * @throws Error if FileReader fails.
 */
export function fileToBase64(file: File): Promise<{ base64Data: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        // Convert ArrayBuffer to binary string, then to Base64
        const uint8Array = new Uint8Array(arrayBuffer);
        let binaryString = '';
        for (let i = 0; i < uint8Array.length; i++) {
          binaryString += String.fromCharCode(uint8Array[i]);
        }
        const base64String = btoa(binaryString);
        const mimeType = file.type || 'application/octet-stream'; // Default if browser doesn't provide
        console.log(`[File Processing] Successfully converted file '${file.name}' to base64. MimeType: '${mimeType}'. Base64 (truncated): ${base64String.substring(0, 50)}...`);
        resolve({ base64Data: base64String, mimeType });
      } catch (conversionError) {
        console.error(`[File Processing ERROR] Failed to convert file '${file.name}' to base64:`, conversionError);
        reject(new Error(`Failed to convert file to base64: ${file.name}`));
      }
    };

    reader.onerror = (e) => {
      console.error(`[File Processing ERROR] FileReader error for file '${file.name}':`, reader.error);
      reject(new Error(`Failed to read file: ${file.name}, error: ${reader.error?.message}`));
    };

    reader.readAsArrayBuffer(file);
  });
}

// Helper function to infer EvidenceItem type from MIME type
export const inferEvidenceTypeFromMime = (mimeType: string): EvidenceItem['type'] => {
  if (mimeType.startsWith('image/')) {
    return 'image';
  }
  if (mimeType.includes('pdf') || mimeType.includes('wordprocessingml') || mimeType.includes('text/plain')) {
    return 'document';
  }
  if (mimeType.includes('spreadsheet') || mimeType.includes('csv')) {
    return 'spreadsheet';
  }
  if (mimeType.includes('presentation')) {
    return 'presentation';
  }
  if (mimeType.includes('audio')) {
    return 'audio';
  }
  if (mimeType.includes('video')) {
    return 'video';
  }
  // Default to 'other' if not explicitly handled
  return 'other';
};
