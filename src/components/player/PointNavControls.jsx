import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useCollisionStore } from '../../store/useCollisionStore.js'
import { resolveCollision } from '../../utils/collision.js'

const EYE_HEIGHT = 1.6
const PLAYER_RADIUS = 0.35
const SPEED = 3.5 // m/s walk-to-point speed
const ARRIVE_EPSILON = 0.05

const raycaster = new THREE.Raycaster()
const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0) // world y = 0
const ndc = new THREE.Vector2()

// Accessible click/tap-to-move alternative to FPS controls — raycasts the
// ground plane on pointerdown and walks the camera to that point each
// frame. This is the primary mode (desktop and mobile), per the build guide.
export default function PointNavControls() {
  const { camera, gl } = useThree()
  const target = useRef(null) // THREE.Vector3 | null

  useEffect(() => {
    camera.position.y = EYE_HEIGHT
    const dom = gl.domElement

    const onPointerDown = (e) => {
      const rect = dom.getBoundingClientRect()
      ndc.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1,
      )
      raycaster.setFromCamera(ndc, camera)
      const hit = new THREE.Vector3()
      if (raycaster.ray.intersectPlane(groundPlane, hit)) {
        target.current = hit
      }
    }

    dom.addEventListener('pointerdown', onPointerDown)
    return () => dom.removeEventListener('pointerdown', onPointerDown)
  }, [camera, gl])

  useFrame((_, delta) => {
    if (!target.current) return

    const dx = target.current.x - camera.position.x
    const dz = target.current.z - camera.position.z
    const dist = Math.hypot(dx, dz)
    if (dist < ARRIVE_EPSILON) {
      target.current = null
      return
    }

    const step = Math.min(SPEED * Math.min(delta, 0.1), dist)
    const dirX = dx / dist
    const dirZ = dz / dist

    const segments = useCollisionStore.getState().getAllSegments()
    const [nx, nz] = resolveCollision(
      camera.position.x + dirX * step,
      camera.position.z + dirZ * step,
      segments,
      PLAYER_RADIUS,
    )
    camera.position.x = nx
    camera.position.z = nz
    camera.position.y = EYE_HEIGHT
    camera.lookAt(target.current.x, EYE_HEIGHT, target.current.z)
  })

  return null
}
