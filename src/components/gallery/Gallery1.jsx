import { useMemo } from 'react'
import GalleryShell from './GalleryShell.jsx'
import { rectanglePlan } from './floorplans.js'
import { galleries } from '../../data/artworks.js'

// Rectangle room, 5800 x 5100mm. White walls per the plan notes.
export default function Gallery1({ position = [0, 0, 0] }) {
  const { width, depth, height } = galleries.gallery1
  const shape = useMemo(() => rectanglePlan(width, depth), [width, depth])

  return (
    <GalleryShell
      shape={shape}
      height={height}
      position={position}
      floorColor="#e8e8e8"
      ceilingColor="#f2f2f2"
      wallColor="#f4f4f4"
    />
  )
}
