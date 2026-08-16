import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

/**
 * Gallery 3's "single strong projection-style light source" (per the build
 * guide) — positioned at/near the video piece it's modeling as the actual
 * in-scene light source (the Rosa Menkman work, per the guide's suggestion),
 * throwing a narrow, dramatic beam across the room in the direction that
 * piece already faces.
 *
 * The only light in the scene with shadows enabled — Section 6 caps shadow
 * maps to a few key lights; this is the one place a hard-edged cast shadow
 * actually serves the room's "dim ambient, single strong source" mood.
 */
export default function ProjectionLight({
  origin, // [x, y, z] — the source artwork's position
  facingAngleY, // the source artwork's rotation.y (its into-room facing direction)
  throwDistance = 6,
  intensity = 1200, // candela — physically-based decay=2 needs this scale over a multi-metre throw
  angle = 0.32,
  penumbra = 0.25,
  color = '#dce8ff',
}) {
  const lightRef = useRef()
  const targetRef = useRef(new THREE.Object3D())

  const { position, target } = useMemo(() => {
    const [x, y, z] = origin
    const dx = Math.sin(facingAngleY)
    const dz = Math.cos(facingAngleY)
    // Pull the source slightly off the wall so it isn't clipping through it,
    // and aim the target further along the same line across the room.
    return {
      position: [x + dx * 0.15, y, z + dz * 0.15],
      target: [x + dx * throwDistance, y - 0.6, z + dz * throwDistance],
    }
  }, [origin, facingAngleY, throwDistance])

  useEffect(() => {
    targetRef.current.position.set(...target)
    if (lightRef.current) lightRef.current.target = targetRef.current
  }, [target])

  return (
    <>
      <spotLight
        ref={lightRef}
        position={position}
        intensity={intensity}
        angle={angle}
        penumbra={penumbra}
        color={color}
        distance={throwDistance * 2}
        decay={2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <primitive object={targetRef.current} />
    </>
  )
}
