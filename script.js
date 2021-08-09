const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const body = document.getElementsByTagName('body')[0]
const ballz = []
const wallz = []
let ballX = 100
let ballY = 100
let velocityv

//Classes/////////////////////////////////

//Ball Object Factory
class Ball {
  constructor(x, y, r, stroke, fill) {
    this.x = x
    this.y = y
    this.r = r
    this.stroke = stroke
    this.fill = fill
    ballz.push(this)
  }
  createBall() {
    context.beginPath()
    context.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    context.strokeStyle = this.stroke
    context.stroke()
    context.fillStyle = this.fill
    context.fill()
  }
}

//Wall Objects
class Wall {
  constructor(x1, x2, y1, y2) {
    this.start = new Vector(x1, x2)
    this.end = new Vector(y1, y2)
    wallz.push(this)
  }
  drawWall() {
    context.beginPath()
    context.moveTo(this.start.x, this.start.y)
    context.lineTo(this.end.x, this.end.y)
    context.strokeStyle = 'black'
    context.stroke()
  }
  wallUnit() {
    return this.end.subtract(this.start).unit()
  }
}
// Vectors
class Vector {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  add(v) {
    return new Vector(this.x + v.x, this.y + v.y)
  }
  subtract(v) {
    return new Vector(this.x - v.x, this.y - v.y)
  }
  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }
  multiply(m) {
    return new Vector(this.x * m, this.y * m)
  }
}

//Game Physics Funcions/////////////////////////////////////////

//WallCollision
//finds closest point in the wall to the object on a collision course
function closestPoint(b1, w1) {
  let ballToWallStart = w1.start.subtract(b1.pos)
  if (Vector.dot(w1.wallUnit(), ballToWallStart) > 0) {
    return w1.start
  }
  let wallEndToBall = ball.pos.subtract(w1.end)
  if (Vector.dot(w1.wallUnit(), wallEndToBall) > 0) {
    return w1.end
  }

  let closestDist = Vector.dot(w1.wallUnit(), ballToWallStart)
  let closestVect = w1.wallUnit().multiply(closestDist)
  return w1.start.subtract(closestVect)
}
//detects collisions between the ball and walls
function collisionDetection(b1, w1) {
  let ballToCP = closestPoint(b1, w1).subtract(b1.pos)
  if (ballToCP.magnitude() <= b1.r) {
    return true
  }
}
//pushes ball from wall by the same amount of penetration
function penetrationCorrection(b1, w1) {
  let penetrationVect = b1.pos.subtract(closestPoint(b1, w1))
  b1.pos = b1.pos.add(
    penetrationVect.unit().multiply(b1.r - penetrationVect.magnitude())
  )
}

function deflectionBW(b1, w1) {
  let normal = b1.pos.subtr(closestPoint(b1, w1)).unit()
  let collisionVel = Vector.dot(b1.vel, normal)
  let seperationVel = -collisionVel * b1.elasticity
  let vSepDiff = collisionVel - seperationVel
  b1.vel = b1.vel.add(normal.multiply(-vSepDiff))
}
//Object Creation//////////////////////////////////////////
let ball1 = new Ball(ballX, ballY, 5, `black`, `grey`)
let

//Animation Logic//////////////////////////////////////////

//Redraws canvas objects, creating the illusion of movement
function animationLoop() {
  //clears old frame, so new one can display smoothly
  context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
  ballz.forEach((b, index) => {
    //displays all balls pushed into the array
    b.createBall()

    wallz.forEach((w) => {
      //displays all walls pushed into the array
      w.drawWall()

      //if collision detected, object will deflect
      if (collisionDetection(ballz[index], w)) {
        penetrationCorrection(ballz[index], w)
        deflectionBW(ballz[index], w)
      }
    })


  })
  requestAnimationFrame(animationLoop)
}

requestAnimationFrame(animationLoop)
