/** Rewrite every catalog/<kind>/<id>.json in the standard format, in place.
 * bun tools/format-catalog.ts
 *
 * `bun run validate` refuses a catalog file that isn't formatted or isn't
 * named after its id. One file per entry means pull requests adding or
 * editing different landmarks never touch the same file.
 */
import { join } from 'node:path'
import { readCatalog, writeCatalog } from '../src/catalog-files'

const root = join(import.meta.dir, '..')
writeCatalog(root, readCatalog(root))
