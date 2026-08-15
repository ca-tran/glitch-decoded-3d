// Resolves a root-relative asset path (as authored in data/artworks.js,
// e.g. '/assets/artworks/foo.svg') against Vite's configured `base`
// ('/glitch-decoded-3d/' — see vite.config.js). Plain string literals like
// mediaSrc aren't rewritten by Vite's asset pipeline the way imports/url()
// are, so without this every asset 404s once base is anything but '/'
// (i.e. always, once deployed to GitHub Pages).
export function assetPath(path) {
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}
