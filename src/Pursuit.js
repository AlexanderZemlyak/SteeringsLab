import Steering from "./Steering";
import Seek from "./Seek";


export default class Pursuit extends Steering {

    constructor(agent, target, stopDistance, maxPredictionTime) {
        super(agent)
        this.target = target
        this.stopDistance = stopDistance
        this.maxPredictionTime = maxPredictionTime
    }

    update() {
        const predictedPosition = this.predictFuturePosition()

        const linearSteering = new Seek(this.agent, predictedPosition, this.stopDistance).update()

        const angularSteering = this.calculateAngularSteering(predictedPosition)
        
        return {
            linear: linearSteering,
            angular: angularSteering
        }
    }

    predictFuturePosition() {

        const targetToAgentVec = this.agent.position.clone().sub(this.target.position)

        const distance = targetToAgentVec.length()

        let predictionTime = distance / this.agent.maxSpeed;

        predictionTime = Math.min(predictionTime, this.maxPredictionTime);

        const targetSpeed = this.target.velocity.length();
        if (targetSpeed > 0.01) {
            const dirToAgent = targetToAgentVec.clone().normalize()
            const targetDir = this.target.velocity.clone().normalize()

            const cos = dirToAgent.dot(targetDir);

            if (cos > 0) {
                predictionTime *= (1 - cos)
            }

            return this.target.position.clone().add(
                this.target.velocity.clone().scale(predictionTime)
            );
        }
        else {
            return this.target.position.clone()
        }
        
    }

    calculateAngularSteering(targetPosition) {

        const toTarget = targetPosition.clone().sub(this.agent.position)
        
        if (toTarget.length() < this.stopDistance) {
            return -this.agent.angularVelocity
        }
        
        const currentAngle = this.agent.shape.angle
            
        const desiredAngle = Math.atan2(toTarget.y, toTarget.x) + Math.PI / 6

        let angleDiff = desiredAngle - currentAngle
        
        if (Math.abs(angleDiff) < Math.PI / 72)
            angleDiff = -this.agent.angularVelocity


        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2
        
        const maxAngularSpeed = this.agent.maxAngularSpeed
        
        if (Math.abs(angleDiff) > maxAngularSpeed) {
            angleDiff = Math.sign(angleDiff) * maxAngularSpeed
        }
        
        return angleDiff
    }

}