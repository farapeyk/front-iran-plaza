const gallery1 = "/design/gallery/gallery-1.png"
const gallery2 = "/design/gallery/gallery-2.png"
const gallery3 = "/design/gallery/gallery-3.png"
const gallery4 = "/design/gallery/gallery-4.png"

export type GalleryItem = {
  src: string
  isVideo?: boolean
}


export const galleryProfileDefaults: GalleryItem[] = [
  { src: gallery1 },
  { src: gallery2 },
  { src: gallery3 },
  { src: gallery4, isVideo: true },
]
