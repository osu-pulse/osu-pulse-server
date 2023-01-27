export enum AudioFileType {
  MP3 = 'audio/mp3',
}

export enum ImageFileType {
  JPEG = 'image/jpeg',
  WEBP = 'image/webp',
}

export enum TextFileType {
  CSS = 'text/css',
}

export type FileType = AudioFileType | ImageFileType | TextFileType;
