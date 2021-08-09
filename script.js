const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const body = document.getElementsByTagName('body')[0]
const ballz = []
const wallz = []
let ballX = 100
let ballY = 100
let velocityv

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
//Redraws canvas objects, creating the illusion of movement
function animationLoop() {
  context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
  ballz.forEach((b) => {
    b.createBall()
  })
  wallz.forEach((w) => {
    w.drawWall()
  })
  requestAnimationFrame(animationLoop)
}
let ball1 = new Ball(ballX, ballY, 5, `black`, `grey`)

requestAnimationFrame(animationLoop)
