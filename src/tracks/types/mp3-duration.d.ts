declare module 'mp3-duration' {
  function mp3Duration(buffer: Buffer, fast?: boolean): Promise<number>;

  export default mp3Duration;
}
