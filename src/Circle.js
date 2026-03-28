import Shape from "./Shape";

export default class Circle extends Shape {

    x = 0;
    y = 0;
    radius = 0;

    constructor(x, y, size, color) {
        super(x, y, size, color)
        this.radius = size / 2
        this.type = "circle"

        this.updateVertices()
    }

    updateVertices() {
        this.min_x = this.x - this.radius
        this.min_y = this.y - this.radius
        this.max_x = this.x + this.radius
        this.max_y = this.y + this.radius
    }

}