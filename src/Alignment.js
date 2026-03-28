import Steering from "./Steering";

export default class Alignment extends Steering {

    alignmentRadius = 100;

    constructor(agent, leader) {
        super(agent)
        this.leader = leader
    }

    update() {
        return this.calculateAngularAlignment()
    }

    calculateAngularAlignment() {
        if (!this.leader || this.leader === this.agent 
            || this.leader.position.clone().sub(this.agent.position).length() > this.alignmentRadius) {
            return -this.agent.angularVelocity
        }
        
        const leaderAngle = this.leader.shape.angle
        
        let angleDiff = leaderAngle - this.agent.shape.angle
        
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2
        
        if (Math.abs(angleDiff) < Math.PI / 72) {
            return -this.agent.angularVelocity
        }
        
        const maxAngularSpeed = this.agent.maxAngularSpeed
        let angularForce = angleDiff
        
        if (Math.abs(angularForce) > maxAngularSpeed) {
            angularForce = Math.sign(angularForce) * maxAngularSpeed
        }
        
        return angularForce
    }
}