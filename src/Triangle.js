import { Vector2 } from "./geometry";
import Shape from "./Shape"

export default class Triangle extends Shape {

    vertices;
    axes;

    constructor(x, y, size, color) {
        super(x, y, size, color)
        this.size = size
        this.type = "triangle"

        this.circumradius = size / Math.sqrt(3)
        this.inradius = size * Math.sqrt(3) / 6

        this.localVertices = [
            new Vector2(0, this.circumradius),
            new Vector2(-this.size / 2, -this.inradius),
            new Vector2(this.size / 2, -this.inradius)
        ]

        this.vertices = this.localVertices.map(v => v.clone())

        this.axes = [new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0)]

        this.updateVertices()
    }

    updateVertices() {
        const cos = Math.cos(this._angle)
        const sin = Math.sin(this._angle)

        let min_x = Infinity
        let min_y = Infinity
        let max_x = -Infinity
        let max_y = -Infinity

        for (let i = 0; i < 3; i++)
        {
            const v = this.localVertices[i]

            const rotatedX = v.x * cos - v.y * sin
            const rotatedY = v.x * sin + v.y * cos

            const worldV = this.vertices[i]

            this.vertices[i].x = this.position.x + rotatedX
            this.vertices[i].y = this.position.y + rotatedY

            min_x = Math.min(min_x, worldV.x);
            min_y = Math.min(min_y, worldV.y);
            max_x = Math.max(max_x, worldV.x);
            max_y = Math.max(max_y, worldV.y);
        }

        // this.aabb = new AABB(min_x, min_y, max_x, max_y)

        this.min_x = min_x
        this.min_y = min_y
        this.max_x = max_x
        this.max_y = max_y

        for (let i = 0; i < 3; i++) {
            const j = (i + 1) % 3;

            const edgeX = this.vertices[j].x - this.vertices[i].x
            const edgeY = this.vertices[j].y - this.vertices[i].y

            this.axes[i].x = -edgeY
            this.axes[i].y = edgeX
        }
    }
}