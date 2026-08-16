import { useEffect } from 'react'
import { useGalleryStore } from '../../store/useGalleryStore.js'
import { setMuted } from '../../audio/audioEngine.js'

// No UI of its own — keeps the underlying Web Audio graph's mute state in
// sync with the zustand `audioOn` toggle. Actual AudioContext creation
// happens in IntroOverlay's click handler (must be synchronous within a
// user gesture per browser autoplay policy); this only manages muting
// afterward, so it's safe to mount unconditionally.
export default function AudioManager() {
  const audioOn = useGalleryStore((s) => s.audioOn)

  useEffect(() => {
    setMuted(!audioOn)
  }, [audioOn])

  return null
}
