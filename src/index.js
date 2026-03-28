import GameObject from "./GameObject";
import { Vector2 } from "./geometry";
import Pursuit from "./Pursuit";
import Seek from "./Seek";
import ObstacleAvoidance from "./ObstacleAvoidance";
import Triangle from "./Triangle";
import Circle from "./Circle";
import Separation from "./Separation";
import Alignment from "./Alignment";

const canvas = document.getElementById("cnvs");

document.addEventListener('mousemove', (event) => {
    gameState.mousePosition = new Vector2(event.clientX, event.clientY)
})

const gameState = {};

function queueUpdates(numTicks) {
    for (let i = 0; i < numTicks; i++) {
        gameState.lastTick = gameState.lastTick + gameState.tickLength
        update(gameState.lastTick)
    }
}

function randomRGB() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

const ctx = canvas.getContext('2d');
const PI2 = Math.PI * 2

function draw(tFrame) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const figures = gameState.figures;
    
    for (let i = 0; i < figures.length; i++) {
        const figure = figures[i];
        
        ctx.save();
        // ctx.translate(figure.x, figure.y);
        // ctx.rotate(figure.angle);
        // ctx.translate(-figure.x, -figure.y);
        
        ctx.fillStyle = figure.shape.color;
        
        const type = figure.shape.type;
        
        if (type === 'square') {
            ctx.fillRect(
                figure.x - figure.halfSize, 
                figure.y - figure.halfSize, 
                figure.size, 
                figure.size
            );
        } 
        else if (type === 'circle') {
            ctx.beginPath();
            ctx.arc(figure.position.x, figure.position.y, figure.shape.radius, 0, PI2);
            ctx.fill();
        } 
        else if (type === 'triangle') {
            const v = figure.shape.vertices;
            ctx.beginPath();
            ctx.moveTo(v[0].x, v[0].y);
            ctx.lineTo(v[1].x, v[1].y);
            ctx.lineTo(v[2].x, v[2].y);
            ctx.closePath();
            ctx.fill();

            // if (typeof steeringForceVar !== 'undefined') {
            //     ctx.beginPath();  // НОВЫЙ путь для линии
            //     ctx.moveTo(figure.position.x, figure.position.y);
            //     ctx.lineTo(
            //         figure.position.x + steeringForceVar.x * figure.shape.size, 
            //         figure.position.y + steeringForceVar.y * figure.shape.size
            //     );
                
            //     ctx.strokeStyle = 'blue';
            //     ctx.lineWidth = 5;
            //     ctx.stroke();

            //     ctx.beginPath();  // НОВЫЙ путь для линии
            //     ctx.moveTo(figure.position.x, figure.position.y);
            //     ctx.lineTo(
            //         figure.position.x + figure.velocity.x * figure.shape.size, 
            //         figure.position.y + figure.velocity.y * figure.shape.size
            //     );
                
            //     ctx.strokeStyle = 'red';
            //     ctx.lineWidth = 5;
            //     ctx.stroke();
            // }
        }
        
        ctx.restore();
    }
}

const STOP_DISTANCE = 5
const MAX_PREDICTION_TIME = 60

const obstacleAvoidanceCoef = 3
const separationCoef = 1.5

