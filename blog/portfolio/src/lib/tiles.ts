// Port of `_tile_positions` / `iter_tiles` from reedlin2002/project inference.py,
// so the hero draws exactly the tiles the refactored pipeline cuts.

export const FRAME = { width: 3840, height: 2160 } as const;
export const TILE = { width: 640, height: 480 } as const;
export const TILE_OVERLAP = 0.1;

export function tilePositions(length: number, tileSize: number, overlap: number): number[] {
  if (length <= tileSize) return [0];
  const stride = Math.max(1, Math.round(tileSize * (1 - overlap)));
  const finalStart = length - tileSize;
  const positions: number[] = [];
  for (let p = 0; p <= finalStart; p += stride) positions.push(p);
  if (positions[positions.length - 1] !== finalStart) positions.push(finalStart);
  return positions;
}

export interface Tile {
  index: number;
  x: number;
  y: number;
}

// Row-major, the same order iter_tiles yields them in.
export function frameTiles(): Tile[] {
  const xs = tilePositions(FRAME.width, TILE.width, TILE_OVERLAP);
  const ys = tilePositions(FRAME.height, TILE.height, TILE_OVERLAP);
  const tiles: Tile[] = [];
  for (const y of ys) {
    for (const x of xs) tiles.push({ index: tiles.length, x, y });
  }
  return tiles;
}
