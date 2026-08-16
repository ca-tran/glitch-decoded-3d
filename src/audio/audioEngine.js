// Plain Web Audio module (no React/Three dependency) — a procedurally
// synthesized ambient gallery room tone, per Phase 5 of the build guide.
// No audio file to source or wait on: a detuned low drone (the "hollow
// gallery hum") plus a filtered noise bed (subtle HVAC/room-hum texture),
// looping indefinitely. Real recorded room tone can replace `startAmbient`'s
// internals later without touching any component that imports this module.
//
// AudioContext creation/resume must happen synchronously inside a real user
// gesture (browsers block autoplay with sound) — `startAmbient()` is called
// directly from IntroOverlay's onClick, not from a React effect.

let audioCtx = null
let masterGain = null
let started = false
let muted = false

const TARGET_GAIN = 0.06 // deliberately subtle — room tone, not music

function createNoiseBuffer(ctx, seconds = 4) {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return buffer
}

export function startAmbient() {
  if (started) {
    if (audioCtx.state === 'suspended') audioCtx.resume()
    return
  }
  started = true

  const AudioContextCtor = window.AudioContext || window.webkitAudioContext
  audioCtx = new AudioContextCtor()

  masterGain = audioCtx.createGain()
  masterGain.gain.value = muted ? 0 : TARGET_GAIN
  masterGain.connect(audioCtx.destination)

  // Detuned low drone — three triangle oscillators through a lowpass filter,
  // each with its own slow LFO detuning for a subtle, "living" room tone
  // rather than a static hum.
  const droneFilter = audioCtx.createBiquadFilter()
  droneFilter.type = 'lowpass'
  droneFilter.frequency.value = 700
  droneFilter.connect(masterGain)

  const droneFreqs = [55, 82.62, 110.5]
  droneFreqs.forEach((freq, i) => {
    const osc = audioCtx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = freq
    const oscGain = audioCtx.createGain()
    oscGain.gain.value = 0.5 / droneFreqs.length
    osc.connect(oscGain)
    oscGain.connect(droneFilter)
    osc.start()

    const lfo = audioCtx.createOscillator()
    lfo.frequency.value = 0.05 + i * 0.02
    const lfoGain = audioCtx.createGain()
    lfoGain.gain.value = 3 // cents of detune wobble
    lfo.connect(lfoGain)
    lfoGain.connect(osc.detune)
    lfo.start()
  })

  // Filtered noise bed — quiet room-hum texture under the drone.
  const noiseSource = audioCtx.createBufferSource()
  noiseSource.buffer = createNoiseBuffer(audioCtx)
  noiseSource.loop = true
  const noiseFilter = audioCtx.createBiquadFilter()
  noiseFilter.type = 'lowpass'
  noiseFilter.frequency.value = 300
  const noiseGain = audioCtx.createGain()
  noiseGain.gain.value = 0.15
  noiseSource.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  noiseGain.connect(masterGain)
  noiseSource.start()
}

export function setMuted(nextMuted) {
  muted = nextMuted
  if (masterGain && audioCtx) {
    const target = muted ? 0 : TARGET_GAIN
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime)
    masterGain.gain.linearRampToValueAtTime(target, audioCtx.currentTime + 0.4)
  }
}

export function isStarted() {
  return started
}
