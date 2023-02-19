declare module 'mp3-duration' {
  function mp3Duration(buffer: Buffer): Promise<number>;

  export default mp3Duration;
}
