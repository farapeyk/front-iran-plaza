export type ImageSize = { width: number; height: number };
export type ImagePoint = { x: number; y: number };
export type CropRect = { x: number; y: number; width: number; height: number };

export function coverScale(source: ImageSize, frame: ImageSize, zoom = 1) {
  if (source.width <= 0 || source.height <= 0 || frame.width <= 0 || frame.height <= 0) return 1;
  return Math.max(frame.width / source.width, frame.height / source.height) * Math.max(1, zoom);
}

export function cropPanBounds(source: ImageSize, frame: ImageSize, zoom = 1): ImagePoint {
  const scale = coverScale(source, frame, zoom);
  return {
    x: Math.max(0, (source.width * scale - frame.width) / 2),
    y: Math.max(0, (source.height * scale - frame.height) / 2),
  };
}

export function clampCropPan(pan: ImagePoint, source: ImageSize, frame: ImageSize, zoom = 1): ImagePoint {
  const bounds = cropPanBounds(source, frame, zoom);
  return {
    x: Math.min(bounds.x, Math.max(-bounds.x, pan.x)),
    y: Math.min(bounds.y, Math.max(-bounds.y, pan.y)),
  };
}

export function sourceCropRect(source: ImageSize, frame: ImageSize, pan: ImagePoint, zoom = 1): CropRect {
  const scale = coverScale(source, frame, zoom);
  const safePan = clampCropPan(pan, source, frame, zoom);
  const renderedWidth = source.width * scale;
  const renderedHeight = source.height * scale;
  const imageLeft = (frame.width - renderedWidth) / 2 + safePan.x;
  const imageTop = (frame.height - renderedHeight) / 2 + safePan.y;

  return {
    x: Math.max(0, -imageLeft / scale),
    y: Math.max(0, -imageTop / scale),
    width: Math.min(source.width, frame.width / scale),
    height: Math.min(source.height, frame.height / scale),
  };
}
