# src/render/characters/custom/ -- fork-owned creature visual overrides

This directory is **never touched by upstream merges**. It is the render-side
equivalent of `src/sim/content/custom/` and works by the same pattern: export
named constants, get them spread into the upstream tables by a single documented
patch in `manifest.ts`.

## Files
- `index.ts` -- exports `CUSTOM_MOB_KEYS` and `CUSTOM_VISUALS`
- `CLAUDE.md` -- this file

## How it plugs in
`manifest.ts` (upstream) imports `CUSTOM_MOB_KEYS` and `CUSTOM_VISUALS` and
spreads them LAST into `MOB_KEYS` and `VISUALS`. Because they come last,
any key in a custom export silently wins over the upstream definition with the
same name. That patch is the only upstream file change needed; it is documented
in `docs/MAINTAINING-FORK.md` with the exact re-apply snippet.

## Naming rules
- Custom visual keys: use `custom_` prefix (e.g. `custom_felhunter`, `custom_forest_bear`)
- Custom GLB files: `public/models/creatures/custom/<name>.glb` -- the `CUSTOM_CREATURES`
  constant in `index.ts` resolves to `models/creatures/custom` for use in urls

## Which ClipMap to use
| Rig type | ClipMap factory | GLB source |
|---|---|---|
| KayKit humanoid | `kaykit(['ClipName', ...])` | KayKit packs |
| KayKit skeleton | `skeletonClips(['ClipName'])` | KayKit enemy packs |
| 14-bone biped | `BIPED14` (imported from manifest.ts) | upstream demon GLBs |
| Quaternius 4-legged | `animal(['Attack'])` | Quaternius creature packs |
| Floating / hovering | `FLOATING` (imported from manifest.ts) | upstream demon GLBs |

ClipMap factories are defined in `manifest.ts` and must be re-exported or
imported from there if needed. See docs/custom-content/CREATURE-MODELS.md
for how to import them.

## Overriding an upstream creature
1. Add `templateId: 'custom_my_key'` to `CUSTOM_MOB_KEYS`.
2. Add `custom_my_key: { url, height, clips, ... }` to `CUSTOM_VISUALS`.
3. If using a new GLB: drop it in `public/models/creatures/custom/`.
4. Run `npm run build` to regenerate the media manifest (content-hashed URLs).

## Adding a new creature (no upstream entry)
Same steps. Because the templateId does not exist in upstream `MOB_KEYS`, it
will fall through to `FAMILY_KEYS` if no custom entry exists. Adding an entry
in `CUSTOM_MOB_KEYS` overrides that fallback.

## Upstream merge safety check
After any upstream merge, verify the patch survived:
```
grep -n "CUSTOM_MOB_KEYS\|CUSTOM_VISUALS" src/render/characters/manifest.ts
```
Expected: 3 hits (import line + spread in VISUALS + spread in MOB_KEYS).
If missing, re-apply from docs/MAINTAINING-FORK.md "manifest.ts" section.