function update(tick) {

    gameState.figures.forEach((figure) => {

        let steeringForce;

        let angularSteeringForce;

        if (figure == gameState.dummyWalker) {
            steeringForce = new Seek(figure, gameState.mousePosition, STOP_DISTANCE).update()
        }
        else if (figure.maxSpeed > 0) {
            const pursuitSteerings = new Pursuit(figure, gameState.dummyWalker, STOP_DISTANCE, MAX_PREDICTION_TIME).update()

            steeringForce = pursuitSteerings.linear

            const obstacleAvoidanceForce = new ObstacleAvoidance(figure, gameState.figures.filter(fig => fig.maxSpeed <= 0.01)).update()

            steeringForce.add(obstacleAvoidanceForce.scale(obstacleAvoidanceCoef))
        
            const separationForce = new Separation(figure, gameState.figures.filter(fig => fig.maxSpeed > 0 && fig !== gameState.dummyWalker)).update()

            steeringForce.add(separationForce.scale(separationCoef))

            if (steeringForce.length() > figure.maxForce) {
                steeringForce.scale(figure.maxForce / steeringForce.length());
            }

            if (figure === gameState.leader)
                angularSteeringForce = pursuitSteerings.angular
            else {
                angularSteeringForce = new Alignment(figure, gameState.leader).update()
            }
                

            if (Math.abs(angularSteeringForce) > figure.maxAngularForce) {
                angularSteeringForce = Math.sign(angularSteeringForce) * figure.maxAngularForce
            }
        }

        if (steeringForce !== undefined) {
            figure.velocity.add(steeringForce)

            const speed = figure.velocity.length()

            if (speed > figure.maxSpeed)
                figure.velocity.scale(figure.maxSpeed / speed)

            figure.position.add(figure.velocity)

            figure.angularVelocity += angularSteeringForce

            if (Math.abs(figure.angularVelocity) > figure.maxAngularSpeed)
                figure.angularVelocity = Math.sign(figure.angularVelocity) * figure.maxAngularSpeed

            figure.shape.angle += figure.angularVelocity

            figure.shape.updateVertices()
        }
    })
}

function run(tFrame) {
    gameState.stopCycle = window.requestAnimationFrame(run)

    const nextTick = gameState.lastTick + gameState.tickLength
    let numTicks = 0

    if (tFrame > nextTick) {
        const timeSinceTick = tFrame - gameState.lastTick
        numTicks = Math.floor(timeSinceTick / gameState.tickLength)
    }
    queueUpdates(numTicks)
    draw(tFrame)
    gameState.lastRender = tFrame
}

function stopGame(handle) {
    window.cancelAnimationFrame(handle);
}


function setup() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    gameState.lastTick = performance.now()
    gameState.lastRender = gameState.lastTick
    gameState.tickLength = 15 //ms

    gameState.figures = []

    const boid1 = new GameObject(
                5,
                0.2,
                Math.PI / 120,
                Math.PI / 360,
                new Triangle(canvas.width / 2 + 50, canvas.height / 2 + 50, 30, `rgb(255, 0, 0)`),
                200
            )

    const boid2 = new GameObject(
                5,
                0.2,
                Math.PI / 120,
                Math.PI / 360,
                new Triangle(canvas.width / 2 - 50, canvas.height / 2 + 50, 30, randomRGB()),
                200
            )
    
    const boid3 = new GameObject(
                5,
                0.2,
                Math.PI / 120,
                Math.PI / 360,
                new Triangle(canvas.width / 2 + 50, canvas.height / 2 - 50, 30, randomRGB()),
                200
            )
    
    const boid4 = new GameObject(
                5,
                0.2,
                Math.PI / 120,
                Math.PI / 360,
                new Triangle(canvas.width / 2 - 50, canvas.height / 2 - 50, 30, randomRGB()),
                200
            )

    gameState.leader = boid1

    gameState.figures.push(boid1, boid2, boid3, boid4)

    const dummyWalker = new GameObject(
        10,
        10,
        0,
        0,
        new Circle(canvas.width / 4, canvas.height / 4, 30, randomRGB())
    )

    gameState.figures.push(dummyWalker)

    gameState.dummyWalker = dummyWalker

    const obstacle1 = new GameObject(
        0,
        0,
        0,
        0,
        new Circle(canvas.width / 2 - 50, canvas.height / 2 - 50, 50, randomRGB())
    )

    gameState.figures.push(obstacle1)

    const obstacle2 = new GameObject(
        0,
        0,
        0,
        0,
        new Circle(canvas.width / 2 - 100, canvas.height / 2 - 100, 50, randomRGB())
    )

    gameState.figures.push(obstacle2)

    const obstacle3 = new GameObject(
        0,
        0,
        0,
        0,
        new Circle(canvas.width / 2 + 300, canvas.height / 2 + 300, 50, randomRGB())
    )

    gameState.figures.push(obstacle3)

    gameState.mousePosition = new Vector2(canvas.width / 2, canvas.height / 2)
}


setup();
run();
