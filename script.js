const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const body = document.getElementsByTagName('body')[0]
const ballz = []
const wallz = []
let x = canvas.width / 2
let y = canvas.height - 30
let dx = 2
let dy = -2

//Classes/////////////////////////////////

//Ball Object Factory
class Ball {
  constructor(x, y, r) {
    this.x = x
    this.y = y
    this.r = r
    // this.xVelocity = 0
    // this.yVelocity = 0
    // this.velocity = v
    this.current = false
    ballz.push(this)
  }
  createBall() {
    context.beginPath()
    context.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    context.strokeStyle = `black`
    context.stroke()
    context.fillStyle = `grey`
    context.fill()
  }
}

//Wall Objects
// class Wall {
//   constructor(x1, y1, x2, y2) {
//     this.start = new Vector(x1, x2)
//     this.end = new Vector(y1, y2)
//     wallz.push(this)
//   }
//   drawWall() {
//     context.beginPath()
//     context.moveTo(this.start.x, this.start.y)
//     context.lineTo(this.end.x, this.end.y)
//     context.strokeStyle = 'black'
//     context.stroke()
//   }
//   wallUnit() {
//     return this.end.subtract(this.start).unit()
//   }
// }
// Vectors
// class Vector {
//   constructor(x, y) {
//     this.x = x
//     this.y = y
//   }
//   add(v) {
//     return new Vector(this.x + v.x, this.y + v.y)
//   }
//   subtract(v) {
//     return new Vector(this.x - v.x, this.y - v.y)
//   }
//   magnitude() {
//     return Math.sqrt(this.x ** 2 + this.y ** 2)
//   }
//   multiply(m) {
//     return new Vector(this.x * m, this.y * m)
//   }
//   drawVec(xStart, yStart, n, color) {
//     context.beginPath()
//     context.moveTo(xStart, yStart)
//     context.lineTo(xStart + this.x * n, yStart + this.y * n)
//     context.strokeStyle = color
//     context.stroke()
//   }
// }

//Event Listeners///////////////////////////////////////////////

//BallMovement
// function keyControl(b) {
//   canvas.addEventListener('keydown', function () {
//     if (KeyboardEvent.code === 'ArrowLeft' || KeyboardEvent.code === 'KeyA') {
//       LEFT = true
//     }
//     if (KeyboardEvent.code === 'ArrowRight' || KeyboardEvent.code === 'KeyD') {
//       RIGHT = true
//     }
//   })
//   canvas.addEventListener('keyup', function () {
//     if (KeyboardEvent.code === 'ArrowLeft' || KeyboardEvent.code === 'KeyA') {
//       LEFT = false
//     }
//     if (KeyboardEvent.code === 'ArrowRight' || KeyboardEvent.code === 'KeyD') {
//       RIGHT = false
//     }
//   })
//   if (LEFT) {
//     b.xVelocity = -b.velocity
//     b.yVelocity = -b.velocity
//   }
//   if (RIGHT) {
//     b.xVelocity = b.velocity
//     b.yVelocity = -b.velocity
//   }
// }
//Game Physics Funcions/////////////////////////////////////////

//WallCollision
//finds closest point in the wall to the object on a collision course
// function closestPoint(b1, w1) {
//   let ballToWallStart = w1.start.subtract(b1.pos)
//   if (Vector.dot(w1.wallUnit(), ballToWallStart) > 0) {
//     return w1.start
//   }
//   let wallEndToBall = ball.pos.subtract(w1.end)
//   if (Vector.dot(w1.wallUnit(), wallEndToBall) > 0) {
//     return w1.end
//   }

//   let closestDist = Vector.dot(w1.wallUnit(), ballToWallStart)
//   let closestVect = w1.wallUnit().multiply(closestDist)
//   return w1.start.subtract(closestVect)
// }
//detects collisions between the ball and walls
// function collisionDetection(b1, w1) {
//   let ballToCP = closestPoint(b1, w1).subtract(b1.pos)
//   if (ballToCP.magnitude() <= b1.r) {
//     return true
//   }
// }
//pushes ball from wall by the same amount of penetration
// function penetrationCorrection(b1, w1) {
//   let penetrationVect = b1.pos.subtract(closestPoint(b1, w1))
//   b1.pos = b1.pos.add(
//     penetrationVect.unit().multiply(b1.r - penetrationVect.magnitude())
//   )
// }

// function deflectionBW(b1, w1) {
//   let normal = b1.pos.subtr(closestPoint(b1, w1)).unit()
//   let collisionVel = Vector.dot(b1.vel, normal)
//   let seperationVel = -collisionVel * b1.elasticity
//   let vSepDiff = collisionVel - seperationVel
//   b1.vel = b1.vel.add(normal.multiply(-vSepDiff))
// }
//Object Creation//////////////////////////////////////////

let ball1 = new Ball(x, y, 5)
ball1.current = true
// let canvasTop = new Wall(0, 0, canvas.clientWidth, 0)
// let canvasRight = new Wall(
//   canvas.clientWidth,
//   0,
//   canvas.clientWidth,
//   canvas.clientHeight
// )
// let canvasBottom = new Wall(
//   canvas.clientWidth,
//   canvas.clientHeight,
//   0,
//   canvas.clientHeight
// )
// let canvasLeft = new Wall(0, canvas.clientHeight, 0, canvas.clientHeight)

//Animation Logic//////////////////////////////////////////

//AnimationLoop

//Redraws canvas objects, creating the illusion of movement
function animationLoop() {
  //clears old frame, so new one can display smoothly
  context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
  ballz.forEach((b, index) => {
    b.createBall()
    //displays all balls pushed into the array
    // if (b.current) {
    //   keyControl(b)
    // }
    // wallz.forEach((w) => {
    //displays all walls pushed into the array
    // w.drawWall()

    //if collision detected, object will deflect
    // if (collisionDetection(ballz[index], w)) {
    //   penetrationCorrection(ballz[index], w)
    //   deflectionBW(ballz[index], w)
    // }
  })
  // })
  x += dx
  y += dy
  requestAnimationFrame(animationLoop)
}
requestAnimationFrame(animationLoop)
