// Single source of truth for gallery geometry and artwork placement.
// Dimensions below are transcribed from the Glitch Decoded floorplan pages
// (metres). When real artwork content is handed off, only `mediaSrc`
// (and any position fine-tuning once real image aspect ratios are known)
// should need to change — no component rewrites.

export const galleries = {
  gallery1: { width: 5.8, depth: 5.1, height: 3.5, shape: 'rectangle' },
  gallery2: { width: 4.7, depth: 8.66, height: 3.0, shape: 'right-triangle' },
  gallery3: { width: 8.41, depth: 5.4, hyp: 8.46, height: 3.5, shape: 'right-triangle-rounded' },
  gallery4: { width: 3.68, depth: 4.7, height: 3.0, shape: 'l-shape' },
  // Not yet in the floorplan pages supplied — placeholder footprint until the
  // real courtyard dimensions are available. Treated as an open-air rectangle
  // (no ceiling) rather than a sealed gallery room.
  courtyard: { width: 6.0, depth: 6.0, height: 4.0, shape: 'rectangle', outdoor: true },
}

// Phase 1 (this build) only needs `galleries` above for room shells.
// `artworks` is stubbed out and will be populated from the Object List PDF
// in Phase 3 — one entry per work, each pointing at a procedurally
// generated placeholder image (see scripts/ + Section 9 of the build guide)
// until real files are supplied.
export const artworks = [
  // {
  //   id: 'token-homes',
  //   artist: 'Matthew Plummer Fernandez',
  //   title: 'Token Homes',
  //   year: 2018,
  //   medium: '3D printed ABS',
  //   dimensions: { width: 0.6, height: 3.0 }, // metres
  //   gallery: 'gallery1',
  //   position: [-2.1, 1.5, -3.6],
  //   rotation: [0, 0, 0],
  //   mediaType: 'image', // 'image' | 'video'
  //   mediaSrc: '/assets/artworks/token-homes-placeholder.jpg',
  //   installNote: 'low plinth, 15cm height',
  //   labelText: `...curatorial text...`,
  // },
]
