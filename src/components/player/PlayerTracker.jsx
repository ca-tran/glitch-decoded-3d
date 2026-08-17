import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGalleryStore } from '../../store/useGalleryStore.js'

// Every frame is overkill for a minimap dot — sample roughly every 6th
// frame (~10Hz at 60fps) to keep the zustand-driven Minimap re-render cheap
// without the dot reading as laggy.
const UPDATE_EVERY_N_FRAMES = 6

export default function PlayerTracker() {
  const { camera } = useThree()
  const setPlayerTransform = useGalleryStore((s) => s.setPlayerTransform)
  const frameCount = useRef(0)

  useFrame(() => {
    frameCount.current += 1
    if (frameCount.current % UPDATE_EVERY_N_FRAMES !== 0) return
    setPlayerTransform([camera.position.x, camera.position.y, camera.position.z], camera.rotation.y)
  })

  return null
}
