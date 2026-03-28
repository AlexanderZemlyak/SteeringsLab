import { Vector2 } from "./geometry"
import Steering from "./Steering"

export default class ObstacleAvoidance extends Steering {

    breakStrengthFactor = 0.8;
    minSpeedForBraking = 2;

    constructor(agent, obstacles) {
        super(agent)
        this.obstacles = obstacles
    }

    update() {

        if (this.agent.velocity.length() < 0.01) {
            return new Vector2(0, 0)
        }

        let steering = new Vector2(0, 0)

        const boxLength = this.agent.avoidRadius
        const boxWidth = this.agent.shape.size

        const velocityDir = this.agent.velocity.clone().normalize()

        const rightDir = velocityDir.perpendicular()

        let closestObstacle = null;
        let minDistance = Infinity;
        
        for (const obstacle of this.obstacles) {
            const toObstacle = obstacle.position.clone().sub(this.agent.position);
            
            const localX = toObstacle.dot(velocityDir);
            const localY = toObstacle.dot(rightDir);

            const obstacleHalfSize = obstacle.shape.size / 2
            // для y с запасом
            if (localX > 0 && localX - obstacleHalfSize < boxLength && Math.abs(localY) - obstacleHalfSize - this.agent.shape.size < boxWidth / 2) {
                if (localX < minDistance) {
                    minDistance = localX;
                    closestObstacle = { localY, distance: localX, halfSize: obstacleHalfSize };
                }
            }
        }

        if (closestObstacle) {
            const avoidanceDir = closestObstacle.localY > 0 ? -1 : 1;
            
            const strength = Math.min(1 - (closestObstacle.distance / (boxLength - closestObstacle.halfSize - this.agent.shape.size / 2)), 1);
            
            steering.x = rightDir.x * avoidanceDir * this.agent.maxForce * strength;
            steering.y = rightDir.y * avoidanceDir * this.agent.maxForce * strength;

            const brakeStrength = (1 - closestObstacle.distance / this.agent.avoidRadius) * this.agent.maxForce * this.breakStrengthFactor;

            const brakeDirection = this.agent.velocity.clone().normalize().scale(-1);

            let brakingForce = brakeDirection.scale(brakeStrength);

            if (this.agent.velocity.length() < this.minSpeedForBraking)
                brakingForce = new Vector2(0, 0)

            steering.add(brakingForce)

            // const forceLength = steering.length();
            // if (forceLength > this.agent.maxForce) {
            //     steering.scale(this.agent.maxForce / forceLength);
            // }
        }

        return steering
    }
}