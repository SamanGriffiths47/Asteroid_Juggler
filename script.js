const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
// let dx = 2
// let dy = -2
let ballz = []
let xvel = null
let yvel = null

// canvas.width = 640 canvas.height = 480

const equalMagnitude = () => {
  let z = Math.random()
  if (z < 0.5) {
    z *= canvas.width / 2 - 20
  } else {
    z *= -(canvas.width / 2 - 20)
  }
  xvel = z
}
equalMagnitude()
console.log(xvel)
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
  multiply(n) {
    return new Vector(this.x * n, this.y * n)
  }
  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }
}

class Ball {
  constructor() {
    this.r = 5
    this.x = canvas.width / 2
    this.y = canvas.height - 50
    this.xVelocity = 2
    this.yVelocity = -2
    ballz.push(this)
  }

  drawBall() {
    context.beginPath()
    context.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    context.strokeStyle = `black`
    context.stroke()
    context.fillStyle = `grey`
    context.fill()
  }
  move() {
    this.x += this.xVelocity
    this.y += this.yVelocity
  }
  wallCollision() {
    if (
      this.x + this.xVelocity > canvas.width - this.r ||
      this.x + this.xVelocity < this.r
    ) {
      this.xVelocity = -this.xVelocity
    }
    if (
      this.y + this.yVelocity > canvas.height - this.r ||
      this.y + this.yVelocity < this.r
    ) {
      this.yVelocity = -this.yVelocity
    }
  }
}

let ball1 = new Ball()

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  ballz.forEach((b) => {
    b.drawBall()
    b.move()
    b.wallCollision()
  })
  requestAnimationFrame(draw)
}

requestAnimationFrame(draw)
