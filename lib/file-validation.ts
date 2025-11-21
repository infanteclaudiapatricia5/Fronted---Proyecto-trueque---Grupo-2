export const MAX_FILE_SIZE = 5 * 1024 * 1024

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
]

export function validateFileSize(file: File, maxSize: number = MAX_FILE_SIZE): boolean {
  return file.size <= maxSize
}

export function validateImageType(file: File): boolean {
  return ALLOWED_IMAGE_TYPES.includes(file.type)
}

export function validateFiles(files: File[]) {
  const validFiles: File[] = []
  const oversizedFiles: File[] = []
  const invalidTypeFiles: File[] = []

  files.forEach((file) => {
    if (!validateImageType(file)) {
      invalidTypeFiles.push(file)
    } else if (!validateFileSize(file)) {
      oversizedFiles.push(file)
    } else {
      validFiles.push(file)
    }
  })

  return {
    validFiles,
    oversizedFiles,
    invalidTypeFiles,
    hasErrors: oversizedFiles.length > 0 || invalidTypeFiles.length > 0,
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}
