// TRACEWISE AI - Cryptographic Web Crypto Helper
// Generates authentic SHA-256 and SHA-512 hashes in the browser

export const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.pdf', '.txt', '.csv', '.json'];
export const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'application/pdf',
  'text/plain',
  'text/csv',
  'application/json'
];

export const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB
export const MAX_PREVIEW_TEXT_BYTES = 64 * 1024; // 64 KB for localStorage preview storage

/**
 * Calculates authentic SHA-256 hash using native Web Crypto API
 * @param {ArrayBuffer} arrayBuffer
 * @returns {Promise<string>} 64-character lowercase hexadecimal hash
 */
export async function computeSHA256(arrayBuffer) {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error('Web Crypto API is not supported in this browser environment.');
  }
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Calculates authentic SHA-512 hash using native Web Crypto API
 * @param {ArrayBuffer} arrayBuffer
 * @returns {Promise<string>} 128-character lowercase hexadecimal hash
 */
export async function computeSHA512(arrayBuffer) {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error('Web Crypto API is not supported in this browser environment.');
  }
  const hashBuffer = await window.crypto.subtle.digest('SHA-512', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Formats byte count to human-readable string (KB, MB, GB)
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Validates file extension and MIME type
 */
export function validateEvidenceFile(file) {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  // Size validation
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size (${formatFileSize(file.size)}) exceeds maximum limit of 15 MB for demo browser processing.`
    };
  }

  // Extension validation
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  const hasValidExt = ALLOWED_EXTENSIONS.includes(ext);
  const hasValidMime =
    ALLOWED_MIME_TYPES.includes(file.type) ||
    file.type === '' ||
    file.name.endsWith('.csv') ||
    file.name.endsWith('.json');

  if (!hasValidExt && !hasValidMime) {
    return {
      valid: false,
      error: `Unsupported file format "${ext}". Supported formats: PNG, JPG, PDF, TXT, CSV, JSON.`
    };
  }

  return { valid: true };
}

/**
 * Categorizes file type into human-friendly label
 */
export function getFriendlyFileType(file) {
  const ext = (file.name || '').split('.').pop().toLowerCase();
  switch (ext) {
    case 'png':
      return 'PNG Image';
    case 'jpg':
    case 'jpeg':
      return 'JPEG Photo Forensics';
    case 'pdf':
      return 'Adobe Acrobat PDF Document';
    case 'txt':
      return 'Plain Text Document';
    case 'csv':
      return 'CSV Structured Records';
    case 'json':
      return 'JSON Data Payload';
    default:
      return file.type || 'Digital Evidence Artifact';
  }
}
