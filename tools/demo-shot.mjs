// Screenshot the demo site's map (web/), by day and by night, from fixed
// cameras: a check on how the basemap, terrain and models read together.
//
//   bun run build && python3 -m http.server 4173 --directory dist
//   OUT=review/demo-3d TAG=after node tools/demo-shot.mjs [scene ...]
//
// Needs Playwright with Chromium, which this repo doesn't install:
//   bun add --no-save playwright && bunx playwright install chromium
//
// Drives the camera through `window.__landmarksMap`, which the app sets only
// when served from localhost. Writes <OUT>/<TAG>-<scene>-<day|night>.png and
// prints, for each shot, the tiles fetched per host and the frame rate while
// the camera turns (headless Chromium: compare runs, not absolute numbers).
//
// env:
//   APP_URL   the local build (default http://localhost:4173/)
//   OUT       output dir (default preview/demo)
//   TAG       file-name prefix (default shot)
//   THEMES    day,night (default both)
import fs from 'node:fs'
import path from 'node:path'

const SCENES = {
  sf: { id: 'sf-golden-gate-bridge', center: [-122.4745, 37.8075], zoom: 14, pitch: 78, bearing: 150 },
  pit: { id: 'pit-west-end-bridge', center: [-80.0225, 40.4425], zoom: 14.6, pitch: 74, bearing: 70 },
  brooklyn: { id: 'nyc-brooklyn-bridge', center: [-73.9985, 40.7068], zoom: 16, pitch: 66, bearing: 135 },
  chicago: { id: 'chi-333-wacker', center: [-87.6365, 41.8850], zoom: 15.8, pitch: 64, bearing: 20 },
}
const wanted = process.argv.slice(2)
const scenes = wanted.length ? wanted : Object.keys(SCENES)
const APP = process.env.APP_URL || 'http://localhost:4173/'
const OUT = process.env.OUT || path.join(import.meta.dirname, '../preview/demo')
const TAG = process.env.TAG || 'shot'
const themes = (process.env.THEMES || 'day,night').split(',')
fs.mkdirSync(OUT, { recursive: true })
const { chromium } = await import('playwright').catch(() => {
  console.error('needs Playwright: bun add --no-save playwright && bunx playwright install chromium')
  process.exit(1)
})
const browser = await chromium.launch({ args: ['--enable-gpu', '--ignore-gpu-blocklist', '--use-angle=gl-egl'] })

for (const theme of themes) for (const name of scenes) {
  const scene = SCENES[name]
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } })
  await ctx.addInitScript(t => { try { localStorage.setItem('landmarks-theme', t) } catch {} }, theme === 'night' ? 'dark' : 'light')
  const page = await ctx.newPage()
  page.on('pageerror', e => console.log('pageerror', e.message.slice(0, 200)))
  const hosts = {}
  page.on('requestfinished', r => { const h = new URL(r.url()).host; hosts[h] = (hosts[h] ?? 0) + 1 })
  await page.goto(`${APP}#${scene.id}`, { waitUntil: 'load', timeout: 120000 })
  await page.waitForFunction(() => window.__landmarksMap?.loaded(), null, { timeout: 120000 })
  await page.waitForTimeout(1500)
  // An older build may cap the pitch lower; lift the cap so before and after share the camera.
  await page.evaluate(s => { const map = window.__landmarksMap; if (map.getMaxPitch() < s.pitch) map.setMaxPitch(s.pitch) }, scene)
  await page.evaluate(s => window.__landmarksMap.jumpTo({ center: s.center, zoom: s.zoom, pitch: s.pitch, bearing: s.bearing }), scene)
  // Settled: every source's tiles loaded and the frame idle, or give up after a minute.
  await page.evaluate(() => new Promise(resolve => {
    const map = window.__landmarksMap
    const done = setTimeout(resolve, 60000)
    const check = () => { if (map.areTilesLoaded()) { clearTimeout(done); resolve() } else map.once('idle', check) }
    map.once('idle', check)
    map.triggerRepaint()
  }))
  await page.waitForTimeout(2500)
  const file = path.join(OUT, `${TAG}-${name}-${theme}.png`)
  await page.screenshot({ path: file })
  const tiles = { ...hosts }
  // Frames drawn while the camera turns 40° over three seconds.
  const fps = await page.evaluate(() => new Promise(resolve => {
    const map = window.__landmarksMap
    let frames = 0
    const count = () => { frames++ }
    map.on('render', count)
    const start = performance.now()
    map.easeTo({ bearing: map.getBearing() + 40, duration: 3000, easing: t => t })
    setTimeout(() => { map.off('render', count); resolve(frames / ((performance.now() - start) / 1000)) }, 3000)
  }))
  console.log(JSON.stringify({ shot: path.basename(file), tiles, fps: Math.round(fps * 10) / 10 }))
  await ctx.close()
}
await browser.close()
