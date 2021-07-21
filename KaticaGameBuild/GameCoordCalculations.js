export function toIndex(coord) {
    return coord.x + coord.y * 6;
}
export function toCoord(position) {
    var x = position % 6;
    var y = Math.floor(position / 6);
    return { x: x, y: y };
}
export function areCoordsEqual(a, b) {
    return a.x === b.x && a.y === b.y;
}
