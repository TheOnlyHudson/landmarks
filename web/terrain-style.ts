import type { Map as LibreMap, SkySpecification, HillshadeLayerSpecification } from 'maplibre-gl'
import { recolor } from './theme'

/**
 * Mapterhorn: open terrarium tiles from USGS 3DEP lidar in the US, the DEM
 * Parchment draws and the models are built on.
 */
const DEM = {
  type: 'raster-dem' as const, encoding: 'terrarium' as const, tileSize: 512, maxzoom: 15,
  tiles: ['https://tiles.mapterhorn.com/{z}/{x}/{y}.webp'],
  attribution: '<a href="https://mapterhorn.com/attribution" target="_blank">© Mapterhorn</a>',
}
export const TERRAIN_SOURCE = 'terrain-dem'
/**
 * The hillshade reads its own, coarser copy of the DEM: at zoom 12 (about 20 m
 * a pixel) it shows the shape of the hills rather than every kerb and
 * embankment in the lidar, and asks for a fraction of the tiles.
 */
const HILLSHADE_SOURCE = 'hillshade-dem'
const HILLSHADE_MAXZOOM = 12
export const HILLSHADE_LAYER = 'terrain-hillshade'
/** Whether a source is one of the terrain's, whose failure leaves the map flat. */
export const isTerrainSource = (id: string | undefined) => id === TERRAIN_SOURCE || id === HILLSHADE_SOURCE
/** Life-size, like Parchment: the models are built to true heights. */
const EXAGGERATION = 1

/**
 * Light from the north-west, fixed to the map, as cartographic relief is lit.
 * Strongest when zoomed out, where hills are the shape of the land; faint at
 * street zoom, where it would only grey the streets.
 */
const SHADE: Record<'day' | 'night', HillshadeLayerSpecification['paint']> = {
  day: {
    'hillshade-shadow-color': 'rgba(72, 70, 64, 0.7)',
    'hillshade-highlight-color': 'rgba(255, 255, 250, 0.45)',
    'hillshade-accent-color': 'rgba(72, 70, 64, 0.25)',
  },
  night: {
    'hillshade-shadow-color': 'rgba(0, 0, 0, 0.9)',
    'hillshade-highlight-color': 'rgba(170, 156, 132, 0.22)',
    'hillshade-accent-color': 'rgba(0, 0, 0, 0.4)',
  },
}

/**
 * Parchment's sky (web/src/lib/map-style/themes.ts): the horizon and fog take
 * the ground's own colour, so a steep view fades into the land rather than
 * ending on a band of another colour.
 */
function sky(ground: string, dark: boolean): SkySpecification {
  return dark
    ? { 'sky-color': 'hsl(218, 34%, 9%)', 'horizon-color': ground, 'fog-color': ground, 'fog-ground-blend': 0.72, 'horizon-fog-blend': 0.6, 'sky-horizon-blend': 0.85, 'atmosphere-blend': 0 }
    : { 'sky-color': 'hsl(199, 88%, 78%)', 'horizon-color': ground, 'fog-color': ground, 'fog-ground-blend': 0.8, 'horizon-fog-blend': 0.6, 'sky-horizon-blend': 0.85, 'atmosphere-blend': 0 }
}

/** The style's ground colour, as drawn in the light theme. */
let ground = 'rgb(242, 243, 240)'

/** 3D terrain, its hillshade beneath the roads and buildings, and the sky. */
export function addTerrain(map: LibreMap) {
  const background = map.getStyle().layers.find(layer => layer.type === 'background')
  const color = background?.paint?.['background-color']
  if (typeof color === 'string') ground = color
  map.addSource(TERRAIN_SOURCE, DEM)
  map.addSource(HILLSHADE_SOURCE, { ...DEM, maxzoom: HILLSHADE_MAXZOOM })
  map.setTerrain({ source: TERRAIN_SOURCE, exaggeration: EXAGGERATION })
  // Over the land and its cover, under the rivers, buildings, roads and labels.
  const layers = map.getStyle().layers
  const above = layers.find(layer => 'source-layer' in layer && ['waterway', 'building', 'transportation'].includes(layer['source-layer'] ?? '')) ??
    layers.find(layer => layer.type === 'symbol')
  map.addLayer({ id: HILLSHADE_LAYER, type: 'hillshade', source: HILLSHADE_SOURCE, paint: {
    'hillshade-method': 'igor',
    'hillshade-illumination-anchor': 'map',
    'hillshade-illumination-direction': 315,
    'hillshade-exaggeration': ['interpolate', ['linear'], ['zoom'], 9, 0.8, 14, 0.7, 17, 0.5, 19, 0.35],
    ...SHADE.day,
  } }, above?.id)
  // Water is flat: drawn over the relief, it hides the noise the DEM has offshore.
  for (const layer of layers) if (layer.type === 'fill' && 'source-layer' in layer && layer['source-layer'] === 'water') map.moveLayer(layer.id, above?.id)
}

/** The relief and sky for Day or Night. */
export function themeTerrain(map: LibreMap, dark: boolean) {
  if (map.getLayer(HILLSHADE_LAYER)) for (const [key, value] of Object.entries(SHADE[dark ? 'night' : 'day']!))
    map.setPaintProperty(HILLSHADE_LAYER, key as Parameters<LibreMap['setPaintProperty']>[1], value as Parameters<LibreMap['setPaintProperty']>[2])
  map.setSky(sky(dark ? recolor(ground, 'background-color') as string : ground, dark))
}
