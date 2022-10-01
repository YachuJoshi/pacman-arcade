export interface GameElement {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function createImageElement(imageSrc: string) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}

export function createAudioElement(audioSrc: string) {
  const audio = new Audio(audioSrc);
  return audio;
}
