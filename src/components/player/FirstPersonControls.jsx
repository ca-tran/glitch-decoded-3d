import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import { useCollisionStore } from '../../store/useCollisionStore.js'
import { resolveCollision } from '../../utils/collision.js'

const SPEED = 3.2 // m/s
const EYE_HEIGHT = 1.6
const PLAYER_RADIUS = 0.35

const KEY_MAP = {
  KeyW: 'forward',
  ArrowUp: 'forward',
  KeyS: 'backward',
  ArrowDown: 'backward',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
}

const forwardVec = new THREE.Vector3()
const rightVec = new THREE.Vector3()
const upVec = new THREE.Vector3(0, 1, 0)

// WASD + mouse-look, desktop only (gated in App.jsx via isDesktopDevice).
// Movement is resolved against the shared wall-collision registry so the
// player is blocked by solid walls but passes freely through doorways.
export default function FirstPersonControls() {
  const { camera } = useThree()
  const move = useRef({ forward: false, backward: false, left: false, right: false })

  useEffect(() => {
    camera.position.y = EYE_HEIGHT

    const onKeyDown = (e) => {
      const dir = KEY_MAP[e.code]
      if (dir) move.current[dir] = true
    }
    const onKeyUp = (e) => {
      const dir = KEY_MAP[e.code]
      if (dir) move.current[dir] = false
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [camera])

  useFrame((_, delta) => {
    const m = move.current
    if (!m.forward && !m.backward && !m.left && !m.right) return

    camera.getWorldDirection(forwardVec)
    forwardVec.y = 0
    forwardVec.normalize()
    rightVec.crossVectors(forwardVec, upVec).normalize()

    const step = SPEED * Math.min(delta, 0.1)
    let dx = 0
    let dz = 0
    if (m.forward) {
      dx += forwardVec.x * step
      dz += forwardVec.z * step
    }
    if (m.backward) {
      dx -= forwardVec.x * step
      dz -= forwardVec.z * step
    }
    if (m.right) {
      dx += rightVec.x * step
      dz += rightVec.z * step
    }
    if (m.left) {
      dx -= rightVec.x * step
      dz -= rightVec.z * step
    }

    const segments = useCollisionStore.getState().getAllSegments()
    const [nx, nz] = resolveCollision(camera.position.x + dx, camera.position.z + dz, segments, PLAYER_RADIUS)
    camera.position.x = nx
    camera.position.z = nz
    camera.position.y = EYE_HEIGHT
  })

  return <PointerLockControls />
}
