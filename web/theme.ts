import { Color } from 'three'
import type { Map as LibreMap } from 'maplibre-gl'

/** A basemap colour as Night draws it: darkened and desaturated, text kept light. */
export function recolor(value: unknown, key: string): unknown {
  if (Array.isArray(value)) return value.map(v => recolor(v, key))
  if (typeof value !== 'string' || !/^(#[0-9a-f]{3,6}$|rgb\(|hsl\()/i.test(value)) return value
  const color = new Color(value)
  const hsl = { h: 0, s: 0, l: 0 }
  color.getHSL(hsl)
  const text = key === 'text-color' || key === 'icon-color'
  const halo = key === 'text-halo-color'
  color.setHSL(hsl.h, hsl.s * 0.45, text ? 0.65 + hsl.l * 0.2 : halo ? 0.07 : 0.055 + (1 - hsl.l) * 0.18)
  return `#${color.getHexString()}`
}

const originalPaint = new WeakMap<LibreMap, { id: string; key: string; value: unknown }[]>()
/** Recolor the existing basemap in place, preserving custom layers and the camera. */
export function applyMapTheme(map: LibreMap, dark: boolean) {
  let original = originalPaint.get(map)
  if (!original) {
    // The hillshade has its own Day and Night colours (terrain-style.ts).
    original = map.getStyle().layers.filter(layer => layer.type !== 'hillshade').flatMap(layer => Object.entries(layer.paint ?? {})
      .filter(([key]) => key.endsWith('-color'))
      .map(([key, value]) => ({ id: layer.id, key, value: structuredClone(value) })))
    originalPaint.set(map, original)
  }
  for (const paint of original) if (map.getLayer(paint.id)) map.setPaintProperty(paint.id, paint.key as Parameters<LibreMap['setPaintProperty']>[1], (dark ? recolor(paint.value, paint.key) : paint.value) as Parameters<LibreMap['setPaintProperty']>[2])
}
