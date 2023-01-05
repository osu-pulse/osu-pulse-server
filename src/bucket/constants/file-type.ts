export enum AudioFileType {
  MP3 = 'audio/mp3',
}

export enum ImageFileType {
  JPG = 'image/jpeg',
}

export enum TextFileType {
  CSS = 'text/css',
}

export type FileType = AudioFileType | ImageFileType | TextFileType;
