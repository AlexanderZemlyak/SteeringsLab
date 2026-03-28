import Steering from "./Steering";
import { Vector2 } from "./geometry";

export default class Separation extends Steering {

    separationRadius = 50;
    attenuationCoef = 1

    constructor(agent, neighbors) {
        super(agent)
        this.neighbors = neighbors
    }

    update() {
        const steering = new Vector2(0, 0)
        
        for (const neighbor of this.neighbors) {
            if (neighbor === this.agent) continue
            
            const toAgent = this.agent.position.clone().sub(neighbor.position)
            const distance = toAgent.length()
            
            if (distance > 0 && distance < this.separationRadius) {
                const strength = 1 - Math.pow(distance / this.separationRadius, 2)
                
                const direction = toAgent.clone().normalize()
                const force = direction.scale(strength)
                
                steering.add(force)
            }
        }
        
        if (steering.length() > this.agent.maxForce) {
            steering.scale(this.agent.maxForce / steering.length())
        }
        
        return steering
    }

}