import { Vector2 } from "./geometry";

export default class Shape {

    position;
    size;
    color;
    type;

    min_x;
    min_y;
    max_x;
    max_y;

    constructor(x, y, size, color) {
        this.position = new Vector2(x, y)
        this.size = size
        this.color = color
        this._angle = 0
        this.min_x = 0
        this.min_y = 0
        this.max_x = 0
        this.max_y = 0
    }

    get angle() {
        return this._angle
    }

    set angle(newAngle) {
        while (newAngle > Math.PI) newAngle -= Math.PI * 2
        while (newAngle < -Math.PI) newAngle += Math.PI * 2

        this._angle = newAngle
    }

    updateVertices() { }
}