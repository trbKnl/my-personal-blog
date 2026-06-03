# Warp Tunnel — Design Spec
Date: 2026-06-03

## Overview

After 10 house clicks, alongside the existing detonator, a warp portal sprite appears. Clicking it triggers a full 3D tunnel sequence built with Three.js — a dramatic contrast to the flat HTML page. The player steers a spacecraft through a glowing wireframe tunnel, popping animals for fun. After ~10 seconds the spacecraft exits, the page returns, and the game resets.

The detonator remains independently clickable. If clicked instead of the portal, it pops all animals and resets normally with no tunnel involved.

---

## Flow

1. 10th house click → detonator spawns (existing) + portal sprite spawns (new)
2. Player clicks portal → transition begins
3. CSS 3D warp animation plays on the live HTML page (~0.8s)
4. Three.js canvas fades in seamlessly at the warp's vanishing point
5. Camera rushes into the tunnel mouth; spacecraft rises from below into frame
6. ~10s of interactive flight — animals appear, player steers to collide with them
7. Spacecraft exits tunnel end, drifts off screen
8. Canvas fades out, page snaps back, game resets (all animals cleared, fresh round)

---

## Transition Animation

The transition is the centrepiece — the flat HTML page visibly *becomes* the tunnel.

**Entry (~1.5s total):**
1. White flash on portal click
2. CSS 3D perspective applied to `<body>` — text and layout pinch toward the centre, sucked into a vanishing point (~0.8s)
3. Three.js canvas fades in at full opacity exactly as the page reaches its vanishing point — seamless handoff, no hard cut
4. Camera zooms forward into the tunnel mouth

**Exit:**
- Tunnel mouth shrinks to a pinpoint
- Brief flash
- Page snaps back to normal

---

## Three.js Tunnel

- **Geometry:** `TubeGeometry` wrapping a `CatmullRomCurve3` with ~6 control points — gentle meanders, not aggressive (player needs room to steer)
- **Material:** Wireframe / grid mesh with emissive glow — tron/sci-fi aesthetic, maximum contrast to flat page
- **Lighting:** 2–3 coloured point lights travelling along the path, making tunnel walls pulse and feel alive
- **Camera:** Rides the curve path automatically at constant speed
- **Spacecraft:** Rendered slightly ahead of and below camera; steerable within a bounded radius from the path centre (cannot fly through walls)
- **Animals:** Billboard quad sprites spawned at random positions along the remaining path, floating in the tunnel
- **Collision:** Per-frame distance check — spacecraft within ~40px of an animal triggers confetti burst + animal removed (pure fun, no scoring)

---

## Controls

| Platform | Control |
|----------|---------|
| Desktop  | WASD — W/S = up/down, A/D = left/right |
| Mobile   | Drag/swipe — steer toward finger position |

Both map to the same underlying "steer toward target offset" system.

---

## Assets

New placeholder SVGs in `resources/game/assets/`:
- `portal.svg` — glowing warp portal (animated, can be swapped later)
- `spacecraft.svg` — spacecraft sprite (can be swapped later)

---

## Code Structure

### New file: `resources/game/tunnel.js`
Self-contained Three.js module. Owns:
- Full-screen canvas creation and lifecycle
- Three.js scene, camera, renderer, animation loop
- Tunnel geometry and materials
- Spacecraft rendering and steering logic
- Animal spawning and collision detection
- Entry/exit transition orchestration
- Confetti integration (imports existing `confetti.js`)

Exports a single function:
```js
export function startTunnelSequence(onComplete)
```
`onComplete` is called after the spacecraft exits and the canvas fades out.

### Changes to `game.js`
- Import `startTunnelSequence` from `./tunnel.js`
- In `handleHouseClick`, when `shouldSpawnDetonator` is true: also spawn portal sprite
- Portal click handler calls `startTunnelSequence(() => { clearDetonatorIfPresent(); resetRound(state) })`
- No other changes

### Changes to `state.js`
None. Portal is purely a UI concern.

### Build
`tunnel.js` is imported by `game.js` — bundled automatically by the existing build setup.

---

## Out of Scope (for now)
- Scoring / hit counters
- Multiple tunnel difficulty levels
- Sound effects
- Animal variety in the tunnel
