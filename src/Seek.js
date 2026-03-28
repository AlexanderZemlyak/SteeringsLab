import Steering from "./Steering"
import { Vector2 } from "./geometry"

export default class Seek extends Steering {

    constructor(agent, target, stopDistance) {
        super(agent)
        this.target = target
        this.stopDistance = stopDistance
    }

    update() {

        const desiredVelocity = this.target.clone().sub(this.agent.position)

        if (desiredVelocity.length() < this.stopDistance) {
            return new Vector2(-this.agent.velocity.x, -this.agent.velocity.y)
        }

        const curVelocity = this.agent.velocity

        desiredVelocity.normalize()
        desiredVelocity.scale(this.agent.maxSpeed)

        const steering = desiredVelocity.sub(curVelocity)

        const steeringLength = steering.length()

        if (steeringLength > this.agent.maxForce)
        {
            steering.scale(this.agent.maxForce / steeringLength)
        }

        return steering
    }
}
