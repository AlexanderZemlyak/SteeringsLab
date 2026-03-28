import { Vector2 } from "./geometry";

export default class GameObject {

    velocity;
    angularVelocity;
    maxSpeed;
    maxForce;
    maxAngularSpeed;
    maxAngularForce;
    shape;
    avoidRadius;

    constructor(maxSpeed, maxForce, maxAngularSpeed, maxAngularForce, shape, avoidRadius = 0) {
        this.velocity = new Vector2(0, 0)
        this.angularVelocity = 0
        this.maxSpeed = maxSpeed
        this.maxForce = maxForce
        this.maxAngularSpeed = maxAngularSpeed
        this.maxAngularForce = maxAngularForce
        this.shape = shape
        this.avoidRadius = avoidRadius
    }

    get position() {
        return this.shape.position
    }

    set position(val) {
        this.shape.position = val
    }
}