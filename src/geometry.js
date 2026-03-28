export class Vector2 {
    
    x;
    y;

    constructor(x, y) {
        this.x = x
        this.y = y
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    dot(other) {
        return this.x * other.x + this.y * other.y
    }

    perpendicular() {
        return new Vector2(-this.y, this.x)
    }

    normalize() {
        const len = Math.sqrt(this.x * this.x + this.y * this.y)
        if (len === 0) return this;
        this.x /= len
        this.y /= len
        return this
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    clone() {
        return new Vector2(this.x, this.y)
    }

    scale(c) {
        this.x *= c
        this.y *= c
        return this
    }

    distanceTo(v) {
        return v.clone().sub(this).length()
    }
}

