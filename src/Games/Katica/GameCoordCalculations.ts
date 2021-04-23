export interface ICoord {
  x: number;
  y: number;
}

export function toIndex(coord: ICoord): number {
  return coord.x + coord.y * 6;
}

export function toCoord(position: number): ICoord {
  const x = position % 6;
  const y = Math.floor(position / 6);
  return { x, y };
}

export function areCoordsEqual(a: ICoord, b: ICoord): boolean {
  return a.x === b.x && a.y === b.y;
}