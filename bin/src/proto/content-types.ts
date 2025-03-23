
export const REGEX_FILE_EXTENSION = /\.[a-z]+$/;
export const CONTENT_TYPES_MAP = {
    ".html": "text/html",
    ".htm": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".xml": "application/xml",
    ".txt": "text/plain",
    ".md": "text/markdown",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".pdf": "application/pdf",
    ".zip": "application/zip",
    ".rar": "application/x-rar-compressed",
    ".tar": "application/x-tar",
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".ogg": "application/ogg",
    ".csv": "text/csv",
    ".xls": "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".ppt": "application/vnd.ms-powerpoint",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation"
} as const;
export function getContentType(fileName: string): string | null{
    const ext = REGEX_FILE_EXTENSION.exec(fileName)?.[0];
    if(!ext) return null;
    return CONTENT_TYPES_MAP[ext as keyof typeof CONTENT_TYPES_MAP]??null;
}